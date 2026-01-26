import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { CaseStudy as CaseStudyType } from 'contentlayer/generated';

const DEFAULT_THEME = {
  background: '#F3F4F6',
  foreground: '#111827',
  primary: '#111827',
};

export const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const lightenColor = (hex: string, amount: number = 0.1) => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  const mix = (value: number) => Math.round(value + (255 - value) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

export const getCaseTheme = (caseStudy: CaseStudyType) => {
  return caseStudy.theme ?? DEFAULT_THEME;
};

// Brighten a color by increasing all RGB values proportionally
export const brightenColor = (hex: string, amount: number = 0.3) => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  
  // Brighten by moving towards white
  const brighten = (value: number) => Math.min(255, Math.round(value + (255 - value) * amount));
  
  return `rgb(${brighten(r)}, ${brighten(g)}, ${brighten(b)})`;
};

// Generate gradient colors from a base color - creates brighter variations
export const generateGradientColors = (baseColor: string) => {
  return {
    color1: baseColor, // Original color at center
    color2: brightenColor(baseColor, 0.15), // Slightly brighter
    color3: brightenColor(baseColor, 0.35), // Brighter
    color4: brightenColor(baseColor, 0.55), // Brightest at edges
  };
};

// Hook to memoize gradient background style to prevent unnecessary recalculations
export const useGradientBackgroundStyle = (baseColor: string): CSSProperties => {
  return useMemo(() => {
    const colors = generateGradientColors(baseColor);
    return {
      background: `radial-gradient(circle at top left, ${colors.color1} 0%, ${colors.color2} 30%, ${colors.color3} 60%, ${colors.color4} 100%)`
    };
  }, [baseColor]);
};
