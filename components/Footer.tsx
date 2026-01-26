'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <motion.footer
      className="w-full h-[50dvh] z-50 bg-black text-white border-t border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-screen-2xl mx-auto px-5 md:px-0 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0">
          {/* Name - matches header style and positioning */}
          <div className="flex-shrink-0 md:ml-36">
            <Link
              href="/"
              className="text-3xl md:text-5xl font-semibold tracking-tight transition-colors hover:text-gray-300"
            >
              Fredrik Westerdahl
            </Link>
          </div>

          {/* Contact links - matches header nav style and positioning */}
          <nav className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 text-xs uppercase tracking-wider md:mr-5">
            <a
              href="https://github.com/polisen"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gray-300"
            >
              GitHub
            </a>
            <a
              href="/fredrik_westerdahl_cv.pdf"
              download
              className="transition-colors hover:text-gray-300"
            >
              Download CV
            </a>
            <a
              href="mailto:fredrik@sublink.to"
              className="transition-colors hover:text-gray-300"
            >
              fredrik@sublink.to
            </a>
          </nav>
        </div>
      </div>
    </motion.footer>
  );
}
