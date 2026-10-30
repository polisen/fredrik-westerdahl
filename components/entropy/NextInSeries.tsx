import Link from 'next/link'
import type { Article } from '@/lib/entropy/content'

type NextInSeriesProps = {
  next: Article
}

export function NextInSeries({ next }: NextInSeriesProps) {
  return (
    <p className="mt-14 text-right text-lg sm:mt-16 sm:text-xl">
      Next:
      <br />
      <Link
        href={next.href}
        className="italic text-black underline underline-offset-4"
      >
        {next.title}
      </Link>
    </p>
  )
}
