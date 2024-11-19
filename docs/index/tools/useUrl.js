import { useCallback, useEffect, useState } from 'preact/hooks';
import { onCall, offCall } from './spy.js';

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
