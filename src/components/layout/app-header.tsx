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
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
              <path d="M12 2L3 8v11a1 1 0 001 1h16a1 1 0 001-1V8l-9-6zm7 16H5V9.6l7-4.66 7 4.66V18z"/>
              <path d="M12 11a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
            <span className="font-bold text-xl">BinaGE Lite</span>
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
