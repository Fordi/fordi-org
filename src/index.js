import { render } from 'preact';
import { useState } from 'preact/hooks';
import { Router } from 'preact-router';
import html from 'html';
import asyncComponent from 'asyncComponent';

import I18n from './I18n.js';
import Redirect from './Redirect.js';
import Layout from './Layout.js';
import Loading from './Loading.js';

const About = asyncComponent(() => import('./About.js'), Loading);
const Portfolio = asyncComponent(() => import('./Portfolio/index.js'), Loading);

const defaultLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];

const Index = () => {
  const [language, setLanguage] = useState(defaultLanguage);
  const storeLanguage = lang => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
  };
  return html`
    <${I18n.Provider} value=${language}>
      <${Layout} setLanguage=${storeLanguage}>
        <${Router}>
          <${Portfolio} path="/portfolio" />
          <${About} path="/about" />
          <${Redirect} path="/" to="/portfolio" />
          <${Loading} path="/loading" />
        <//>
      <//>
    <//>
  `;
};

render(html`<${Index}/>`, document.body);
