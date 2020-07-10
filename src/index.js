import { render, html } from 'https://unpkg.com/@fordi-org/buildless';

import Layout from './Layout.js';
import About from './About.js';
import TwoPiece from './TwoPiece.js';
import Nav from './Nav.js';
import Portfolio from './Portfolio/index.js';

const Index = () => html`
  <${Layout}>
    <${TwoPiece}
      top=${Portfolio}
      nav=${Nav}
      bottom=${About}
    />
  <//>
`;

render(html`<${Index}/>`, document.body);
