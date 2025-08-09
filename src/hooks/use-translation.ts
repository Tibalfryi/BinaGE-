// @/hooks/use-translation.ts
"use client";

import { useLanguage } from "@/context/language-context";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import ka from "@/locales/ka.json";

/**
 * Рекурсивный тип для сообщений: позволяет иметь вложенные объекты
 * (appHeader.aiAssistant и т.п.)
 */
type Messages = { [key: string]: string | Messages };
type Translations = Record<string, Messages>;

const translations: Translations = {
  en,
  ru,
  ka,
};

/**
 * Достаёт значение по пути вида "group.sub.key".
 * Возвращает строку или undefined, если не найдено.
 */
const getNestedValue = (obj: Messages, path: string): string | undefined => {
  let curr: string | Messages | undefined = obj;
  for (const part of path.split(".")) {
    if (curr && typeof curr === "object" && part in curr) {
      curr = (curr as Messages)[part];
    } else {
      curr = undefined;
      break;
    }
  }
  return typeof curr === "string" ? curr : undefined;
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langTranslations = translations[language] || translations["en"];
    let translated = getNestedValue(langTranslations, key) || key;

    if (params) {
      for (const [pKey, pVal] of Object.entries(params)) {
        const re = new RegExp(`\\$\\{${pKey}\\}`, "g");
        translated = translated.replace(re, String(pVal));
      }
    }
    return translated;
  };

  return { t, currentLanguage: language };
};
