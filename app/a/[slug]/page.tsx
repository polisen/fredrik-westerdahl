import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleHeader } from '@/components/entropy/ArticleHeader'
import { EssayBody } from '@/components/entropy/EssayBody'
import { EssayShell } from '@/components/entropy/EssayShell'
import { NextInSeries } from '@/components/entropy/NextInSeries'
import {
  articles,
  getArticle,
  getNextArticle,
  SITE,
} from '@/lib/entropy/content'

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticle(params.slug)
  if (!article) return {}
  return {
    title: { absolute: `${article.title} — ${SITE.brand}` },
    description: article.blurb,
  }
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  const next = getNextArticle(article)

  return (
    <EssayShell currentHref={article.href}>
      <ArticleHeader
        entryTitle={article.title}
        author={SITE.author}
        date={article.date}
      />
      <EssayBody sections={article.body} />
      {next ? <NextInSeries next={next} /> : null}
    </EssayShell>
  )
}
