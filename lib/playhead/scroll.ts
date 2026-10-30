/** Virtual scroll. The only number the rest of the home surface is allowed to read. */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export class ScrollPane {
  /** Current playhead, in pixels. */
  scroll = 0
  target = 0
  max = 0
  view = 1
  enabled = true
  lastDir = 1

  private wheeling = false
  private wheelTimer = 0
  private touchY: number | null = null
  private readonly lerp = 12

  constructor(private ruler: HTMLElement) {
    window.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('keydown', this.onKey, { passive: false })
    window.addEventListener('touchstart', this.onTouchStart, { passive: true })
    window.addEventListener('touchmove', this.onTouchMove, { passive: false })
    window.addEventListener('touchend', this.onTouchEnd, { passive: true })
  }

  dispose() {
    window.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('keydown', this.onKey)
    window.removeEventListener('touchstart', this.onTouchStart)
    window.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('touchend', this.onTouchEnd)
  }

  resize(view: number, content: number) {
    this.view = view
    this.max = Math.max(0, content - view)
    this.scroll = clamp(this.scroll, 0, this.max)
    this.target = clamp(this.target, 0, this.max)
    this.apply()
  }

  update(dt: number, instant = false) {
    if (!this.enabled) return

    if (this.wheeling) {
      this.wheelTimer -= dt
      if (this.wheelTimer <= 0) this.wheeling = false
    }

    this.target = clamp(this.target, 0, this.max)
    if (instant) {
      this.scroll = this.target
    } else {
      this.scroll += (this.target - this.scroll) * (1 - Math.exp(-this.lerp * dt))
    }
    this.scroll = clamp(this.scroll, 0, this.max)
    this.apply()
  }

  get progress() {
    return this.max > 0 ? this.scroll / this.max : 0
  }

  private apply() {
    this.ruler.style.transform = `translate3d(0, ${-this.scroll}px, 0)`
  }

  private nudge(delta: number) {
    if (!this.enabled) return
    this.target += delta
    this.lastDir = Math.sign(delta) || this.lastDir
    this.wheeling = true
    this.wheelTimer = 0.18
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    this.nudge(e.deltaY + e.deltaX)
  }

  private onKey = (e: KeyboardEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target instanceof HTMLElement && e.target.isContentEditable)
    ) {
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault()
      this.nudge(e.key === 'PageDown' ? this.view * 0.85 : 120)
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      this.nudge(e.key === 'PageUp' ? -this.view * 0.85 : -120)
    }
    if (e.key === 'Home') {
      e.preventDefault()
      this.target = 0
    }
    if (e.key === 'End') {
      e.preventDefault()
      this.target = this.max
    }
  }

  private onTouchStart = (e: TouchEvent) => {
    this.touchY = e.touches[0]?.clientY ?? null
  }

  private onTouchMove = (e: TouchEvent) => {
    if (this.touchY == null) return
    const y = e.touches[0]?.clientY
    if (y == null) return
    e.preventDefault()
    this.nudge(this.touchY - y)
    this.touchY = y
  }

  private onTouchEnd = () => {
    this.touchY = null
  }
}
