import { mostReadable, TinyColor } from "@ctrl/tinycolor";

/**
 * Sorts an array of hex colors from brightest to darkest so that card lines
 * go from high to low intensity. Uses relative luminance (WCAG); ties are
 * broken by saturation (more saturated first).
 */
export function sortColorsByIntensity(
  colors: readonly string[]
): string[] {
  return [...colors].sort((a, b) => {
    const tcA = new TinyColor(a);
    const tcB = new TinyColor(b);
    const lumA = tcA.getLuminance();
    const lumB = tcB.getLuminance();
    if (Math.abs(lumA - lumB) > 0.001) return lumB - lumA; // brightest first
    const satA = tcA.toHsl().s;
    const satB = tcB.toHsl().s;
    return satB - satA; // more saturated first when luminance ties
  });
}

/** WCAG AA contrasting text color for a given background. Pure function, safe for useMemo. */
export function getContrastingTextColor(
  backgroundColor: string,
  opacity = 1
): string {
  const result = mostReadable(backgroundColor, ["#0f0f0f", "#ffffff"], {
    includeFallbackColors: true,
    level: "AA",
    size: "small",
  });
  const hex = result?.toHexString() ?? "#0f0f0f";
  if (opacity >= 1) return hex;
  return new TinyColor(hex).setAlpha(opacity).toRgbString();
}

/**
 * Intro card line palette — white-ish backgrounds for the intro section.
 * Use with getIntroCardLineColor(index).
 */
export const INTRO_CARD_LINE_COLORS = [
  "#fafaf9",
  "#f5f5f4",
  "#f0f0ef",
  "#ebebea",
  "#e6e6e5",
] as const;

const SORTED_INTRO_CARD_LINE_COLORS = sortColorsByIntensity([...INTRO_CARD_LINE_COLORS]);

/** Get the intro card line background color for a given row index (white-ish palette). */
export function getIntroCardLineColor(index: number): string {
  return SORTED_INTRO_CARD_LINE_COLORS[index % SORTED_INTRO_CARD_LINE_COLORS.length];
}

/**
 * Card line color palette. Change these values to update card line backgrounds
 * across the site (e.g. IntroCardLines). Use with getCardLineColor(index) to
 * cycle by row index.
 */
export const CARD_LINE_COLORS = [
  "#C0BED1",
  "#658FBD",
  "#6F6C74",
  "#00296A",
  "#9A9FB3",
] as const;

export type CardLineColorHex = (typeof CARD_LINE_COLORS)[number];

const SORTED_CARD_LINE_COLORS = sortColorsByIntensity(CARD_LINE_COLORS);

/** Get the card line background color for a given row index (cycles through the palette, sorted bright→dark). */
export function getCardLineColor(index: number): string {
  return SORTED_CARD_LINE_COLORS[index % SORTED_CARD_LINE_COLORS.length];
}

/**
 * Arbitrage platform card line palette. Change these to update arbitrage case study card line backgrounds.
 */
export const ARBITRAGE_CARD_LINE_COLORS = [
  "#ECD1A3",
  "#A39277",
  "#DBD8C9",
  "#C8CE8F",
] as const;

const SORTED_ARBITRAGE_CARD_LINE_COLORS = sortColorsByIntensity(ARBITRAGE_CARD_LINE_COLORS);

/** Get the arbitrage platform card line color for a given row index (cycles through the palette, sorted bright→dark). */
export function getArbitrageCardLineColor(index: number): string {
  return SORTED_ARBITRAGE_CARD_LINE_COLORS[index % SORTED_ARBITRAGE_CARD_LINE_COLORS.length];
}

/**
 * Social graph card line palette. Change these to update social graph case study card line backgrounds.
 * Neutral bright pastels (from Renewcell, main, Arbitrage, Auction house).
 */
export const SOCIAL_GRAPH_CARD_LINE_COLORS = [
  "#EFF3F3",
  "#E9EFF3",
  "#E5E7EB",
  "#DBD8C9",
  "#C0BED1",
] as const;

const SORTED_SOCIAL_GRAPH_CARD_LINE_COLORS = sortColorsByIntensity(SOCIAL_GRAPH_CARD_LINE_COLORS);

/** Get the social graph card line color for a given row index (cycles through the palette, sorted bright→dark). */
export function getSocialGraphCardLineColor(index: number): string {
  return SORTED_SOCIAL_GRAPH_CARD_LINE_COLORS[index % SORTED_SOCIAL_GRAPH_CARD_LINE_COLORS.length];
}

/**
 * Sublink card line palette. Change these to update sublink case study card line backgrounds.
 */
export const SUBLINK_CARD_LINE_COLORS = [
  "#292010",
  "#e6e2e1",
  "#2C2C22",
  "#555E58",
  "#B9CBBD",
] as const;

const SORTED_SUBLINK_CARD_LINE_COLORS = SUBLINK_CARD_LINE_COLORS

/** Get the sublink card line color for a given row index (cycles through the palette, sorted bright→dark). */
export function getSublinkCardLineColor(index: number): string {
  return SORTED_SUBLINK_CARD_LINE_COLORS[index % SORTED_SUBLINK_CARD_LINE_COLORS.length];
}

/**
 * Lilla auktionsstudion (auction house) card line palette.
 */
export const AUCTION_HOUSE_CARD_LINE_COLORS = [
  "#fffffff2",
  "#f3facb",
  "#f0f0f0",
  "#e5e7eb",
  "#ebaad0",
  "#ec1607",
] as const;

const SORTED_AUCTION_HOUSE_CARD_LINE_COLORS = sortColorsByIntensity(AUCTION_HOUSE_CARD_LINE_COLORS);

/** Get the auction house card line color for a given row index (cycles through the palette, sorted bright→dark). */
export function getAuctionHouseCardLineColor(index: number): string {
  return SORTED_AUCTION_HOUSE_CARD_LINE_COLORS[index % SORTED_AUCTION_HOUSE_CARD_LINE_COLORS.length];
}

/**
 * Renewcell card line palette.
 */
export const RENEWCELL_CARD_LINE_COLORS = [
  "#657798",
  "#EFF3F3",
  "#506998",
  "#E9EFF3",
  "#E0E5E3",
] as const;

const SORTED_RENEWCELL_CARD_LINE_COLORS = sortColorsByIntensity(RENEWCELL_CARD_LINE_COLORS);

/** Get the renewcell card line color for a given row index (cycles through the palette, sorted bright→dark). */
export function getRenewcellCardLineColor(index: number): string {
  return SORTED_RENEWCELL_CARD_LINE_COLORS[index % SORTED_RENEWCELL_CARD_LINE_COLORS.length];
}
