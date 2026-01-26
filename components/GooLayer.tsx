'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useGooContext } from './GooContext';
import { cn } from '@/lib/utils';
import { useSafari } from '@/lib/useSafari';

export function GooLayer() {
  const { containers, setContainerRef } = useGooContext();
  const isSafari = useSafari();
  const refsMap = useRef<Map<string, React.RefObject<HTMLDivElement>>>(
    new Map()
  );

  // Create refs for all containers
  const containerEntries = useMemo(() => {
    return Array.from(containers.entries());
  }, [containers]);

  useEffect(() => {
    containerEntries.forEach(([id]) => {
      if (!refsMap.current.has(id)) {
        const ref = React.createRef<HTMLDivElement>();
        refsMap.current.set(id, ref);
        setContainerRef(id, ref);
      }
    });

    // Clean up refs for removed containers
    // This runs immediately when containers are removed since unregisterContainer is now synchronous
    const currentIds = new Set(containerEntries.map(([id]) => id));
    refsMap.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        refsMap.current.delete(id);
        // Note: The ref is already removed from context by unregisterContainer
      }
    });
  }, [containerEntries, setContainerRef]);

  const renderedShapes = useMemo(() => {
    if (containerEntries.length === 0) return [];

    return containerEntries.map(([id, info]) => {
      const {
        bounds,
        shape,
        borderRadius,
        color,
        customShape,
        backgroundImage,
        backgroundStyle,
        zIndex,
        scale,
      } = info;
      let ref = refsMap.current.get(id);
      if (!ref) {
        ref = React.createRef<HTMLDivElement>();
        refsMap.current.set(id, ref);
        setContainerRef(id, ref);
      }

      if (shape === 'custom' && customShape) {
        const scaleTransform = scale !== undefined ? ` scale(${scale})` : '';
        return (
          <div
            key={id}
            ref={ref}
            style={{
              position: 'fixed',
              transform: `translate3d(${bounds.x}px, ${bounds.y}px, 0)${scaleTransform}`,
              transformOrigin: 'center center',
              width: `${bounds.width}px`,
              height: `${bounds.height}px`,
              willChange: 'transform',
              ...(zIndex !== undefined && { zIndex }),
              ...backgroundStyle,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'visible',
              }}
            >
              {customShape}
            </div>
          </div>
        );
      }

      const borderRadiusClass =
        shape === 'rounded' ? borderRadius || 'rounded-3xl' : '';

      const scaleTransform = scale !== undefined ? ` scale(${scale})` : '';
      const style: React.CSSProperties = {
        position: 'fixed',
        transform: `translate3d(${bounds.x}px, ${bounds.y}px, 0)${scaleTransform}`,
        transformOrigin: 'center center',
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        willChange: 'transform',
        ...(zIndex !== undefined && { zIndex }),
        ...(color && { backgroundColor: color }),
        ...(backgroundImage && { backgroundImage }),
        ...backgroundStyle,
      };

      return (
        <div
          key={id}
          ref={ref}
          className={cn(borderRadiusClass)}
          style={style}
        />
      );
    });
  }, [containerEntries, setContainerRef]);

  // Safari doesn't support applying SVG filters to DOM elements (only SVG elements)
  // So we conditionally disable the filter in Safari - shapes will render normally without gooey effect
  const [filterUrl, setFilterUrl] = useState<string>('url(#gooeyContainerFilter)');
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !isSafari) {
      const baseUrl = window.location.href.split('#')[0];
      setFilterUrl(`url(${baseUrl}#gooeyContainerFilter)`);
    }
  }, [isSafari]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        ...(!isSafari && {
          filter: filterUrl,
          WebkitFilter: filterUrl,
        }),
        willChange: 'filter',
        transform: 'translateZ(0)',
      }}
    >
      {renderedShapes}
    </div>
  );
}
