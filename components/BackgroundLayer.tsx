"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BackgroundLayerProps {
  children?: ReactNode;
  className?: string;
}

/**
 * BackgroundLayer - A container for background elements that float behind everything.
 * These elements are not affected by the GooLayer filter since they're rendered
 * before the GooLayer in the DOM and have a lower z-index.
 */
export function BackgroundLayer({ children, className }: BackgroundLayerProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none ',
        'z-[0]', // Behind everything, including GooLayer (which has z-0)
        className
      )}
    >
      {children}
    </div>
  );
}
