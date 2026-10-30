---
kind: intent
maturity: shaped
status: active
parent:
legacy_path:
---

# Reconstruct the site as a CV

> The public site is a measured curriculum vitae, not a portfolio of cards.

## Why

The current site performs. Cards, goo, navigation, color. A CV should not. The site exists so someone can read who Fredrik is and what he has done — with one gesture, on one surface, without being entertained.

## Who

Anyone evaluating Fredrik professionally. Recruiter, client, collaborator. They should be able to read the page like a document.

## What

1. **One playhead.** Port the Userland Studio mechanism: wheel (and touch) writes one number; a timeline maps that number onto named beats; the page is a ruler translated by that number. Scroll is the only driver. No native page scroll on the home surface.
2. **Nuke the chrome.** No header, no top bar, no navigation, no cards, no goo, no custom cursor, no load animation. Footer stays — contact and the PDF — restyled as text.
3. **Keep the copy on disk.** Case-study files and old components are source for past work. They are not rendered. This is not an exhaustive proof of the old portfolio.
4. **Keep the background animation.** Bleach it: blue and pink become almost white. Monochrome atmosphere, barely there.
5. **Text, and a face.** White field, black type. Headshot if it earns its place. Nothing else.

Beats on the first playhead: identity, selected work, footer. No 3D ride. No project reel of cards.

## Feel

Institutional. Extremely measured. A document that happens to move. See `institutional-measure`.

## Out of scope

- Redesigning the PDF
- Exhaustive case studies or project pages
- The Studio 3D tunnel / card zoom
- Rewriting the old copy files (they stay as reference)
- Insights, creative, and experiment routes as part of this surface

## Open questions

- How much selected work belongs on the first cut (titles and one line, or a short paragraph each)
- Whether other routes stay reachable by URL only, or get a later pass
- Exact institutional type size and measure — locked in the build, revisable

## Relates to

- `planning/notes/scroll-is-one-playhead.md`
- `planning/notes/institutional-measure.md`
- `userland.studio/experiments/playhead` (source mechanism)
- `planning/notes/nav-toolbar-priority.md` (superseded)
