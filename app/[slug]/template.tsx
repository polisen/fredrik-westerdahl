'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

const spring = { type: 'spring', stiffness: 250, damping: 22, mass: 0.9 };

type Dir = 'forward' | 'backward' | 'none';

const variants = {
  initial: (dir: Dir) => ({
    x: dir === 'forward' ? '10%' : dir === 'backward' ? '-10%' : '0%',
    opacity: dir === 'none' ? 1 : 0,
    filter: dir === 'none' ? 'blur(0px)' : 'blur(10px)',
  }),
  animate: { x: '0%', opacity: 1, filter: 'blur(0px)' },
  exit: (dir: Dir) => ({
    // exit for the screen that is leaving
    x: dir === 'forward' ? '-10%' : dir === 'backward' ? '10%' : '-10%',
    opacity: 0,
    filter: 'blur(10px)',
  }),
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  // Calculate direction synchronously during render
  const prev = prevPathRef.current;
  let dir: Dir = 'none';
  
  if (prev) {
    const isRoot = pathname === '/';
    const prevIsRoot = prev === '/';

    if (prevIsRoot && !isRoot) {
      dir = 'forward';
    } else if (!prevIsRoot && isRoot) {
      dir = 'backward';
    } else if (!prevIsRoot && !isRoot) {
      // Navigating between two non-root paths (slug-to-slug)
      dir = 'forward';
    }
  }

  // Update previous pathname in useEffect
  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        custom={dir}
        variants={variants}
        initial="initial"
        layout="position"
        animate="animate"
        exit="exit"
        transition={spring}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
