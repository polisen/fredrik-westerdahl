"use client";

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { useMotionValue, MotionValue, useTransform, transform } from 'motion/react';

export interface CursorRect {
  x: number;
  y: number;
  width: number;
  height: number;
  minX: number;
  midX: number;
  maxX: number;
  minY: number;
  midY: number;
  maxY: number;
}

export interface CursorPoint {
  x: number;
  y: number;
}

interface CursorContextValue {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  hoveredRect: CursorRect | undefined;
  setHoveredRect: (rect: CursorRect | undefined) => void;
  originX: MotionValue<number>;
  originY: MotionValue<number>;
  isPressed: boolean;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursorContext() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursorContext must be used within CursorProvider');
  }
  return context;
}

interface CursorProviderProps {
  children: ReactNode;
}

export function CursorProvider({ children }: CursorProviderProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hoveredRect, setHoveredRect] = useState<CursorRect | undefined>(undefined);
  const [isPressed, setIsPressed] = useState(false);
  const hoveredRectRef = useRef<CursorRect | undefined>(undefined);

  // Update ref when state changes
  useEffect(() => {
    hoveredRectRef.current = hoveredRect;
  }, [hoveredRect]);

  // Track mouse position (pointermove + capture so we get updates during drag/capture)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    document.addEventListener('pointermove', handlePointerMove, { capture: true });
    return () =>
      document.removeEventListener('pointermove', handlePointerMove, { capture: true });
  }, [mouseX, mouseY]);

  // Track mouse press state
  useEffect(() => {
    const handleMouseDown = () => {
      setIsPressed(true);
    };
    const handleMouseUp = () => {
      setIsPressed(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Calculate originX and originY based on mouse position relative to hovered rect
  const originX = useTransform(mouseX, (x) => {
    const rect = hoveredRectRef.current;
    if (!rect) return 0.5;
    return transform(x, [rect.minX, rect.maxX], [0, 1]);
  });

  const originY = useTransform(mouseY, (y) => {
    const rect = hoveredRectRef.current;
    if (!rect) return 0.5;
    return transform(y, [rect.minY, rect.maxY], [0, 1]);
  });

  return (
    <CursorContext.Provider
      value={{
        mouseX,
        mouseY,
        hoveredRect,
        setHoveredRect,
        originX,
        originY,
        isPressed,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function convertDOMRectToCursorRect(rect: DOMRect): CursorRect {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    minX: rect.x,
    midX: rect.x + rect.width / 2,
    maxX: rect.x + rect.width,
    minY: rect.y,
    midY: rect.y + rect.height / 2,
    maxY: rect.y + rect.height,
  };
}
