import html from "html";
import css from "css";
import { useEffect, useState } from "preact/hooks";

import ExtLink from "../ExtLink/index.js";
import NavLink from "../NavLink/index.js";

const styles = css`
  .nav {
    display: flex;
    height: 96px;
    overflow: hidden;
    width: 100%;
    z-index: 1;
    margin-top: -96px;
    position: relative;
  }
  .logo,
  .language {
    background: #99e8ff;
  }
  .language {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .language button {
    background: none;
    border: none;
    padding: 0;
    margin-right: 10px;
    cursor: pointer;
  }
  .callout,
  .logo {
    vertical-align: bottom;
    flex: 0 0 auto;
  }
  .controls {
    flex: 1 1 auto;
    background: #99e8ff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
  }
  .callout {
    position: relative;
    transition: top 0.4s;
    top: -45px;
  }
  .resume {
  }
  .button:focus {
    outline: none;
  }
`;

const textButton = styles.button.and("button--text");

// Slug of the newest post; blog.json is generated newest-first.
const latestPost = fetch("./index/api/layout/blog.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((layout) => layout?.[0]?.[1]?.posts?.[0]?.slug)
  .catch(() => undefined);

// Link to the newest post, falling back to the post index.
const useBlogHref = () => {
  const [href, setHref] = useState("/blog");
  useEffect(() => {
    latestPost.then((slug) => slug && setHref(`/blog/${slug}`));
  }, []);
  return href;
};

export default ({ setLanguage }) => {
  const blogHref = useBlogHref();
  return html`
  <div className=${styles.nav}>
    <img className=${
      styles.logo
    } src="./index/img/fordi.png" alt="Personal logo" style=${{ height: 96 }} />
    <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 40 141" width="40" height="141" className=${
      styles.callout
    }>
      <path fill="#99e8ff" d="M0 0v141h13c9-6 0-22 0-22s13 8 16 22h11V0H29c-3 14-16 22-16 22s9-16 0-22z"/>
    </svg>
    <div className=${styles.controls}>
      <${NavLink} href="/portfolio" className="button--text">
        Portfolio
      <//>
      <span className=${styles.resume}>
        ${"Resume: "}
        <${ExtLink} className=${textButton} href="./index/res/Bryan_Elliott.docx">Word</ExtLink>
        ${" | "}
        <${ExtLink} className=${textButton} href="./index/res/Bryan_Elliott.md">Text</ExtLink>
      </span>
      <${NavLink} href="/about" className="button--text">
          About
      <//>
      <${NavLink} href=${blogHref} className="button--text">
          Blog
      <//>
    </div>
    <div className=${styles.language}>
      <button onClick=${() =>
        setLanguage("en")}><img src="./index/img/flags/en.png" alt="English" /></button>
      <button onClick=${() =>
        setLanguage("es")}><img src="./index/img/flags/es.png" alt="Español" /></button>
      <button onClick=${() =>
        setLanguage("jp")}><img src="./index/img/flags/jp.png" alt="日本人" /></button>
    </div>
  </div>
`;
};
