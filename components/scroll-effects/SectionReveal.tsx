'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { springConfigs } from '@/lib/springConfigs';

interface SectionRevealProps {
  children: React.ReactNode;
  offset?: string | [string, string];
  className?: string;
  // Custom transform ranges
  yRange?: [number, number];
  opacityRange?: number[];
  scaleRange?: number[];
}

export function SectionReveal({ 
  children, 
  offset = ['start end', 'end start'],
  className,
  yRange = [60, -60],
  opacityRange = [0.1, 0.3, 0.7, 0.9],
  scaleRange = [0.98, 1, 0.98]
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Always call useSpring (hooks must be called unconditionally), but use the original value if reduced motion
  const springedProgress = useSpring(scrollYProgress, springConfigs.default);
  const p = prefersReducedMotion ? scrollYProgress : springedProgress;

  const y = useTransform(p, [0, 1], yRange);
  // opacityRange defines input breakpoints, output is always [0, 1, 1, 0] for fade in/out
  const opacity = useTransform(
    p, 
    opacityRange.length === 4 
      ? [opacityRange[0], opacityRange[1], opacityRange[2], opacityRange[3]] as [number, number, number, number]
      : [0, 1] as [number, number],
    opacityRange.length === 4 
      ? [0, 1, 1, 0] as [number, number, number, number]
      : [0, 1] as [number, number]
  );
  const scale = useTransform(p, [0, 0.5, 1], scaleRange);

  return (
    <section ref={ref} className={className || 'min-h-[120vh] flex items-center justify-center'}>
      <motion.div style={{ y, opacity, scale }}>
        {children}
      </motion.div>
    </section>
  );
}
