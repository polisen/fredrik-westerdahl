# Fredrik Westerdahl
**Portfolio & Professional Website**

End-to-end problem solver designing, shipping, and operating production systems.

---

## About

**Senior Software Engineer (Systems & Architecture)**

I design systems around constraints: performance, cost, legal boundaries, and change. I own frontend and backend execution end‑to‑end and treat analytics and feedback loops as core system components. AI is integrated as infrastructure—observable, cost‑aware, and replaceable—rather than novelty.

---

## Portfolio

Selected systems and platforms I've designed and delivered. Each case study is a concise, self-contained summary. Deeper technical and architectural thinking is expanded in related insights.

### Case Studies

1. **Sublink** — Co-Founder & CTO  
   Designing a modular SaaS architecture under startup uncertainty

2. **Arbitrage Platform** — High-throughput document analysis system  
   Designing cost-aware AI pipelines for large-scale document ingestion

3. **Social Graph** — Graph-based market and audience analysis  
   Modeling markets through graph-based relationships and influence

4. **Re:Newcell Toolkit** — High-scale embeddable web system  
   Embedding product education at scale under performance and legal constraints

5. **Lilla Auktionsstudion** — Domain-specific production platform  
   Shipping a production system under tight budget and domain constraints

---

## Project Overview

This repository contains a Next.js portfolio website that showcases case studies, insights, and creative work. The site uses Contentlayer for MDX-based content management, providing type-safe content at build time.

### Purpose

- Showcase selected case studies and projects
- Publish technical insights
- Display creative works
- Provide access to CV and professional information

### Content Structure

- **Case Studies** — 5 detailed project case studies with technical context, problems, decisions, and outcomes
- **Insights** — Deep-dive insights linked to specific case studies
- **Creative Works** — Creative projects and experiments
- **CV** — Professional curriculum vitae (PDF download)

---

## Technology Stack

### Frontend

- **React** — UI library
- **Next.js** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first CSS framework
- **Motion (Framer Motion) 11** — Animation library
- **Styled Components** — CSS-in-JS styling
- **Three.js** — 3D graphics library

### Backend & Infrastructure

- **Firebase** — Backend services
- **Google Cloud Platform** — Cloud infrastructure
- **Docker** — Containerization

### Data & APIs

- **GraphQL** — API query language
- **Neo4j / Cypher** — Graph database and query language
- **SQL** — Relational database queries

### Analytics & Observability

- **PostHog** — Product analytics
- **Mixpanel** — Event tracking and analytics
- **Sentry** — Error tracking and monitoring

### AI Systems

- **LLM APIs** — Large language model integrations
- **MCP (Model Context Protocol)** — AI system orchestration

---

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── insights/          # Insight listing and detail pages
│   ├── creative/          # Creative works page
│   ├── cv/                # CV download page
│   └── [slug]/            # Dynamic route handlers
├── components/            # React components
│   ├── 3d/               # 3D graphics components
│   └── ...               # UI components
├── content/              # MDX content files
│   ├── case-studies/    # Case study markdown files
│   ├── insights/        # Insight markdown files
│   ├── creative/        # Creative work markdown files
│   └── pages/           # Page content (e.g., portfolio.md)
├── lib/                  # Utility functions
├── context/              # React context providers
├── public/               # Static assets (including CV PDF)
└── contentlayer.config.ts # Contentlayer schema definitions
```

---

## Getting Started

### Prerequisites

- **Bun** (preferred) or Node.js 18+
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd fredrik-westerdahl
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Run the development server:

   ```bash
   bun run dev
   # or
   npm run dev
   ```

   Contentlayer runs automatically during development. The site will be available at `http://localhost:3000`.

### Build

Generate Contentlayer types and build the Next.js application:

```bash
bun run build
# or
npm run build
```

You can also generate Contentlayer types manually:

```bash
bun run content:build
# or
npx contentlayer build
```

---

## Content Model

Content is managed through MDX files in the `content/` directory. Contentlayer generates TypeScript types at build time based on the schema defined in `contentlayer.config.ts`.

### Case Studies

Location: `content/case-studies/*.md`

Fields:
- `title` — Case study title
- `subtitle` — Role or context (e.g., "Co-Founder & CTO")
- `tagline` — Brief description
- `order` — Display order
- `insightSlugs` — Related insight article slugs
- `theme` — Color theme (background, foreground, primary)

### Insights

Location: `content/insights/*.md`

Fields:
- `title` — Insight title
- `summary` — Brief summary
- `publishedAt` — Publication date
- `tags` — Insight tags
- `relatedCaseAnchor` — Related case study anchor
- `theme` — Optional color theme

### Creative Works

Location: `content/creative/*.md`

Fields:
- `title` — Work title
- `summary` — Brief description
- `year` — Creation year
- `medium` — Medium or format
- `link` — External link (optional)

### Portfolio Page

Location: `content/pages/portfolio.md`

Singleton page with portfolio overview content.

---

## Contact & Links

- **Email:** fredrik.westerdahl1@sublink.to
- **GitHub:** [https://github.com/polisen](https://github.com/polisen)
- **CV:** [Download PDF CV](/fredrik_westerdahl_cv.pdf)

---

## License
MIT License