'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const itemClass =
  'rounded-md bg-gray-100 backdrop-blur-md shadow-sm inline-flex items-center px-3 py-2 text-gray-900 text-sm font-medium transition-opacity hover:opacity-80';

const FLOAT_FROM_Y = 100;

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
    <footer className="w-full" aria-hidden>
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      <motion.div
        initial={{ y: FLOAT_FROM_Y }}
        animate={{ y: isInView ? 0 : FLOAT_FROM_Y }}
        transition={{ type: 'spring', damping: 28, stiffness: 120 }}
        className="flex flex-wrap items-center gap-3 pt-20 pl-4 pr-8 md:pl-32 md:pr-8 max-w-4xl"
      >
        <Link
          href="/fredrik_westerdahl_cv.pdf"
          download
          className={`${itemClass} w-fit max-w-[12rem]`}
        >
          Download PDF CV
        </Link>
        <a
          href="https://github.com/polisen"
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemClass} w-fit`}
        >
          GitHub
        </a>
        <a href="mailto:fredrik@sublink.to" className={`${itemClass} w-fit`}>
          fredrik@sublink.to
        </a>
      </motion.div>
    </footer>
  );
}
