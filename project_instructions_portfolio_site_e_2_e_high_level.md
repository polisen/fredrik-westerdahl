# Project Instructions – Portfolio Site (E2E, High-Level)

## Goal
Build a minimal, fast portfolio website with three top-level sections (**Portfolio**, **Articles**, **Creative work**) and a downloadable **CV (PDF)**. The default landing page is the portfolio (scrollable, readable). Articles provide optional depth via long-form writeups.

---

## Success Criteria
- A recruiter clicking from the CV understands who you are within 30–60 seconds.
- Portfolio page is one long scroll, finite, and readable on mobile.
- Articles are discoverable but opt-in; each case study links to a related article.
- CV is accessible as a direct PDF download.
- Site is fast: minimal JavaScript, great typography, no UI friction.

---

## Information Architecture
### Primary Routes
- `/` — **Portfolio** (scrollable page with case studies + “How I Work” + Technical Scope + CV link)
- `/articles` — **Articles index**
- `/articles/[slug]` — **Article detail**
- `/creative` — **Creative work**
- `/cv` — **CV route** (either embed + download, or redirect to `/fredrik_westerdahl_cv.pdf`)

### Static Asset
- `/fredrik_westerdahl_cv.pdf` — authoritative CV file

---

## Navigation
- Persistent top-left navigation:
  - Name/Logo → `/`
  - Portfolio → `/`
  - Articles → `/articles`
  - Creative work → `/creative`
- Minimal styling. No complex menus required.

---

## Content Model
### Portfolio Content
- Use the prepared Portfolio Markdown copy as source-of-truth.
- Implement as a single page with headings and anchors.

**Case study anchors (required):**
- `#sublink`
- `#arbitrage-platform`
- `#social-graph`
- `#renewcell-circulose-toolkit`
- `#auction-house-platform`

### Articles
- Store articles as Markdown/MDX with frontmatter.

**Frontmatter (minimum):**
- `title`
- `date`
- `summary`
- `tags`
- `relatedCaseAnchor` (e.g., `sublink`, `arbitrage-platform`)

**Behavior:**
- `/articles` lists all articles with title + summary + date + tags.
- `/articles/[slug]` renders the article and includes:
  - “Back to Articles”
  - “Related case study” → `/#<anchor>`

### Creative work
- Minimal grid or list layout.
- Each entry can link to external platforms (YouTube, SoundCloud, etc.) or internal detail pages if desired.

---

## UX Rules
- Portfolio page is **not collapsible**. Keep it readable and finite.
- Depth lives in Articles, not the Portfolio route.
- Typography-first design:
  - generous spacing
  - strong hierarchy (H1, H2, H3)
  - readable line length
- Avoid heavy motion. If any, keep it subtle.

---

## Implementation Plan (E2E)

### Phase 1 — Skeleton
1. Create base layout with persistent navigation.
2. Implement route structure:
   - `/` (Portfolio)
   - `/articles` (Index)
   - `/articles/[slug]` (Detail)
   - `/creative`
   - `/cv`
3. Add `/public/fredrik_westerdahl_cv.pdf` and link to it from nav and portfolio page.

### Phase 2 — Portfolio
1. Implement portfolio page content:
   - Hero (title + 1–2 sentence positioning)
   - Case studies (in the order defined)
   - “How I Work”
   - “Technical Scope”
   - “Download CV”
   - Contact
2. Add anchors to each case study heading.
3. Add “Read article” links for each case study (even if some articles are not written yet).

### Phase 3 — Articles System
1. Add content directory for MD/MDX.
2. Build article index:
   - sort by date desc
   - optional “Featured” pinning
3. Build article detail page:
   - render MD/MDX
   - show title, date, tags
   - include “Related case study” link to anchor

### Phase 4 — Creative Work
1. Implement a minimal grid/list of items.
2. Each item includes:
   - title
   - year
   - medium (music/video/etc.)
   - link

### Phase 5 — Polish
1. Ensure all pages are mobile-readable.
2. Ensure all links work:
   - CV downloads
   - case anchors
   - article routes
3. Performance check:
   - avoid large client bundles
   - prefer server components where possible

---

## Deliverables Checklist
- [ ] Working routes: `/`, `/articles`, `/articles/[slug]`, `/creative`, `/cv`, `/fredrik_westerdahl_cv.pdf`
- [ ] Persistent navigation (top-left)
- [ ] Portfolio page implemented with anchors and article links
- [ ] Articles index + article detail rendering from MD/MDX
- [ ] Creative work page with minimal list/grid
- [ ] CV PDF available and linked

---

## Notes / Constraints
- Keep the Portfolio page as the authoritative “recruiter experience.”
- Use Articles to hold deeper technical writing; do not bloat the Portfolio route.
- Prefer clarity over features. Ship minimal, then iterate.

