'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type MutableRefObject,
} from 'react';
import { motion } from 'motion/react';
import useMeasure from 'react-use-measure';
import { cn } from '@/lib/utils';

function ease_quad_in_out(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function ease_sin(t: number) {
  return (1 - Math.cos(t * Math.PI)) / 2;
}

class FrameLoop {
  max: number;
  from: number;
  to: number;
  frame = 0;
  value: number;
  range: number;
  go_back: boolean;
  ease: (t: number) => number;

  constructor(
    max: number,
    from = 0,
    to = max,
    go_back = false,
    ease = (t: number) => t
  ) {
    this.max = max;
    this.from = from;
    this.to = to;
    this.value = from;
    this.range = from < to ? to - from : -(from - to);
    this.go_back = go_back;
    this.ease = ease;
  }

  update_value() {
    if (this.go_back) {
      const half = this.max / 2;
      if (this.frame < half) {
        this.value = this.from + this.ease(this.frame / half) * this.range;
      } else {
        this.value =
          this.to - this.ease((this.frame - half) / half) * this.range;
      }
    } else {
      this.value = this.from + this.ease(this.frame / this.max) * this.range;
    }
  }

  inc() {
    this.frame += 1;
    if (this.frame >= this.max) this.frame = 0;
    this.update_value();
  }

  set(val: number) {
    this.frame = val;
    if (this.frame >= this.max) this.frame = 0;
    this.update_value();
  }
}

export type AsciiWaveRipple = {
  nx: number;
  ny: number;
  /** `performance.now()` when the ripple was spawned. */
  bornAt: number;
  strength: number;
  /** Override interaction config — lower = wider ripples. */
  wavelength?: number;
  /** Override ring thickness (normalized). */
  ringWidth?: number;
};

export type AsciiWaveRippleOptions = {
  wavelength?: number;
  ringWidth?: number;
};

export type AsciiWaveInteractionConfig = {
  /** Normalized radius per second the wave front travels (0–1 space). */
  rippleVelocity?: number;
  /** Normalized radius where the ripple fades out completely. */
  rippleMaxRadius?: number;
  /** Thickness of the traveling ring (normalized). */
  rippleRingWidth?: number;
  /** Displacement multiplier for ripple rings. */
  rippleIntensity?: number;
  /** Spatial frequency of the ring oscillation. */
  rippleWavelength?: number;
  /** Trailing echo strength behind the front (0–1). */
  rippleTrail?: number;
  /** Hover swell radius when the pointer is not pressed. */
  hoverRadius?: number;
  hoverIntensity?: number;
  /** Optional instant swell on press (0 disables). */
  pressSwellRadius?: number;
  pressSwellIntensity?: number;
};

export type AsciiWaveInteractionState = {
  ripples: AsciiWaveRipple[];
  pointer: { nx: number; ny: number } | null;
  pressed: boolean;
};

export type AsciiWaveInteractionRef = MutableRefObject<AsciiWaveInteractionState>;

export function pushAsciiWaveRipple(
  interactionRef: AsciiWaveInteractionRef | undefined,
  nx: number,
  ny: number,
  strength: number,
  options?: AsciiWaveRippleOptions
) {
  if (!interactionRef?.current) return;
  interactionRef.current.ripples.push({
    nx,
    ny,
    bornAt: performance.now(),
    strength,
    wavelength: options?.wavelength,
    ringWidth: options?.ringWidth,
  });
}

const DEFAULT_INTERACTION_CONFIG: Required<AsciiWaveInteractionConfig> = {
  rippleVelocity: 0.18,
  rippleMaxRadius: 0.72,
  rippleRingWidth: 0.042,
  rippleIntensity: 0.95,
  rippleWavelength: 22,
  rippleTrail: 0.14,
  hoverRadius: 0.07,
  hoverIntensity: 0.4,
  pressSwellRadius: 0,
  pressSwellIntensity: 0,
};

function resolveInteractionConfig(
  config?: AsciiWaveInteractionConfig
): Required<AsciiWaveInteractionConfig> {
  return { ...DEFAULT_INTERACTION_CONFIG, ...config };
}

function rippleRadiusAt(
  ripple: AsciiWaveRipple,
  now: number,
  velocity: number
) {
  return ((now - ripple.bornAt) / 1000) * velocity;
}

function sampleRippleOffset(
  dist: number,
  ripple: AsciiWaveRipple,
  now: number,
  config: Required<AsciiWaveInteractionConfig>
) {
  const ringWidth = ripple.ringWidth ?? config.rippleRingWidth;
  const wavelength = ripple.wavelength ?? config.rippleWavelength;
  const radius = rippleRadiusAt(ripple, now, config.rippleVelocity);
  if (radius <= 0 || radius > config.rippleMaxRadius + ringWidth) {
    return 0;
  }

  // Wave front has not reached this cell yet.
  if (dist > radius) return 0;

  const fade = 1 - radius / config.rippleMaxRadius;
  if (fade <= 0) return 0;

  const behind = radius - dist;
  const ageSec = (now - ripple.bornAt) / 1000;

  let envelope = 0;

  if (behind <= ringWidth) {
    const t = 1 - behind / ringWidth;
    envelope = Math.sin(t * Math.PI * 0.5);
  } else if (config.rippleTrail > 0) {
    envelope =
      config.rippleTrail *
      Math.exp(-(behind - ringWidth) * 20) *
      (0.5 + 0.5 * Math.sin(dist * wavelength * Math.PI * 2));
  }

  const oscillation = Math.sin(dist * wavelength * Math.PI * 2 - ageSec * 10);

  return (
    oscillation * envelope * ripple.strength * config.rippleIntensity * fade
  );
}

const FILL_LINE_EXTRA_PX = 4;

function measureMaxCharWidth(
  parent: HTMLElement,
  font: string,
  fontSizePx: number,
  charSet: string
) {
  const probe = document.createElement('span');
  probe.style.font = font;
  probe.style.fontFamily = 'monospace';
  probe.style.fontSize = `${fontSizePx}px`;
  probe.style.lineHeight = '1';
  probe.style.visibility = 'hidden';
  probe.style.position = 'absolute';
  probe.style.whiteSpace = 'pre';
  parent.appendChild(probe);

  let maxWidth = 0;
  for (const char of charSet) {
    probe.textContent = char;
    maxWidth = Math.max(maxWidth, probe.getBoundingClientRect().width);
  }

  parent.removeChild(probe);
  return maxWidth || fontSizePx * 0.6;
}

function measureGridSize(
  parent: HTMLElement,
  fallbackWidth: number,
  fallbackHeight: number,
  charSet: string
) {
  const rect = parent.getBoundingClientRect();
  const layoutW = parent.offsetWidth;
  const layoutH = parent.offsetHeight;
  if (rect.width <= 0 || rect.height <= 0 || layoutW <= 0 || layoutH <= 0) {
    return {
      width: fallbackWidth,
      height: fallbackHeight,
      fontSizePx: null as number | null,
    };
  }

  // getBoundingClientRect includes CSS transforms (e.g. parent scale).
  // Grid layout uses untransformed CSS pixels — convert measurements back.
  const scaleX = rect.width / layoutW;
  const scaleY = rect.height / layoutH;

  const style = getComputedStyle(parent);
  const baseFontSize = parseFloat(style.fontSize) || 16;

  const lineProbe = document.createElement('div');
  lineProbe.style.font = style.font;
  lineProbe.style.fontFamily = 'monospace';
  lineProbe.style.fontSize = `${baseFontSize}px`;
  lineProbe.style.lineHeight = '1';
  lineProbe.style.visibility = 'hidden';
  lineProbe.style.position = 'absolute';
  lineProbe.style.whiteSpace = 'pre';
  lineProbe.textContent = '0\n0';
  parent.appendChild(lineProbe);
  const lineBlockHeight = lineProbe.getBoundingClientRect().height || baseFontSize;
  const lineHeight = lineBlockHeight / 2 / scaleY;
  parent.removeChild(lineProbe);

  const fontSizePx = lineHeight + FILL_LINE_EXTRA_PX;
  const charWidth =
    measureMaxCharWidth(parent, style.font, fontSizePx, charSet) / scaleX;
  const width = Math.max(1, Math.floor(layoutW / charWidth));
  const height = Math.max(1, Math.floor(layoutH / fontSizePx));

  return { width, height, fontSizePx, charWidth };
}

export type AsciiWaveGridMetrics = {
  charWidth: number;
  lineHeight: number;
  cols: number;
  rows: number;
};

function clientToGridNorm(
  clientX: number,
  clientY: number,
  element: HTMLElement,
  _metrics: AsciiWaveGridMetrics
) {
  const rect = element.getBoundingClientRect();

  // Map in visual space (rect includes transforms). Metrics are layout-space;
  // under uniform scale, visual fraction == layout fraction across the element.
  const nx =
    rect.width > 0
      ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      : 0;
  const ny =
    rect.height > 0
      ? Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
      : 0;

  return { nx, ny };
}

function clampIndex(value: number, max: number) {
  return Math.max(0, Math.min(max, value));
}

function blendInteractionTint(
  baseColor: string,
  tintColor: string,
  interactionAmount: number,
  strength: number
) {
  const mix = Math.min(1, Math.abs(interactionAmount) * strength);
  if (mix <= 0.01) return baseColor;
  return `color-mix(in srgb, ${baseColor} ${Math.round((1 - mix) * 100)}%, ${tintColor})`;
}

function sampleInteractionOffset(
  x: number,
  y: number,
  canvas_width: number,
  canvas_height: number,
  interaction: AsciiWaveInteractionState | undefined,
  config: Required<AsciiWaveInteractionConfig>,
  now: number
) {
  if (!interaction) return 0;

  let offset = 0;
  const nx = x / canvas_width;
  const ny = y / canvas_height;

  if (interaction.pointer) {
    const dx = nx - interaction.pointer.nx;
    const dy = ny - interaction.pointer.ny;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const hoverRadius = interaction.pressed
      ? config.pressSwellRadius
      : config.hoverRadius;
    const hoverIntensity = interaction.pressed
      ? config.pressSwellIntensity
      : config.hoverIntensity;

    if (hoverRadius > 0 && dist < hoverRadius) {
      const falloff = 1 - dist / hoverRadius;
      offset += hoverIntensity * falloff * falloff;
    }
  }

  for (const ripple of interaction.ripples) {
    const dx = nx - ripple.nx;
    const dy = ny - ripple.ny;
    const dist = Math.sqrt(dx * dx + dy * dy);
    offset += sampleRippleOffset(dist, ripple, now, config);
  }

  return offset;
}

export type AsciiWaveAudioState = {
  bands: number[];
  isActive: boolean;
  /** Monotonic forward depth shift in charset layer units (voice mode). */
  depthBias?: number;
};

export type AsciiWaveAudioRef = MutableRefObject<AsciiWaveAudioState>;

export type AsciiWaveAudioConfig = {
  /** Scales how much FFT bands push charset depth layers. */
  depthIntensity?: number;
  /** Gaussian σ — tightness of band-to-layer coupling. */
  resonanceWidth?: number;
  /** Ignore band energy below this (0–1). */
  bandFloor?: number;
  /** Map each band index to a charset depth center (for EQ bands ≠ layer count). */
  bandLayerCenters?: number[];
};

type ResolvedAsciiWaveAudioConfig = {
  depthIntensity: number;
  resonanceWidth: number;
  bandFloor: number;
  bandLayerCenters: number[] | null;
};

const DEFAULT_AUDIO_CONFIG: ResolvedAsciiWaveAudioConfig = {
  depthIntensity: 1.1,
  resonanceWidth: 1,
  bandFloor: 0.04,
  bandLayerCenters: null,
};

function resolveAudioConfig(
  config?: AsciiWaveAudioConfig
): ResolvedAsciiWaveAudioConfig {
  return {
    ...DEFAULT_AUDIO_CONFIG,
    ...config,
    bandLayerCenters: config?.bandLayerCenters ?? null,
  };
}

function sampleAudioDepthOffset(
  cellValue: number,
  audio: AsciiWaveAudioState | null | undefined,
  config: ResolvedAsciiWaveAudioConfig
) {
  if (!audio?.isActive || !audio.bands.length) return 0;

  const { bands } = audio;
  const sigma = config.resonanceWidth;
  const invTwoSigmaSq = 1 / (2 * sigma * sigma);
  let offset = audio.depthBias ?? 0;

  for (let i = 0; i < bands.length; i++) {
    const level = bands[i] ?? 0;
    if (level < config.bandFloor) continue;

    const layerCenter = config.bandLayerCenters?.[i] ?? i;
    const dist = cellValue - layerCenter;
    const resonance = Math.exp(-dist * dist * invTwoSigmaSq);
    offset += level * resonance * config.depthIntensity;
  }

  return offset;
}

export type AsciiWaveVisualMode = 'ascii' | 'debug';

export type AsciiWaveInteractiveProps = {
  width?: number;
  height?: number;
  fill?: boolean;
  charSet?: string;
  max?: number;
  FRAMES?: number;
  BLUR_STEPS?: number;
  from?: number;
  to?: number;
  goBack?: boolean;
  ease?: (t: number) => number;
  /** Per charset index — enables multi-color in a single layer. */
  charColors?: string[];
  interactionRef?: AsciiWaveInteractionRef;
  interactionConfig?: AsciiWaveInteractionConfig;
  audioRef?: AsciiWaveAudioRef;
  audioConfig?: AsciiWaveAudioConfig;
  /** `debug` renders a depth heatmap instead of characters (FFT tuning). */
  visualMode?: AsciiWaveVisualMode;
  /** Debug heatmap: high depth → dark (useful when voice pushes charset forward). */
  debugInvertDepth?: boolean;
  /** When set, interaction ripples/swells tint cells toward this color (e.g. pink rings on blue paint). */
  interactionTintColor?: string;
  /** How strongly interaction offset blends into `interactionTintColor` (default 0.72). */
  interactionTintStrength?: number;
  /**
   * Animation speed multiplier read each frame (1 = full speed, 0 = frozen / paused).
   * When ≤ 0 the rAF loop stops so the frozen frame costs almost nothing.
   */
  speedRef?: MutableRefObject<number>;
  /**
   * `window` tracks the pointer globally while keeping the canvas non-interactive
   * for hit-testing (useful as a page background).
   */
  pointerTarget?: 'element' | 'window';
  className?: string;
  style?: CSSProperties;
};

function AsciiWaveInteractive({
  width = 200,
  height = 80,
  fill = false,
  charSet = ' ░▒▓█▀▄'.split('').reverse().join(''),
  max: maxProp,
  FRAMES = 6000,
  BLUR_STEPS = 15,
  from = 0,
  to,
  goBack = true,
  ease = ease_sin,
  charColors,
  interactionRef,
  interactionConfig,
  audioRef,
  audioConfig,
  visualMode = 'ascii',
  debugInvertDepth = false,
  interactionTintColor,
  interactionTintStrength = 0.72,
  speedRef,
  pointerTarget = 'element',
  className = '',
  style,
}: AsciiWaveInteractiveProps) {
  const resolvedInteractionConfig = useMemo(
    () => resolveInteractionConfig(interactionConfig),
    [interactionConfig]
  );
  const resolvedAudioConfig = useMemo(
    () => resolveAudioConfig(audioConfig),
    [audioConfig]
  );
  const noiseMax = maxProp ?? Math.max(1, charSet.length * 2 - 2);
  const charTo = to ?? charSet.length - 1;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [measureRef, bounds] = useMeasure({ scroll: false });
  const containerWidth = bounds.width;
  const containerHeight = bounds.height;
  const gridMetricsRef = useRef<AsciiWaveGridMetrics>({
    charWidth: 1,
    lineHeight: 1,
    cols: 1,
    rows: 1,
  });
  const lastRippleAtRef = useRef(0);

  useEffect(() => {
    const round = Math.round;
    const floor = Math.floor;
    const min = Math.min;
    const max = Math.max;
    const random = (a?: number | unknown[], b?: number) => {
      if (Array.isArray(a)) return a[floor(Math.random() * a.length)];
      if (a == null) return Math.random();
      if (b == null) return Math.random() * a;
      return a < b ? Math.random() * (b - a) + a : Math.random() * (a - b) + b;
    };
    const map = (val: number, s1: number, e1: number, s2: number, e2: number) =>
      ((val - s1) / (e1 - s1)) * (e2 - s2) + s2;

    const parent = containerRef.current;
    if (!parent) return;
    const canvasParent: HTMLDivElement = parent;

    const { width: gridWidth, height: gridHeight, fontSizePx, charWidth } = fill
      ? measureGridSize(canvasParent, width, height, charSet)
      : { width, height, fontSizePx: null, charWidth: null };

    if (fontSizePx != null) {
      canvasParent.style.fontSize = `${fontSizePx}px`;
      canvasParent.style.lineHeight = '1';
    }

    if (charWidth != null && fontSizePx != null) {
      gridMetricsRef.current = {
        charWidth,
        lineHeight: fontSizePx,
        cols: gridWidth,
        rows: gridHeight,
      };
    }

    let ascii: string[][] = [];
    let display_idx: number[][] = [];
    let debug_interaction: number[][] = [];
    let debug_audio: number[][] = [];
    let canvas_width = gridWidth;
    let canvas_height = gridHeight;
    let wave_map: FrameLoop[][] = [];
    let running = true;
    let advanceAccum = 0;

    function render_frame() {
      if (visualMode === 'debug') {
        render_debug();
        return;
      }
      render_ascii();
    }

    function render_debug() {
      const cw = gridMetricsRef.current.charWidth;
      const lh = gridMetricsRef.current.lineHeight;
      const depthSteps = charSet.length;

      canvasParent.replaceChildren();
      canvasParent.style.fontSize = '';
      canvasParent.style.lineHeight = '';

      const wrap = document.createElement('div');
      wrap.style.position = 'relative';
      wrap.style.width = '100%';
      wrap.style.height = '100%';
      wrap.style.background = '#050505';

      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          const idx = clampIndex(
            display_idx[y]?.[x] ?? 0,
            charSet.length - 1
          );
          const colorIdx = debugInvertDepth ? charSet.length - 1 - idx : idx;
          const t =
            depthSteps > 1 ? colorIdx / (depthSteps - 1) : 0;
          const interactionAmt = debug_interaction[y]?.[x] ?? 0;
          const audioAmt = debug_audio[y]?.[x] ?? 0;

          const cell = document.createElement('div');
          cell.style.position = 'absolute';
          cell.style.left = `${x * cw}px`;
          cell.style.top = `${y * lh}px`;
          cell.style.width = `${cw}px`;
          cell.style.height = `${lh}px`;
          cell.style.boxSizing = 'border-box';

          if (charColors?.length) {
            cell.style.backgroundColor =
              charColors[colorIdx] ??
              charColors[charColors.length - 1] ??
              '#002a8a';
          } else {
            const lightness = 12 + t * 58;
            cell.style.backgroundColor = `hsl(220 85% ${lightness}%)`;
          }

          if (interactionAmt > 0.02) {
            const ringAlpha = Math.min(1, Math.abs(interactionAmt) * 0.85);
            if (interactionTintColor) {
              cell.style.boxShadow = `inset 0 0 0 1px color-mix(in srgb, transparent ${Math.round((1 - ringAlpha) * 100)}%, ${interactionTintColor})`;
            } else {
              cell.style.boxShadow = `inset 0 0 0 1px rgba(255, 220, 120, ${ringAlpha})`;
            }
          }
          if (Math.abs(audioAmt) > 0.02) {
            cell.style.outline = `1px solid rgba(120, 200, 255, ${Math.min(1, Math.abs(audioAmt) * 0.9)})`;
          }

          wrap.appendChild(cell);
        }
      }

      canvasParent.appendChild(wrap);
    }

    function render_ascii() {
      const interaction = interactionRef?.current;

      if (!charColors?.length) {
        canvasParent.textContent = ascii.map((row) => row.join('')).join('\n');
        return;
      }

      canvasParent.replaceChildren();
      const fragment = document.createDocumentFragment();

      for (let y = 0; y < canvas_height; y++) {
        const rowEl = document.createElement('div');
        rowEl.style.lineHeight = '1';
        rowEl.style.whiteSpace = 'pre';

        for (let x = 0; x < canvas_width; x++) {
          const idx = clampIndex(
            display_idx[y]?.[x] ?? round(wave_map[y][x].value),
            charSet.length - 1
          );
          const span = document.createElement('span');
          span.textContent = ascii[y][x];
          const baseColor =
            charColors[idx] ?? charColors[charColors.length - 1] ?? '';
          const interactionAmt = debug_interaction[y]?.[x] ?? 0;
          span.style.color =
            interactionTintColor != null
              ? blendInteractionTint(
                  baseColor,
                  interactionTintColor,
                  interactionAmt,
                  interactionTintStrength
                )
              : baseColor;
          rowEl.appendChild(span);
        }

        fragment.appendChild(rowEl);
      }

      canvasParent.appendChild(fragment);
    }

    function create_layer() {
      const layer: number[][] = [];
      for (let y = 0; y < canvas_height; y++) {
        layer.push(new Array(canvas_width).fill(0));
      }
      return layer;
    }

    function setup() {
      ascii = [];
      display_idx = [];
      debug_interaction = [];
      debug_audio = [];
      for (let y = 0; y < canvas_height; y++) {
        ascii.push(' '.repeat(canvas_width).split(''));
        display_idx.push(new Array(canvas_width).fill(0));
        debug_interaction.push(new Array(canvas_width).fill(0));
        debug_audio.push(new Array(canvas_width).fill(0));
      }

      const noise = create_layer();
      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          noise[y][x] = random(noiseMax) as number;
        }
      }

      for (let step = 0; step < BLUR_STEPS; step++) {
        for (let y = 0; y < canvas_height; y++) {
          for (let x = 0; x < canvas_width; x++) {
            const value = noise[y][x];
            const left = noise[y][x > 0 ? x - 1 : x];
            const right = noise[y][x < canvas_width - 1 ? x + 1 : x];
            const top = noise[y > 0 ? y - 1 : y][x];
            const bottom = noise[y < canvas_height - 1 ? y + 1 : y][x];
            const tl = noise[y > 0 && x > 0 ? y - 1 : y][x > 0 ? x - 1 : x];
            const tr =
              noise[y > 0 && x < canvas_width - 1 ? y - 1 : y][
                x < canvas_width - 1 ? x + 1 : x
              ];
            const bl =
              noise[y < canvas_height - 1 && x > 0 ? y + 1 : y][
                x > 0 ? x - 1 : x
              ];
            const br =
              noise[y < canvas_height - 1 && x < canvas_width - 1 ? y + 1 : y][
                x < canvas_width - 1 ? x + 1 : x
              ];
            noise[y][x] =
              (value + left + right + top + bottom + tl + tr + bl + br) / 9;
          }
        }
      }

      let val_min = Infinity;
      let val_max = -Infinity;
      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          val_min = min(val_min, noise[y][x]);
          val_max = max(val_max, noise[y][x]);
        }
      }

      wave_map = [];
      for (let y = 0; y < canvas_height; y++) {
        const row: FrameLoop[] = [];
        for (let x = 0; x < canvas_width; x++) {
          const value = floor(map(noise[y][x], val_min, val_max, 0, FRAMES));
          const loop = new FrameLoop(FRAMES, from, charTo, goBack, ease);
          loop.set(value);
          row.push(loop);
        }
        wave_map.push(row);
      }

      render_frame();
    }

    function draw() {
      const interaction = interactionRef?.current;
      const now = performance.now();

      if (interaction) {
        interaction.ripples = interaction.ripples.filter((ripple) => {
          const radius = rippleRadiusAt(
            ripple,
            now,
            resolvedInteractionConfig.rippleVelocity
          );
          return radius <= resolvedInteractionConfig.rippleMaxRadius + 0.08;
        });
      }

      const speed = Math.max(0, speedRef?.current ?? 1);
      advanceAccum += speed;
      const advanceSteps = Math.floor(advanceAccum);
      advanceAccum -= advanceSteps;

      for (let y = 0; y < canvas_height; y++) {
        for (let x = 0; x < canvas_width; x++) {
          const interactionOffset = sampleInteractionOffset(
            x,
            y,
            canvas_width,
            canvas_height,
            interaction ?? undefined,
            resolvedInteractionConfig,
            now
          );
          const audioOffset = sampleAudioDepthOffset(
            wave_map[y][x].value,
            audioRef?.current,
            resolvedAudioConfig
          );
          const base = wave_map[y][x].value + interactionOffset + audioOffset;
          const idx = clampIndex(round(base), charSet.length - 1);
          display_idx[y][x] = idx;
          debug_interaction[y][x] = interactionOffset;
          debug_audio[y][x] = audioOffset;
          ascii[y][x] = charSet[idx] ?? ' ';
          for (let step = 0; step < advanceSteps; step++) {
            wave_map[y][x].inc();
          }
        }
      }
      render_frame();
    }

    setup();

    let rafId = 0;
    let isLooping = false;

    function isPaused() {
      return (speedRef?.current ?? 1) <= 0;
    }

    function loop() {
      if (!running) return;
      if (isPaused()) {
        isLooping = false;
        rafId = 0;
        return;
      }
      isLooping = true;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function ensureLoop() {
      if (!running || isLooping || isPaused()) return;
      isLooping = true;
      rafId = requestAnimationFrame(loop);
    }

    ensureLoop();

    // Cheap wake poll while paused — no draw cost until speed > 0 again.
    const wakeId = window.setInterval(() => {
      if (!running) return;
      ensureLoop();
    }, 200);

    return () => {
      running = false;
      isLooping = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.clearInterval(wakeId);
      canvasParent.replaceChildren();
      if (fontSizePx != null) {
        canvasParent.style.fontSize = '';
        canvasParent.style.lineHeight = '';
      }
    };
  }, [
    fill,
    width,
    height,
    containerWidth,
    containerHeight,
    charSet,
    noiseMax,
    FRAMES,
    BLUR_STEPS,
    from,
    charTo,
    goBack,
    ease,
    charColors,
    visualMode,
    debugInvertDepth,
    interactionTintColor,
    interactionTintStrength,
    resolvedInteractionConfig,
    resolvedAudioConfig,
    // interactionRef / audioRef identity stable; read .current each frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    interactionRef,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    audioRef,
    // speedRef identity stable; read .current each frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    speedRef,
  ]);

  const interactive = Boolean(interactionRef);
  const useWindowPointer = interactive && pointerTarget === 'window';

  const addRipple = (nx: number, ny: number, strength: number) => {
    pushAsciiWaveRipple(interactionRef, nx, ny, strength);
  };

  useEffect(() => {
    if (!useWindowPointer || !interactionRef) return;

    const resolveNorm = (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return null;
      return clientToGridNorm(
        clientX,
        clientY,
        el,
        gridMetricsRef.current
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!interactionRef.current) return;
      const norm = resolveNorm(event.clientX, event.clientY);
      if (!norm) return;
      interactionRef.current.pointer = norm;

      if (!interactionRef.current.pressed || event.buttons === 0) return;
      const now = performance.now();
      if (now - lastRippleAtRef.current < 120) return;
      lastRippleAtRef.current = now;
      addRipple(norm.nx, norm.ny, 0.85);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!interactionRef.current) return;
      if (event.button !== 0) return;
      interactionRef.current.pressed = true;
      const norm = resolveNorm(event.clientX, event.clientY);
      if (!norm) return;
      interactionRef.current.pointer = norm;
      addRipple(norm.nx, norm.ny, 1.25);
    };

    const clearPointer = () => {
      if (!interactionRef.current) return;
      interactionRef.current.pointer = null;
      interactionRef.current.pressed = false;
    };

    const handlePointerUp = () => {
      if (!interactionRef.current) return;
      interactionRef.current.pressed = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', clearPointer);
    window.addEventListener('blur', clearPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', clearPointer);
      window.removeEventListener('blur', clearPointer);
      clearPointer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useWindowPointer, interactionRef]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactionRef?.current || useWindowPointer) return;
    const { nx, ny } = clientToGridNorm(
      event.clientX,
      event.clientY,
      event.currentTarget,
      gridMetricsRef.current
    );
    interactionRef.current.pointer = { nx, ny };

    if (!interactionRef.current.pressed || event.buttons === 0) return;
    const now = performance.now();
    if (now - lastRippleAtRef.current < 120) return;
    lastRippleAtRef.current = now;
    addRipple(nx, ny, 0.85);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactionRef?.current || useWindowPointer) return;
    interactionRef.current.pressed = true;
    const { nx, ny } = clientToGridNorm(
      event.clientX,
      event.clientY,
      event.currentTarget,
      gridMetricsRef.current
    );
    interactionRef.current.pointer = { nx, ny };
    addRipple(nx, ny, 1.25);
  };

  const clearPointer = () => {
    if (!interactionRef?.current) return;
    interactionRef.current.pointer = null;
    interactionRef.current.pressed = false;
  };

  const elementInteractive = interactive && !useWindowPointer;

  return (
    <motion.div
      ref={(node) => {
        containerRef.current = node;
        measureRef(node);
      }}
      className={cn(
        'h-full w-full select-none leading-none text-base text-white/20',
        elementInteractive ? 'pointer-events-auto touch-none' : 'pointer-events-none',
        className
      )}
      style={{ whiteSpace: 'pre', fontFamily: 'monospace', lineHeight: 1, ...style }}
      onPointerMove={elementInteractive ? handlePointerMove : undefined}
      onPointerDown={elementInteractive ? handlePointerDown : undefined}
      onPointerUp={elementInteractive ? () => {
        if (interactionRef?.current) interactionRef.current.pressed = false;
      } : undefined}
      onPointerLeave={elementInteractive ? clearPointer : undefined}
      onPointerCancel={elementInteractive ? clearPointer : undefined}
    />
  );
}

export default React.memo(AsciiWaveInteractive);
