'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CaseStudyPageIndicatorProps {
  containerRef: React.RefObject<HTMLElement>;
  totalPages: number;
  className?: string;
}

export function CaseStudyPageIndicator({
  containerRef,
  totalPages,
  className,
}: CaseStudyPageIndicatorProps) {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateActivePage = () => {
      if (!container) return;

      // Get all snap items (children with snap-start class)
      const snapItems = Array.from(
        container.querySelectorAll('[class*="snap-start"]')
      ) as HTMLElement[];

      if (snapItems.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Find which item is closest to the center
      let closestIndex = 0;
      let closestDistance = Infinity;

      snapItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      // Adjust for left spacer (index 0 is usually the spacer)
      const actualPage = Math.max(0, closestIndex - 1);
      setActivePage(Math.min(actualPage, totalPages - 1));
    };

    // Initial update
    updateActivePage();

    // Update on scroll
    container.addEventListener('scroll', updateActivePage, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', updateActivePage);

    return () => {
      container.removeEventListener('scroll', updateActivePage);
      window.removeEventListener('resize', updateActivePage);
    };
  }, [containerRef, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 md:gap-3 mt-4 md:mt-6',
        className
      )}
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => {
            const container = containerRef.current;
            if (!container) return;

            // Find the corresponding snap item (skip left spacer)
            const snapItems = Array.from(
              container.querySelectorAll('[class*="snap-start"]')
            ) as HTMLElement[];

            // Index + 1 to skip the left spacer
            const targetItem = snapItems[index + 1];
            if (targetItem) {
              targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
              });
            }
          }}
          className="relative focus:outline-none focus:ring-2 focus:ring-[color:var(--case-accent)] focus:ring-offset-2 rounded-full"
          aria-label={`Go to page ${index + 1}`}
        >
          <motion.div
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              index === activePage
                ? 'bg-[color:var(--case-accent)]'
                : 'bg-[color:var(--case-muted)] opacity-40'
            )}
            animate={{
              scale: index === activePage ? 1.2 : 1,
              opacity: index === activePage ? 1 : 0.4,
            }}
            transition={{ duration: 0.2 }}
          />
        </button>
      ))}
    </div>
  );
}
