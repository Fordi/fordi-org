import html from 'html';
import css from 'css';

import Carousel from '../Carousel/index.js';
import Item from '../Carousel/Item.js';
import XfinityLogo from './XfinityLogo.js';
import ExtLink from '../ExtLink.js';
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
          title="${_`You Are Here`}"
        >
          ${_`Bryan enjoys playing with innovative ways of building things, usually starting
          with this page.  Visit the repo to see how he wrote this one using `}
          <${ExtLink} className=${styles.flavorLink} href="https://github.com/Fordi/buildless">buildless<//>
          ${'.'}
        <//>
        <${Item}
          href="https://customer.xfinity.com"
          image="Portfolio/xfinity.png"
          title=${html`<${XfinityLogo} style=${{ marginTop: -18 }} alt="Xfinity MyAccount"/>`}
        >
          ${_`Bryan helped to maintain Comcast's various customer portals, working in React and
          Angular, and picking up Ruby and Rails.  The job was to prevent downtime, ensure
          the security of transactions and personal information, and to create the best
          possible customer experience by working together with several upstream API teams
          to implement new features.`}
        <//>
        <${Item}
          href="https://www.orbistechnologies.com/rsuite"
          image="Portfolio/rsuite.png"
          title=${html`<img src="Portfolio/RSuiteLogo.png" style=${{ marginTop: -22 }} alt="RSuite CMS" />`}
        >
          ${_`Bryan developed the user interface for RSI Content Solutions’ main
          product, RSuite, from scratch.  Leveraging Ember, LESS, and building REST
          services in Java, he focused on functionality, extensibility, and
          performance.  The single-page web application is used by publishing houses
          across the globe....`}
        <//>
        <${Item}
          href="https://toysrus.com"
          image="Portfolio/toysrus.jpg"
          title=${html`<img src="Portfolio/toysrusLogo.png" style=${{ marginTop: -15 }} alt={'Toys"R"Us'} />`}
        >
          ${_`Bryan’s role as part of the Toys‘R’Us conversion team was that of
          converting Prototype-dependent scripts to jQuery, converting an
          include-based JSP website into one that leverages Tiles, and ensuring W3C
          validation throughout the site.`}
        <//>
        <${Item}
          href="https://www.maurices.com/"
          image="Portfolio/maurices.jpg"
          title="Maurices"
        >
          ${_`Maurices needed a dynamic Store Locator that could be integrated with Google Maps’ API;`}
          <br />
          <em>${_`Bryan was happy to oblige.`}</em>
        <//>
        <${Item}
          href="https://sportchek.ca"
          image="Portfolio/sportchek.jpg"
          title="Forzani Sport Chek"
        >
          ${_`Bryan set up fonts and flash, enabled CSS3, and played “fixer”
          for this fast launch.`}
        <//>
        <${Item}
          href="https://muppet.fandom.com/wiki/The_Muppet_Whatnot_Workshop"
          image="Portfolio/fao.jpg"
          title="Muppet Whatnot Workshop"
        >
          ${_`Bryan developed the web interface for the Muppet Whatnot Workshop, allowing an
          online shopper to customize their own Muppet-themed plush.`}
        <//>
        <${Item}
          href="https://en.wikipedia.org/wiki/Vectrix"
          image="Portfolio/vectrix.jpg"
          title="Vectrix Tools"
        >
          ${_`Whether calculating your gasoline savings with a Vectrix scooter versus other
          vehicles, or determining how far you can go on a full charge, Bryan's code enables you.`}
        <//>
      <//>
    </div>
  `;
};
