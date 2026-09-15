import { translations, LanguageCode, TranslationDictionary } from './translations';

export function getTranslation(lang: LanguageCode, key: keyof TranslationDictionary): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || String(key);
}
