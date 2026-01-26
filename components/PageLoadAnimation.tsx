'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function PageLoadAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 50); // Small delay to ensure the component is mounted

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ height: '100vh' }}
      animate={{ height: isVisible ? '80vh' : '0vh' }}
      transition={{
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1], // ease-in-out
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000',
        zIndex: 9999,
        pointerEvents: isVisible ? 'auto' : 'none',
        padding: 0,
      }}
    />
  );
}
