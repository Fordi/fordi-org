import css from 'css';
import { createContext, createElement } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const BROWSER_LANG = navigator.language.split('-')[0];

const { i18nLoading, noMessage } = css`
.i18nLoading {
  filter: blur(1em);
}
.noMessage {
  outline: 1px dashed red;
}
`;

export default ({ config: { languages, keys }, fetchLanguage }) => {
  const defaultLang = languages.indexOf(BROWSER_LANG) !== -1
    ? BROWSER_LANG
    : languages[0];
  const Context = createContext({ language: defaultLang });
  const keyMap = keys.reduce((o, k, i) => {
    o[k] = i;
    return o;
  }, {});
  const { Provider } = Context;
  const cache = {};
  Context.Provider = ({
    children,
    value:language = BROWSER_LANG,
  }) => {
    const [messageTable, setMessageTable] = useState(null);
    useEffect(async () => {
      if (!cache[language]) {
        cache[language] = fetchLanguage(language);
      }
      if (cache[language].then) {
        const table = await cache[language];
        if (cache[language] !== table) {
          cache[language] = table;
        }
      }
      setMessageTable(cache[language]);
    }, [language]);

    return createElement(
      Provider,
      {
        value: (strings, ...subs) => {
          const id = typeof strings === 'string' ? strings : strings.raw.join('%%');
          if (messageTable === null) {
            return createElement(
              'div',
              { className: i18nLoading },
              [...strings.raw.join('%%')].map(() => 
                String.fromCharCode(Math.floor(Math.random() * 95 + 32))
              ).join('')
            );
          }
          const message = messageTable[keyMap[id]];
          if (!message) {
            return createElement(
              'div',
              { className: noMessage },
              `No i18n entries for "${id}" in ${language}`
            );

          }
          return String.raw({ raw: message.split('%%') }, ...subs);
        }
      },
      children
    );
  };
  return Context;
};