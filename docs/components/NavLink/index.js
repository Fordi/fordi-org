import html from 'html';
import css from 'css';
import classes from 'classes';
import useUrl from '../../tools/useUrl.js';

const styles = css`
  .active {
    text-shadow: 0 0 1px #FFFFFF, 0 0 1px #FFFFFF;
    color: black;
  }
`;

const handleClick = (event) => {
  window.history.pushState(null, null, event.target.href);
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
  const isActive = new URL(href, url.href).href === url.href;
  return html`
    <a
      ...${props}
      href=${href}
      className=${classes(className, isActive && styles.active)}
      onClick=${handleClick}
    >
      ${children}
    </a>
  `;
};
