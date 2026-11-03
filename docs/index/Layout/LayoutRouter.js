import { createElement } from 'preact';
import { useEffect } from 'preact/hooks';
import useUrl, { toHref, toRoute } from '../hooks/useUrl.js';
import Layout from './Layout.js';

export default ({ index, Loading, ...props }) => {
  const url = useUrl();
  const route = toRoute(url.pathname);
  useEffect(() => {
    if (route === '/') {
      window.location.replace(toHref(index));
    }
  }, [route]);
  return createElement(Layout, {
    ...props,
    Loading,
    layoutName: route.replace(/^\//, ''),
  });
};
