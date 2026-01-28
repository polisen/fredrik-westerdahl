'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useInView } from 'motion/react';
import type { RefObject } from 'react';

export type CardState = 'REST' | 'IN_VIEW' | 'ACTIVE' | 'HOVER' | 'FOCUS' | 'PRESS';

const HOVER_INTENT_MS = 75;
const ACTIVE_BAND_START = 0.18; // 18% viewport height
const ACTIVE_BAND_END = 0.55; // 55% viewport height

export interface UseCardStateOptions {
  scrollContainerRef?: RefObject<HTMLElement | null> | null;
}

export function useCardState(
  cardRef: RefObject<HTMLElement | null>,
  options: UseCardStateOptions = {}
) {
  const { scrollContainerRef } = options;
  const [activeProgress, setActiveProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const hoverIntentRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInView = useInView(cardRef, { amount: 0.12, once: false });

  const updateActiveProgress = useCallback(() => {
    const el = cardRef.current;
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const bandEnd = ACTIVE_BAND_END * vh;
    const bandStart = ACTIVE_BAND_START * vh;
    const p = (bandEnd - rect.top) / (bandEnd - bandStart);
    setActiveProgress(Math.max(0, Math.min(1, p)));
  }, [cardRef]);

  // Scroll and resize listener for active band
  useEffect(() => {
    const container = scrollContainerRef?.current ?? null;
    const el = cardRef.current;
    if (!el || typeof window === 'undefined') return;
    const target: EventTarget | null = container ?? window;

    updateActiveProgress();

    const handleScroll = () => updateActiveProgress();
    const handleResize = () => updateActiveProgress();

    target.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      target.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollContainerRef, cardRef, updateActiveProgress]);

  // Hover intent: 75ms before setting hovered; on leave, clear immediately
  const onPointerEnter = useCallback(() => {
    if (hoverIntentRef.current) clearTimeout(hoverIntentRef.current);
    hoverIntentRef.current = setTimeout(() => setHovered(true), HOVER_INTENT_MS);
  }, []);
  const onPointerLeave = useCallback(() => {
    if (hoverIntentRef.current) {
      clearTimeout(hoverIntentRef.current);
      hoverIntentRef.current = null;
    }
    setHovered(false);
  }, []);
  const onPointerDown = useCallback(() => setIsPressed(true), []);
  const onPointerUp = useCallback(() => setIsPressed(false), []);
  const onPointerCancel = useCallback(() => setIsPressed(false), []);
  const onFocus = useCallback(() => setHasFocus(true), []);
  const onBlur = useCallback(() => setHasFocus(false), []);

  const isActive = activeProgress > 0;
  const isHoverLike = hovered || hasFocus;

  let state: CardState = 'REST';
  if (isPressed) state = 'PRESS';
  else if (isHoverLike) state = 'HOVER';
  else if (isActive) state = 'ACTIVE';
  else if (isInView) state = 'IN_VIEW';

  return {
    state,
    activeProgress,
    isPressed,
    isActive,
    isInView,
    isHoverLike,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onFocus,
    onBlur,
  };
}
