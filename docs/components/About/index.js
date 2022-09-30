import html from 'html';
import css from 'css';

const styles = css`
  .about {
    padding-top: 96px;
    background: #222;
    color: #FEFEFE;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  .about article {
    width: 75%;
    display: block;
    margin: 0 auto;
    max-width: 960px;
    padding: 0 1em;
  }
`;

export default ({ title, article = [] }) => html`
  <div className=${styles.about}>
      <article>
          <h1>${title}</h1>
          ${article.map(({ title: subtitle, content = [] }) => html`
            <h2>${subtitle}</h2>
            ${content.map((item) => html`<p>${item}</p>`)}
          `)}
      </article>
  </div>
`;
