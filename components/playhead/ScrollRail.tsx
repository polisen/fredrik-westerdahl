'use client'

import { useEffect, useRef } from 'react'
import { usePlayhead } from './Playhead'

const MIN_THUMB = 0.2

/** Thin progress rail. Shows while the playhead is moving, then fades. */
export function ScrollRail() {
  const { progress, scroll, max, view } = usePlayhead()
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const bar = barRef.current
    if (!track || !bar) return

    let shown = 0
    let idle = 0
    let last = scroll.get()
    let frame = 0
    let prev = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const current = scroll.get()
      const moving = Math.abs(current - last) > 0.05
      last = current
      idle = moving ? 0 : idle + dt
      shown = Math.min(1, Math.max(0, shown + (idle < 0.5 ? 2 : -2) * dt))
      track.style.opacity = String(shown)

      const pages = max.get() / Math.max(view.get(), 1)
      const thumb = pages > 0 ? Math.max(MIN_THUMB, 1 / (1 + pages)) : 1
      const trackH = track.getBoundingClientRect().height || 1
      bar.style.height = `${trackH * thumb}px`
      bar.style.transform = `translate3d(0, ${trackH * progress.get() * (1 - thumb)}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [progress, scroll, max, view])

  return (
    <div
      ref={trackRef}
      aria-hidden
      className="pointer-events-none fixed right-4 top-[18vh] z-20 h-[64vh] w-px bg-black/10 opacity-0"
    >
      <div ref={barRef} className="w-px bg-black" />
    </div>
  )
}
