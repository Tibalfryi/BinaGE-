import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/layout/client-providers'; 

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata can be dynamic based on language in more advanced setups
export const metadata: Metadata = {
  title: 'BinaGE Lite',
  description: 'Find your perfect apartment in Batumi with BinaGE Lite.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The lang attribute will be dynamically set by LanguageProvider in ClientProviders
  return (
    <html lang="en"> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders> 
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
