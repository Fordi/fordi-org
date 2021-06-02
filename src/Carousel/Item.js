import html from 'html';
import css from 'css';

import ExtLink from '../ExtLink.js';

const styles = css`
  .item {
    width: 50vw;
    max-width: 640px;
    transition: opacity 0.4s, transform 0.4s;
    position: absolute;
  }
  .item img {
    box-shadow: 0 0 10px 0 #eeaa44;
    width: 50vw;
    max-width: 640px;
  }
  .item .flavor {
    color: white;
    text-shadow: 0 0 10px #46585c, 0 0 10px #46585c, 0 0 10px #46585c;
  }
`;
export default ({
  id, href, image, title, children, className
}) => html`
  <li className=${styles.item.and(className)} id=${id}>
    <div className=${styles.shadow}> </div>
    <${ExtLink} href=${href}>
      <img src=${image} className=${styles.image} alt=${title} />
    <//>
    <div className=${styles.flavor}>${children}</div>
  </li>
`;
