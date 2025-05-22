// src/components/layout/client-providers.tsx
"use client";

import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";

// It's highly recommended to use an environment variable for the API key.
// For this exercise, using the key directly as provided in the prompt.
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyB9w9vQF51hdCFEuQ5olMTaIs6EiJQJQi8';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <SidebarProvider defaultOpen={true}>
        {children}
        <Toaster />
      </SidebarProvider>
    </APIProvider>
  );
}
