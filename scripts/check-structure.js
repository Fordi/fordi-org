/**
 * Scores the repository against its structure rules (see README.md).
 *
 * Usage:
 *   node scripts/check-structure.js            # print report, fail if score drops
 *   node scripts/check-structure.js --update   # accept the current score as baseline
 *
 * Each check reports what it looked at and what failed. The score is the
 * average pass rate across checks. CI fails only when the score falls below
 * the baseline in structure-baseline.json, so the rules can be adopted
 * gradually: every change should hold or raise the score.
 */
import { execFileSync } from "child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { basename, dirname, extname, join, normalize, relative } from "path";

const root = new URL("..", import.meta.url).pathname;
const baselinePath = new URL("./structure-baseline.json", import.meta.url)
  .pathname;
process.chdir(root);

// Tracked files plus new, unignored ones; skips files deleted in the tree.
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter((f) => f && existsSync(f));
const fileSet = new Set(files);

const SITE = "docs"; // Published site root; GitHub Pages requires this name.
const TEXT = /\.(js|mjs|json|css|html|md|yml|yaml)$|(^|\/)[^.]+$/;
const isText = (f) => TEXT.test(f) && !f.endsWith("package-lock.json");
const read = (f) => readFileSync(f, "utf8");
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

// Files that are live by convention: manifests, tool config, entry points.
const ENTRY_POINTS = [
  /^package(-lock)?\.json$/,
  /^\.(gitignore|nvmrc)$/,
  /^eslint\.config\.js$/,
  /^\.github\/workflows\/[^/]+\.ya?ml$/,
  /^\.vscode\/[^/]+\.json$/,
  /(^|\/)README\.md$/,
  /^docs\/index\.html$/,
  /^blog\/[^/]+\.md$/, // Input to scripts/build-blog.js
];

// Output folders and the script that generates each.
const GENERATED = [
  [/^docs\/index\/api\/i18n\//, "scripts/build-i18n.js"],
  [/^docs\/index\/api\/blog\//, "scripts/build-blog.js"],
  [/^docs\/index\/api\/layout\/blog(\.json|\/)/, "scripts/build-blog.js"],
];

// Content, not code: links inside these aren't checked for drift.
const CONTENT = [/^blog\//, /^docs\/index\/api\/blog\//, /^docs\/index\/res\//];

const JUNK_NAMES = /^(utils?|misc|helpers?|lib|core|tools|common|shared)$/i;
const MAX_DIR_FILES = 50;

// ---- Reference extraction --------------------------------------------------

const importMap = JSON.parse(
  /<script type="importmap">([\s\S]*?)<\/script>/.exec(
    read(`${SITE}/index.html`),
  )[1],
).imports;

const PATTERNS = [
  /\bfrom\s+["']([^"']+)["']/g, // static imports
  /\bimport\s+["']([^"']+)["']/g, // side-effect imports
  /url\(\s*["']?([^"')]+?)["']?\s*\)/g, // CSS url()
  /@import\s+["']([^"']+)["']/g, // CSS @import
  /["'`]([^"'`\s${}]+\.[a-z0-9]{2,5})["'`]/gi, // quoted file paths
  /["'](\.\/index\/[^"'\s]+)["']/g, // importmap values
  /\]\(([^)\s]+)\)/g, // Markdown links
  /`([^`\s]+)`/g, // Markdown code spans
  /(?:^|\s)((?:\.{1,2}\/|[\w.-]+\/)[\w./-]*[\w-](?:\.\w+)?)(?=$|[\s"'`),;])/gm, // bare paths
];

// Skip URLs, globs and template strings (those are checked by dynamicRefs).
const isExternal = (ref) => /^([a-z]+:|\/\/|#|@)|[*$]/i.test(ref);
const looksLocal = (ref) =>
  /^\.{1,2}\//.test(ref) ||
  (/\//.test(ref) && /\.[a-z][a-z0-9]{1,4}$/i.test(ref));

const extractRefs = (file) => {
  const text = read(file);
  const refs = new Set();
  for (const pattern of PATTERNS) {
    for (const [, ref] of text.matchAll(pattern)) {
      refs.add(ref.replace(/[?#].*$/, ""));
    }
  }
  return [...refs].filter((r) => r && !isExternal(r));
};

// Resolve a reference the way the thing reading it would: relative to the
// file, to the site root (the page's <base>), or to the repo root.
const resolveRef = (ref, from) => {
  if (importMap[ref]) {
    return isExternal(importMap[ref])
      ? "external"
      : normalize(join(SITE, importMap[ref]));
  }
  const candidates = [join(dirname(from), ref)];
  if (from.startsWith(`${SITE}/`)) {
    candidates.push(join(SITE, ref.replace(/^\//, "")));
  }
  candidates.push(ref.replace(/^\.?\//, ""));
  return candidates
    .map((c) => normalize(c).replace(/\/$/, ""))
    .find((c) => fileSet.has(c) || isDir(c));
};

// Components are loaded by name from layout JSON, and layouts by route.
const dynamicRefs = (file) => {
  const out = [];
  const text = read(file);
  if (/^docs\/index\/api\/layout\/.*\.json$/.test(file)) {
    for (const [, name] of text.matchAll(/"([A-Za-z][\w/]*)(?:\.[\w.]+)?"/g)) {
      out.push(`${SITE}/index/components/${name}/index.js`);
    }
  }
  if (file.startsWith(`${SITE}/`) && file.endsWith(".js")) {
    for (const [, route] of text.matchAll(/["'`=]\/([a-z][\w-]*)\b/g)) {
      out.push(`${SITE}/index/api/layout/${route}.json`);
    }
  }
  return out.filter((f) => fileSet.has(f));
};

// ---- Checks ----------------------------------------------------------------

const live = new Set();
const broken = [];
for (const file of files.filter(isText)) {
  const isContent = CONTENT.some((rx) => rx.test(file));
  for (const ref of extractRefs(file)) {
    const target = resolveRef(ref, file);
    if (target && target !== "external") {
      live.add(target);
    } else if (!target && !isContent && looksLocal(ref)) {
      broken.push(`${file}: "${ref}" does not exist`);
    }
  }
  dynamicRefs(file).forEach((f) => live.add(f));
}

const checks = [];
const check = (name, items, fails) =>
  checks.push({ name, total: items.length, fails });

check(
  "Only live things: every file is used",
  files,
  files.filter(
    (f) =>
      !live.has(f) &&
      !ENTRY_POINTS.some((rx) => rx.test(f)) &&
      !GENERATED.some(([rx, script]) => rx.test(f) && fileSet.has(script)),
  ),
);

check(
  "Docs and config match the tree: every path named exists",
  files.filter(isText),
  broken,
);

const dirs = [...new Set(files.map((f) => dirname(f)))].filter(
  (d) => d !== ".",
);
const childCount = (d) => files.filter((f) => dirname(f) === d).length;
check(
  `Directories stay small: at most ${MAX_DIR_FILES} files`,
  dirs,
  dirs
    .filter((d) => childCount(d) > MAX_DIR_FILES)
    .map((d) => `${d}/ has ${childCount(d)} files`),
);

const segments = [...new Set(dirs.flatMap((d) => d.split("/")))];
check(
  "Names say what's inside: no junk-drawer directories",
  segments,
  segments.filter((s) => JUNK_NAMES.test(s)).map((s) => `${s}/`),
);

// One convention per purpose.
const conventionFails = [];
for (const d of dirs.filter((d) => !d.split("/").some((s) => s[0] === "."))) {
  const name = basename(d);
  const isModule =
    d.startsWith(`${SITE}/index/`) && fileSet.has(`${d}/index.js`);
  if (isModule && !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    conventionFails.push(`${d}/: module directories are PascalCase`);
  }
  if (!isModule && !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    conventionFails.push(`${d}/: other directories are lowercase-kebab`);
  }
}
for (const f of files) {
  const name = basename(f);
  if (f.startsWith(`${SITE}/`) && !extname(name)) {
    conventionFails.push(`${f}: served files need an extension`);
  }
  if (/^docs\/.*\.js$/.test(f) && !/^[A-Za-z][A-Za-z0-9]*\.js$/.test(name)) {
    conventionFails.push(`${f}: site modules are camelCase or PascalCase`);
  }
  if (/^(scripts|server)\/.*\.js$/.test(f) && !/^[a-z0-9-]+\.js$/.test(name)) {
    conventionFails.push(`${f}: Node scripts are kebab-case`);
  }
}
check("One convention per purpose", [...dirs, ...files], conventionFails);

const specs = files.filter((f) => /\.test\.js$/.test(f));
check(
  "Test paths follow from source paths",
  specs,
  specs
    .filter((f) => !fileSet.has(f.replace(/\.test\.js$/, ".js")))
    .map((f) => `${f}: no ${basename(f).replace(".test", "")} beside it`),
);

// ---- Report ----------------------------------------------------------------

const scored = checks.filter((c) => c.total > 0);
const score =
  Math.round(
    (scored.reduce((sum, c) => sum + 1 - c.fails.length / c.total, 0) /
      scored.length) *
      1000,
  ) / 10;

for (const { name, total, fails } of checks) {
  const status = total === 0 ? "n/a" : `${total - fails.length}/${total}`;
  console.info(`${fails.length ? "✗" : "✓"} ${name} (${status})`);
  fails.forEach((f) => console.info(`    ${f}`));
}

const baseline = existsSync(baselinePath)
  ? JSON.parse(read(baselinePath)).score
  : 0;
console.info(`\nScore: ${score} (baseline ${baseline})`);

if (process.argv.includes("--update")) {
  writeFileSync(baselinePath, JSON.stringify({ score }, null, 2) + "\n");
  console.info(`Baseline set to ${score} in ${relative(root, baselinePath)}`);
} else if (score < baseline) {
  console.error("Score dropped below baseline.");
  process.exit(1);
}
