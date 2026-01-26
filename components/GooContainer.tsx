"use client";

import { useEffect, useRef, useId, useCallback, ReactNode } from 'react';
import { useGooContext, ContainerShape, ContainerBounds } from './GooContext';
import { cn } from '@/lib/utils';

interface GooContainerProps {
  children: ReactNode;
  shape?: ContainerShape;
  borderRadius?: string;
  color?: string;
  customShape?: ReactNode;
  className?: string;
  backgroundImage?: string;
  backgroundStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

export function GooContainer({
  children,
  shape = 'rounded',
  borderRadius,
  color,
  customShape,
  className,
  backgroundImage,
  backgroundStyle,
  style,
}: GooContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const { registerContainer, unregisterContainer, updateContainerBounds, registerUpdateCallback, unregisterUpdateCallback } = useGooContext();
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastBoundsRef = useRef<ContainerBounds | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateBounds = useCallback((useDirectUpdate = false) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Use viewport coordinates since GooLayer uses position: fixed
    const bounds: ContainerBounds = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };

    if (useDirectUpdate) {
      // Use direct DOM update for position changes (faster)
      updateContainerBounds(id, bounds);
    } else {
      // Full update for initial registration or style changes
      registerContainer(id, {
        bounds,
        shape,
        borderRadius,
        color,
        customShape,
        backgroundImage,
        backgroundStyle,
      });
    }
  }, [id, shape, borderRadius, color, customShape, backgroundImage, backgroundStyle, registerContainer, updateContainerBounds]);

  // Create stable update callback for registration
  const triggerUpdate = useCallback(() => {
    updateBounds(false);
  }, [updateBounds]);

  // Animation tracking function - continuously monitors position for motion animations
  const trackPosition = useCallback(() => {
    if (!containerRef.current) {
      animationFrameRef.current = null;
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const currentBounds: ContainerBounds = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };

    const lastBounds = lastBoundsRef.current;
    
    // Only update if position actually changed
    if (!lastBounds || 
        lastBounds.x !== currentBounds.x || 
        lastBounds.y !== currentBounds.y ||
        lastBounds.width !== currentBounds.width ||
        lastBounds.height !== currentBounds.height) {
      // Position changed - update bounds
      updateBounds(true); // Use direct update for performance
      lastBoundsRef.current = currentBounds;
    }
    
    // Always continue tracking (no auto-stop)
    animationFrameRef.current = requestAnimationFrame(trackPosition);
  }, [updateBounds]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial bounds calculation - use full update for initial registration
    updateBounds(false);

    // Register update callback so other containers can trigger updates when they unmount
    registerUpdateCallback(id, triggerUpdate);

    // Start animation tracking to follow motion animations
    lastBoundsRef.current = null; // Reset to force initial update
    animationFrameRef.current = requestAnimationFrame(trackPosition);

    // ResizeObserver for size changes (debounced)
    const handleResize = () => {
      if (resizeTimeoutRef.current !== null) {
        cancelAnimationFrame(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = requestAnimationFrame(() => {
        updateBounds(false); // Full update for resize
        resizeTimeoutRef.current = null;
        // Update lastBounds to prevent duplicate updates from trackPosition
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          lastBoundsRef.current = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          };
        }
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Find all scroll containers (could be window or parent elements)
    const findScrollContainers = (element: HTMLElement | null): Array<HTMLElement | Window> => {
      const containers: Array<HTMLElement | Window> = [window];
      if (!element) return containers;
      
      let parent = element.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const hasScroll = parent.scrollHeight > parent.clientHeight;
        if ((style.overflow === 'auto' || style.overflow === 'scroll' || 
            style.overflowY === 'auto' || style.overflowY === 'scroll') && hasScroll) {
          containers.push(parent);
        }
        parent = parent.parentElement;
      }
      return containers;
    };

    const scrollContainers = findScrollContainers(containerRef.current);

    // Throttled scroll handler (uses direct DOM updates for performance)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateBounds(true); // Use direct update for scroll (faster)
          ticking = false;
          // Update lastBounds to prevent duplicate updates from trackPosition
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            lastBoundsRef.current = {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            };
          }
        });
        ticking = true;
      }
    };

    // Listen to scroll on all containers
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll, { passive: true });
    });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      // Unregister callback first to avoid calling it during unmount
      unregisterUpdateCallback(id);
      
      // Stop animation tracking
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current !== null) {
        cancelAnimationFrame(resizeTimeoutRef.current);
      }
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
      window.removeEventListener('resize', handleScroll);
      unregisterContainer(id);
    };
  }, [id, updateBounds, unregisterContainer, registerUpdateCallback, unregisterUpdateCallback, triggerUpdate, trackPosition]);

  return (
    <div ref={containerRef} className={cn('h-full w-full', className)} style={style}>
      {children}
    </div>
  );
}
