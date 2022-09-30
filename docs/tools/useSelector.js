import { useEffect, useState } from 'preact';

export default (machine, selector) => {
  const [value, setValue] = useState(selector(machine.getState()));
  useEffect(
    () => machine.listen((newState, oldState) => {
      const gnu = selector(newState);
      const old = selector(oldState);
      if (gnu !== old) {
        setValue(gnu);
      }
    }),
    [],
  );
  return value;
};
