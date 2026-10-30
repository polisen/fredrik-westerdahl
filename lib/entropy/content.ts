export type EssaySection = {
  heading?: string
  paragraphs: string[]
}

export type Article = {
  slug: string
  title: string
  blurb: string
  date: string
  href: string
  body: EssaySection[]
}

export const SITE = {
  brand: 'Entropy Management',
  description: 'design notes by Fredrik Westerdahl',
  author: 'Fredrik Westerdahl',
  date: 'October 2026',
} as const

const stubBody = (opening: string): EssaySection[] => [
  {
    paragraphs: [
      opening,
      'This essay is a placeholder — a named slot while the real argument is still being written.',
    ],
  },
]

const draft = (
  partial: Omit<Article, 'href' | 'date'>,
): Article => ({
  ...partial,
  date: SITE.date,
  href: `/a/${partial.slug}`,
})

/** Flat article list — no series, no numbers. First after Introduction. */
export const articles: Article[] = [
  draft({
    slug: 'designing-for-humanity-in-the-age-of-ai',
    title: 'Designing for Humanity in the Age of AI',
    blurb: 'Keep the human in the loop — not as decoration, as the point.',
    body: stubBody(
      'When machines can draft, decide, and deliver, design’s job is no longer to make the system impressive. It is to keep people oriented, accountable, and able to refuse.',
    ),
  }),
  draft({
    slug: 'counting-the-agents',
    title: 'Counting the Agents',
    blurb: 'How many non-human workers are already on the payroll?',
    body: stubBody(
      'Organizations are filling seats with systems that never clock out. Before strategy, you need a headcount that includes the machines.',
    ),
  }),
  draft({
    slug: 'the-operator-problem',
    title: 'The Operator Problem',
    blurb: 'Who steers when the model is faster than the meeting?',
    body: stubBody(
      'AI does not remove management — it relocates it. Someone still has to set the brief, read the failure, and own the consequence.',
    ),
  }),
  draft({
    slug: 'automation-without-abdication',
    title: 'Automation Without Abdication',
    blurb: 'Hand off the labor. Keep the accountability.',
    body: stubBody(
      'The tempting move is to treat a successful demo as a settled process. The durable move is to keep a human on the hook for what the automaton ships.',
    ),
  }),
  draft({
    slug: 'lab-to-ledger',
    title: 'From Lab to Ledger',
    blurb: 'Prototype energy dies in production unless you design for the books.',
    body: stubBody(
      'Pilot projects love novelty. Companies love margins. The gap between them is where most AI efforts go quiet.',
    ),
  }),
  draft({
    slug: 'the-attention-commons',
    title: 'The Attention Commons',
    blurb: 'Creativity starts where interruption ends.',
    body: stubBody(
      'Feeds treat attention as inventory. Practice treats it as habitat. The future of making depends on which metaphor wins.',
    ),
  }),
  draft({
    slug: 'taste-after-abundance',
    title: 'Taste After Abundance',
    blurb: 'When anyone can generate, judgment becomes the craft.',
    body: stubBody(
      'Scarcity used to live in production. Now it lives in selection. Taste is the scarce instrument.',
    ),
  }),
  draft({
    slug: 'tools-with-opinions',
    title: 'Tools With Opinions',
    blurb: 'Neutral software is a myth. Creative tools already argue with you.',
    body: stubBody(
      'Every interface encodes a theory of good work. The question is whether that theory matches yours — and whether you can feel the disagreement.',
    ),
  }),
  draft({
    slug: 'publishing-as-practice',
    title: 'Publishing as Practice',
    blurb: 'Release is how creative systems stay honest.',
    body: stubBody(
      'Unshipped archives accumulate entropy. A public artifact forces the work to meet reality — and forces you to meet it too.',
    ),
  }),
]

export const introduction = {
  href: '/',
  title: 'Introduction',
  blurb: 'Most of the work that matters is deciding what not to let scatter.',
  date: SITE.date,
  body: [
    {
      paragraphs: [
        'Most of the work that matters is not invention. It is deciding what not to let scatter.',
        'Entropy Management is a set of design notes on building under noise — with machines, products, and creative practice.',
        'These essays are meant to stand alone. Reading them in order is still encouraged.',
      ],
    },
  ] satisfies EssaySection[],
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getNextArticle(current: Article): Article | undefined {
  const i = articles.findIndex((a) => a.slug === current.slug)
  if (i < 0 || i >= articles.length - 1) return undefined
  return articles[i + 1]
}

/** Nav + reading order: introduction first, then articles. */
export function getNavItems(): { href: string; label: string }[] {
  return [
    { href: introduction.href, label: introduction.title },
    ...articles.map((a) => ({ href: a.href, label: a.title })),
  ]
}
