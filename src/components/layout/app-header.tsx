// @/components/layout/app-header.tsx
"use client";

import Link from 'next/link';
import { Bot, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAssistantDialog } from '@/components/ai/ai-assistant-dialog';
import { useSidebar } from '@/components/ui/sidebar';
import { LanguageSwitcher } from './language-switcher';
import { useTranslation } from '@/hooks/use-translation';

const Logo = () => (
  <svg 
    width="160" 
    height="120" 
    viewBox="0 0 190 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    aria-label="BinaGE Batumi Logo"
    className="h-10 w-auto" // Adjusted height, width will scale
  >
    {/* Icon */}
    <defs>
      <linearGradient id="binageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "hsl(var(--accent))", stopOpacity: 1}} />
      </linearGradient>
      <linearGradient id="batumiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor: "#3B82F6", stopOpacity: 1}} /> {/* Blue */}
        <stop offset="20%" style={{stopColor: "#10B981", stopOpacity: 1}} /> {/* Green */}
        <stop offset="40%" style={{stopColor: "#F59E0B", stopOpacity: 1}} /> {/* Yellow/Amber */}
        <stop offset="60%" style={{stopColor: "#EF4444", stopOpacity: 1}} /> {/* Red */}
        <stop offset="80%" style={{stopColor: "#8B5CF6", stopOpacity: 1}} /> {/* Purple */}
        <stop offset="100%" style={{stopColor: "#EC4899", stopOpacity: 1}} /> {/* Pink */}
      </linearGradient>
    </defs>

    {/* Icon resembling a heart/cloud made of orange segments */}
    <path d="M73.3896 6.7824C73.3896 6.7824 70.9631 23.1739 51.553 23.1739C32.1429 23.1739 27.1947 42.3033 27.1947 42.3033C27.1947 42.3033 3.09621 38.5674 3.09621 59.5945C3.09621 80.6216 37.0228 81.5705 37.0228 81.5705L37.5701 61.0141C37.5701 61.0141 39.1194 46.0392 56.0158 46.0392C72.9122 46.0392 74.3107 63.7501 74.3107 63.7501L75.2286 81.5705C75.2286 81.5705 109.155 80.6216 109.155 59.5945C109.155 38.5674 85.0568 42.3033 85.0568 42.3033C85.0568 42.3033 80.1085 23.1739 60.6984 23.1739C54.1466 23.1739 53.2438 17.4274 51.553 12.8129C49.3301 6.7824 58.0474 6.7824 73.3896 6.7824Z" fill="hsl(var(--primary))"/>
    <path d="M95.2208 26.8575C95.2208 26.8575 92.7943 43.249 73.3842 43.249C53.9741 43.249 48.981 62.3784 48.981 62.3784C48.981 62.3784 24.8825 58.6425 24.8825 79.6696C24.8825 100.697 58.8091 101.646 58.8091 101.646L59.3564 81.0892C59.3564 81.0892 60.9057 66.1143 77.8021 66.1143C94.6985 66.1143 96.097 83.8252 96.097 83.8252L97.0149 101.646C97.0149 101.646 130.941 100.697 130.941 79.6696C130.941 58.6425 106.843 62.3784 106.843 62.3784C106.843 62.3784 101.895 43.249 82.4847 43.249C75.9329 43.249 75.0301 37.4991 73.3393 32.888C71.1164 26.8575 79.8337 26.8575 95.2208 26.8575Z" fill="hsl(var(--primary))"  transform="translate(15, -15) scale(0.8)" opacity="0.7"/>
    <path d="M117.052 46.9326C117.052 46.9326 114.626 63.3241 95.2154 63.3241C75.8053 63.3241 70.8122 82.4535 70.8122 82.4535C70.8122 82.4535 46.7137 78.7176 46.7137 99.7447C46.7137 120.772 80.6403 121.721 80.6403 121.721L81.1876 101.164C81.1876 101.164 82.7369 86.1894 99.6333 86.1894C116.53 86.1894 117.928 103.9 117.928 103.9L118.846 121.721C118.846 121.721 152.773 120.772 152.773 99.7447C152.773 78.7176 128.674 82.4535 128.674 82.4535C128.674 82.4535 123.726 63.3241 104.316 63.3241C97.7641 63.3241 96.8613 57.5742 95.1705 52.9631C92.9476 46.9326 101.665 46.9326 117.052 46.9326Z" fill="hsl(var(--primary))" transform="translate(30, -30) scale(0.6)" opacity="0.4"/>

    {/* Text "BinaGE" */}
    <text x="10" y="110" fontFamily="Arial, Helvetica, sans-serif" fontSize="34" fontWeight="bold" fill="url(#binageGradient)">
      BinaGE
    </text>

    {/* Text "Batumi" */}
    <text x="65" y="135" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="bold" fill="url(#batumiGradient)">
      Batumi
    </text>
  </svg>
);


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
          <Link href="/" aria-label="BinaGE Batumi Home">
            <Logo />
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
