export * from 'https://unpkg.com/@fordi-org/buildless@1.0.2/dist/buildless.modern.js';

export const joinClass = (...classes) => classes.filter(a => !!a).join(' ');

export const css = (...args) => {
  const rid = Math.random().toString(36).substr(2);
  const cssRules = parseRules(String.raw(...args));
  const classes = {};
  allRules({ cssRules }).forEach(rule => {
    rule.selectorText = rule.selectorText.replace(/\.([^ \.\[:>,]+)/g, (_, match) => (
      `.${classes[match] = `${match}_${rid}`}`)
    );
  });
  cssRules.forEach(rule => sheets.insertRule(rule.cssText));
  return classes;
};

const head = document.querySelector('head');
const sheets = head.appendChild(document.createElement('style')).sheet;
const allRules = a => (
  a.selectorText
    ? [a]
    : Array.from(a.cssRules || []).reduce((list, rule) => (
      [...list, ...allRules(rule)]
    ), [])
);

const parseRules = css => {
  const t = document.createElement('style');
  t.textContent = css;
  head.appendChild(t);
  const r = t.sheet;
  head.removeChild(t);
  return Array.from(r.cssRules);
}
