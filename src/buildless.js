export * from 'https://unpkg.com/@fordi-org/buildless@1.0.3/dist/buildless.modern.js';

export const joinClass = (...classes) => classes.filter(a => !!a).join(' ');

const clsRx = /\.([^ \.\[:>,]+)/g;

export const insertRule = (rule, id) => {
  const index = sheets.insertRule(rule);
  const classes = {};
  allRules(sheets.cssRules[index]).forEach(r => {
    r.selectorText = r.selectorText.replace(clsRx, (_, m) => `.${classes[m] = `${m}_${id}`}`);
  });
  return classes;
};

export const css = (...args) => {
  const rid = Math.random().toString(36).substr(2);
  const cssRules = parseRules(String.raw(...args));
  const classes = {};
  cssRules.forEach(rule => Object.assign(classes, insertRule(rule.cssText, rid)));
  return classes;
};

const head = document.querySelector('head');
const staticRules = Array.from(document.styleSheets).reduce((s, sheet) => (
  [...s, ...Array.from(sheet.cssRules).map(rule => rule.cssText)]
), []);
console.log(staticRules);
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
