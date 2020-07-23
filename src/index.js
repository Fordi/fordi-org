import { render, html, Router, asyncComponent } from 'https://unpkg.com/@fordi-org/buildless';

import Redirect from './Redirect.js';
import Layout from './Layout.js';
import Loading from './Loading.js';

const About = asyncComponent(() => import('./About.js'), Loading);
const Portfolio = asyncComponent(() => import('./Portfolio/index.js'), Loading);

const Index = () => html`
  <${Layout}>
    <${Router}>
      <${Portfolio} path="/portfolio" />
      <${About} path="/about" />
      <${Redirect} path="/" to="/portfolio" />
    <//>
  <//>
`;

render(html`<${Index}/>`, document.body);
