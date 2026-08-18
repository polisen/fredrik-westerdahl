/** Music-mode EQ zones (AnalyserNode bin ranges @ fftSize 2048). */
export type MusicEqBand = {
  label: string;
  binStart: number;
  binEnd: number;
};

/** Four EQ areas for music visualizer — sub through air. */
export const ART4_MUSIC_EQ_BANDS: readonly MusicEqBand[] = [
  { label: 'Sub', binStart: 1, binEnd: 10 },
  { label: 'Low', binStart: 11, binEnd: 28 },
  { label: 'Mid', binStart: 29, binEnd: 65 },
  { label: 'High', binStart: 66, binEnd: 120 },
] as const;

/** Map each EQ band to a depth layer center (0 = sharpest ● … 8 = sparse). */
export const ART4_MUSIC_EQ_LAYER_CENTERS = [0.8, 2.8, 5, 7.2] as const;

export const ART4_MUSIC_EQ_BAND_COUNT = ART4_MUSIC_EQ_BANDS.length;
