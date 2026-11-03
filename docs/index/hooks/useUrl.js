import { useCallback, useEffect, useState } from 'preact/hooks';
import { onCall, offCall } from './spy.js';

// Where the site is mounted, taken from <base>: "/" in production, and
// "/fordi-org/" on staging, where the deploy rewrites the <base> tag.
export const basePath = new URL('.', document.baseURI).pathname;

// Site route ("/about") for a pathname ("/fordi-org/about" on staging).
export const toRoute = (pathname) =>
  `/${pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname.replace(/^\//, '')}`;

// Pathname for a site route: "/about" -> "/fordi-org/about" on staging.
export const toHref = (route) => `${basePath}${route.replace(/^\//, '')}`;

export default () => {
  const [url, setUrl] = useState(new URL(window.location.href));

  const onHashChange = useCallback(() => {
    if (url.toString() !== window.location.href) {
      setUrl(new URL(window.location.href));
    }
  }, [url]);

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    onCall(window.history, 'pushState', onHashChange);
    onCall(window.history, 'replaceState', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
      offCall(window.history, 'pushState', onHashChange);
      offCall(window.history, 'replaceState', onHashChange);
    };
  }, [onHashChange]);

  return Object.assign(url, {
    assign: () => window.history.pushState(url),
    replace: () => window.history.replaceState(url),
  });
};
