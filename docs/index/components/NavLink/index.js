import html from 'html';
import css from 'css';
import classes from 'classes';
import useUrl, { toHref } from '../../hooks/useUrl.js';

const styles = css`
  .active {
    text-shadow: 0 0 1px #FFFFFF, 0 0 1px #FFFFFF;
    color: black;
  }
`;

const handleClick = (event) => {
  window.history.pushState(null, null, event.currentTarget.href);
  event.preventDefault();
  return false;
};

export default ({
  children,
  className,
  href,
  ...props
}) => {
  const url = useUrl();
  // `href` is a site route ("/about"); resolve it against where the site
  // is mounted.
  const target = href.startsWith('/') ? toHref(href) : href;
  const isActive = new URL(target, url.href).href === url.href;
  return html`
    <a
      ...${props}
      href=${target}
      className=${classes(className, isActive && styles.active)}
      onClick=${handleClick}
    >
      ${children}
    </a>
  `;
};
