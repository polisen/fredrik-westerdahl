'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { springConfigs } from '@/lib/springConfigs';

interface HeroParallaxProps {
  children: React.ReactNode;
  // Configurable ranges for different effects
  bgYRange?: [number, number];
  titleYRange?: [number, number];
  titleOpacityRange?: [number, number];
  scrollRange?: [number, number];
  className?: string;
}

export function HeroParallax({ 
  children, 
  bgYRange = [0, -120],
  titleYRange = [0, -40],
  titleOpacityRange = [0, 0],
  scrollRange = [0, 800],
  className
}: HeroParallaxProps) {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  
  // Always call useSpring (hooks must be called unconditionally), but use the original value if reduced motion
  const springedY = useSpring(scrollY, springConfigs.subtle);
  const y = prefersReducedMotion ? scrollY : springedY;

  const bgY = useTransform(y, scrollRange, bgYRange);
  const titleY = useTransform(y, scrollRange, titleYRange);
  const titleOpacity = useTransform(y, scrollRange, titleOpacityRange);

  return (
    <section className={`relative overflow-hidden ${className || ''}`}>
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
      />
      <motion.div
        className="sticky top-0 h-screen flex items-center"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}
