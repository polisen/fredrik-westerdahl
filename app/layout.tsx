import type { Metadata } from 'next';

import './globals.css';
import { FooterNavigation } from '@/components/FooterNavigation';
import { Blur } from '@/components/Blur';
import { AppProvider } from '@/context/AppContext';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { LayoutGroup } from 'motion/react';
import { GooProvider } from '@/components/GooContext';
import { GooLayer } from '@/components/GooLayer';
import { CursorProvider } from '@/components/CursorContext';
import { CursorLayers } from '@/components/CursorLayers';
import { BackgroundLayer } from '@/components/BackgroundLayer';
import AsciiWave from '@/components/AsciiWave';
import { PageLoadAnimation } from '@/components/PageLoadAnimation';

export const metadata: Metadata = {
  title: 'fredrik-westerdahl.me',
  description: 'hello',
  icons: {
    icon: '/favicon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans  relative text-black bg-white`}>
        <CursorProvider>
          <GooProvider>
            <AppProvider>
              <LayoutGroup>
                <PageLoadAnimation />
                {/* <BackgroundLayer>
                  <AsciiWave width={200} height={80} />
                </BackgroundLayer> */}
                <Blur />
                <AnimatedHeader />
                {/* <FooterNavigation /> */}
                <GooLayer />
                <CursorLayers />
                {children}
              </LayoutGroup>
            </AppProvider>
          </GooProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
