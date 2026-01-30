'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark' | 'blue';
type Orientation = 'vertical' | 'horizontal';

const THEMES: Theme[] = ['light', 'dark', 'blue'];
const ORIENTATIONS: Orientation[] = ['vertical', 'horizontal'];

export function CirculoseEmbedCard() {
  const [theme, setTheme] = useState<Theme>('light');
  const [orientation, setOrientation] = useState<Orientation>('vertical');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const el = document.createElement('circulose-banner');
    el.dataset.theme = theme;
    el.dataset.orientation = orientation;
    container.appendChild(el);

    window.dispatchEvent(new CustomEvent('reparse'));

    return () => {
      if (container.contains(el)) {
        container.removeChild(el);
      }
    };
  }, [theme, orientation]);

  return (
    <div className="p-4 h-full flex flex-col gap-4" style={{ color: 'inherit' }}>
      <div
        ref={containerRef}
        className="flex-1 min-h-0 flex items-center justify-center"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`px-2.5 py-1 text-sm rounded border transition-colors ${
                theme === t
                  ? 'border-current opacity-90'
                  : 'opacity-60 border-current hover:opacity-80'
              }`}
              style={{
                borderColor: 'inherit',
                color: 'inherit',
                ...(theme === t && { backgroundColor: 'rgba(0,0,0,0.08)' }),
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {ORIENTATIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrientation(o)}
              className={`px-2.5 py-1 text-sm rounded border transition-colors ${
                orientation === o
                  ? 'border-current opacity-90'
                  : 'opacity-60 border-current hover:opacity-80'
              }`}
              style={{
                borderColor: 'inherit',
                color: 'inherit',
                ...(orientation === o && { backgroundColor: 'rgba(0,0,0,0.08)' }),
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
