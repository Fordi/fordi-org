import React from 'react';
import styles from './index.module.scss';
import Carousel, { Item } from '../Carousel';
import rsuite from './rsuite.png';
import toysrus from './toysrus.jpg';
import sportchek from './sportchek.jpg';
import fao from './fao.jpg';
import vectrix from './vectrix.jpg';
import maurices from './maurices.jpg';
import RSuiteLogo from './RSuiteLogo.png';
import toysrusLogo from './toysrusLogo.png';
import xfinity from './xfinity.png';
import xfinityLogo from './xfinityLogo.svg';

export default () => (
  <div className={styles.portfolio}>
    <Carousel className={styles.carousel}>
      <Item
        href="https://customer.xfinity.com"
        image={xfinity}
        title={<img src={xfinityLogo} style={{ marginTop: -18 }} alt="Xfinity MyAccount" />}
      >
        Bryan helped to maintain Comcast's various customer portals, working in React and
        Angular, and picking up Ruby and Rails.  The job was to prevent downtime, ensure
        the security of transactions and personal information, and to create the best
        possible customer experience by working together with several upstream API teams
        to implement new features.
      </Item>
      <Item
        href="https://www.orbistechnologies.com/rsuite"
        image={rsuite}
        title={<img src={RSuiteLogo} style={{ marginTop: -22 }} alt="RSuite CMS" />}
      >
        Bryan developed the user interface for RSI Content Solutions&rsquo; main
        product, RSuite, from scratch.  Leveraging Ember, LESS, and building REST
        services in Java, he focused on functionality, extensibility, and
        performance.  The single-page web application is used by publishing houses
        across the globe....
      </Item>
      <Item
        href="https://toysrus.com"
        image={toysrus}
        title={<img src={toysrusLogo} style={{ marginTop: -15 }} alt={'Toys"R"Us'} />}
      >
        Bryan&rsquo;s role as part of the Toys&lsquo;R&rsquo;Us conversion team was that of
        converting Prototype-dependent scripts to jQuery, converting an
        include-based JSP website into one that leverages Tiles, and ensuring W3C
        validation throughout the site.
      </Item>
      <Item
        href="https://www.maurices.com/"
        image={maurices}
        title="Maurices"
      >
        Maurices needed a dynamic Store Locator that could be integrated with Google Maps&rsquo; API;
        <br />
        <em>Bryan was happy to oblige.</em>
      </Item>
      <Item
        href="https://sportchek.ca"
        image={sportchek}
        title="Forzani Sport Chek"
      >
        Bryan set up fonts and flash, enabled CSS3, and played &ldquo;fixer&rdquo;
        for this fast launch.
      </Item>
      <Item
        href="https://muppet.fandom.com/wiki/The_Muppet_Whatnot_Workshop"
        image={fao}
        title="Muppet Whatnot Workshop"
      >
        Bryan developed the web interface for the Muppet Whatnot Workshop, allowing an
        online shopper to customize their own Muppet-themed plush.
      </Item>
      <Item
        href="https://en.wikipedia.org/wiki/Vectrix"
        image={vectrix}
        title="Vectrix Tools"
      >
        Whether calculating your gasoline savings with a Vectrix scooter versus other
        vehicles, or determining how far you can go on a full charge, Bryan&apos;s code
        {' '}
        <em>enables</em>
        {' '}
  you.
      </Item>
    </Carousel>
  </div>
);
