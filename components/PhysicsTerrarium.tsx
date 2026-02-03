'use client';

import React, { useEffect, useRef } from 'react';
import useMeasure from 'react-use-measure';
import Matter from 'matter-js';

import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';

type PillConfig = {
  label: string;
  color: string;
  width: number;
  height: number;
};

/** Slightly lighten or darken a hex color (factor > 1 = lighter, < 1 = darker). */
function adjustLuminance(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  r = Math.round(Math.min(255, r * factor));
  g = Math.round(Math.min(255, g * factor));
  b = Math.round(Math.min(255, b * factor));
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

const PILL_HEIGHT = 40;
const PILL_PADDING_X = 20;

function pillWidth(label: string): number {
  return Math.min(180, Math.max(64, label.length * 9 + PILL_PADDING_X));
}

/** Category id → base hex (palette #92: golden yellow, beige, grey-brown, blue-grey, off-white). */
const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#efcc6e',
  cloud: '#c1c9ae',
  devops: '#968a79',
  data: '#b89070',
  observability: '#f6f5ff',
  ai: '#b89070',
};

/** Items by category (order = display order); each gets category color with slight luminance step. */
const ITEMS_BY_CATEGORY: Array<{ category: keyof typeof CATEGORY_COLORS; label: string }> = [
  // Frontend
  { category: 'frontend', label: 'React' },
  { category: 'frontend', label: 'Next.js' },
  { category: 'frontend', label: 'TypeScript' },
  { category: 'frontend', label: 'React Native' },
  { category: 'frontend', label: 'Expo' },
  // Cloud
  { category: 'cloud', label: 'GCP' },
  { category: 'cloud', label: 'AWS' },
  { category: 'cloud', label: 'Firebase' },
  { category: 'cloud', label: 'Digital Ocean' },
  // DevOps
  { category: 'devops', label: 'Docker' },
  // Data
  { category: 'data', label: 'GraphQL' },
  { category: 'data', label: 'Neo4j' },
  { category: 'data', label: 'SQL' },
  { category: 'data', label: 'MongoDB' },
  // Observability
  { category: 'observability', label: 'PostHog' },
  { category: 'observability', label: 'Sentry' },
  // AI
  { category: 'ai', label: 'LLM APIs' },
  { category: 'ai', label: 'MCP' },
  { category: 'ai', label: 'etc. et al' },
];

/** Build pill configs sorted by category, with per-item luminance variation within each category. */
function buildPillConfigs(): PillConfig[] {
  const configs: PillConfig[] = [];
  let categoryIndex: Record<string, number> = {};

  for (const { category, label } of ITEMS_BY_CATEGORY) {
    const base = CATEGORY_COLORS[category] ?? '#888';
    const i = categoryIndex[category] ?? 0;
    categoryIndex[category] = i + 1;
    // Slightly different luminance per item in category (first = base, then a bit lighter)
    const luminanceFactor = 1 + i * 0.06;
    const color = adjustLuminance(base, luminanceFactor);
    configs.push({
      label,
      color,
      width: pillWidth(label),
      height: PILL_HEIGHT,
    });
  }

  return configs;
}

const PILL_CONFIGS: PillConfig[] = buildPillConfigs();

// Display smoothing: lerp factor (0 = no movement, 1 = instant). Lower = smoother, less jitter.
const SMOOTH_FACTOR = 0.22;

// Physics tuning
const WALL_THICKNESS = 32;
const INSET_PADDING = 16; // keep bodies away from border
const SPAWN_GAP = 14;
const MAX_SPEED = 9;

// Fixed timestep (stability)
const FIXED_TIMESTEP = 1000 / 60; // 16.666ms
const MAX_FRAME_DELTA = 50; // clamp huge frames

/** Returns non-overlapping (center x, center y) for each pill so they don't intersect at spawn. */
function getSpawnPositions(width: number, height: number): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  let rowX = INSET_PADDING;
  let rowY = INSET_PADDING;
  let rowHeight = 0;

  for (const config of PILL_CONFIGS) {
    const w = config.width;
    const h = config.height;
    const rightEdge = rowX + w;

    if (rightEdge > width - INSET_PADDING && positions.length > 0) {
      rowX = INSET_PADDING;
      rowY += rowHeight + SPAWN_GAP;
      rowHeight = 0;
    }

    const x = rowX + w / 2;
    const y = rowY + h / 2;
    positions.push({ x, y });

    rowX += w + SPAWN_GAP;
    rowHeight = Math.max(rowHeight, h);
  }

  return positions;
}

/**
 * Create inset walls (no post-solve clamping/teleporting).
 * This avoids breaking collision resolution and reduces interpenetration jitter.
 */
function createInsetWalls(width: number, height: number) {
  const t = WALL_THICKNESS;
  const inset = INSET_PADDING;

  const top = Matter.Bodies.rectangle(width / 2, inset - t / 2, width + t * 2, t, { isStatic: true });
  const bottom = Matter.Bodies.rectangle(width / 2, height - inset + t / 2, width + t * 2, t, { isStatic: true });
  const left = Matter.Bodies.rectangle(inset - t / 2, height / 2, t, height + t * 2, { isStatic: true });
  const right = Matter.Bodies.rectangle(width - inset + t / 2, height / 2, t, height + t * 2, { isStatic: true });

  return [top, bottom, left, right];
}

export function PhysicsTerrarium({
  className,
  fillContainer,
}: {
  className?: string;
  /** When true, fills parent (no minHeight); use inside a sized card. */
  fillContainer?: boolean;
}) {
  const [measureRef, bounds] = useMeasure({ scroll: false });
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const pillBodiesRef = useRef<Array<{ body: Matter.Body; config: PillConfig }>>([]);
  const pillRefsRef = useRef<(HTMLDivElement | null)[]>([]);
  const smoothedRef = useRef<Array<{ x: number; y: number; angle: number }>>([]);
  const rafRef = useRef<number>(0);

  const width = bounds.width;
  const height = bounds.height;
  const hasBounds = width > 0 && height > 0;

  useEffect(() => {
    if (prefersReducedMotion || !hasBounds || !containerRef.current) return;

    // ---- Engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 },
      positionIterations: 14,
      velocityIterations: 10,
      constraintIterations: 4,
    });
    engine.enableSleeping = true;

    engineRef.current = engine;
    const world = engine.world;

    // ---- Boundaries (inset walls)
    const walls = createInsetWalls(width, height);
    Matter.Composite.add(world, walls);

    // ---- Pills
    const spawnPositions = getSpawnPositions(width, height);
    const pillBodies: Array<{ body: Matter.Body; config: PillConfig }> = [];

    PILL_CONFIGS.forEach((config, i) => {
      const w = config.width;
      const h = config.height;

      // Chamfered rectangle: still more expensive than circles; keep settings stable.
      const chamferRadius = Math.min(w, h) / 2;

      const { x, y } = spawnPositions[i] ?? { x: width / 2, y: height / 2 };

      const body = Matter.Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: chamferRadius },
        restitution: 0.2,
        friction: 0.9,
        frictionAir: 0.08,
        density: 0.003,
        slop: 0.01,
      });

      Matter.Composite.add(world, body);
      pillBodies.push({ body, config });
    });

    pillBodiesRef.current = pillBodies;
    smoothedRef.current = pillBodies.map(({ body }) => ({
      x: body.position.x,
      y: body.position.y,
      angle: body.angle,
    }));

    // ---- Mouse interaction
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      element: containerRef.current,
      constraint: { stiffness: 0.15, damping: 0.2 },
    } as Matter.IMouseConstraintDefinition);
    Matter.Composite.add(world, mouseConstraint);

    const GRAVITY_STRENGTH = 0.08;
    const centerX = width / 2;
    const centerY = height / 2;

    // ---- Fixed timestep loop (major stability improvement)
    let last = performance.now();
    let acc = 0;

    const tick = () => {
      const now = performance.now();
      const frameDelta = Math.min(now - last, MAX_FRAME_DELTA);
      last = now;

      // Gravity toward cursor (pull items toward mouse/touch position)
      const mouse = mouseConstraint.mouse;
      const mx = mouse.position.x;
      const my = mouse.position.y;
      const dx = mx - centerX;
      const dy = my - centerY;
      const len = Math.hypot(dx, dy) || 1;
      engine.gravity.x = (dx / len) * GRAVITY_STRENGTH;
      engine.gravity.y = (dy / len) * GRAVITY_STRENGTH;

      acc += frameDelta;

      // Step in fixed increments
      while (acc >= FIXED_TIMESTEP) {
        Matter.Engine.update(engine, FIXED_TIMESTEP);
        acc -= FIXED_TIMESTEP;
      }

      // Render DOM transforms with smoothing (reduces jitter in corners)
      const pills = pillBodiesRef.current;
      const smoothed = smoothedRef.current;

      for (let i = 0; i < pills.length; i++) {
        const { body } = pills[i];

        // Cap speed (prevents tunneling / chaos)
        const vx = body.velocity.x;
        const vy = body.velocity.y;
        const speed = Math.hypot(vx, vy);
        if (speed > MAX_SPEED) {
          const s = MAX_SPEED / speed;
          Matter.Body.setVelocity(body, { x: vx * s, y: vy * s });
        }

        // Gentle rotational damping (via API, not direct mutation)
        Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.91);

        // Lerp smoothed position/angle toward physics (smooth movement, no jitter)
        if (smoothed[i]) {
          const t = SMOOTH_FACTOR;
          smoothed[i].x += (body.position.x - smoothed[i].x) * t;
          smoothed[i].y += (body.position.y - smoothed[i].y) * t;
          smoothed[i].angle += (body.angle - smoothed[i].angle) * t;
        }

        const el = pillRefsRef.current[i];
        if (el && smoothed[i]) {
          const { x, y, angle } = smoothed[i];
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}rad)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);

      // Remove bodies/constraints to avoid leaks
      try {
        Matter.Composite.clear(world, false);
        Matter.Engine.clear(engine);
      } catch {
        // no-op
      }

      engineRef.current = null;
      pillBodiesRef.current = [];
      smoothedRef.current = [];
    };
  }, [prefersReducedMotion, hasBounds, width, height]);

  const showStatic = prefersReducedMotion || !hasBounds;

  const stopPropagation = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={(node) => {
        measureRef(node);
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        'relative overflow-hidden rounded-xl bg-[#F5F5F4]',
        fillContainer && 'h-full w-full min-h-0',
        className
      )}
      style={fillContainer ? undefined : { minHeight: 320 }}
      onPointerDown={stopPropagation}
      onPointerMove={stopPropagation}
      onPointerUp={stopPropagation}
      onPointerCancel={stopPropagation}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
      onTouchMove={stopPropagation}
      onTouchEnd={stopPropagation}
    >
      {showStatic ? (
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-6">
          {PILL_CONFIGS.map((config, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center justify-center rounded-lg bg-gray-100 font-medium text-black tracking-wide whitespace-nowrap"
              style={{
                width: config.width,
                height: config.height,
                padding: '0 16px',
              }}
            >
              <span className="text-base">{config.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          {PILL_CONFIGS.map((config, i) => (
            <div
              key={i}
              ref={(el) => {
                pillRefsRef.current[i] = el;
              }}
              className="absolute left-0 top-0 flex items-center justify-center rounded-full bg-white/60 font-light text-black text-medium tracking-wide select-none whitespace-nowrap"
              style={{
                width: config.width,
                height: config.width,
                padding: '0 16px',
                transformOrigin: 'center center',
                willChange: 'transform',
                touchAction: 'none',
              }}
            >
              <span className="text-base">{config.label}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
