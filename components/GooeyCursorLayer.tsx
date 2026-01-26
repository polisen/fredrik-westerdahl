"use client";

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useCursorContext } from './CursorContext';
import { useGooContext } from './GooContext';
import { useId } from 'react';

export function GooeyCursorLayer() {
  const { mouseX, mouseY, hoveredRect } = useCursorContext();
  const { registerContainer, updateContainerBounds, unregisterContainer } = useGooContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const pathname = usePathname();
  const [hasMeasured, setHasMeasured] = useState(false);

  // Update position and bounds based on hover state
  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current) return;

      const x = mouseX.get();
      const y = mouseY.get();

      // Only show after first measurement (when coordinates are not both 0)
      // This prevents the overlay from appearing in the top-left corner
      if (!hasMeasured && (x !== 0 || y !== 0)) {
        setHasMeasured(true);
      }

      // Don't update position if we haven't measured yet
      if (!hasMeasured) return;

      if (hoveredRect) {
        // When hovering, use fixed 120x120px size centered on mouse
        containerRef.current.style.left = `${x}px`;
        containerRef.current.style.top = `${y}px`;
        containerRef.current.style.width = '120px';
        containerRef.current.style.height = '120px';
        containerRef.current.style.transform = 'translate(-50%, -50%)'; // Center on mouse
      } else {
        // When not hovering, use circular shape centered on mouse
        containerRef.current.style.left = `${x}px`;
        containerRef.current.style.top = `${y}px`;
        containerRef.current.style.width = '80px';
        containerRef.current.style.height = '80px';
        containerRef.current.style.transform = 'translate(-50%, -50%)'; // Center on mouse
      }

      // Update bounds in GooContext
      const rect = containerRef.current.getBoundingClientRect();
      updateContainerBounds(id, {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
    };

    // Always subscribe to mouse movement to follow cursor
    const unsubscribeX = mouseX.on('change', updateBounds);
    const unsubscribeY = mouseY.on('change', updateBounds);

    // Initial update
    updateBounds();

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, hoveredRect, id, updateContainerBounds, hasMeasured]);

  // Initial registration and updates when gradient/borderRadius changes
  useEffect(() => {
    if (!containerRef.current || !hasMeasured) return;
    
    // Use requestAnimationFrame to ensure DOM has been updated by the first effect
    const rafId = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Use backdrop-filter to saturate and brighten what's behind
      // Combine with a subtle white overlay for the enhancement effect
      const backdropFilter = hoveredRect
        ? 'brightness(1.6) saturate(2)' // Stronger effect when hovering
        : 'brightness(1.6) saturate(2)'; // Subtle effect when following
      
      registerContainer(id, {
        bounds: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        shape: 'rounded',
        borderRadius: hoveredRect ? '8px' : 'rounded-full', // Match RegularCursorLayer when hovering
        backgroundStyle: {
        //   backgroundColor: hoveredRect ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
        // backgroundColor yves klein blue 
          backgroundColor: '#002FA7',
          backdropFilter: 'invert(1)',
          WebkitBackdropFilter: 'invert(1)', // Safari support
        //   backdropFilter: backdropFilter,
        //   WebkitBackdropFilter: backdropFilter, // Safari support
        },
        zIndex: 10, // Above regular content but below navigation and regular cursor
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      unregisterContainer(id);
    };
  }, [id, registerContainer, unregisterContainer, hoveredRect, pathname, hasMeasured]);

  // Render nothing - GooLayer will render the shape
  // We just need a hidden element to track bounds
  // Initial values will be set by useEffect immediately
  // Add transition only to width/height (size), not position
  // Keep hidden until first coordinate is measured
  return (
    <div
      ref={containerRef}
      className="pointer-events-none"
      style={{
        position: 'fixed',
        left: hasMeasured ? '0px' : '-9999px',
        top: hasMeasured ? '0px' : '-9999px',
        width: '400px',
        height: '400px',
        transform: 'translate(-50%, -50%)',
        visibility: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden
    />
  );
}
