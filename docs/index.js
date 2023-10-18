import { render } from "preact";
import html from "html";
import { LayoutRouter } from "Layout";
import Layout from "./config/Layout.js";
import Loading from "./Loading.js";

const Index = () => html`
  <${Layout}>
    <${LayoutRouter}
      index="/portfolio"
      Loading=${Loading}
      transitionDelay=${800}
    />
  <//>
`;

render(html`<${Index} />`, document.body);
