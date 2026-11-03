import html from "html";
import css from "css";
import { useEffect, useState } from "preact/hooks";
import { useI18n } from "../../app/I18n.js";
import NavLink from "../NavLink/index.js";

const styles = css`
  .blog {
    padding-top: 96px;
    background: #222;
    color: #fefefe;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  .blog article {
    width: 75%;
    display: block;
    margin: 0 auto;
    max-width: 960px;
    padding: 0 1em;
  }
  .blog a {
    color: #99e8ff;
  }
  .list {
    list-style: none;
    padding: 0;
  }
  .list li {
    margin-bottom: 1em;
  }
  .list a {
    font-size: 1.25em;
  }
  .date {
    display: block;
    opacity: 0.7;
    font-size: 0.9em;
  }
  .notice {
    font-style: italic;
    opacity: 0.7;
  }
  .body img {
    max-width: 100%;
  }
  .body {
    line-height: 1.5;
    padding-bottom: 2em;
  }
  .body code {
    font-family:
      "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.92em;
  }
  .body :not(pre) > code {
    background: rgba(255, 255, 255, 0.08);
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }
  .body pre {
    overflow: auto;
    background: #1a1d1e;
    border-left: 3px solid #99e8ff;
    border-radius: 4px;
    padding: 0.9em 1.1em;
    line-height: 1.45;
  }
`;

// Colors for the highlighted code that scripts/build-blog.js generates.
if (!document.querySelector("link[data-blog-highlight]")) {
  document.head.appendChild(
    Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      href: "./index/components/Blog/highlight.css",
    }),
  ).dataset.blogHighlight = "";
}

// Site language codes that differ from BCP 47 locale codes.
const LOCALES = { jp: "ja" };

// The reader's language if the post has it, otherwise the post's first.
const pickLanguage = (languages, language) =>
  languages.includes(language) ? language : languages[0];

const formatDate = (date, language) => {
  const dateOnly = !date.includes("T");
  return new Intl.DateTimeFormat(LOCALES[language] ?? language, {
    dateStyle: "long",
    // Date-only stamps parse as UTC midnight; don't let the reader's
    // timezone shift them to the previous day.
    timeZone: dateOnly ? "UTC" : undefined,
  }).format(new Date(date));
};

const PostDate = ({ date, language }) => html`
  <time className=${styles.date} datetime=${date}>
    ${formatDate(date, language)}
  </time>
`;

const Page = ({ children }) => html`
  <div className=${styles.blog}>
    <article>${children}</article>
  </div>
`;

export const Post = ({ slug, date, title = {}, languages = [] }) => {
  const t = useI18n();
  const lang = pickLanguage(languages, t.language);
  const [body, setBody] = useState(null);

  useEffect(() => {
    let current = true;
    setBody(null);
    fetch(`./index/api/blog/${slug}.${lang}.html`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(r.status))))
      .then(
        (text) => current && setBody(text),
        () => current && setBody(false),
      );
    return () => {
      current = false;
    };
  }, [slug, lang]);

  return html`
    <${Page}>
      <${NavLink} href="/blog">${t`blogBack`}<//>
      <h1>${title[lang]}</h1>
      <${PostDate} date=${date} language=${t.language} />
      ${
        lang !== t.language &&
        html`<p className=${styles.notice}>${t`blogUntranslated`}</p>`
      }
      ${
        body === false
          ? html`<p className=${styles.notice}>${t`blogLoadError`}</p>`
          : body &&
            html`<div
              className=${styles.body}
              dangerouslySetInnerHTML=${{ __html: body }}
            />`
      }
    <//>
  `;
};

export default ({ posts = [] }) => {
  const t = useI18n();
  return html`
    <${Page}>
      <h1>${t`blogTitle`}</h1>
      ${
        posts.length === 0
          ? html`<p className=${styles.notice}>${t`blogEmpty`}</p>`
          : html`
              <ul className=${styles.list}>
                ${posts.map(
                  ({ slug, date, title, languages }) => html`
                    <li key=${slug}>
                      <${NavLink} href=${`/blog/${slug}`}>
                        ${title[pickLanguage(languages, t.language)]}
                      <//>
                      <${PostDate} date=${date} language=${t.language} />
                    </li>
                  `,
                )}
              </ul>
            `
      }
    <//>
  `;
};
