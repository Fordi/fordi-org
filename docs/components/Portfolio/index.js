import html from 'html';
import css from 'css';

export const styles = css`
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

export default ({ children }) => html`
  <div className=${styles.portfolio}>
    ${children}
  </div>
`;
