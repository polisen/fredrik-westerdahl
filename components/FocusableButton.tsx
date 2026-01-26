"use client";

import React, { ReactElement, cloneElement, useRef } from 'react';
import { useCursorContext, convertDOMRectToCursorRect, CursorRect } from './CursorContext';
import { cn } from '@/lib/utils';

interface FocusableButtonProps {
  children: ReactElement;
  className?: string;
}

export function FocusableButton({ children, className }: FocusableButtonProps) {
  const { setHoveredRect } = useCursorContext();
  const lastRectRef = useRef<CursorRect | null>(null);

  const updateRect = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const cursorRect = convertDOMRectToCursorRect(rect);
    
    // Only update if the actual values have changed
    const lastRect = lastRectRef.current;
    if (
      !lastRect ||
      lastRect.x !== cursorRect.x ||
      lastRect.y !== cursorRect.y ||
      lastRect.width !== cursorRect.width ||
      lastRect.height !== cursorRect.height
    ) {
      lastRectRef.current = cursorRect;
      setHoveredRect(cursorRect);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    updateRect(target);
    children.props.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    lastRectRef.current = null;
    setHoveredRect(undefined);
    children.props.onMouseLeave?.(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    updateRect(target);
    children.props.onMouseMove?.(e);
  };

  // Use React event handlers on the cloned element
  return cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
    className: cn(children.props.className, className, 'cursor-none'),
  });
}
