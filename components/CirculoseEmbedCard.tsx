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
              className={`h-8 px-3 text-sm rounded-full transition-colors ${
                theme === t
                  ? 'bg-gray-300 text-black'
                  : 'bg-gray-100 text-black/60 hover:text-black hover:bg-gray-200'
              }`}
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
              className={`h-8 px-3 text-sm rounded-full transition-colors ${
                orientation === o
                  ? 'bg-gray-300 text-black'
                  : 'bg-gray-100 text-black/60 hover:text-black hover:bg-gray-200'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
