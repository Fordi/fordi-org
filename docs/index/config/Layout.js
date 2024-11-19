import html from 'html';
import css from 'css';
import { LayoutContext } from 'Layout';
import { useLocalStorage } from 'useStorage';

import Nav from './Nav.js';
import I18n, { reviveI18n } from './I18n.js';

const styles = css`
  .container {
    width: 100vw;
    height: 100vh;
  }
  .container>* {
    padding-bottom: 96px;
  }
`;

const fetchLayout = (layout) => fetch(`./index/api/layout/${layout}.json`).then(r => {
    if (Math.floor(r.status / 100) !== 2) {
      if (r.status === 404) {
        throw Object.assign(new Error(), {
          name:  "Not Found",
          message:  `No page named /${layout}`,
          stack:  '',
        });
      }
      throw new Error(`HTTP ${r.status} ${r.statusText}`);
    }
    return r.text();
  });
  
const fetchModule = (moduleName) => import(`../components/${moduleName}/index.js`);

const defaultLanguage = navigator.language.split('-')[0];

export default ({ children, className }) => {
  const [language, setLanguage] = useLocalStorage('language', defaultLanguage);
  return html`
    <${I18n.Provider} value=${language}>
      <${LayoutContext.Provider}
        fetchLayout=${fetchLayout}
        fetchModule=${fetchModule}
        revivers=${[reviveI18n]}
      >
        <div className=${styles.container.and(className)}>
          ${children}
        </div>
        <${Nav} setLanguage=${setLanguage} />
      <//>
    <//>
  `;
};
