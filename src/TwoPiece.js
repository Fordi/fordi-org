import { html, useState, css, Router } from 'https://unpkg.com/@fordi-org/buildless';


export default ({ className, top: Top, bottom: Bottom, nav: Nav }) => {
  const [selected, setSelected] = useState('top');
  const setToTop = () => setSelected('top');
  const setToBottom = () => setSelected('bottom');
  return html`

  `;
};
