"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { GooeyFilter } from '@/components/GooeyFilter';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useSafari } from '@/lib/useSafari';

type BlobConfig = {
  id: string;
  size: number;
  color: string;
  anchorX: number;
  anchorY: number;
};

const DEFAULT_BLOB_COUNT = 12;
const PALETTE = [
  '#C9D5E2',
  '#E6DFD7',
  '#F6E2B2',
  '#C2D0C1',
  '#A8BED1',
  '#D3E0E6',
];

const createSeededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value + 0x6D2B79F5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export function HeaderGooeyCluster({
  className,
  blobCount = DEFAULT_BLOB_COUNT,
}: {
  className?: string;
  blobCount?: number;
}) {
  const isSafari = useSafari();
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef({ width: 0, height: 0 });
  const positionsRef = useRef<Array<{ x: number; y: number }>>([]);
  const velocitiesRef = useRef<Array<{ x: number; y: number }>>([]);

  const blobs = useMemo(() => {
    const random = createSeededRandom(42);
    return Array.from({ length: blobCount }).map((_, index) => {
      const size = 110 + random() * 120;
      const anchorX = 0.15 + random() * 0.7;
      const anchorY = 0.15 + random() * 0.7;
      const color = PALETTE[index % PALETTE.length];
      return {
        id: `header-blob-${index}`,
        size,
        color,
        anchorX,
        anchorY,
      };
    });
  }, [blobCount]);

  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(
    () => blobs.map(() => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      boundsRef.current = { width: rect.width, height: rect.height };
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  useEffect(() => {
    const bounds = boundsRef.current;
    positionsRef.current = blobs.map((blob) => ({
      x: blob.anchorX * bounds.width,
      y: blob.anchorY * bounds.height,
    }));
    velocitiesRef.current = blobs.map(() => ({ x: 0, y: 0 }));
    positionsRef.current.forEach((pos, index) => {
      positionsRef.current[index] = { ...pos };
    });
    setPositions(positionsRef.current.map((pos) => ({ ...pos })));
  }, [blobs]);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.032);
      lastTime = time;

      const { width, height } = boundsRef.current;
      if (width === 0 || height === 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const padding = 24;
      const repelRadius = 140;
      const repelStrength = 1200;
      const springStrength = 0.4;
      const damping = 0.85;

      for (let i = 0; i < blobs.length; i += 1) {
        const pos = positionsRef.current[i];
        const vel = velocitiesRef.current[i];
        const blob = blobs[i];

        let forceX = 0;
        let forceY = 0;

        const anchorX = blob.anchorX * width;
        const anchorY = blob.anchorY * height;
        forceX += (anchorX - pos.x) * springStrength;
        forceY += (anchorY - pos.y) * springStrength;

        for (let j = 0; j < blobs.length; j += 1) {
          if (i === j) continue;
          const other = positionsRef.current[j];
          const dx = pos.x - other.x;
          const dy = pos.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < repelRadius) {
            const strength = (1 - distance / repelRadius) * repelStrength;
            forceX += (dx / distance) * strength;
            forceY += (dy / distance) * strength;
          }
        }

        if (pos.x < padding) forceX += (padding - pos.x) * 6;
        if (pos.x > width - padding) forceX -= (pos.x - (width - padding)) * 6;
        if (pos.y < padding) forceY += (padding - pos.y) * 6;
        if (pos.y > height - padding) forceY -= (pos.y - (height - padding)) * 6;

        vel.x = (vel.x + forceX * dt) * damping;
        vel.y = (vel.y + forceY * dt) * damping;

        pos.x += vel.x * dt * 60;
        pos.y += vel.y * dt * 60;

      }

      setPositions(positionsRef.current.map((pos) => ({ ...pos })));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [blobs]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      <GooeyFilter filterId="headerGooey" stdDeviation={40} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          // Safari doesn't support applying SVG filters to DOM elements
          ...(!isSafari && {
            filter: 'url(#headerGooey)',
            WebkitFilter: 'url(#headerGooey)',
          }),
          willChange: 'filter',
          transform: 'translateZ(0)',
        }}
      >
        {blobs.map((blob, index) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full opacity-80"
            style={{
              width: blob.size,
              height: blob.size * 0.7,
              backgroundColor: blob.color,
              transform: `translate3d(${positions[index]?.x ?? 0}px, ${positions[index]?.y ?? 0}px, 0) translate(-50%, -50%)`,
            }}
            whileHover={{
              scale: 1.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default HeaderGooeyCluster;
