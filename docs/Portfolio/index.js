import html from 'html';
import css from 'css';

import Carousel from '../Carousel/index.js';
import Item from '../Carousel/Item.js';
import XfinityLogo from './XfinityLogo.js';
import { useI18n } from '../I18n.js';

const styles = css`
  .portfolio {
    background: url(Portfolio/denim-velvet.jpg);
    width: 100%;
    height: 100%;
  }
  .carousel {
    padding: 5vh 0;
    color: white;
  }
  .carousel h1 {
    max-height: 42px;
    margin-left: 1em;
  }
  .flavorLink {
    text-shadow: 1px 1px 10px black, -1px -1px 10px black;
    color: white;
    text-decoration: none;
  }
`;

export default () => {
  const _ = useI18n();
  return html`
    <div className=${styles.portfolio}>
      <${Carousel} className=${styles.carousel}>
        <${Item}
          href="https://github.com/Fordi/fordi-org"
          image="Portfolio/portfolio.jpg"
          title="${_`youAreHere`}"
        >
          ${_`portfolio`}
        <//>
        <${Item}
          href="https://customer.xfinity.com"
          image="Portfolio/xfinity.png"
          title=${html`<${XfinityLogo} style=${{ marginTop: -18 }} alt="Xfinity MyAccount"/>`}
        >
          ${_`portfolioComcast`}
        <//>
        <${Item}
          href="https://www.orbistechnologies.com/rsuite"
          image="Portfolio/rsuite.png"
          title=${html`<img src="Portfolio/RSuiteLogo.png" style=${{ marginTop: -22 }} alt="RSuite CMS" />`}
        >
          ${_`portfolioRSuite`}
        <//>
        <${Item}
          href="https://toysrus.com"
          image="Portfolio/toysrus.jpg"
          title=${html`<img src="Portfolio/toysrusLogo.png" style=${{ marginTop: -15 }} alt={'Toys"R"Us'} />`}
        >
          ${_`portfolioToys`}
        <//>
        <${Item}
          href="https://muppet.fandom.com/wiki/The_Muppet_Whatnot_Workshop"
          image="Portfolio/fao.jpg"
          title="Muppet Whatnot Workshop"
        >
          ${_`portfolioFAO`}
        <//>
        <${Item}
          href="https://en.wikipedia.org/wiki/Vectrix"
          image="Portfolio/vectrix.jpg"
          title="Vectrix Tools"
        >
          ${_`portfolioVectrix`}
        <//>
      <//>
    </div>
  `;
};
