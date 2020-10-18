import { html, css, classes, Router } from 'https://unpkg.com/@fordi-org/buildless';
import ExtLink from './ExtLink.js';
const { Link } = Router;
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
  .logo, .language {
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
    top: -45px;
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

const textButton = styles.button.and('button--text');

export default ({ setLanguage }) => html`
  <div className=${styles.nav}>
    <img className=${styles.logo} src="./fordi.png" alt="Personal logo" style=${{ height: 96 }} />
    <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 40 141" width="40" height="141" className=${styles.callout}>
      <path fill="#99e8ff" d="M0 0v141h13c9-6 0-22 0-22s13 8 16 22h11V0H29c-3 14-16 22-16 22s9-16 0-22z"/>
    </svg>
    <div className=${styles.controls}>
      <${Link} href="/portfolio" className=${classes('button--text', location.pathname === '/portfolio' && styles.active)}>
        Portfolio
      <//>
      <span className=${styles.resume}>
        ${'Resume: '}
        <${ExtLink} className=${textButton} href="./Bryan_Elliott.docx">Word</ExtLink>
        ${' | '}
        <${ExtLink} className=${textButton} href="./Bryan_Elliott.md">Text</ExtLink>
      </span>
      <${Link} href="/about" className=${classes('button--text', location.pathname === '/about' && styles.active)}>
          About
      <//>
    </div>
    <div className=${styles.language}>
      <button onClick=${() => setLanguage('en')}><img src="en.png" alt="English" /></button>
      <button onClick=${() => setLanguage('es')}><img src="es.png" alt="Español" /></button>
    </div>
  </div>
`;
