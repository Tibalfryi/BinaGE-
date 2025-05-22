import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { APIProvider } from '@vis.gl/react-google-maps';
import { SidebarProvider } from '@/components/ui/sidebar'; // Import SidebarProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BinaGE Lite',
  description: 'Find your perfect apartment in Batumi with BinaGE Lite.',
};

// It's highly recommended to use an environment variable for the API key.
// For this exercise, using the key directly as provided in the prompt.
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyB9w9vQF51hdCFEuQ5olMTaIs6EiJQJQi8';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <SidebarProvider defaultOpen={true}>
            {children}
            <Toaster />
          </SidebarProvider>
        </APIProvider>
      </body>
    </html>
  );
}
