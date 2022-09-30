import { createElement } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import isThenable from '../isThenable.js';
import LayoutContext from './LayoutContext.js';

const isHtmlTag = (c) => (
  c[0].toLowerCase() === c[0] && c.indexOf('.') === -1 && c.indexOf('/') === -1
);

const LayoutComponent = ({ componentName, children, ...props }) => {
  const { moduleCache } = useContext(LayoutContext);
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

export default LayoutComponent;
