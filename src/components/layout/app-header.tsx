
// @/components/layout/app-header.tsx
"use client";

import Link from 'next/link';
import { Bot, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAssistantDialog } from '@/components/ai/ai-assistant-dialog';
import { useSidebar } from '@/components/ui/sidebar';
import { LanguageSwitcher } from './language-switcher';
import { useTranslation } from '@/hooks/use-translation';

export function AppHeader() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
               <Menu className="h-6 w-6" />
             </Button>
          )}
          <Link href="/" className="flex items-center space-x-2 text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 32" // Adjusted viewBox for "aipo"
              className="h-7 w-auto"
              aria-label="aipo Logo" // Updated aria-label
            >
              <style>
                {`.logo-text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; font-size: 18px; fill: currentColor; }`}
              </style>
              {/* Letter 'a' */}
              <text x="2" y="22" className="logo-text">a</text>
              
              {/* 'i' stem */}
              <rect x="13" y="13.5" width="2.5" height="8.5" fill="currentColor" rx="1"/>
              {/* 'i' dot (orange house) */}
              <path fill="hsl(var(--primary))" d="M11.25,12 L15.25,12 L15.25,9 L13.25,6.5 L11.25,9 Z" />
              
              {/* Letter 'p' */}
              <text x="19" y="22" className="logo-text">p</text>
              {/* Letter 'o' */}
              <text x="29" y="22" className="logo-text">o</text>
            </svg>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <LanguageSwitcher />
          <AIAssistantDialog>
            <Button variant="outline" size="sm" className="gap-2">
              <Bot className="h-5 w-5" />
              <span className="hidden sm:inline">{t('appHeader.aiAssistant')}</span>
            </Button>
          </AIAssistantDialog>
          
          <Button variant="ghost" size="icon" aria-label={t('appHeader.profileAlt')}>
            <UserCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}

