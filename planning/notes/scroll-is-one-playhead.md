---
kind: truth
maturity: canonical
status: active
parent:
legacy_path:
---

# Scroll is one playhead

> One number. Sections are beats on the same timeline. One gesture moves through all of them.

## What this means

Native scroll is not the driver. Wheel and touch write a target; the playhead lerps toward it. A timeline maps playhead pixels onto named beats, each with a 0–1 ratio.

On Userland Studio (`experiments/playhead`) the chain is:

```
wheel → ScrollPane.scroll
      → Timeline.ratio
      → whatever reads the ratio
```

Pixel-based beats use real section height (the work page, the footer). Weighted beats share leftover scroll (the ride). A second playhead on a project page first travels sideways, then down.

The CV site takes the first playhead only: identity, work, and footer as pixel beats on one ruler. No second reel. No tunnel.

## Implications

- Home overflow is locked. The ruler translates. Nothing else scrolls.
- Background animation reads playhead progress, not `window` scroll.
- Adding a section means adding a beat, not a new scroll context.
- The thin rail is the playhead made visible — it appears while moving, then goes.

## History

- 2026-08-28 — Captured from the Studio playhead experiment; adopted as the CV site's scroll model.
