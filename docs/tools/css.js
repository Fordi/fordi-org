import classes from "./classes.js";

const head = document.querySelector("head");
const { sheet } = head.appendChild(document.createElement("style"));

const clsRx = /\.([^ .[:>,]+)/g;

const appendId = (str, id) => (str.endsWith(`_${id}`) ? str : `${str}_${id}`);
const aniKwRx =
  /infinite|none|forwards|backwards|both|paused|running|normal|reverse|alternate-normal|alternate-reverse/;

const allRules = (a) =>
  a.selectorText
    ? [a]
    : Array.from(a.cssRules || []).reduce(
        (list, rule) => [a, ...list, ...allRules(rule)],
        []
      );

const parseRules = (css) => {
  const t = document.createElement("style");
  t.textContent = css;
  head.appendChild(t);
  const r = t.sheet;
  head.removeChild(t);
  return Array.from(r.cssRules);
};

const insertRule = (rule, id) => {
  const classNames = allRules(rule).reduce((cls, r) => {
    if (r.type === CSSRule.KEYFRAMES_RULE) {
      r.name = appendId(r.name, id);
    }
    if (r.style) {
      if (r.style["animation-name"]) {
        r.style["animation-name"] = r.style["animation-name"]
          .split(",")
          .map((p) => appendId(p.trim(), id))
          .join(",");
      }
      if (r.style.animation) {
        r.style.animation = r.style.animation
          .replace(/,[\s\r\n\t]+/g, ",")
          .split(/[\s\r\n\t]+/)
          .map((part) => {
            // Can have multiple values
            const [piece, ...pieces] = part.split(",");
            // Starts with a number; it's a time value or iteration count
            if (/^[.0-9]/.test(piece)) {
              return part;
            }
            // keywords
            if (aniKwRx.test(piece)) {
              return part;
            }
            // Not a keyword or numeric; it's an ID.
            return [piece, ...pieces]
              .map((p) => appendId(p.trim(), id))
              .join(",");
          })
          .join(" ");
      }
    }
    if (r.selectorText) {
      r.selectorText = r.selectorText.replace(clsRx, (...m) => {
        cls[m[1]] = appendId(m[1], id);
        return `.${cls[m[1]]}`;
      });
    }
    return cls;
  }, {});
  sheet.insertRule(rule.cssText);
  return classNames;
};

const createStylesheet = (str) => {
  const rid = Math.random().toString(36).substr(2);
  const cssRules = parseRules(str);
  const styles = {};
  cssRules.forEach((rule) => Object.assign(styles, insertRule(rule, rid)));
  Object.keys(styles).forEach((name) => {
    styles[name] = classes(styles[name]);
  });
  return styles;
};

export default (...args) => createStylesheet(String.raw(...args));
