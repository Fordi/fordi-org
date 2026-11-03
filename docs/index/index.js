import { render } from "preact";
import html from "html";
import { LayoutRouter } from "Layout";
import Shell from "./app/Shell.js";
import Loading from "./components/Loading/index.js";

const Index = () => html`
  <${Shell}>
    <${LayoutRouter}
      index="/portfolio"
      Loading=${Loading}
      transitionDelay=${800}
    />
  <//>
`;

render(html`<${Index} />`, document.body);
