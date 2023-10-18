const callMap = new WeakMap();

export const onCall = (obj, member, listener) => {
  const context = obj;
  if (!callMap.get(obj[member])) {
    const props = {
      context,
      name: member,
      original: obj[member],
      listeners: new Set(),
    };
    props.proxy = (...args) => {
      const ret = props.original.apply(props.context, args);
      [...props.listeners].forEach((l) => l.apply(props.context, args));
      return ret;
    };
    callMap.set(props.original, props);
    callMap.set(props.proxy, props);
    context[member] = props.proxy;
  }
  callMap.get(obj[member]).listeners.add(listener);
};

export const offCall = (obj, member, listener) => {
  const props = callMap.get(obj[member]);
  if (!props) {
    return;
  }
  props.listeners.delete(listener);
  if (props.listeners.size === 0) {
    callMap.delete(props.proxy);
    callMap.delete(props.original);
    props.context[props.name] = props.original;
  }
};
