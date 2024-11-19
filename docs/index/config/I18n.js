import { createElement } from "preact";
import { useContext } from "preact/hooks";
import createI18nContext from "createI18nContext";

const I18N = createI18nContext({
  config: await fetch("./api/i18n/config").then((r) => r.json()),
  fetchLanguage: (language) =>
    fetch(`./api/i18n/${language}`).then((r) => r.json()),
});

export const useI18n = () => useContext(I18N);

export const I18NSub = ({ messageKey, subs }) =>
  useI18n()({ raw: [messageKey] }, ...subs);

export const reviveI18n = (...args) => {
  const value = args[1];
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const { i18n: messageKey, subs = [] } = value;
  if (typeof messageKey !== "string") {
    return undefined;
  }
  return createElement(I18NSub, { messageKey, subs });
};

export default I18N;
