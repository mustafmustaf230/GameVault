import { createContext, useContext, useState, type ReactNode } from 'react';
import { LANGUAGES, t as translate, isRTL, type LanguageCode, type TranslationKey } from './i18n';

type LanguageContextValue = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  rtl: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('en');

  const setLang = (l: LanguageCode) => {
    setLangState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = isRTL(l) ? 'rtl' : 'ltr';
  };

  const t = (key: TranslationKey) => translate(lang, key);
  const rtl = isRTL(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, rtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export { LANGUAGES };
