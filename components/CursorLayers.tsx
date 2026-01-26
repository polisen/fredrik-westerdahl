"use client";

import { useEffect, useState } from 'react';
import { RegularCursorLayer } from './RegularCursorLayer';
import { GooeyCursorLayer } from './GooeyCursorLayer';

export function CursorLayers() {
  const [isMobile, setIsMobile] = useState(true); // Start with true to avoid flash

  useEffect(() => {
    const checkMobile = () => {
      // Check if device is mobile (touch device or small screen)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render cursor layers on mobile
  if (isMobile) {
    return null;
  }

  return (
    <>
      <GooeyCursorLayer />
      <RegularCursorLayer />
    </>
  );
}
