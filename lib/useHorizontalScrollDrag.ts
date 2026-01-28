import { animate, useMotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function useHorizontalScrollDrag(opts?: { inertia?: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollMV = useMotionValue(0);

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    maxScroll: number;
    lastX: number;
    lastT: number;
    instV: number; // px/s
  } | null>(null);

  // Sync motion value from native scroll (trackpad etc.)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => scrollMV.set(el.scrollLeft);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollMV]);

  // Drive scrollLeft from motion value during inertia anim
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const unsub = scrollMV.on("change", (val) => {
      if (Math.abs(el.scrollLeft - val) > 0.5) el.scrollLeft = val;
    });
    return () => unsub();
  }, [scrollMV]);

  // Keep bounds stable
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const next = clamp(el.scrollLeft, 0, max);
      if (next !== el.scrollLeft) el.scrollLeft = next;
      scrollMV.set(el.scrollLeft);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollMV]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    // stop any running inertia
    animate(scrollMV, scrollMV.get(), { duration: 0 });

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      maxScroll,
      lastX: e.clientX,
      lastT: performance.now(),
      instV: 0,
    };

    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    const d = dragRef.current;
    if (!el || !d || d.pointerId !== e.pointerId) return;

    const dx = e.clientX - d.startX;
    const next = clamp(d.startScroll - dx, 0, d.maxScroll);

    el.scrollLeft = next;
    scrollMV.set(next);

    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.instV = ((d.lastX - e.clientX) / dt) * 1000;
    d.lastX = e.clientX;
    d.lastT = now;
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    const d = dragRef.current;
    if (!el || !d || d.pointerId !== e.pointerId) return;

    dragRef.current = null;

    if (opts?.inertia === false) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const current = el.scrollLeft;
    const velocity = d.instV;

    if (Math.abs(velocity) > 50) {
      // Big, Slow, Bigger, Smoother: more travel, longer deceleration, softer stop
      animate(scrollMV, current, {
        type: "inertia",
        velocity,
        min: 0,
        max: maxScroll,
        power: 1.3,
        timeConstant: 720,
        bounceStiffness: 200,
        bounceDamping: 25,
      });
    }
  };

  return {
    scrollerRef,
    scrollMV,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
}
