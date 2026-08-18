'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const footerItemClass =
  'h-12 rounded-full bg-white/60 backdrop-blur-xl inline-flex items-center gap-1.5 px-5 text-xl text-black transition-opacity hover:opacity-100';

const FLOAT_FROM_Y = 100;

export function FooterLinks({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={className}>
      <Link
        href="/fredrik_westerdahl_cv.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={footerItemClass}
      >
        Open CV as PDF
        <ArrowUpRight className="size-5" />
      </Link>
      <a
        href="https://github.com/polisen"
        target="_blank"
        rel="noopener noreferrer"
        className={footerItemClass}
      >
        github.com/polisen
      </a>
      <a href="mailto:fredrik@userland.xyz" className={footerItemClass}>
        fredrik@userland.xyz
      </a>
    </div>
  );
}

export function Footer() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full">
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      <motion.div
        initial={{ y: FLOAT_FROM_Y }}
        animate={{ y: isInView ? 0 : FLOAT_FROM_Y }}
        transition={{ type: 'spring', damping: 28, stiffness: 120 }}
      >
        <FooterLinks
          id="recruiters"
          className="relative flex w-full flex-wrap items-center gap-3 pt-20 pb-10 pl-4 pr-8 md:pl-10 md:pr-8 max-w-4xl"
        />
      </motion.div>
    </footer>
  );
}

/** Floating footer that slides up when the nav menu overlay is open. */
export function MenuOverlayFooter({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu-overlay-footer"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 160 }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-6 md:pb-8"
        >
          <FooterLinks className="pointer-events-auto flex w-full flex-wrap items-center gap-3 pl-4 pr-8 md:pl-10 md:pr-8 max-w-4xl" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
