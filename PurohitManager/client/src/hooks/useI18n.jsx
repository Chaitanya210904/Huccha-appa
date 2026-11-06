import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import kn from '../i18n/kn.json';

const translations = { en, hi, kn };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('pm_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('pm_lang', lang);
  }, [lang]);

  const t = (pathStr, fallback = '') => {
    const keys = pathStr.split('.');
    let val = translations[lang];
    for (const k of keys) {
      if (!val || val[k] === undefined) {
        // Fallback to English
        let enVal = translations['en'];
        for (const ek of keys) {
          if (!enVal || enVal[ek] === undefined) return fallback || pathStr;
          enVal = enVal[ek];
        }
        return enVal;
      }
      val = val[k];
    }
    return val;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

