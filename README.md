# fordi.org

My portfolio site and blog. There's no build step for the site itself: the browser loads the modules in `docs/` directly.

- Staging: [fordi.github.io/fordi-org](https://fordi.github.io/fordi-org) (every push to `main`)
- Production: [fordi.org](https://fordi.org) (`v*` tags)

## Where things live

| Path                                       | What it is                                                                  |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `blog/`                                    | Blog posts, named `{ISO date} - {Title}.{lang}.md`                          |
| `messageTable.json`                        | UI text in every language                                                   |
| `docs/`                                    | **The published site**, not documentation (GitHub Pages serves this folder) |
| `docs/index.html`                          | Page entry point and importmap                                              |
| `docs/index/api/`                          | Page data: `layout/` (pages), `i18n/` and `blog/` (generated; don't edit)   |
| `docs/index/app/`                          | App shell: providers, language selection                                    |
| `docs/index/components/`                   | One folder per component, named as layouts refer to it                      |
| `docs/index/Layout/`                       | Renders pages from layout JSON                                              |
| `docs/index/i18n/`, `hooks/`, `rendering/` | Translation context, browser-state hooks, `html`/`css` helpers              |
| `docs/index/res/`                          | Résumé (`.md` is the source; `.docx` is generated)                          |
| `scripts/`                                 | Builders and the structure check                                            |
| `server/`                                  | Local dev server                                                            |

## Commands

Requires [nvm](https://github.com/nvm-sh/nvm) and [pandoc](https://pandoc.org/). On Windows, use nvm-windows and git-bash.

```bash
./nvm_use && npm i     # first run
npm start              # http://localhost:3000
npm run build:blog     # blog/ -> docs/index/api/{blog,layout/blog*}
npm run build:i18n     # messageTable.json -> docs/index/api/i18n/
npm run build:resume   # résumé .md -> .docx (CI also does this)
npm run check          # lint + structure score
```

## How the site works

**Layouts.** Each route (`/about`) loads `docs/index/api/layout/about.json`, a tree of `[componentName, props, children]`. `Layout/` fetches the components it names from `components/` on demand. Content stays separate from the code that renders it.

**Translations.** `messageTable.json` is the source. `build:i18n` splits it into `keys.json` plus one array per language, so readers only download their own language. In layout JSON, `{ "i18n": "key" }` becomes that message.

**Styles.** `css` is a tagged template that returns a map of class names, made unique so components never collide.

**Structure.** `npm run check` scores the repo against its structure rules: every file is used, every path named in docs and config exists, directories stay small and well named, and naming is consistent. CI fails if the score drops below `scripts/structure-baseline.json`. Run `node scripts/check-structure.js --update` after raising it.
