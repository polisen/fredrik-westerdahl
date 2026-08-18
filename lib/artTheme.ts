/** Site art theme — primary/secondary/tertiary used by cursor + ASCII wave. */

export const artTheme = {
  /** Dominant hue from /texture12 (site primary) */
  primary: '#c4ff06',
  /** ASCII wave deep blue */
  secondary: '#0046e0',
  /** Interaction ripple / boundary tint */
  tertiary: '#ff6eb4',
  /** Soft end of the secondary blue ramp */
  secondarySoft: '#f4f8ff',
} as const;

export type ArtTheme = typeof artTheme;
