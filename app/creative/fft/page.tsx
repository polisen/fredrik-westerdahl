'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { Art4FullscreenArt } from '@/components/art4';

export default function FftArtPage() {
  return (
    <div className="fixed inset-0 z-[60] bg-black">
      <Art4FullscreenArt
        headerStart={
          <Link
            href="/creative"
            aria-label="Close FFT art"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-white hover:border-white/40"
          >
            <X className="h-4 w-4" />
          </Link>
        }
      />
    </div>
  );
}
