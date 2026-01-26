"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { useCursorContext } from './CursorContext';

export function RegularCursorLayer() {
  const { mouseX, mouseY, hoveredRect, isPressed } = useCursorContext();
  const animation = useAnimation();
  const stateRef = useRef<'following' | 'animating' | 'highlighting'>('following');
  const lastHoveredRectRef = useRef<typeof hoveredRect>(undefined);

  // Handle size transitions when hovering - animate to fixed square size
  useEffect(() => {
    if (hoveredRect) {
      if (stateRef.current === 'following' || stateRef.current === 'highlighting') {
        stateRef.current = 'animating';
        // Animate to fixed square size (slightly bigger), position continues following mouse
        const baseSize = 32;
        const pressedSize = isPressed ? baseSize * 0.7 : baseSize;
        animation.start({
          width: pressedSize,
          height: pressedSize,
          borderRadius: isPressed ? 16 : 8, // Become round when pressed
          transition: { type: 'spring', stiffness: 400, damping: 30 },
        });
      }
    } else {
      // Only transition away from square if we're currently highlighting
      if (stateRef.current === 'highlighting' || (stateRef.current === 'animating' && lastHoveredRectRef.current)) {
        stateRef.current = 'animating';
        // Animate back to small round dot, position continues following mouse
        const baseSize = 16;
        const pressedSize = isPressed ? baseSize * 0.7 : baseSize;
        animation.start({
          width: pressedSize,
          height: pressedSize,
          borderRadius: 16, // Always round when not hovering
          transition: { type: 'spring', stiffness: 400, damping: 30 },
        });
      }
    }
    lastHoveredRectRef.current = hoveredRect;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredRect, animation, isPressed]);

  // Handle press animation - quick springy effect, become round, animate size only
  useEffect(() => {
    const baseWidth = hoveredRect ? 32 : 16;
    const baseHeight = hoveredRect ? 32 : 16;
    const targetBorderRadius = hoveredRect ? (isPressed ? 16 : 8) : 16;
    
    if (isPressed) {
      // On press: size down quickly with spring, become round
      animation.start({
        width: baseWidth * 0.7,
        height: baseHeight * 0.7,
        borderRadius: 16, // Always round when pressed
        transition: { type: 'spring', stiffness: 600, damping: 20 },
      });
    } else {
      // On release: size back to normal, return to previous shape
      animation.start({
        width: baseWidth,
        height: baseHeight,
        borderRadius: targetBorderRadius,
        transition: { type: 'spring', stiffness: 400, damping: 30 },
      });
    }
  }, [isPressed, hoveredRect, animation]);

  // Always follow mouse - position updates immediately regardless of hover state
  useEffect(() => {
    // Set initial position
    const initialX = mouseX.get() - 8;
    const initialY = mouseY.get() - 8;
    animation.set({ x: initialX, y: initialY });

    const unsubscribeX = mouseX.on('change', (x) => {
      // Update position immediately (no transition)
      animation.set({ x: x - 8 });
    });
    const unsubscribeY = mouseY.on('change', (y) => {
      // Update position immediately (no transition)
      animation.set({ y: y - 8 });
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, animation]);

  return (
    <motion.div
      animate={animation}
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: 16,
        height: 16,
        zIndex: 9999,
        originX: 0.5,
        originY: 0.5,
      }}
      onAnimationComplete={() => {
        // Update state based on current hoveredRect
        if (hoveredRect) {
          stateRef.current = 'highlighting';
        } else {
          stateRef.current = 'following';
        }
      }}
    >
      <motion.div
        style={{
          pointerEvents: 'none',
          borderRadius: 'inherit',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          filter: 'invert(1)',
          backdropFilter: 'invert(1) blur(3px)',
          WebkitBackdropFilter: 'invert(1) blur(3px)', // Safari support
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}
      />
    </motion.div>
  );
}
