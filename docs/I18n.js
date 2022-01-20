import { useContext } from 'preact/hooks';
import createI18nContext from 'createI18nContext';

import messageTable from './messageTable.js';

const I18N = createI18nContext({
  keyLang: 'en',
  messageTable,
});

export const useI18n = () => useContext(I18N);
export default I18N;
