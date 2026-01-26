'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { springConfigs } from '@/lib/springConfigs';

interface HorizontalOnScrollProps {
  children: React.ReactNode;
  xRange?: [string, string]; // e.g., ['0%', '-75%']
  offset?: string | [string, string];
  sectionHeight?: string; // e.g., '200vh'
  className?: string;
  stickyClassName?: string;
}

export function HorizontalOnScroll({
  children,
  xRange = ['0%', '-75%'],
  offset = ['start start', 'end start'],
  sectionHeight = '200vh',
  className,
  stickyClassName
}: HorizontalOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Always call useSpring (hooks must be called unconditionally), but use the original value if reduced motion
  const springedProgress = useSpring(scrollYProgress, springConfigs.default);
  const p = prefersReducedMotion ? scrollYProgress : springedProgress;

  const x = useTransform(p, [0, 1], xRange);

  return (
    <section ref={ref} className={`relative ${className || ''}`} style={{ height: sectionHeight }}>
      <div className={`sticky top-0 h-screen overflow-hidden ${stickyClassName || ''}`}>
        <motion.div 
          className="flex gap-6 will-change-transform" 
          style={{ x }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
