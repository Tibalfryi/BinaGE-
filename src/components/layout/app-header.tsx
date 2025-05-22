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
              viewBox="0 0 170 32" // Adjusted viewBox slightly for new letterforms
              className="h-7 w-auto"
              aria-label="BinaGE Logo"
            >
              {/* B - More rounded, Google-esque */}
              <path fill="currentColor" d="M17.3,25.5c-4.4,0-7.8-1.7-7.8-5.3c0-3.1,2.4-4.9,6.3-4.9h1.1v-1c0-1.6-1.1-2.4-3.1-2.4c-1.7,0-2.8,0.6-3.1,1.7l-2.1-0.9c0.5-1.8,2.4-3.1,5.2-3.1c3.4,0,5.4,1.8,5.4,4.6v7.2h-1.8V23h-0.2c-0.5,0.9-1.8,1.5-3.4,1.5H17.3z M17.5,14.2c-2.5,0-4.3,1.3-4.3,3.3c0,2,1.8,3.3,4.3,3.3c2.5,0,4.3-1.3,4.3-3.3C21.8,15.5,20,14.2,17.5,14.2z"/>

              {/* i (stem) - Standard stem */}
              <rect fill="currentColor" x="28" y="10" width="3.8" height="15.5" rx="1.9"/>
              {/* i (dot - house icon, unchanged) */}
              <path fill="hsl(var(--primary))" d="M26.1,8.5 L33.9,8.5 L33.9,2.5 L30,0 L26.1,2.5 Z M27.1,7.5 L32.9,7.5 L32.9,3.5 L31.5,2.5 L31.5,4.5 C31.5,5 31,5.5 30.5,5.5 L29.5,5.5 C29,5.5 28.5,5 28.5,4.5 L28.5,2.5 L27.1,3.5 Z"/>

              {/* n - More geometric, Google-esque */}
              <path fill="currentColor" d="M47.8,10h-3.8v15.5h3.8V17.8h0.1c0.6,1.3,2,2.2,3.9,2.2c2.9,0,4.8-1.9,4.8-5c0-3.1-1.9-5-4.8-5c-1.8,0-3.2,0.8-3.9,2.1h-0.1V10z M50.1,12.1c1.8,0,3,1.3,3,3s-1.2,3-3,3s-3-1.3-3-3S48.3,12.1,50.1,12.1z"/>

              {/* a - More open and rounded, Google-esque */}
              <path fill="currentColor" d="M69.3,15.5c0-3.3-2.3-5.3-5.5-5.3c-3.2,0-5.5,2-5.5,5.3c0,3.3,2.3,5.3,5.5,5.3C67,20.8,69.3,18.8,69.3,15.5z M63.8,12.1c1.8,0,3,1.3,3,3.3s-1.2,3.3-3,3.3s-3-1.3-3-3.3S62,12.1,63.8,12.1z"/>
              
              {/* G - More open 'G' style */}
              <path fill="currentColor" d="M85.5,15.5c0-4.5,3.5-7.8,8-7.8c3.2,0,5.4,1.6,6.3,3.6l-2,0.9c-0.6-1.4-2-2.3-4.2-2.3c-3.1,0-5.5,2.5-5.5,5.6s2.4,5.6,5.5,5.6c2.5,0,4.4-1.3,4.8-3.1h-4.9v-2.2h7.1v1.7c-0.2,3.3-2.8,5.2-6.6,5.2C89,23.3,85.5,20,85.5,15.5z"/>

              {/* E - More rounded, Google-esque */}
              <path fill="currentColor" d="M105.2,20.6c3.2,0,5.3-1.9,5.3-4.9c0-2.7-1.8-4.9-5.1-4.9h-4.7v15.5h3.8V17.8h0.8c0.8,0,1.4,0.1,1.8,0.3c1.3,0.5,2,1.6,2,3.3c0,2.3-1.4,3.7-3.7,3.7h-0.9v2.2H105.2z M103.1,12.9h1.5c1.7,0,2.9,0.9,2.9,2.6c0,1.7-1.1,2.6-2.8,2.6h-1.5V12.9z"/>
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
