"use client";

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GooSvgProps {
  viewBox?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  preserveAspectRatio?: string;
  children: ReactNode;
  animate?: boolean;
}

/**
 * GooSvg - A reusable wrapper component for SVG elements in the Goo layer.
 * 
 * This component provides a clean API for creating SVG shapes that will be
 * cast to the goo layer via GooContainer's customShape prop.
 * 
 * Features:
 * - Handles viewBox and dimensions
 * - Supports Motion React animations
 * - Responsive with percentage-based coordinates
 */
export function GooSvg({
  viewBox = "0 0 100 100",
  width = "100%",
  height = "100%",
  className,
  preserveAspectRatio = "xMidYMid meet",
  children,
  animate = true,
}: GooSvgProps) {
  const svgProps = {
    viewBox,
    width,
    height,
    preserveAspectRatio,
    className: cn("absolute inset-0", className),
    style: {
      overflow: 'visible' as const,
      display: 'block' as const,
      width: '100%',
      height: '100%',
    },
  };

  if (animate) {
    return <motion.svg {...svgProps}>{children}</motion.svg>;
  }

  return <svg {...svgProps}>{children}</svg>;
}
