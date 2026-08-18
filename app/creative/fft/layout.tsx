import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'FFT Art — Fredrik Westerdahl',
  description: 'Music-reactive FFT heatmap — Art 4 debug mode.',
};

export default function FftArtLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
