---
kind: intent
maturity: shaped
status: active
parent:
legacy_path:
---

# Nav & toolbar priority

> Reorder the top chrome: hamburger first, CV last in the left bar, kill the scroll indicator, pad the blob, full-site grouped menu overlay.

## Why

The top bar should carry navigation priority and progress (via its own presence/scale), not a separate scroll chrome. CV belongs with the rest of the chrome as the footer stand-in, reading left→right toward site structure then exit/contact. A single menu should expose the whole site tree the way Case Studies / Projects already open — but for everything, ending in the footer.

## Who

Site visitors using the fixed top chrome on the portfolio (desktop first; mobile should not break).

## What

Ordered scope for this pass:

1. **CV into the toolbar (last item)**  
   Move the CV control from the far-right into the left rounded toolbar as the final item. It represents the footer.

2. **Remove the scroll bar**  
   Drop the rightmost vertical animated scroll progress UI (`ScrollLinked`).

3. **Pad the toolbar for the active blob**  
   Add inner padding so the flying active indicator doesn’t touch the pill edges.

4. **Menu icon as first item**  
   Hamburger as the first item in the same gray pill. Opens a **grouped** overlay (Case Studies / Projects / etc.) covering the whole site tree, with the **footer at the end**. Toggles closed via the same menu control. Case Studies and Projects labels do **not** open their own menus — section awareness comes from scroll; jumping to specific items is via the hamburger menu (or scrolling the page).

## Decisions (locked)

- Menu control: **first item inside the same bar**
- Glyph: **hamburger**
- Menu structure: **grouped**
- Case Studies / Projects: **no independent dropdowns**
- Scroll UI to remove: **right-edge vertical progress bar** (`ScrollLinked`)

## Feel

Same family as existing Case Studies / Projects overlays: structured grouped list, familiar chrome, footer present at the bottom of the full-site menu. Toolbar stays one coherent pill with room for the active blob to breathe.

## Out of scope (this pass)

- Broader restyle of case-study sticky headers or card physics  
- Content rewrite of case studies / projects  
- New footer content beyond what’s already shown in overlays  

## Relates to

- `components/Navigation.tsx`  
- `components/ScrollLinked.tsx` / `app/layout.tsx`  
- `components/Footer.tsx` (`MenuOverlayFooter`, CV / footer links)
