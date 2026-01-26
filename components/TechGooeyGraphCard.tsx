"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { GooeyFilter } from '@/components/GooeyFilter';
import { cn } from '@/lib/utils';
import { useSafari } from '@/lib/useSafari';

type CategoryId = 'frontend' | 'backend' | 'data' | 'analytics' | 'ai';

type NodeConfig = {
  id: string;
  label: string;
  category: CategoryId;
  size: number;
  color: string;
  anchorX: number;
  anchorY: number;
};


const CATEGORIES: Array<{ id: CategoryId; label: string; color: string }> = [
  { id: 'frontend', label: 'Frontend', color: '#9BB7D4' },
  { id: 'backend', label: 'Backend', color: '#B7C8B6' },
  { id: 'data', label: 'Data', color: '#E3C6A6' },
  { id: 'analytics', label: 'Analytics', color: '#C9AFCB' },
  { id: 'ai', label: 'AI Systems', color: '#A9C5D9' },
];

const NODE_DEFS = [
  { id: 'react', label: 'React', category: 'frontend' as const },
  { id: 'nextjs', label: 'Next.js', category: 'frontend' as const },
  { id: 'typescript', label: 'TypeScript', category: 'frontend' as const },
  { id: 'firebase', label: 'Firebase', category: 'backend' as const },
  { id: 'gcp', label: 'Google Cloud', category: 'backend' as const },
  { id: 'docker', label: 'Docker', category: 'backend' as const },
  { id: 'graphql', label: 'GraphQL', category: 'data' as const },
  { id: 'neo4j', label: 'Neo4j / Cypher', category: 'data' as const },
  { id: 'sql', label: 'SQL', category: 'data' as const },
  { id: 'posthog', label: 'PostHog', category: 'analytics' as const },
  { id: 'mixpanel', label: 'Mixpanel', category: 'analytics' as const },
  { id: 'sentry', label: 'Sentry', category: 'analytics' as const },
  { id: 'llm', label: 'LLM APIs', category: 'ai' as const },
  { id: 'mcp', label: 'MCP', category: 'ai' as const },
];


const createSeededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const categoryCenters: Record<CategoryId, { x: number; y: number }> = {
  frontend: { x: 0.22, y: 0.25 },
  backend: { x: 0.72, y: 0.25 },
  data: { x: 0.22, y: 0.62 },
  analytics: { x: 0.72, y: 0.62 },
  ai: { x: 0.5, y: 0.85 },
};

export function TechGooeyGraphCard({
  className,
}: {
  className?: string;
}) {
  const isSafari = useSafari();
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef({ width: 0, height: 0 });
  const positionsRef = useRef<Array<{ x: number; y: number }>>([]);
  const velocitiesRef = useRef<Array<{ x: number; y: number }>>([]);
  const anchorsRef = useRef<Array<{ x: number; y: number }>>([]);
  const dragRef = useRef<{ index: number | null; offsetX: number; offsetY: number }>({
    index: null,
    offsetX: 0,
    offsetY: 0,
  });

  const nodes: NodeConfig[] = useMemo(() => {
    const random = createSeededRandom(14);
    return NODE_DEFS.map((node, index) => {
      const category = CATEGORIES.find((item) => item.id === node.category);
      const center = categoryCenters[node.category];
      const size = Math.max(92, 56 + node.label.length * 6);
      const jitterX = (random() - 0.5) * 0.06;
      const jitterY = (random() - 0.5) * 0.06;
      return {
        ...node,
        size,
        color: category?.color ?? '#CBD5E1',
        anchorX: center.x + jitterX,
        anchorY: center.y + jitterY,
      };
    });
  }, []);

  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(
    () => nodes.map(() => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      boundsRef.current = { width: rect.width, height: rect.height };
      anchorsRef.current = nodes.map((node) => ({
        x: node.anchorX * rect.width,
        y: node.anchorY * rect.height,
      }));
      positionsRef.current = anchorsRef.current.map((pos) => ({ ...pos }));
      velocitiesRef.current = nodes.map(() => ({ x: 0, y: 0 }));
      setPositions(positionsRef.current.map((pos) => ({ ...pos })));
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [nodes]);

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

      const padding = 32;
      const repelRadius = 80;
      const repelStrength = 220;
      const springStrength = 0.7;
      const damping = 0.88;

      for (let i = 0; i < nodes.length; i += 1) {
        const pos = positionsRef.current[i];
        const vel = velocitiesRef.current[i];
        const anchor = anchorsRef.current[i];

        if (dragRef.current.index === i) {
          vel.x = 0;
          vel.y = 0;
          continue;
        }

        let forceX = 0;
        let forceY = 0;

        forceX += (anchor.x - pos.x) * springStrength;
        forceY += (anchor.y - pos.y) * springStrength;

        for (let j = 0; j < nodes.length; j += 1) {
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
  }, [nodes]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (dragRef.current.index === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const index = dragRef.current.index;
      const nextX = event.clientX - rect.left + dragRef.current.offsetX;
      const nextY = event.clientY - rect.top + dragRef.current.offsetY;
      const { width, height } = boundsRef.current;
      const clampedX = Math.max(32, Math.min(width - 32, nextX));
      const clampedY = Math.max(32, Math.min(height - 32, nextY));
      positionsRef.current[index].x = clampedX;
      positionsRef.current[index].y = clampedY;
    };

    const handlePointerUp = () => {
      dragRef.current.index = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handlePointerDown = (index: number) => (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = positionsRef.current[index];
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
    dragRef.current = {
      index,
      offsetX: pos.x - cursorX,
      offsetY: pos.y - cursorY,
    };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'h-full border w-full relative',
        className
      )}
    >
      <GooeyFilter
        filterId="techGooeyCard"
        stdDeviation={30}
        matrixValues="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -5"
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          // Safari doesn't support applying SVG filters to DOM elements
          ...(!isSafari && {
            filter: 'url(#techGooeyCard)',
            WebkitFilter: 'url(#techGooeyCard)',
          }),
          willChange: 'filter',
          transform: 'translateZ(0)',
        }}
      >
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className="absolute rounded-full opacity-80 transition-transform"
            style={{
              width: node.size,
              height: node.size * 0.62,
              backgroundColor: node.color,
              transform: `translate3d(${positions[index]?.x ?? 0}px, ${positions[index]?.y ?? 0}px, 0) translate(-50%, -50%)`,
            }}
            onPointerDown={handlePointerDown(index)}
          />
        ))}
      </div>
      <div className="absolute inset-0 z-20">
        {nodes.map((node, index) => (
          <div
            key={`${node.id}-label`}
            className="absolute select-none text-xs font-semibold text-gray-700"
            style={{
              transform: `translate3d(${positions[index]?.x ?? 0}px, ${positions[index]?.y ?? 0}px, 0) translate(-50%, -50%)`,
            }}
            onPointerDown={handlePointerDown(index)}
          >
            {node.label}
          </div>
        ))}
      </div>
    
      <ul className="sr-only">
        {nodes.map((node) => (
          <li key={`${node.id}-sr`}>{node.label}</li>
        ))}
      </ul>
    </div>
  );
}

export default TechGooeyGraphCard;
