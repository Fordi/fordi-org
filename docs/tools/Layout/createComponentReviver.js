import { createElement } from 'preact';

export default (moduleCache, Component) => (_, value) => {
  if (typeof value && Array.isArray(value.component)) {
    const [componentName, props, children = []] = value.component;
    return Promise.resolve(createElement(Component, {
      ...props,
      componentName,
      children,
      moduleCache,
    }));
  }
  return undefined;
};
