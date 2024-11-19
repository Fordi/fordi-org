import html from 'html';

export default ({ error }) => html`
  <div class="error">
    <h1>${error.name}</h1>
    <h2>${error.message}</h2>
    <ul>
      ${error.stack.split('\n').slice(1).map((trace) => html`
        <li>${trace.trim()}</li>
      `)}
    </ul>
  </div>
`;
