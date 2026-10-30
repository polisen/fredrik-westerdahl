import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Entropy Management',
    template: '%s — Entropy Management',
  },
  description:
    'Notes on building under noise — AI, product systems, and creative practice. By Fredrik Westerdahl.',
  icons: {
    icon: '/favicon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="font-sans relative bg-white text-black">
        {children}
      </body>
    </html>
  )
}
