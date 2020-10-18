import { createI18nContext, useContext } from 'https://unpkg.com/@fordi-org/buildless';
import messageTable from './messageTable.js';

const I18N = createI18nContext({ messageTable });

export const useI18n = () => useContext(I18N);
export default I18N;
