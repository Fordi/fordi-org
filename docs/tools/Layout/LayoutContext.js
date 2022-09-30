import { createContext, createElement } from 'preact';
import ModuleCache from '../ModuleCache.js';
import JsonCache from '../JsonCache.js';
import createClassReviver from './createClassReviver.js';
import createComponentReviver from './createComponentReviver.js';

const Context = createContext({});
const { Provider } = Context;

Context.Provider = ({ fetchLayout, fetchModule, revivers, children }) => {
  const moduleCache = new ModuleCache(fetchModule);
  const layoutCache = new JsonCache(fetchLayout, [
    createClassReviver(moduleCache),
    createComponentReviver(moduleCache),
    ...revivers,
  ]);
  return createElement(Provider, { value: { moduleCache, layoutCache } }, children);
};

export default Context;
