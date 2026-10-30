type ArticleHeaderProps = {
  entryTitle: string
  author: string
  date: string
}

/** Left-aligned entry title + byline — not the centered site chrome. */
export function ArticleHeader({ entryTitle, author, date }: ArticleHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10">
      <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.5rem]">
        {entryTitle}
      </h1>
      <p className="mt-4 text-xl text-black sm:text-2xl">
        {author}, {date}
      </p>
    </header>
  )
}
