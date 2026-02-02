'use client';
import { allCaseStudies } from 'contentlayer/generated';
import { FadeIn } from '@/components/FadeIn';
import { Footer } from '@/components/Footer';
import { useRef, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { ActiveSection } from '@/context/AppContext';
import { GooContainer } from '@/components/GooContainer';
import { IntroCardLines } from '@/components/IntroCardLines';
import { CaseStudy01SublinkNew } from '@/components/CaseStudy01SublinkNew';
import { CaseStudy02ArbitragePlatformNew } from '@/components/CaseStudy02ArbitragePlatformNew';
import { CaseStudy03SocialGraphNew } from '@/components/CaseStudy03SocialGraphNew';
import { CaseStudy04RenewcellToolkitNew } from '@/components/CaseStudy04RenewcellToolkitNew';
import { CaseStudy05AuctionHouseNew } from '@/components/CaseStudy05AuctionHouseNew';

export default function PortfolioPage() {
  const pathname = usePathname();
  const {
    setScrollYProgress,
    setActiveSection,
    activeSection,
    setScrollContainerRef,
  } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [expandedCaseStudy, setExpandedCaseStudy] = useState<string | null>(
    null
  );

  // Set scroll container ref in context for AnimatedHeader to use
  useEffect(() => {
    if (ref.current) {
      setScrollContainerRef(ref);
    }
    return () => {
      setScrollContainerRef(null);
    };
  }, [setScrollContainerRef]);

  // Scroll progress is no longer synced to context; ScrollLinked uses useScroll() directly
  // so the indicator updates via MotionValues without triggering React re-renders.
  useEffect(() => {
    return () => {
      setScrollYProgress(null);
    };
  }, [setScrollYProgress]);

  const sortedCaseStudies = useMemo(
    () => [...allCaseStudies].sort((a, b) => (a.order || 0) - (b.order || 0)),
    []
  );

  // Create ordered list of all sections for navigation
  const sections = useMemo(() => {
    return [
      { type: 'intro' as const, id: 'intro' },
      { type: 'case-study' as const, id: 'tech-stack' },
      { type: 'case-study' as const, id: 'case-studies' },
      ...sortedCaseStudies.map((cs) => ({
        type: 'case-study' as const,
        id: cs.slug,
      })),
    ];
  }, [sortedCaseStudies]);

  // Keyboard navigation
  useEffect(() => {
    // Only enable on home page
    if (pathname !== '/') {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();

        // Find current section index
        const currentIndex = sections.findIndex((s) => {
          if (!activeSection) return false;
          if (s.type !== activeSection.type) return false;
          if (s.type === 'case-study') {
            return activeSection.identifier === s.id;
          }
          return activeSection.identifier === s.id;
        });

        let targetIndex: number;
        if (e.key === 'ArrowDown') {
          targetIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else {
          targetIndex = Math.max(currentIndex - 1, 0);
        }

        // If we're at the same index or couldn't find current, default to first/last
        if (currentIndex === -1) {
          targetIndex = e.key === 'ArrowDown' ? 0 : sections.length - 1;
        }

        const targetSection = sections[targetIndex];
        if (targetSection) {
          const element = document.getElementById(targetSection.id);
          if (element && ref.current) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, sections, activeSection]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ref.current) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
        setActiveSection({ type: 'case-study', identifier: hash });
      }
    }
  }, [setActiveSection]);

  return (
    <motion.main
      ref={ref}
      layoutScroll
      className="w-full max-w-full py-2 md:py-0 flex flex-col bg-transparent scroll-pt-20 md:scroll-pt-0"
    >
      <FadeIn>
        <div className="flex flex-col h-min  overflow-x-visible gap-2 pt-[60vh] pb-[30vh] ">
          <IntroCardLines />
          <div className="h-12" />

          <CaseStudy01SublinkNew />
          <div className="h-12" />

          <CaseStudy05AuctionHouseNew />
          <div className="h-12" />

          <CaseStudy04RenewcellToolkitNew />
          <div className="h-12" />
          <CaseStudy02ArbitragePlatformNew />
          <CaseStudy03SocialGraphNew />
          <Footer />
        </div>
      </FadeIn>
      
    </motion.main>
  );
}
