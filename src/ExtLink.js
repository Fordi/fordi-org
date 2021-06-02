import html from 'html';

export default ({ children, ...props }) => html`
  <a
    target="_blank"
    rel="noopener noreferrer"
    ...${props}
  >
    ${children}
  </a>
`;
