import i18next from "i18next";
import i18nextMiddleware from 'i18next-express-middleware';

import localeEN from './locales/en.json';
import localeAM from './locales/am.json';

i18next.use(i18nextMiddleware.LanguageDetector).init({
  detection: {
    order: ['header'],
    lookupHeader: 'accept-language'
  },
  preload: ['en', 'am'],
  whitelist: ['en', 'am'],
  fallbackLng: 'en',
  resources: {
    en: { translation: localeEN },
    ge: { translation: localeAM }
  }
});

export { i18next, i18nextMiddleware };
