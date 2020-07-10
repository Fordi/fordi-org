import { html, css } from 'https://unpkg.com/@fordi-org/buildless';

const styles = css`
  .container {
    width: 100vw;
    height: 100vh;
  }
`;

export default ({ children, className }) => {
  return html`
    <div className=${styles.container.and(className)}>
      ${children}
    </div>
  `;
};
