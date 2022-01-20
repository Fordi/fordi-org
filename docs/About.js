import html from 'html';
import css from 'css';
import { useI18n } from './I18n.js';

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

export default () => {
    const _ = useI18n();
    return html`
      <div className=${styles.about}>
          <article>
              <h1>Bryan elliott</h1>
              <h2>${_`historyTitle`}</h2>
              <p>${_`preEducation`}</p>
              <p>${_`school`}</p>
              <p>${_`clientWork`}</p>
              <p>${_`comcast`}</p>
              <h2>${_`skillsTitle`}</h2>
              <p>${_`ecosystem`}</p>
              <p>${_`flexibility`}</p>
              <p>${_`technology`}</p>
              <h2>${_`futureTitle`}</h2>
              <p>${_`ambitions`}</p>
              <p>${_`relationship`}</p>
          </article>
      </div>
  `;
};
