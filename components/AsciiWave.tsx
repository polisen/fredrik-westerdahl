'use client';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import React, { useEffect, useRef } from 'react';

function ease_quad_in_out(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

class FrameLoop {
  max: number;
  from: number;
  to: number;
  frame: number;
  value: number;
  range: number;
  go_back: boolean;
  ease: (t: number) => number;

  constructor(
    max: number,
    from: number = 0,
    to: number = max,
    go_back: boolean = false,
    ease: (t: number) => number = (t: number) => t
  ) {
    this.max = max;
    this.from = from;
    this.to = to;
    this.frame = 0;
    this.value = from;
    this.range = from < to ? to - from : -(from - to);
    this.go_back = go_back;
    this.ease = ease;
  }

  update_value(): void {
    if (this.go_back) {
      const half = this.max / 2;
      if (this.frame < half) {
        this.value = this.from + this.ease(this.frame / half) * this.range;
      } else {
        this.value = this.to - this.ease((this.frame - half) / half) * this.range;
      }
    } else {
      this.value = this.from + this.ease(this.frame / this.max) * this.range;
    }
  }

  inc(): void {
    this.frame += 1;
    if (this.frame >= this.max) this.frame = 0;
    this.update_value();
  }

  set(val: number): void {
    this.frame = val;
    if (this.frame >= this.max) this.frame = 0;
    this.update_value();
  }
}

const chars = '  ░ ▒▓ █▀▄';
// const chars = '░▒▓ █▀▄ ';

const reverseChars = chars.split('').reverse().join('');

interface AsciiWaveProps {
  width?: number;
  height?: number;
  CHAR?: string;
  MAX?: number;
  FRAMES?: number;
  BLUR_STEPS?: number;
  className?: string;
}

function AsciiWave({
  width = 200,
  height = 80,
  CHAR = reverseChars,
  MAX = reverseChars.length * 2 - 2,
  FRAMES = 3000,
  BLUR_STEPS = 15,
  className = '',
}: AsciiWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.debug('setup ascii wave');
    
    // Inject style to remove br spacing globally for this component
    const styleId = 'ascii-wave-br-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [data-ascii-wave] br {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 0 !important;
          height: 0 !important;
          display: block !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Minimal replacements for used math functions
    const round = Math.round;
    const floor = Math.floor;
    const min = Math.min;
    const max = Math.max;
    const random = (a: number | number[] | null = 0, b: number | null = 0): number => {
      if (Array.isArray(a)) return a[floor(Math.random() * a.length)];
      if (a == null) return Math.random();
      if (b == null) return Math.random() * a;
      return a < b ? Math.random() * (b - a) + a : Math.random() * (a - b) + b;
    };
    const map = (val: number, s1: number, e1: number, s2: number, e2: number): number =>
      ((val - s1) / (e1 - s1)) * (e2 - s2) + s2;

    let ascii: string[][];
    let canvas_width: number;
    let canvas_height: number;
    let wave_map: (number | FrameLoop)[][];
    let running = true;

    function create_canvas() {
      const parent = containerRef.current;
      if (!parent) return;
      // Determine a fitting canvas size based on container width/height

      ascii = [];
      parent.innerHTML = '';
      for (let y = 0; y < height; y++) {
        const row = ' '.repeat(width).split('');
        ascii.push(row);
      }
      canvas_width = width;
      canvas_height = height;
      render_ascii();
    }

    function render_ascii() {
      const parent = containerRef.current;
      if (!parent) return;
      // Clear
      parent.innerText = '';
      for (let y = 0; y < canvas_height; y++) {
        parent.appendChild(document.createTextNode(ascii[y].join('')));
        const br = document.createElement('br');
        parent.appendChild(br);
      }
    }

    function create_layer(): number[][] {
      const layer: number[][] = [];
      for (let y = 0; y < canvas_height; y++) {
        layer.push(new Array(canvas_width).fill(0));
      }
      return layer;
    }

    function setup() {
      create_canvas();
      wave_map = create_layer();
      // Initialize random values
      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          wave_map[y][x] = random(MAX);
        }
      }
      // Blur
      for (let step = 0; step < BLUR_STEPS; step++) {
        for (let y = 0; y < canvas_height; y++) {
          for (let x = 0; x < canvas_width; x++) {
            const value = wave_map[y][x] as number;
            const left = wave_map[y][x > 0 ? x - 1 : x] as number;
            const right = wave_map[y][x < canvas_width - 1 ? x + 1 : x] as number;
            const top = wave_map[y > 0 ? y - 1 : y][x] as number;
            const bottom = wave_map[y < canvas_height - 1 ? y + 1 : y][x] as number;
            wave_map[y][x] = (value + left + right + top + bottom) / 5;
          }
        }
      }

      // Remap values
      let val_min = Infinity;
      let val_max = -Infinity;
      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          const numValue = wave_map[y][x] as number;
          val_min = min(val_min, numValue);
          val_max = max(val_max, numValue);
        }
      }

      // Create frameloops
      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          const numValue = wave_map[y][x] as number;
          const value = floor(map(numValue, val_min, val_max, 0, FRAMES));
          const frameLoop = new FrameLoop(
            FRAMES,
            4,
            CHAR.length - 1,
            true,
            ease_quad_in_out
          );
          frameLoop.set(value);
          wave_map[y][x] = frameLoop;
        }
      }
    }

    function draw() {
      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          const frameLoop = wave_map[y][x] as FrameLoop;
          ascii[y][x] = CHAR[round(frameLoop.value)];
          frameLoop.inc();
        }
      }
      render_ascii();
    }

    setup();

    function loop() {
      if (!running) return;
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    return () => {
      running = false;
      const style = document.getElementById('ascii-wave-br-fix');
      if (style) {
        style.remove();
      }
    };
  }, [width, height, CHAR, MAX, FRAMES, BLUR_STEPS]);

  return (
    <motion.div
      ref={containerRef}
      data-ascii-wave
      className={cn(
        'h-full  w-full   select-none pointer-events-none leading-none  text-md text-ow',
        className
      )}
      style={{ 
        whiteSpace: 'pre', 
        fontFamily: 'monospace',
        lineHeight: '1',
        fontSize: '1em',
        opacity: 0.20,
      }}
    />
  );
}

export default React.memo(AsciiWave);
