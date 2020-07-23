import { html, css } from 'https://unpkg.com/@fordi-org/buildless';
import Nav from './Nav.js';

const styles = css`
  .container {
    width: 100vw;
    height: 100vh;
  }
  .container>* {
    padding-bottom: 96px;
  }
`;

export default ({ children, className }) => {
  return html`
    <div className=${styles.container.and(className)}>
      ${children}
    </div>
    <${Nav} />
  `;
};
