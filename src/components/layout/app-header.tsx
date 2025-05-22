// @/components/layout/app-header.tsx
"use client";

import Link from 'next/link';
import { Bot, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAssistantDialog } from '@/components/ai/ai-assistant-dialog';
import { useSidebar } from '@/components/ui/sidebar';

export function AppHeader() {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
               <Menu className="h-6 w-6" />
             </Button>
          )}
          <Link href="/" className="flex items-center space-x-2 text-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 160 32" 
              className="h-7 w-auto"
              aria-label="BinaGE Logo"
            >
              {/* B */}
              <path fill="currentColor" d="M10,25 C6,25 4,23 4,19 C4,15 6,13 10,13 L10,7 L12,7 L12,13 L17,13 C21,13 23,15 23,19 C23,23 21,25 17,25 L10,25 Z M12,15 L10,15 L10,17 L12,17 C14,17 15,16.5 15,16 C15,15.5 14,15 12,15 Z M12,23 L17,23 C19,23 20,22.5 20,22 C20,21.5 19,21 17,21 L12,21 L12,23 Z"/>
              {/* i (stem) */}
              <rect fill="currentColor" x="28" y="13" width="4" height="12" rx="1"/>
              {/* i (dot - house) */}
              <path fill="hsl(var(--primary))" d="M26,11 L34,11 L34,5 L30,2 L26,5 Z M27,10 L33,10 L33,6 L31.5,5 L31.5,7 C31.5,7.5 31,8 30.5,8 L29.5,8 C29,8 28.5,7.5 28.5,7 L28.5,5 L27,6 Z"/>
              {/* n */}
              <path fill="currentColor" d="M40,13 L40,25 L44,25 L44,19 C44,15 47,13 50,13 L50,25 L54,25 L54,13 L50,13 C47,13 44,15 44,19 L44,13 L40,13 Z"/>
              {/* a */}
              <path fill="currentColor" d="M68,25 L68,23 L63,23 C59,23 57,21 57,17 C57,13 59,11 63,11 L65,11 C69,11 71,13 71,17 L71,19 L67,19 L67,17 C67,15 66,14 65,14 L63,14 C61,14 60,15 60,17 C60,19 61,20 63,20 L68,20 L68,25 Z"/>
              {/* G */}
              <path fill="currentColor" d="M88,13 C84,13 82,15 82,19 C82,23 84,25 88,25 L90,25 L90,22 L88,22 C86,22 85,21.5 85,21 L85,17 C85,16.5 86,16 88,16 L92,16 L92,13 L88,13 Z M90,25 C94,25 96,23 96,19 L96,13 L92,13 L92,16 L90,16 L90,19 C90,21 92,22 92,22 L90,22 L90,25Z"/>
              {/* E */}
              <path fill="currentColor" d="M102,13 L102,25 L114,25 L114,22 L105,22 L105,20 L113,20 L113,17 L105,17 L105,15 L114,15 L114,13 L102,13 Z"/>
            </svg>
            <span className="font-bold text-xl"> Lite</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <AIAssistantDialog>
            <Button variant="outline" size="sm" className="gap-2">
              <Bot className="h-5 w-5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Button>
          </AIAssistantDialog>
          
          <Button variant="ghost" size="icon" aria-label="Profile">
            <UserCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
