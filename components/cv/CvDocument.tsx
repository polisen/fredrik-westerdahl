import { Footer } from '@/components/Footer'

const WORK = [
  {
    title: 'Sublink',
    role: 'Co-Founder & CTO',
    body: 'A funded platform for creators. Modular architecture under startup uncertainty — real-time collaboration, identity, and payments designed so the product could change without collapsing the system.',
  },
  {
    title: 'Circulose branding toolkit',
    role: 'Lead engineer',
    body: 'An embeddable system for a publicly traded textile company. Built to run at the point of purchase, millions of times a day, without cookies or harming host sites.',
  },
  {
    title: 'Lilla Auktionsstudion',
    role: 'Consultant & lead developer',
    body: 'A production auction house: live and online bidding, payments, sellers, and operations. Delivered complete under a tight budget by modeling the domain instead of stretching ecommerce.',
  },
  {
    title: 'Arbitrage platform',
    role: 'Sole architect and engineer',
    body: 'High-throughput ingestion of unstructured documents to surface time-sensitive market opportunities. Inference treated as infrastructure — cost, batching, and control as first-class problems.',
  },
  {
    title: 'Social graph',
    role: 'Data model and analysis',
    body: 'Markets read as relationships between people and communities, not funnels. Graph structure used to find influence and leverage that aggregates could not show.',
  },
] as const

export function CvDocument() {
  return (
    <>
      <section data-beat="identity" className="px-6 pt-28 sm:px-12 sm:pt-32 md:px-20 md:pt-36">
        <div className="max-w-[56rem] text-2xl leading-snug">
          <h1 className="text-5xl font-normal leading-snug">
            Fredrik Westerdahl
          </h1>
          <p className="mt-1">
            Senior Software Engineer, systems and architecture.
          </p>
          <p className="mt-5">
            End-to-end problem solver. I design, ship, and operate production
            systems under real technical, product, and business constraints.
          </p>
        </div>
      </section>

      <section data-beat="work" className="px-6 pt-8 pb-16 sm:px-12 md:px-20">
        <div className="max-w-[56rem] text-2xl leading-snug">
          <h2 className="text-3xl font-normal">Selected work</h2>
          <ol className="mt-4 flex flex-col gap-6">
            {WORK.map((item) => (
              <li key={item.title}>
                <h3 className="text-3xl font-normal">
                  {item.title}
                  <span className="text-black/55"> — {item.role}</span>
                </h3>
                <p className="mt-1">{item.body}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-8 text-3xl font-normal">How I work</h2>
          <p className="mt-2">
            I design around constraints: performance, cost, legal boundaries,
            and change. I own frontend and backend end-to-end. Analytics and
            feedback loops are part of the system. AI is infrastructure —
            observable, cost-aware, replaceable — not novelty.
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
