'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const cardItemClass =
  'rounded-lg bg-gray-100/70 backdrop-blur-md shadow-sm overflow-hidden';

const cardClass = `inline-flex items-center px-4 py-3 ${cardItemClass} text-gray-900 font-medium transition-opacity hover:opacity-80`;

const LEAVE_DELAY_MS = 200;

export function Footer() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
          }
          setIsAtBottom(true);
        } else {
          leaveTimeoutRef.current = setTimeout(() => {
            leaveTimeoutRef.current = null;
            setIsAtBottom(false);
          }, LEAVE_DELAY_MS);
        }
      },
      { threshold: 0, rootMargin: '16px' }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const cardContent = (
    <div className="flex flex-col p-4 md:flex-row md:items-start gap-8 md:gap-12">
      {/* Left: I'm looking for clients + GitHub + email cards */}
      <div className="flex flex-col gap-3">
        <span className={cardClass}>I&apos;m looking for clients.</span>
        <a
          href="https://github.com/polisen"
          target="_blank"
          rel="noopener noreferrer"
          className={`${cardClass} w-fit`}
        >
          GitHub
        </a>
        <a href="mailto:fredrik@sublink.to" className={`${cardClass} w-fit`}>
          fredrik@sublink.to
        </a>
      </div>

      {/* Right: copy + download CV CTA */}
      <div className="flex flex-col gap-3 md:flex-1">
        <p className="text-gray-900 font-medium">
          I don&apos;t know, download PDF CV.
        </p>
        <Link
          href="/fredrik_westerdahl_cv.pdf"
          download
          className={`group flex items-center rounded-lg overflow-hidden w-full md:max-w-md transition-opacity hover:opacity-90 ${cardItemClass}`}
        >
          <span className="flex-1 px-4 py-3 text-gray-900 font-medium">
            Download PDF CV
          </span>
          <span className="flex items-center justify-center w-12 h-full bg-gray-200/80 text-gray-900 group-hover:bg-gray-300/80 transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <footer className="relative w-full" aria-hidden>
        <div
          ref={sentinelRef}
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          aria-hidden
        />
      </footer>

      <AnimatePresence>
        {isAtBottom && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-32 p-4 right-0 z-[1000] max-w-4xl bg-gray-100/70 backdrop-blur-md shadow-sm rounded-t-lg overflow-hidden text-gray-900"
            style={{ padding: 0 }}
          >
            {cardContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
