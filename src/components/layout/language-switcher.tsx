// @/components/layout/language-switcher.tsx
"use client";

import { useLanguage } from '@/context/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from '@/hooks/use-translation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto min-w-[120px] text-xs sm:text-sm h-9" aria-label={t('languageSwitcher.selectLanguage')}>
        <div className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 opacity-70" />
          <SelectValue placeholder={t('languageSwitcher.selectLanguage')} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
