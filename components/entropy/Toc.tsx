import Link from 'next/link'
import { articles, introduction } from '@/lib/entropy/content'

type TocProps = {
  currentHref: string
}

export function Toc({ currentHref }: TocProps) {
  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Table of Contents</h2>
      <p className="mb-8 text-lg leading-relaxed">
        Each essay is meant to stand on its own, though I’d strongly encourage
        reading through.
      </p>
      <ol className="flex list-none flex-col gap-5 p-0">
        <li>
          <Link href="/" className="group block space-y-1 text-black no-underline">
            <span className="text-lg leading-snug group-hover:underline underline-offset-4 sm:text-xl">
              {introduction.title}
              {currentHref === '/' ? (
                <>
                  {' '}
                  <span className="text-black/45">[this page]</span>
                </>
              ) : null}
            </span>
            <span className="block text-base leading-relaxed text-black/65">
              {introduction.blurb}
            </span>
          </Link>
        </li>
        {articles.map((article) => (
          <li key={article.href}>
            <Link
              href={article.href}
              className="group block space-y-1 text-black no-underline"
            >
              <span className="text-lg leading-snug group-hover:underline underline-offset-4 sm:text-xl">
                {article.title}
                {currentHref === article.href ? (
                  <>
                    {' '}
                    <span className="text-black/45">[this page]</span>
                  </>
                ) : null}
              </span>
              <span className="block text-base leading-relaxed text-black/65">
                {article.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
