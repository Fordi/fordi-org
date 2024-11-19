
import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
 
export default ({ to }) => {
  useEffect(() => route(to, true), []);
  return null;
};
