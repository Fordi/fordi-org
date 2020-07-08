import { html, css, joinClass } from './buildless.js';

const styles = css`
  .container {
    width: 100vw;
    height: 100vh;
  }
`;

export default ({ children, className }) => {
  return html`
    <div className=${joinClass(styles.container, className)}>
      ${children}
    </div>
  `;
};
