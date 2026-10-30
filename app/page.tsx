import { ArticleHeader } from '@/components/entropy/ArticleHeader'
import { EssayBody } from '@/components/entropy/EssayBody'
import { EssayShell } from '@/components/entropy/EssayShell'
import { NextInSeries } from '@/components/entropy/NextInSeries'
import { Toc } from '@/components/entropy/Toc'
import { articles, introduction, SITE } from '@/lib/entropy/content'

export default function EntropyHomePage() {
  const next = articles[0]

  return (
    <EssayShell currentHref="/">
      <ArticleHeader
        entryTitle={introduction.title}
        author={SITE.author}
        date={introduction.date}
      />
      <EssayBody sections={introduction.body} />
      <Toc currentHref="/" />
      {next ? <NextInSeries next={next} /> : null}
    </EssayShell>
  )
}
