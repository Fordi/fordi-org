/**
 * Builds the blog from a folder of Markdown posts.
 *
 * Usage: node scripts/build-blog.js [sourceDir]   (default: ./blog)
 *
 * Source files are named `{ISO 8601 date} - {Title}.{lang}.md`, e.g.
 *   blog/2026-11-03 - Hello, world.en.md
 *   blog/2026-11-03 - Hola, mundo.es.md
 * Translations of the same post share the exact same date stamp. Use a full
 * timestamp (e.g. `2026-11-03T14:30`) to publish more than one post per day.
 *
 * Outputs:
 *   docs/index/api/layout/blog.json         - post index, rendered by `Blog`
 *   docs/index/api/layout/blog/{slug}.json  - one per post, rendered by `Blog.Post`
 *   docs/index/api/blog/{slug}.{lang}.html  - post bodies, fetched on demand
 */
import { readdir, readFile, writeFile, mkdir, rm } from "fs/promises";
import { join, resolve } from "path";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/common";

const root = new URL("..", import.meta.url).pathname;
const sourceDir = resolve(process.argv[2] ?? join(root, "blog"));
const api = join(root, "docs/index/api");
const layoutDir = join(api, "layout");
const postLayoutDir = join(layoutDir, "blog");
const bodyDir = join(api, "blog");

const { languages } = JSON.parse(
  await readFile(join(root, "messageTable.json"), "utf8"),
);

const FILE_PATTERN =
  /^(\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?) - (.+)\.([a-z]{2})\.md$/;

// Fenced code is highlighted here, at build time, so readers download no
// highlighter. Colors live in docs/index/components/Blog/highlight.css.
const highlight = (code, lang) => {
  if (!lang || !hljs.getLanguage(lang)) {
    return ""; // markdown-it escapes it as plain code
  }
  const { value } = hljs.highlight(code, {
    language: lang,
    ignoreIllegals: true,
  });
  return `<pre><code class="hljs language-${lang}">${value}</code></pre>`;
};

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight,
});

// Render a post body. The post page shows the title from the filename, so a
// leading `# Heading` (usually the same title) is dropped to avoid repeating it.
const renderBody = (source) => {
  const env = {};
  const tokens = md.parse(source, env);
  if (tokens[0]?.type === "heading_open" && tokens[0].tag === "h1") {
    const close = tokens.findIndex((t) => t.type === "heading_close");
    tokens.splice(0, close + 1);
  }
  return md.renderer.render(tokens, md.options, env);
};

const slugify = (text) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const writeJson = (path, data) =>
  writeFile(path, JSON.stringify(data, null, 2) + "\n");

const listSources = async () => {
  try {
    return await readdir(sourceDir);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.warn(`No blog folder at ${sourceDir}; building an empty blog.`);
      return [];
    }
    throw e;
  }
};

// Group source files into posts, keyed by date stamp.
const posts = new Map();
for (const file of (await listSources()).sort()) {
  if (!file.endsWith(".md")) {
    continue;
  }
  const match = FILE_PATTERN.exec(file);
  if (!match) {
    console.warn(`Skipping "${file}": expected "{date} - {Title}.{lang}.md".`);
    continue;
  }
  const [, date, title, lang] = match;
  if (Number.isNaN(Date.parse(date))) {
    console.warn(`Skipping "${file}": "${date}" is not a valid ISO 8601 date.`);
    continue;
  }
  if (!languages.includes(lang)) {
    console.warn(
      `Skipping "${file}": "${lang}" is not one of ${languages.join(", ")}.`,
    );
    continue;
  }
  if (!posts.has(date)) {
    posts.set(date, { date, title: {}, files: {} });
  }
  posts.get(date).title[lang] = title;
  posts.get(date).files[lang] = join(sourceDir, file);
}

await rm(postLayoutDir, { recursive: true, force: true });
await rm(bodyDir, { recursive: true, force: true });
await mkdir(postLayoutDir, { recursive: true });
await mkdir(bodyDir, { recursive: true });

const index = [];
const slugs = new Set();
for (const { date, title, files } of posts.values()) {
  const postLanguages = languages.filter((lang) => lang in title);
  const datePart = date.replace(/[^0-9A-Za-z-]/g, "").toLowerCase();
  const titlePart = slugify(title[postLanguages[0]]);
  const slug = titlePart ? `${datePart}-${titlePart}` : datePart;
  if (slugs.has(slug)) {
    throw new Error(`Two posts would share the URL /blog/${slug}`);
  }
  slugs.add(slug);

  for (const lang of postLanguages) {
    const source = await readFile(files[lang], "utf8");
    await writeFile(join(bodyDir, `${slug}.${lang}.html`), renderBody(source));
  }

  const meta = { slug, date, title, languages: postLanguages };
  await writeJson(join(postLayoutDir, `${slug}.json`), [["Blog.Post", meta]]);
  index.push(meta);
}

index.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
await writeJson(join(layoutDir, "blog.json"), [["Blog", { posts: index }]]);

console.info(`Built ${index.length} blog post(s) from ${sourceDir}`);
