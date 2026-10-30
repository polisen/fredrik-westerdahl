'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useMotionValue, type MotionValue } from 'motion/react'
import { ScrollPane } from '@/lib/playhead/scroll'
import { Timeline } from '@/lib/playhead/timeline'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { ScrollRail } from './ScrollRail'

type PlayheadContextValue = {
  progress: MotionValue<number>
  scroll: MotionValue<number>
  max: MotionValue<number>
  view: MotionValue<number>
}

const PlayheadContext = createContext<PlayheadContextValue | null>(null)

export function usePlayhead() {
  const ctx = useContext(PlayheadContext)
  if (!ctx) {
    throw new Error('usePlayhead must be used within Playhead')
  }
  return ctx
}

export function usePlayheadOptional() {
  return useContext(PlayheadContext)
}

function outerHeight(el: HTMLElement) {
  const style = getComputedStyle(el)
  return (
    el.offsetHeight +
    parseFloat(style.marginTop) +
    parseFloat(style.marginBottom)
  )
}

export function Playhead({
  children,
  atmosphere,
}: {
  children: ReactNode
  atmosphere?: ReactNode
}) {
  const rulerRef = useRef<HTMLDivElement>(null)
  const paneRef = useRef<ScrollPane | null>(null)
  const timelineRef = useRef(new Timeline())
  const progress = useMotionValue(0)
  const scrollMv = useMotionValue(0)
  const maxMv = useMotionValue(0)
  const viewMv = useMotionValue(1)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const ruler = rulerRef.current
    if (!ruler) return

    const pane = new ScrollPane(ruler)
    paneRef.current = pane
    const timeline = timelineRef.current
    const html = document.documentElement
    html.classList.add('playhead-lock')

    const layout = () => {
      const view = window.innerHeight
      const identity = ruler.querySelector<HTMLElement>('[data-beat="identity"]')
      const work = ruler.querySelector<HTMLElement>('[data-beat="work"]')
      const footer = ruler.querySelector<HTMLElement>('[data-beat="footer"]')
      const content =
        (identity ? outerHeight(identity) : 0) +
        (work ? outerHeight(work) : 0) +
        (footer ? outerHeight(footer) : 0)
      pane.resize(view, content)
      viewMv.set(view)
      maxMv.set(pane.max)
      timeline.layout(pane.max, {
        identity: identity ? outerHeight(identity) : 0,
        work: work ? outerHeight(work) : 0,
        footer: footer ? outerHeight(footer) : 0,
      })
    }

    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(ruler)
    window.addEventListener('resize', layout)

    let last = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      pane.update(dt, prefersReducedMotion)
      timeline.update(pane.scroll)
      progress.set(pane.progress)
      scrollMv.set(pane.scroll)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', layout)
      pane.dispose()
      paneRef.current = null
      html.classList.remove('playhead-lock')
    }
  }, [prefersReducedMotion, progress, scrollMv, maxMv, viewMv])

  return (
    <PlayheadContext.Provider
      value={{ progress, scroll: scrollMv, max: maxMv, view: viewMv }}
    >
      {atmosphere}
      <div
        ref={rulerRef}
        id="playhead-ruler"
        className="relative z-10 w-full will-change-transform"
      >
        {children}
      </div>
      <ScrollRail />
    </PlayheadContext.Provider>
  )
}
