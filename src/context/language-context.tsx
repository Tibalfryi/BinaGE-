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
  // Initialize with default language on both server and client's first render pass
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE_CODE);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const storedLang = localStorage.getItem('binage-language');
    let currentLang = DEFAULT_LANGUAGE_CODE; // Fallback to default

    if (storedLang && LANGUAGES.some(l => l.code === storedLang)) {
      currentLang = storedLang;
      // Only set state if it's different from the initial default,
      // to avoid an unnecessary re-render if localStorage matches default.
      if (storedLang !== DEFAULT_LANGUAGE_CODE) {
        setLanguage(storedLang);
      }
    }
    // Always set document.documentElement.lang on client mount
    document.documentElement.lang = currentLang;
  }, []); // Empty dependency array: runs once on mount

  useEffect(() => {
    // This effect runs when language state changes (e.g., user selects a new one, or from initial localStorage check)
    // It ensures localStorage and html lang attribute are updated.
    // Check if language is not the initial default to avoid writing default to localStorage if it wasn't there.
    // However, if user explicitly selects default, it should be saved.
    // The main purpose here is to sync changes from setLanguage (e.g. switcher) to localStorage and html tag.
    localStorage.setItem('binage-language', language);
    document.documentElement.lang = language;
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
