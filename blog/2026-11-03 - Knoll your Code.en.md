# Knoll your Code

Onboarding a new developer should be easy; they should be able to take one look at your repository and, without reading through reams of documentation, be able to start writing PRs.

To this end, it's important to talk about knolling - named after a brand of furniture known for its clean geometric aesthetic, it's the process of making your workspace understandable at-a-glance.

To this end, I have drafted a few simple rules. I'll inline examples for how they have been applied on this site.

## Entry points should be visible at the project root

It should be obvious how each project or package is started, what it exports and where the main areas live. There should be no vestigial `index.js` or `main.ts`; the project's manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc) should tell a developer what they need to know, and a `README.md` of about one screen should be present with a "where things live" map.

**On this site:** the manifest pointed at a folder that didn't exist, and the commands were missing or misnamed. Now every way in is a named script:

```diff
 {
   "name": "fordi-org",
   "description": "Zero-build version of my portfolio site",
-  "browser": "src/index.html",
   "scripts": {
     "start": "node server/index.js",
-    "build:docs": "pandoc docs/index/res/Bryan_Elliott.md -o …",
+    "build:blog": "node scripts/build-blog.js",
+    "build:i18n": "node scripts/build-i18n.js",
+    "build:resume": "pandoc docs/index/res/Bryan_Elliott.md -o …",
+    "check": "eslint && node scripts/check-structure.js",
     "lint": "eslint"
   },
```

The README went from install steps to a one-screen map:

```markdown
| Path                     | What it is                                                                  |
| ------------------------ | --------------------------------------------------------------------------- |
| `blog/`                  | Blog posts, named `{ISO date} - {Title}.{lang}.md`                          |
| `docs/`                  | **The published site**, not documentation (GitHub Pages serves this folder) |
| `docs/index/api/`        | Page data: `layout/` (pages), `i18n/` and `blog/` (generated; don't edit)   |
| `docs/index/components/` | One folder per component, named as layouts refer to it                      |
| `scripts/`               | Builders and the structure check                                            |
```

## Directories should stay reasonably small, split by domain

Over 50 files, a directory should get subdivided. Timestamped or sortable directories should be subdivided by their first searchable term (e.g., year for timestamps). A large, undifferentiated `lib` directory, for example, would fail this check.

**On this site:** nothing to do here. No folder holds more than 12 files.

```text
✓ Directories stay small: at most 50 files (31/31)
```

## Documentation lives next to what it describes, and drift is caught

Package documentation sits at the root of the package. Any document that names a script, path or branch should be verified to exist. Documentation specific to a script should live alongside that script.

**On this site:** the résumé had moved from `docs/res/` to `docs/index/res/`, but CI was still checking the old path. It had been comparing timestamps of two files that didn't exist, so the Word version never rebuilt:

```diff
-          SRC="$(git log -n 1 --format='%ct' -- docs/res/Bryan_Elliott.md)"
-          DEST="$(git log -n 1 --format='%ct' -- docs/res/Bryan_Elliott.docx)"
+          SRC="$(git log -n 1 --format='%ct' -- docs/index/res/Bryan_Elliott.md)"
+          DEST="$(git log -n 1 --format='%ct' -- docs/index/res/Bryan_Elliott.docx)"
```

Generated files can drift too. CI now rebuilds them and fails if the result differs from what was committed:

```yaml
- name: Generated files are up to date
  run: |
    npm run build:i18n
    npm run build:blog
    git add -N docs/index/api
    git diff --exit-code -- docs/index/api
```

## Only live things in the tree

Every file is used by a script, an import, CI or a doc. Dead code gets deleted, full stop. You have a git history for historical concerns.

**On this site:** seven files that nothing used, four importmap entries that nothing imported, and two dev dependencies with no script to run them:

```text
D  docs/index/Redirect.js            # last user of preact-router
D  docs/index/tools/makeResolver.js
D  docs/index/tools/useUid.js
D  docs/index/tools/importFont.js
D  docs/index/config/Tournedos.js    # the font actually loads through CSS
D  docs/index/Portfolio/fao.png      # fao.jpg is the one in use
D  .vscode/tasks.json                # { "tasks": [] }
```

```diff
         "imports": {
           "preact": "https://unpkg.com/preact/src/index.js",
           "preact/hooks": "https://unpkg.com/preact/hooks/src/index.js",
-          "preact-router": "https://cdn.jsdelivr.net/npm/preact-router/dist/preact-router.module.js",
-          "preact-router/match": "https://cdn.jsdelivr.net/npm/preact-router/match/index.module.js",
           "htm": "https://unpkg.com/htm/src/index.mjs",
           …
-          "importFont": "./index/tools/importFont.js",
-          "isThenable": "./index/tools/isThenable.js",
-          "JsonCache": "./index/tools/JsonCache.js",
-          "ModuleCache": "./index/tools/ModuleCache.js",
-          "useUrl": "./index/tools/useUrl.js"
```

## Like with like

Fixtures and helpers are kept apart from specs, harnesses apart from tests, and mocks live in one place per package.

## One convention per purpose

Casing, `src` vs `lib`, spec suffix, file extension and singular vs plural are each consistent.

**On this site:** layout data was `about.json`, but translation data was plain `en` and `config`. Asset folders were PascalCase (`Portfolio/`, `Tournedos/`) beside lowercase ones (`res/`, `api/`). The rule now is simple: PascalCase folders are modules with an `index.js`, everything else is lowercase, and every served file has an extension.

```text
docs/index/api/i18n/config  →  docs/index/api/i18n/keys.json
docs/index/api/i18n/en      →  docs/index/api/i18n/en.json
docs/index/Tournedos/       →  docs/index/fonts/tournedos/
docs/index/Portfolio/       →  docs/index/img/portfolio/
scripts/update-messages.js  →  scripts/build-i18n.js
```

## Names say what's inside, and seams are visible

No junk drawers. No directory called `utils`, `misc`, `Core`, `helpers` or `lib` that holds many unrelated, undifferentiated concerns. You should be able to guess a directory's contents from its name. You should be able to tell from the path which technology a file belongs to.

**On this site:** `tools/` held a page renderer, two caches, styling helpers, storage hooks and the translation context. Each now lives in a folder named for what it does. The caches moved in with `Layout/`, the only thing that uses them:

```text
Before                          After
tools/                          Layout/
  Layout/                         Layout.js, LayoutRouter.js, …
  JsonCache.js                    JsonCache.js
  ModuleCache.js                  ModuleCache.js
  isThenable.js                   isThenable.js
  classes.js                    rendering/
  css.js                          classes.js, css.js, html.js
  html.js                       hooks/
  spy.js                          useStorage.js, useStorageEffect.js,
  useStorage.js                   useUrl.js, spy.js
  useStorageEffect.js           i18n/
  useUrl.js                       createI18nContext.js
  createI18nContext.js
config/                         app/
  Layout.js                       Shell.js, I18n.js
  I18n.js                       components/
  Nav.js                          Nav/index.js
Loading.js                        Loading/index.js
```

## Test paths follow from source paths

Given `routes/Foo/bar.ts`, you can predict the spec path without searching, and the reverse also holds. There is a school of thought that specs suites should test functional groups that aren't always 1:1 to files - but a situation like that indicates your files are not grouped well.

## One word, one meaning

A term should mean one thing across the repo. While this isn't always possible (for example, if your product has a thing called a "Story" and you also use Storybook and Playwright's component testing, you've got three different things called "Story"), a conversation should be had about differentiation.

**On this site:** "Layout" meant three things: the app shell, the library that renders pages, and the page data. The app shell is now `Shell`:

```diff
-import Layout from "./config/Layout.js";
+import Shell from "./app/Shell.js";
```

"docs" was worse. `docs/` is the published website, while `npm run build:docs` built the résumé. The script is now `build:resume`. `docs/` itself can't be renamed, because GitHub Pages publishes staging from it. So the README's map says so in bold, and project documentation stays out of it.

## Knolling should be cost-effective

A move is only worth it if the discoverability it adds outweighs what it costs: `git blame`/`log` continuity, conflicts with open and stacked PRs, broken import paths, and invalidated visual snapshots. Each problem you create is time your churn - and knolling _is_ churn, if valuable churn - costs your development team. Consider each change with that in mind.

**On this site:** two moves didn't pay for themselves. The site's assets live under `/index` because of one line:

```html
<base href="/index" />
```

Renaming that folder would change every public URL, including résumé links that are already out in the world. It stays, as a known exception. Everything that did move was moved without changing its contents, so `git log --follow` still finds its history.

## Rules are enforced

Every rule that can be checked programmatically should be; a rule that nothing checks will inevitably decay back into chaos. Recognize that nothing is perfect, and that any CI doing this checking should output a score, and new PRs should increase that score. Applying a ruleset where everything fails will require you to boil the ocean before you can do another build, and that helps no one.

**On this site:** `npm run check` turns the rules above into a score. Here's what it reported on the old tree (trimmed):

```text
✗ Only live things: every file is used (73/84)
✗ Docs and config match the tree: every path named exists (47/59)
    .github/workflows/main.yml: "docs/res/Bryan_Elliott.md" does not exist
    docs/index/components/Portfolio/index.js: "Portfolio/denim-velvet.jpg" does not exist
    package.json: "src/index.html" does not exist
✓ Directories stay small: at most 50 files (21/21)
✗ Names say what's inside: no junk-drawer directories (23/24)
    tools/
✗ One convention per purpose (99/105)
✓ Test paths follow from source paths (n/a)

Score: 91.3
```

And after:

```text
✓ Only live things: every file is used (84/84)
✓ Docs and config match the tree: every path named exists (60/60)
✓ Directories stay small: at most 50 files (31/31)
✓ Names say what's inside: no junk-drawer directories (33/33)
✓ One convention per purpose (115/115)
✓ Test paths follow from source paths (n/a)

Score: 100 (baseline 100)
```

CI fails only when the score drops below the stored baseline, so a messier repo could adopt this one PR at a time.

## The payoff

None of this was about making the tree look pretty. Tidying this one small site turned up a CI job that had been quietly checking for a résumé that wasn't there, a background image pointing at a path that didn't exist, and a logo ignoring the styles its layout gave it. Each was hiding in plain sight, because nobody could see the whole tree at a glance. That's the real value of knolling: once everything has an obvious place, whatever is out of place stands out - to a new developer on their first day, and to you, six months from now. Start with the rules a script can check, take the cheap wins first, and let the score do the nagging.
