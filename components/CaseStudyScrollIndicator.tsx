'use client';

import { useMemo, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { allCaseStudies } from 'contentlayer/generated';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { GooeyFilter } from '@/components/GooeyFilter';

export default function CaseStudyScrollIndicator() {
  const pathname = usePathname();
  const { activeSection: contextActiveSection } = useApp();
  const [segmentHeights, setSegmentHeights] = useState({
    inactive: '2rem',
    active: '12rem',
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sortedCaseStudies = useMemo(
    () => [...allCaseStudies].sort((a, b) => (a.order || 0) - (b.order || 0)),
    []
  );

  // Create unified sections array matching page.tsx structure
  const sections = useMemo(() => {
    return [
      { type: 'intro' as const, id: 'intro' },
      ...sortedCaseStudies.map((cs) => ({
        type: 'case-study' as const,
        id: cs.slug,
      })),
    ];
  }, [sortedCaseStudies]);

  const totalSections = sections.length;
  const sectionBaseColors = useMemo(
    () => ({
      intro: '#cffe01', // Match header color (lime-yellow-500)
    }),
    []
  );

  const hexToRgba = (hex: string, alpha: number) => {
    const normalized = hex.replace('#', '');
    const expanded =
      normalized.length === 3
        ? normalized
            .split('')
            .map((c) => c + c)
            .join('')
        : normalized;
    const r = parseInt(expanded.slice(0, 2), 16);
    const g = parseInt(expanded.slice(2, 4), 16);
    const b = parseInt(expanded.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Calculate fixed heights based on viewport height
  useEffect(() => {
    const calculateHeights = () => {
      const padding = 32; // 2rem = 32px (p-4 top + p-4 bottom)
      const gap = 8 * (totalSections - 1); // gap-2 = 8px between segments
      const availableHeight = window.innerHeight - padding - gap;
      const inactiveHeight = availableHeight / totalSections;
      const activeHeight = inactiveHeight * 1.5; // Active segment is 1.5x taller

      setSegmentHeights({
        inactive: `${inactiveHeight}px`,
        active: `${activeHeight}px`,
      });
    };

    calculateHeights();
    window.addEventListener('resize', calculateHeights);
    return () => window.removeEventListener('resize', calculateHeights);
  }, [totalSections]);

  // Find active section index in unified array
  const activeIndex = useMemo(() => {
    if (!contextActiveSection) {
      return null;
    }

    return sections.findIndex((s) => {
      if (s.type !== contextActiveSection.type) return false;
      if (s.type === 'case-study') {
        return contextActiveSection.identifier === s.id;
      }
      return contextActiveSection.identifier === s.id;
    });
  }, [contextActiveSection, sections]);

  // Get base color for a section based on its type and theme
  const getBaseColor = (section: (typeof sections)[0]) => {
    if (section.type === 'case-study') {
      const caseStudy = sortedCaseStudies.find((cs) => cs.slug === section.id);
      const theme = caseStudy?.theme;
      return theme?.primary ?? theme?.foreground ?? '#111827';
    }
    return (
      sectionBaseColors[section.id as keyof typeof sectionBaseColors] ??
      '#F3F4F6'
    );
  };

  // Handle click to scroll to section
  const handleSectionClick = (section: (typeof sections)[0]) => {
    const element = document.getElementById(section.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Only show on home page
  if (pathname !== '/') {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 h-screen p-4 z-50 hidden md:flex items-center justify-center overflow-visible"
      >
        {/* Top floating dot */}

        <GooeyFilter filterId="caseStudyGooey" stdDeviation={15} />
        <div
          className="flex flex-col items-center justify-center relative"
          style={{ filter: 'url(#caseStudyGooey)  ' }}
        >
          <motion.div
            className="fixed  right-4 top-4 w-5 h-5 rounded-full bg-black z-[1000]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />

          <motion.div
            className="fixed  right-4 bottom-4 w-5 h-5 rounded-full bg-black z-[1000]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />

          {sections.map((section, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;
            const baseColor = getBaseColor(section);
            const backgroundColor = baseColor;
            const borderColor = hexToRgba(baseColor, 0.6);

            return (
              <motion.div
                key={section.id}
                className={cn('w-5 z-50 relative', isActive ? 'rounded-none' : 'rounded-full')}
                style={{
                  backgroundColor,
                  borderColor,
                  filter: isActive ? 'saturate(200%) brightness(1.05)' : 'none',
                }}
                initial={{ height: segmentHeights.inactive }}
                animate={{
                  // height: isActive
                  //   ? segmentHeights.active
                  //   : segmentHeights.inactive,
                  backgroundColor,
                  filter: isActive
                    ? 'saturate(200%) brightness(1.05)'
                    : isHovered
                      ? 'brightness(1.2) saturate(150%)'
                      : 'none',
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{
                  type: 'tween',
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => handleSectionClick(section)}
                whileHover={{
                  scale: 1.15,
                  filter: 'brightness(1.3) saturate(180%)',
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
