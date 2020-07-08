import { html, css, joinClass } from './buildless.js';

const styles = css`
  .extLink {}
`;

export default ({ children, className, ...props }) => html`
  <a
    className=${joinClass(styles['extLink'], className)}
    target="_blank"
    rel="noopener noreferrer"
    ...${props}
  >
    ${children}
  </a>
`;
