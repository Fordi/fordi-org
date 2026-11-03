import { createContext, createElement } from "preact";
import ModuleCache from "./ModuleCache.js";
import JsonCache from "./JsonCache.js";
import createClassReviver from "./createClassReviver.js";
import createComponentReviver from "./createComponentReviver.js";
import { useState, useEffect, useContext } from "preact/hooks";

const Context = createContext({});

const isHtmlTag = (c) =>
  c[0].toLowerCase() === c[0] && c.indexOf(".") === -1 && c.indexOf("/") === -1;

export const LayoutComponent = ({ componentName, children, ...props }) => {
  const { moduleCache } = useContext(Context);
  // Remember which name the loaded component belongs to: when the layout
  // changes, this instance is reused, and the old component must never be
  // rendered with the new layout's props.
  const [loaded, setLoaded] = useState({ name: null, Component: null });

  useEffect(() => {
    if (isHtmlTag(componentName)) {
      setLoaded({ name: componentName, Component: componentName });
      return undefined;
    }
    let current = true;
    Promise.resolve(moduleCache.getExport(componentName)).then((Component) => {
      if (current) {
        setLoaded({ name: componentName, Component });
      }
    });
    return () => {
      current = false;
    };
  }, [componentName, moduleCache]);

  const { name, Component } = loaded;
  if (name !== componentName || !Component) {
    return null;
  }

  return createElement(
    Component,
    props,
    (children || []).map((sub) => {
      if (Array.isArray(sub) && sub.length <= 3) {
        return createElement(LayoutComponent, {
          ...sub[1],
          componentName: sub[0],
          children: sub[2],
        });
      }
      return sub;
    })
  );
};

const { Provider } = Context;

Context.Provider = ({ fetchLayout, fetchModule, revivers, children }) => {
  const moduleCache = new ModuleCache(fetchModule);
  const componentReviver = createComponentReviver(moduleCache, LayoutComponent);
  const layoutCache = new JsonCache(fetchLayout, [
    createClassReviver(moduleCache),
    componentReviver,
    ...revivers,
  ]);
  return createElement(
    Provider,
    { value: { moduleCache, layoutCache } },
    children
  );
};

export default Context;
