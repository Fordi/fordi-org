const parsePath = (path) => {
  const { pathname = '/', search = '', hash = '' } = new URL('/portfolio', 'http://_/');
  return { pathname, search, hash };
};

const createPath = ({ pathname = '/', search = '', hash = '' }) => pathname + search + hash;

const createEvents = () => {
  let handlers = new Set();
  return {
    get length() {
      return handlers.size;
    },
    push(fn) {
      handlers.add(fn);
      return () => handlers.delete(fn);
    },
    call(arg) {
      for (const fn in handlers) fn && fn(arg);
    }
  };
};

const createKey = () => Math.random().toString(36).substr(2, 8);

const promptBeforeUnload = (event) => {
  event.preventDefault();
  event.returnValue = '';
};

const Action = {
  Pop: 'POP',
  Push: 'PUSH',
  Replace: 'REPLACE',
};

export default({ window = document.defaultView } = {}) => {
  const globalHistory = window.history;

  const getIndexAndLocation = () => {
    let { pathname, search, hash } = parsePath(window.location.hash.substr(1));
    let state = history.state || {};
    return [
      state.idx,
      {
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      }
    ];
  }
  let blockedPopTx = null;
  const handlePop = () => {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
      return;
    }
    const nextAction = Action.Pop;
    const [nextIndex, nextLocation] = getIndexAndLocation();

    if (blockers.length) {
      if (nextIndex != null) {
        const delta = index - nextIndex;
        if (delta) {
          // Revert the POP
          blockedPopTx = {
            action: nextAction,
            location: nextLocation,
            retry: () => go(delta * -1),
          };
          go(delta);
        }
      } else {
        console.warn(
          `You are trying to block a POP navigation to a location that was not ` +
            `created by the history library. The block will fail silently in ` +
            `production, but in general you should do all navigation with the ` +
            `history library (instead of using window.history.pushState directly) ` +
            `to avoid this situation.`
        );
      }
    } else {
      applyTx(nextAction);
    }
  }

  window.addEventListener('popstate', handlePop);

  window.addEventListener('hashchange', () => {
    let [, nextLocation] = getIndexAndLocation();
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  let listeners = createEvents();
  let blockers = createEvents();

  if (index == null) {
    index = 0;
    history.replaceState({ ...history.state, idx: index }, '');
  }

  const getBaseHref = () => {
    let base = document.querySelector('base');
    let href = '';

    if (base && base.getAttribute('href')) {
      let url = window.location.href;
      let hashIndex = url.indexOf('#');
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  };

  const createHref = (to) => `${getBaseHref()}#${typeof to === 'string' ? to : createPath(to)}`;

  const getNextLocation = (to, state = null) => ({
    ...location,
    ...(typeof to === 'string' ? parsePath(to) : to),
    state,
    key: createKey()
  });

  const getHistoryStateAndUrl = (nextLocation, index) => [
    {
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index
    },
    createHref(nextLocation)
  ];

  const allowTx = (action, location, retry) => (
    !blockers.length || (blockers.call({ action, location, retry }), false)
  );

  const applyTx = (nextAction) => {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  const push = (to, state) => {
    let nextAction = Action.Push;
    let nextLocation = getNextLocation(to, state);
    const retry = () => push(to, state);
    if (nextLocation.pathname.charAt(0) === '/') {
      console.warn(`Relative pathnames are not supported in hash history.push(${JSON.stringify(to)})`);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        history.pushState(historyState, '', url);
      } catch (error) {
        window.location.assign(url);
      }
      applyTx(nextAction);
    }
  }

  const replace = (to, state) => {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);
    const retry = () => replace(to, state);

    if (nextLocation.pathname.charAt(0) === '/') {
      console.warn(`Relative pathnames are not supported in hash history.replace(${JSON.stringify(to)})`);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);
      history.replaceState(historyState, '', url);
      applyTx(nextAction);
    }
  }

  const go = delta => history.go(delta);

  const block = blocker => {
    let unblock = blockers.push(blocker);
    if (blockers.length === 1) {
      window.addEventListener('beforeunload', promptBeforeUnload);
    }
    return () => {
      unblock();
      if (!blockers.length) {
        window.removeEventListener('beforeunload', promptBeforeUnload);
      }
    };
  }

  return {
    get action() { return action; },
    get location() { return location; },
    createHref,
    push,
    replace,
    go,
    block,
    back: () => go(-1),
    forward: () => go(1),
    listen: (listener) => listeners.push(listener),
  };
}