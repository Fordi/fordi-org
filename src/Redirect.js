
import { route, useEffect } from 'https://unpkg.com/@fordi-org/buildless';
 
export default ({ to }) => {
  useEffect(() => route(to, true), []);
  return null;
};
