import type { EssaySection } from '@/lib/entropy/content'

type EssayBodyProps = {
  sections: EssaySection[]
}

export function EssayBody({ sections }: EssayBodyProps) {
  return (
    <div className="space-y-6 text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
      {sections.map((section, i) => (
        <section key={i} className="space-y-4">
          {section.heading ? (
            <h2 className="pt-2 text-2xl font-bold sm:text-3xl">
              {section.heading}
            </h2>
          ) : null}
          {section.paragraphs.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </section>
      ))}
    </div>
  )
}
