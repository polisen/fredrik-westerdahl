'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValueEvent, useTransform } from 'motion/react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { usePlayhead } from '@/components/playhead/Playhead'
import AsciiWaveInteractive, {
  type AsciiWaveInteractionConfig,
  type AsciiWaveInteractionState,
} from '@/components/art4/AsciiWaveInteractive'
import { artTheme } from '@/lib/artTheme'

const ART4_FRAMES = 3000
const ART4_CHAR_SET = '●◉◎◯◦○◌◍•∙· '
const ART4_INTERACTION: AsciiWaveInteractionConfig = {
  rippleVelocity: 0.42,
  rippleMaxRadius: 1.05,
  rippleRingWidth: 0.13,
  rippleIntensity: 0.55,
  rippleWavelength: 14,
  rippleTrail: 1.15,
  hoverRadius: 0.2,
  hoverIntensity: 0.4,
  pressSwellRadius: 0,
  pressSwellIntensity: 0,
}

function ease_quad_in_out(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function buildCharColors(charSet: string, start: string, end: string) {
  const len = charSet.length
  if (len <= 1) return [start]

  return Array.from({ length: len }, (_, i) => {
    const t = i / (len - 1)
    return `color-mix(in srgb, ${start} ${Math.round((1 - t) * 100)}%, ${end})`
  })
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

/** Home background: the ASCII field, bleached to near-white. */
export function VideoBackground() {
  const { progress } = usePlayhead()
  const prefersReducedMotion = useReducedMotion()

  const interactionRef = useRef<AsciiWaveInteractionState>({
    ripples: [],
    pointer: null,
    pressed: false,
  })
  const speedRef = useRef(1)
  const animPausedRef = useRef(false)

  const charColors = useMemo(
    () => buildCharColors(ART4_CHAR_SET, artTheme.secondary, artTheme.secondarySoft),
    []
  )

  const pauseAt = 0.92
  const resumeAt = 0.78

  const applyPlayback = useCallback(
    (p: number, hidden = typeof document !== 'undefined' && document.hidden) => {
      if (prefersReducedMotion) {
        animPausedRef.current = true
        speedRef.current = 0
        return
      }

      if (hidden) {
        speedRef.current = 0
        return
      }

      if (animPausedRef.current) {
        if (p <= resumeAt) {
          animPausedRef.current = false
          speedRef.current = Math.min(1, Math.max(0.08, 1 - p))
        } else {
          speedRef.current = 0
        }
        return
      }

      if (p >= pauseAt) {
        animPausedRef.current = true
        speedRef.current = 0
        return
      }

      speedRef.current = Math.min(1, Math.max(0.08, 1 - p))
    },
    [prefersReducedMotion, pauseAt, resumeAt]
  )

  useMotionValueEvent(progress, 'change', (p) => {
    applyPlayback(clamp01(p))
  })

  useEffect(() => {
    const sync = () => applyPlayback(clamp01(progress.get()))
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [applyPlayback, progress])

  const blurPx = useTransform(progress, [0, 1], [0, 18])
  const blurFilter = useTransform(blurPx, (v) => `blur(${v.toFixed(2)}px)`)

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40"
      style={{
        transform: 'scale(1.05)',
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
        interactionTintColor={artTheme.tertiary}
        interactionTintStrength={0.28}
        interactionRef={interactionRef}
        interactionConfig={ART4_INTERACTION}
          visualMode="debug"
          debugInvertDepth
          debugClearColor="#ffffff"
        speedRef={speedRef}
        pointerTarget="window"
        cellScale={0.55}
        className="opacity-80"
      />
    </motion.div>
  )
}
