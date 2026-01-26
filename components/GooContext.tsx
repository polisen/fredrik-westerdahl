"use client";

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GooeyFilter } from './GooeyFilter';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

export type ContainerShape = 'rectangle' | 'rounded' | 'custom';

export interface ContainerBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ContainerInfo {
  bounds: ContainerBounds;
  shape: ContainerShape;
  borderRadius?: string;
  color?: string;
  customShape?: ReactNode;
  backgroundImage?: string;
  backgroundStyle?: React.CSSProperties;
  zIndex?: number;
  scale?: number;
}

interface PendingUpdate {
  id: string;
  info: ContainerInfo | null; // null means unregister
}

interface GooContextValue {
  containers: Map<string, ContainerInfo>;
  registerContainer: (id: string, info: ContainerInfo) => void;
  unregisterContainer: (id: string) => void;
  updateContainerBounds: (id: string, bounds: ContainerBounds) => void;
  getContainerRefs: () => Map<string, React.RefObject<HTMLDivElement>>;
  setContainerRef: (id: string, ref: React.RefObject<HTMLDivElement>) => void;
  clearAllContainers: () => void;
  registerUpdateCallback: (id: string, callback: () => void) => void;
  unregisterUpdateCallback: (id: string) => void;
}

const GooContext = createContext<GooContextValue | null>(null);

export function useGooContext() {
  const context = useContext(GooContext);
  if (!context) {
    throw new Error('useGooContext must be used within GooProvider');
  }
  return context;
}

interface GooProviderProps {
  children: ReactNode;
}

export function GooProvider({ children }: GooProviderProps) {
  const [containers, setContainers] = useState<Map<string, ContainerInfo>>(new Map());
  const containersRef = useRef<Map<string, ContainerInfo>>(new Map());
  const updateQueueRef = useRef<Map<string, PendingUpdate>>(new Map());
  const rafIdRef = useRef<number | null>(null);
  const containerRefsRef = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());
  const updateCallbacksRef = useRef<Map<string, () => void>>(new Map());
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  const flushUpdates = useCallback(() => {
    if (updateQueueRef.current.size === 0) {
      rafIdRef.current = null;
      return;
    }

    const updates = new Map(updateQueueRef.current);
    updateQueueRef.current.clear();

    updates.forEach((update, id) => {
      if (update.info === null) {
        containersRef.current.delete(id);
        containerRefsRef.current.delete(id);
      } else {
        containersRef.current.set(id, update.info);
      }
    });

    setContainers(new Map(containersRef.current));
    rafIdRef.current = null;
  }, []);

  const scheduleUpdate = useCallback((id: string, info: ContainerInfo | null) => {
    updateQueueRef.current.set(id, { id, info });

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(flushUpdates);
    }
  }, [flushUpdates]);

  const registerContainer = useCallback((id: string, info: ContainerInfo) => {
    // For initial registration, update immediately to ensure first render
    const isNew = !containersRef.current.has(id);
    if (isNew) {
      containersRef.current.set(id, info);
      setContainers(new Map(containersRef.current));
    } else {
      // For updates, use batching
      scheduleUpdate(id, info);
    }
  }, [scheduleUpdate]);

  const unregisterContainer = useCallback((id: string) => {
    // Immediate removal - don't batch unmounts
    containersRef.current.delete(id);
    containerRefsRef.current.delete(id);
    updateCallbacksRef.current.delete(id);
    
    // Cancel any pending update for this container
    updateQueueRef.current.delete(id);
    
    // Trigger updates for all remaining containers to catch layout shifts
    updateCallbacksRef.current.forEach((callback) => {
      callback();
    });
    
    // Update state immediately
    setContainers(new Map(containersRef.current));
    
    // Cancel RAFs if this was the last container
    if (containersRef.current.size === 0) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }
  }, []);

  const updateContainerBounds = useCallback((id: string, bounds: ContainerBounds) => {
    const existing = containersRef.current.get(id);
    if (existing) {
      const updated = { ...existing, bounds };
      // Update ref immediately for direct DOM access
      containersRef.current.set(id, updated);
      
      // Direct DOM update via ref if available (for immediate visual update)
      const ref = containerRefsRef.current.get(id);
      if (ref?.current) {
        const scaleTransform = existing.scale !== undefined ? ` scale(${existing.scale})` : '';
        ref.current.style.transform = `translate3d(${bounds.x}px, ${bounds.y}px, 0)${scaleTransform}`;
        ref.current.style.width = `${bounds.width}px`;
        ref.current.style.height = `${bounds.height}px`;
      }
      
      // Queue React state update in the same RAF cycle as other updates
      // This ensures all containers (cards and bridges) update in sync
      scheduleUpdate(id, updated);
    }
  }, [scheduleUpdate]);

  const getContainerRefs = useCallback(() => {
    return containerRefsRef.current;
  }, []);

  const setContainerRef = useCallback((id: string, ref: React.RefObject<HTMLDivElement>) => {
    containerRefsRef.current.set(id, ref);
  }, []);

  const registerUpdateCallback = useCallback((id: string, callback: () => void) => {
    updateCallbacksRef.current.set(id, callback);
  }, []);

  const unregisterUpdateCallback = useCallback((id: string) => {
    updateCallbacksRef.current.delete(id);
  }, []);

  const clearAllContainers = useCallback(() => {
    // Cancel any pending animation frames
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    // Clear all Maps and refs
    containersRef.current.clear();
    containerRefsRef.current.clear();
    updateQueueRef.current.clear();
    updateCallbacksRef.current.clear();
    
    // Reset state to empty Map
    setContainers(new Map());
  }, []);

  // Detect route changes and clear all containers
  useEffect(() => {
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      // Route changed - clear all containers
      clearAllContainers();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, clearAllContainers]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Detect mobile vs desktop for responsive stdDeviation
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common mobile breakpoint
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  return (
    <GooContext.Provider
      value={{
        containers,
        registerContainer,
        unregisterContainer,
        updateContainerBounds,
        getContainerRefs,
        setContainerRef,
        clearAllContainers,
        registerUpdateCallback,
        unregisterUpdateCallback, 
      }}
    >
      <GooeyFilter filterId="gooeyContainerFilter" stdDeviation={isMobile ? 40 : 50} additionalBlur={12} />
      {children}
    </GooContext.Provider>
  );
}
