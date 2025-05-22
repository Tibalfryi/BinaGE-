// @/context/language-context.tsx
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Language {
  code: string;
  name: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'ka', name: 'ქართული' },
];

export const DEFAULT_LANGUAGE_CODE = 'en';

interface LanguageContextType {
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('binage-language');
      return storedLang && LANGUAGES.some(l => l.code === storedLang) ? storedLang : DEFAULT_LANGUAGE_CODE;
    }
    return DEFAULT_LANGUAGE_CODE;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('binage-language', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, availableLanguages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
