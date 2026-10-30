/** Site art theme — primary/secondary/tertiary used by the ASCII field. */

export const artTheme = {
  /** Unused on the CV surface; kept so existing art code still resolves. */
  primary: '#f5f5f5',
  /** ASCII field, almost white */
  secondary: '#e8e8e8',
  /** Interaction ripple / grid tint, almost white */
  tertiary: '#e6e6e6',
  /** Soft end of the field ramp */
  secondarySoft: '#ffffff',
} as const

export type ArtTheme = typeof artTheme
