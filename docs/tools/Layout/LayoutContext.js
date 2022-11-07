import { createContext, createElement } from 'preact';
import ModuleCache from '../ModuleCache.js';
import JsonCache from '../JsonCache.js';
import createClassReviver from './createClassReviver.js';
import createComponentReviver from './createComponentReviver.js';
import { useState, useEffect, useContext } from 'preact/hooks';
import isThenable from '../isThenable.js';

const Context = createContext({});

const isHtmlTag = (c) => (
  c[0].toLowerCase() === c[0] && c.indexOf('.') === -1 && c.indexOf('/') === -1
);

export const LayoutComponent = ({ componentName, children, ...props }) => {
  const { moduleCache } = useContext(Context);
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (isHtmlTag(componentName)) {
      setComponent(componentName);
    } else {
      setComponent(() => moduleCache.getExport(componentName));
    }
  }, [componentName, moduleCache]);

  useEffect(async () => {
    if (!isThenable(Component)) return;
    const comp = await Component;
    setComponent(() => comp);
  }, [Component]);

  if (!Component || isThenable(Component)) return null;

  return createElement(
    Component,
    props,
    (children || []).map((sub) => {
      if (Array.isArray(sub) && sub.length <= 3) {
        return createElement(
          LayoutComponent,
          {
            ...sub[1],
            componentName: sub[0],
            children: sub[2],
          },
        );
      }
      return sub;
    }),
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
  return createElement(Provider, { value: { moduleCache, layoutCache } }, children);
};

export default Context;
