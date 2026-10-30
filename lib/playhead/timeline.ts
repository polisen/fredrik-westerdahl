/** Scroll pixels in → named 0–1 ratios out. */

export type BeatId = 'identity' | 'work' | 'footer'

type BeatDef = { id: BeatId; weight: number; pixelBased?: boolean }

export type Range = {
  id: BeatId
  ratio: number
  isActive: boolean
  from: number
  to: number
}

export type PagePixels = Partial<Record<BeatId, number>>

const BEATS: BeatDef[] = [
  { id: 'identity', weight: 0, pixelBased: true },
  { id: 'work', weight: 0, pixelBased: true },
  { id: 'footer', weight: 0, pixelBased: true },
]

export class Timeline {
  ranges: Range[] = BEATS.map((b) => ({
    id: b.id,
    ratio: 0,
    isActive: false,
    from: 0,
    to: 0,
  }))

  layout(totalPixels: number, pagePixels: PagePixels = {}) {
    const pages = { identity: 0, work: 0, footer: 0, ...pagePixels }
    const weighted = BEATS.filter((b) => !b.pixelBased)
    const weight = weighted.reduce((s, b) => s + b.weight, 0)
    const leftover = Math.max(
      0,
      totalPixels - pages.identity - pages.work - pages.footer
    )
    let cursor = 0

    this.ranges.forEach((range, i) => {
      const def = BEATS[i]
      const span = def.pixelBased
        ? pages[def.id]
        : weight > 0
          ? leftover * (def.weight / weight)
          : 0
      range.from = cursor
      range.to = cursor + span
      cursor = range.to
    })
  }

  update(scroll: number) {
    for (const range of this.ranges) {
      const span = range.to - range.from
      range.ratio = span > 0 ? (scroll - range.from) / span : 0
      range.isActive = range.ratio >= 0 && range.ratio < 1
    }
  }

  get(id: BeatId): Range {
    return this.ranges.find((r) => r.id === id)!
  }

  get active(): Range {
    return this.ranges.find((r) => r.isActive) ?? this.ranges[this.ranges.length - 1]
  }
}
