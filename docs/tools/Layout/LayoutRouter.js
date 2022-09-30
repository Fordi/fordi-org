import { createElement } from 'preact';
import { useEffect } from 'preact/hooks';
import useUrl from '../useUrl.js';
import Layout from './Layout.js';

export default ({ index, Loading, ...props }) => {
  const url = useUrl();
  useEffect(() => {
    if (url.pathname === '/') {
      window.location.replace(index);
    }
  }, [url]);
  return createElement(Layout, {
    ...props,
    Loading,
    layoutName: `${url.pathname.replace(/^\//, '')}`,
  });
};
