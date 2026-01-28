"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { GooeyFilter } from '@/components/GooeyFilter';
import { cn } from '@/lib/utils';
import { useSafari } from '@/lib/useSafari';
import { motion } from 'framer-motion';

type CategoryId = 'frontend' | 'backend' | 'data' | 'analytics' | 'ai';

type NodeConfig = {
  id: string;
  label: string;
  category: CategoryId;
  size: number;
  color: string;
};


const CATEGORIES: Array<{ id: CategoryId; label: string; color: string }> = [
  { id: 'frontend', label: 'Frontend', color: '#f9dc5c' },
  { id: 'backend', label: 'Backend', color: '#fae588' },
  { id: 'data', label: 'Data', color: '#fcefb4' },
  { id: 'analytics', label: 'Analytics', color: '#fdf8e1' },
  { id: 'ai', label: 'AI Systems', color: '#f9dc5c' },
];

const NODE_DEFS = [
  { id: 'react', label: 'React', category: 'frontend' as const },
  { id: 'nextjs', label: 'Next.js', category: 'frontend' as const },
  { id: 'typescript', label: 'TypeScript', category: 'frontend' as const },
  { id: 'firebase', label: 'Firebase', category: 'backend' as const },
  { id: 'gcp', label: 'Google Cloud', category: 'backend' as const },
  { id: 'docker', label: 'Docker', category: 'backend' as const },
  { id: 'graphql', label: 'GraphQL', category: 'data' as const },
  { id: 'neo4j', label: 'Neo4j', category: 'data' as const },
  { id: 'sql', label: 'SQL', category: 'data' as const },
  { id: 'posthog', label: 'PostHog', category: 'analytics' as const },
  { id: 'mixpanel', label: 'Mixpanel', category: 'analytics' as const },
  { id: 'sentry', label: 'Sentry', category: 'analytics' as const },
  { id: 'llm', label: 'LLM APIs', category: 'ai' as const },
  { id: 'mcp', label: 'MCP', category: 'ai' as const },
];


const PADDING = 128;

const createSeededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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
  const dragRef = useRef<{
    index: number | null;
    offsetX: number;
    offsetY: number;
    halfW: number;
    halfH: number;
  }>({ index: null, offsetX: 0, offsetY: 0, halfW: 0, halfH: 0 });

  // Isolated goo cursor: only when pointer is over the card, pointer devices only
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const cursorPosRef = useRef<{ x: number; y: number } | null>(null);
  const cursorRafRef = useRef<number | null>(null);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    setIsPointerDevice(
      !('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  }, []);

  const updateCursorFromClient = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    cursorPosRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    if (cursorRafRef.current == null) {
      cursorRafRef.current = requestAnimationFrame(() => {
        setCursorPos(cursorPosRef.current);
        cursorRafRef.current = null;
      });
    }
  };

  const handleCardPointerEnter = (e: React.PointerEvent) => {
    if (!isPointerDevice) return;
    updateCursorFromClient(e.clientX, e.clientY);
  };

  const handleCardPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDevice) return;
    updateCursorFromClient(e.clientX, e.clientY);
  };

  const handleCardPointerLeave = () => {
    cursorPosRef.current = null;
    if (cursorRafRef.current != null) {
      cancelAnimationFrame(cursorRafRef.current);
      cursorRafRef.current = null;
    }
    setCursorPos(null);
  };

  const nodes: NodeConfig[] = useMemo(() => {
    return NODE_DEFS.map((node) => {
      const category = CATEGORIES.find((item) => item.id === node.category);
      const size = Math.max(200, 200 + node.label.length * 8);
      return {
        ...node,
        size,
        color: category?.color ?? '#CBD5E1',
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
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      anchorsRef.current = nodes.map(() => ({ x: cx, y: cy }));
      positionsRef.current = nodes.map((_, i) => {
        const r = createSeededRandom(1000 + i);
        const dx = (r() - 0.5) * 120;
        const dy = (r() - 0.5) * 120;
        return { x: cx + dx, y: cy + dy };
      });
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

      const repelRadius = 175;
      const repelStrength = 600;
      const springStrength = 0.9;
      const damping = 0.88;
      const boundaryRepelRadius = 80;
      const boundaryRepelStrength = 320;

      for (let i = 0; i < nodes.length; i += 1) {
        const pos = positionsRef.current[i];
        const vel = velocitiesRef.current[i];
        const anchor = anchorsRef.current[i];
        const halfW = nodes[i].size / 2;
        const halfH = nodes[i].size * 0.25;

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

        // Boundary repulsion: same model as node-to-node, using node edges vs padding line
        let gap = (pos.x - halfW) - PADDING;
        if (gap < boundaryRepelRadius) {
          const g = Math.max(0, gap);
          forceX += (1 - g / boundaryRepelRadius) * boundaryRepelStrength;
        }
        gap = (width - PADDING) - (pos.x + halfW);
        if (gap < boundaryRepelRadius) {
          const g = Math.max(0, gap);
          forceX -= (1 - g / boundaryRepelRadius) * boundaryRepelStrength;
        }
        gap = (pos.y - halfH) - PADDING;
        if (gap < boundaryRepelRadius) {
          const g = Math.max(0, gap);
          forceY += (1 - g / boundaryRepelRadius) * boundaryRepelStrength;
        }
        gap = (height - PADDING) - (pos.y + halfH);
        if (gap < boundaryRepelRadius) {
          const g = Math.max(0, gap);
          forceY -= (1 - g / boundaryRepelRadius) * boundaryRepelStrength;
        }

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
      const { halfW, halfH } = dragRef.current;
      const nextX = event.clientX - rect.left + dragRef.current.offsetX;
      const nextY = event.clientY - rect.top + dragRef.current.offsetY;
      const { width, height } = boundsRef.current;
      const clampedX = Math.max(PADDING + halfW, Math.min(width - PADDING - halfW, nextX));
      const clampedY = Math.max(PADDING + halfH, Math.min(height - PADDING - halfH, nextY));
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
    const halfW = nodes[index].size / 2;
    const halfH = nodes[index].size * 0.25;
    dragRef.current = {
      index,
      offsetX: pos.x - cursorX,
      offsetY: pos.y - cursorY,
      halfW,
      halfH,
    };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'h-full border w-full relative',
        className
      )}
      onPointerEnter={handleCardPointerEnter}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={handleCardPointerLeave}
    >
      <GooeyFilter
        filterId="techGooeyCard"
        stdDeviation={50}
        matrixValues="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -5"
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          // Safari doesn't support applying SVG filters to DOM elements
          ...(!isSafari && {
            filter: 'url(#techGooeyCard) blur(10px)', 
            WebkitFilter: 'url(#techGooeyCard) blur(10px)',
          }),
          willChange: 'filter',
          transform: 'translateZ(0)',
        }}
      >
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute rounded-full opacity-80 transition-transform"
            style={{
              width: node.size,
              height: node.size * 0.5,
              backgroundColor: node.color,
              transform: `translate3d(${positions[index]?.x ?? 0}px, ${positions[index]?.y ?? 0}px, 0) translate(-50%, -50%)`,
            }}
            whileHover={{ scale: 1.1, rotate: 10, filter: 'brightness(1.2)' }}
            onPointerDown={handlePointerDown(index)}
          />
        ))}
        {/* Isolated goo cursor: merges with blobs via the same filter, only when pointer over card */}
        {isPointerDevice && cursorPos && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              width: 200,
              height: 200,
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#002FA7',
              backdropFilter: 'invert(1)',
              WebkitBackdropFilter: 'invert(1)',
            }}
            aria-hidden
          />
        )}
      </div>
      <div className="absolute inset-0 z-20">
        {nodes.map((node, index) => (
          <div
            key={`${node.id}-label`}
            className="absolute select-none text-lg font-semibold text-black"
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
