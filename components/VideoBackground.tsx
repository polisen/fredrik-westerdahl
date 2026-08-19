'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import AsciiWaveInteractive, {
  type AsciiWaveInteractionConfig,
  type AsciiWaveInteractionState,
} from '@/components/art4/AsciiWaveInteractive';

import { artTheme } from '@/lib/artTheme';

const ART4_FRAMES = 3000;
const ART4_CHAR_SET = '●◉◎◯◦○◌◍•∙· ';
const ART4_BLUES = {
  deep: artTheme.secondary,
  light: artTheme.secondarySoft,
} as const;
const ART4_RIPPLE_PINK = artTheme.tertiary;

const ART4_INTERACTION: AsciiWaveInteractionConfig = {
  rippleVelocity: 0.42,
  rippleMaxRadius: 1.05,
  rippleRingWidth: 0.13,
  rippleIntensity: 1.75,
  rippleWavelength: 14,
  rippleTrail: 1.15,
  hoverRadius: 0.2,
  hoverIntensity: 1.45,
  pressSwellRadius: 0,
  pressSwellIntensity: 0,
};

function ease_quad_in_out(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function buildCharColors(charSet: string, start: string, end: string) {
  const len = charSet.length;
  if (len <= 1) return [start];

  return Array.from({ length: len }, (_, i) => {
    const t = i / (len - 1);
    return `color-mix(in srgb, ${start} ${Math.round((1 - t) * 100)}%, ${end})`;
  });
}

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

/** Home background: Art 4 version 2 (debug heatmap), no mic, pointer + scroll blur/slowdown. */
export function VideoBackground() {
  const pathname = usePathname();
  const { scrollContainerRef } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const isHome = pathname === '/';

  const interactionRef = useRef<AsciiWaveInteractionState>({
    ripples: [],
    pointer: null,
    pressed: false,
  });
  const speedRef = useRef(1);
  const animPausedRef = useRef(false);

  const charColors = useMemo(
    () => buildCharColors(ART4_CHAR_SET, ART4_BLUES.deep, ART4_BLUES.light),
    []
  );

  const windowScroll = useScroll();
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

  const springedScrollY = useSpring(baseScrollY, springConfigs.subtle);
  const smoothScrollY = prefersReducedMotion ? baseScrollY : springedScrollY;

  const scrollRangePx = 600;
  /** Fully pause the art loop past this scroll progress (saves CPU). */
  const pauseAt = 0.92;
  /** Resume with hysteresis so we don't thrash at the threshold. */
  const resumeAt = 0.78;

  const progress = useTransform(smoothScrollY, (v) => clamp01(v / scrollRangePx));
  const progressForPlayback = useTransform(baseScrollY, (v) =>
    clamp01(v / scrollRangePx)
  );

  const blurPx = useTransform(progress, [0, 1], [0, 32]);
  const blurFilter = useTransform(blurPx, (v) => `blur(${v.toFixed(2)}px)`);

  const scale = useMemo(() => 1.05, []);

  const applyPlayback = useCallback(
    (p: number, hidden = typeof document !== 'undefined' && document.hidden) => {
      if (prefersReducedMotion) {
        animPausedRef.current = true;
        speedRef.current = 0;
        return;
      }

      // Tab hidden: freeze the current frame. Do not flip pause hysteresis so
      // resume continues from the same scroll speed with no visual jump.
      if (hidden) {
        speedRef.current = 0;
        return;
      }

      if (animPausedRef.current) {
        if (p <= resumeAt) {
          animPausedRef.current = false;
          speedRef.current = Math.min(1, Math.max(0.08, 1 - p));
        } else {
          speedRef.current = 0;
        }
        return;
      }

      if (p >= pauseAt) {
        animPausedRef.current = true;
        speedRef.current = 0;
        return;
      }

      // Slow toward ~0.08 as you scroll, then hard-pause past pauseAt.
      speedRef.current = Math.min(1, Math.max(0.08, 1 - p));
    },
    [prefersReducedMotion, pauseAt, resumeAt]
  );

  useMotionValueEvent(progressForPlayback, 'change', (p) => {
    applyPlayback(p);
  });

  useEffect(() => {
    const sync = () => applyPlayback(progressForPlayback.get());
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [applyPlayback, progressForPlayback]);

  if (!isHome) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        transform: `scale(${scale})`,
        willChange: 'transform, filter',
        filter: prefersReducedMotion ? 'none' : blurFilter,
        WebkitFilter: prefersReducedMotion ? 'none' : blurFilter,
      }}
    >
      <AsciiWaveInteractive
        fill
        FRAMES={ART4_FRAMES}
        BLUR_STEPS={18}
        from={0}
        ease={ease_quad_in_out}
        charSet={ART4_CHAR_SET}
        charColors={charColors}
        interactionTintColor={ART4_RIPPLE_PINK}
        interactionTintStrength={0.88}
        interactionRef={interactionRef}
        interactionConfig={ART4_INTERACTION}
        visualMode="debug"
        debugInvertDepth
        speedRef={speedRef}
        pointerTarget="window"
        cellScale={0.55}
        className="opacity-90"
      />
    </motion.div>
  );
}
