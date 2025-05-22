// @/hooks/use-translation.ts
"use client";

import { useLanguage } from '@/context/language-context';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import ka from '@/locales/ka.json';

// Define a type for your translations
type Translations = Record<string, Record<string, string>>;

const translations: Translations = {
  en,
  ru,
  ka,
};

// Helper function to access nested keys like "group.key"
const getNestedValue = (obj: Record<string, any>, path: string): string | undefined => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) as string | undefined;
};


export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langTranslations = translations[language] || translations['en'];
    let translatedString = getNestedValue(langTranslations, key) || key;

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`\\$\\{${paramKey}\\}`, 'g');
        translatedString = translatedString.replace(regex, String(params[paramKey]));
      });
    }
    
    return translatedString;
  };

  return { t, currentLanguage: language };
};
