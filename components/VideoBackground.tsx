'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { springConfigs } from '@/lib/springConfigs';

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function checkIfContainerIsScrollable(container: HTMLElement): boolean {
  const style = window.getComputedStyle(container);
  const hasOverflowScroll =
    style.overflow === 'auto' ||
    style.overflow === 'scroll' ||
    style.overflowY === 'auto' ||
    style.overflowY === 'scroll' ||
    style.overflowX === 'auto' ||
    style.overflowX === 'scroll';

  if (hasOverflowScroll) return true;
  return false;
}

export function VideoBackground() {
  const pathname = usePathname();
  const { scrollContainerRef } = useApp();
  const prefersReducedMotion = useReducedMotion();

  // Only render on the home page.
  const isHome = pathname === '/';

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Window scroll (default)
  const windowScroll = useScroll();

  // Container scroll motion value (if we detect a scroll container)
  const containerScrollY = useMotionValue(0);
  const [isContainerScrollable, setIsContainerScrollable] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) {
      setIsContainerScrollable(false);
      return;
    }

    const checkScrollable = () => {
      setIsContainerScrollable(checkIfContainerIsScrollable(container));
    };

    checkScrollable();

    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [scrollContainerRef]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container || !isContainerScrollable) return;

    const updateScroll = () => {
      containerScrollY.set(container.scrollTop);
    };

    updateScroll();
    container.addEventListener('scroll', updateScroll, { passive: true });
    return () => container.removeEventListener('scroll', updateScroll);
  }, [scrollContainerRef, containerScrollY, isContainerScrollable]);

  const baseScrollY =
    scrollContainerRef?.current && isContainerScrollable
      ? containerScrollY
      : windowScroll.scrollY;

  // Keep hooks unconditional, then choose reduced-motion behavior via derived values.
  const springedScrollY = useSpring(baseScrollY, springConfigs.subtle);
  const smoothScrollY = prefersReducedMotion ? baseScrollY : springedScrollY;

  // Tunable: how much scroll (px) until we reach max blur/pause.
  const scrollRangePx = 600;

  const progress = useTransform(smoothScrollY, (v) => clamp01(v / scrollRangePx));
  // Raw progress (no spring) for playback rate so it responds immediately to scroll
  const progressForPlayback = useTransform(baseScrollY, (v) =>
    clamp01(v / scrollRangePx)
  );

  const blurPx = useTransform(progress, [0, 1], [0, 32]);
  const blurFilter = useTransform(blurPx, (v) => `blur(${v.toFixed(2)}px)`);

  const scale = useMemo(() => 1.05, []);

  // Track last playback state to avoid spamming play/pause.
  const lastWantedPausedRef = useRef<boolean | null>(null);

  useMotionValueEvent(progressForPlayback, 'change', (p) => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) return;

    // Slow down as we scroll. Clamp to a small non-zero value so it eases into pausing.
    const playbackRate = Math.min(0.8, Math.max(0.08, 1 - p));
    if (!Number.isNaN(playbackRate) && Number.isFinite(playbackRate)) {
      video.playbackRate = playbackRate;
    }

    const wantPaused = p >= 0.98;
    if (lastWantedPausedRef.current === wantPaused) return;
    lastWantedPausedRef.current = wantPaused;

    if (wantPaused) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise && typeof (playPromise as Promise<void>).catch === 'function') {
        (playPromise as Promise<void>).catch(() => {
          // Ignore autoplay rejections (e.g. Safari/iOS quirks).
        });
      }
    }
  });

  // Ensure we start in a valid state when the video becomes available.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Default state at top of page.
    video.playbackRate = 0.2;
    lastWantedPausedRef.current = false;

    if (!prefersReducedMotion) {
      const playPromise = video.play();
      if (playPromise && typeof (playPromise as Promise<void>).catch === 'function') {
        (playPromise as Promise<void>).catch(() => {});
      }
    }
  }, [prefersReducedMotion]);

  if (!isHome) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        transform: `scale(${scale})`,
        willChange: 'transform, filter',
      }}
    >
      <motion.video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/loop3.webm"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        // CSS filter is scroll-linked (video itself, not backdrop-filter).
        style={{
          filter: prefersReducedMotion ? 'none' : (blurFilter as any),
          WebkitFilter: prefersReducedMotion ? 'none' : (blurFilter as any),
          willChange: 'filter',
        }}
      />
    </motion.div>
  );
}

