import { html, joinClass, css } from './buildless.js';
import ExtLink from './ExtLink.js';

const styles = css`
  .nav {
      display: flex;
      height: 96px;
      overflow: hidden;
      z-index: 1;
  }
  .logo {
      background: #99e8ff;
  }
  .callout, .logo {
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
  }
  .nav-top {
      margin-top: -96px;
      margin-bottom: 0;
      .callout {
          top: 0;
      }

  }
  .nav-bottom {
      margin-top: 0;
      margin-bottom: -96px;
      .callout {
          top: -45px;
      }
  }
  .active {
      text-shadow: 0 0 1px #FFFFFF, 0 0 1px #FFFFFF;
      color: black;
  }
  .resume {}
  .button:focus {
      outline: none;
  }
`;

export default ({ setToTop, setToBottom, selected }) => html`
  <div className=${joinClass(styles.nav, styles[`nav-${selected}`])}>
    <img className=${styles.logo} src="./fordi.png" alt="Personal logo" style=${{ height: 96 }} />
    <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 40 141" width="40" height="141" className=${styles.callout}>
      <path fill="#99e8ff" d="M0 0v141h13c9-6 0-22 0-22s13 8 16 22h11V0H29c-3 14-16 22-16 22s9-16 0-22z"/>
    </svg>
    <div className=${styles.controls}>
      <button
          type="button"
          className=${joinClass(
            selected === 'top' ? styles.active : styles.inactive,
            styles.button,
            'button--text'
          )}
          onClick=${setToTop}
      >
        Portfolio
      </button>
      <span className=${styles.resume}>
        ${'Resume: '}
        <${ExtLink} className=${joinClass('button--text', styles.button)} href="./Bryan_Elliott.docx">Word</ExtLink>
        ${' | '}
        <${ExtLink} className=${joinClass('button--text', styles.button)} href="./Bryan_Elliott.md">Text</ExtLink>
      </span>
      <button
        type="button"
        className=${joinClass(
            selected === 'bottom' ? 'active' : 'inactive',
            styles.button,
            'button--text'
        )}
        onClick=${setToBottom}
      >
          About
      </button>
    </div>
  </div>
`;
