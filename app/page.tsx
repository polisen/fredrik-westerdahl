'use client';
import { allCaseStudies } from 'contentlayer/generated';
import { FadeIn } from '@/components/FadeIn';
import ScrollLinked from '@/components/ScrollLinked';
import { FooterNavigation } from '@/components/FooterNavigation';
import { Footer } from '@/components/Footer';
import { useRef, useEffect, useMemo, useState } from 'react';
import { useMotionValueEvent, useScroll, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { ActiveSection } from '@/context/AppContext';
import { TechGooeyGraphCard } from '@/components/TechGooeyGraphCard';
import { GooContainer } from '@/components/GooContainer';
import { StyleCard } from '@/components/StyleCard';
import { CaseStudy01SublinkNew } from '@/components/CaseStudy01SublinkNew';
import { CaseStudy02ArbitragePlatformNew } from '@/components/CaseStudy02ArbitragePlatformNew';
import { CaseStudy03SocialGraphNew } from '@/components/CaseStudy03SocialGraphNew';
import { CaseStudy04RenewcellToolkitNew } from '@/components/CaseStudy04RenewcellToolkitNew';
import { CaseStudy05AuctionHouseNew } from '@/components/CaseStudy05AuctionHouseNew';
import dynamic from 'next/dynamic';
import AsciiWave from '@/components/AsciiWave';

const Button3D = dynamic(() => import('@/components/3d/Button3D'), {
  ssr: false,
});

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

  const { scrollYProgress } = useScroll({
    container: ref as React.RefObject<HTMLDivElement>,
  });

  // Update global scrollYProgress when it changes
  useEffect(() => {
    return () => {
      setScrollYProgress(null);
    };
  }, [scrollYProgress, setScrollYProgress]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // reacts on every update
    setScrollYProgress(latest);
  });

  const sortedCaseStudies = useMemo(
    () => [...allCaseStudies].sort((a, b) => (a.order || 0) - (b.order || 0)),
    []
  );

  // Create ordered list of all sections for navigation
  const sections = useMemo(() => {
    return [
      { type: 'intro' as const, id: 'intro' },
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
      className="w-full  max-w-full py-2 md:py-0 flex flex-col  bg-white bg-gradient-to-b   scroll-pt-20 md:scroll-pt-0"
    >
      <FadeIn>
        <div className="flex flex-col h-min ">
          {/* About Me Header Section */}
          <motion.section
            id="intro"
            onViewportEnter={() =>
              setActiveSection({
                type: 'intro',
                identifier: 'intro',
              })
            }
            viewport={{ margin: '-20% 0px -20% 0px' }}
            className="md:snap-center flex flex-col overflow-visible "
          >
            <div className="w-full py-2 px-2 md:px-5 ">
              <div className="w-full mx-auto">
                <GooContainer
                  shape="rectangle"
                  backgroundStyle={{
                    backgroundColor: '#002FA7',
                  }}
                  style={{
                    paddingTop: 'calc(80vh)',
                    color: 'white',
                  }}
                  className="rounded-lg p-8 md:p-12 relative z-10 *:text-white"
                >
                  <div className="flex flex-col gap-6 relative z-10 mx-auto ml-0 md:ml-20 max-w-4xl px-4 md:px-0">
                    <StyleCard.Paragraph title="About" textColor="white">
                      The case studies below reflect a handful of systems
                      I&apos;ve worked on over the past few years, each shaped
                      by a different set of real-world constraints. They&apos;re
                      intentionally concise, aiming to capture the essence of
                      each challenge.
                    </StyleCard.Paragraph>
                    <div className="w-full px-2 z-50 pb-6 ">
                      <div className="w-full z-[100]">
                        <div className="h-px bg-white/10" />
                      </div>
                    </div>
                  </div>
                </GooContainer>
              </div>
            </div>
            {/* Bottom border */}
          </motion.section>

          <motion.section
            id="01-sublink"
            onViewportEnter={() =>
              setActiveSection({
                type: 'case-study',
                identifier: '01-sublink',
              })
            }
            viewport={{ margin: '-20% 0px -20% 0px' }}
            className="md:snap-center flex flex-col overflow-visible"
          >
            <CaseStudy01SublinkNew
              isExpanded={expandedCaseStudy === '01-sublink'}
              onToggle={() =>
                setExpandedCaseStudy(
                  expandedCaseStudy === '01-sublink' ? null : '01-sublink'
                )
              }
            />
          </motion.section>

          <motion.section
            id="02-arbitrage-platform"
            onViewportEnter={() =>
              setActiveSection({
                type: 'case-study',
                identifier: '02-arbitrage-platform',
              })
            }
            viewport={{ margin: '-20% 0px -20% 0px' }}
            className="md:snap-center flex flex-col overflow-visible"
          >
            <CaseStudy02ArbitragePlatformNew
              isExpanded={expandedCaseStudy === '02-arbitrage-platform'}
              onToggle={() =>
                setExpandedCaseStudy(
                  expandedCaseStudy === '02-arbitrage-platform'
                    ? null
                    : '02-arbitrage-platform'
                )
              }
            />
          </motion.section>
          <motion.section
            id="03-social-graph"
            onViewportEnter={() =>
              setActiveSection({
                type: 'case-study',
                identifier: '03-social-graph',
              })
            }
            viewport={{ margin: '-20% 0px -20% 0px' }}
            className="md:snap-center flex flex-col overflow-visible"
          >
            <CaseStudy03SocialGraphNew
              isExpanded={expandedCaseStudy === '03-social-graph'}
              onToggle={() =>
                setExpandedCaseStudy(
                  expandedCaseStudy === '03-social-graph'
                    ? null
                    : '03-social-graph'
                )
              }
            />
          </motion.section>
          <motion.section
            id="04-renewcell-toolkit"
            onViewportEnter={() =>
              setActiveSection({
                type: 'case-study',
                identifier: '04-renewcell-toolkit',
              })
            }
            viewport={{ margin: '-20% 0px -20% 0px' }}
            className="md:snap-center flex flex-col overflow-visible"
          >
            <CaseStudy04RenewcellToolkitNew
              isExpanded={expandedCaseStudy === '04-renewcell-toolkit'}
              onToggle={() =>
                setExpandedCaseStudy(
                  expandedCaseStudy === '04-renewcell-toolkit'
                    ? null
                    : '04-renewcell-toolkit'
                )
              }
            />
          </motion.section>
          <motion.section
            id="05-auction-house"
            onViewportEnter={() =>
              setActiveSection({
                type: 'case-study',
                identifier: '05-auction-house',
              })
            }
            viewport={{ margin: '-20% 0px -20% 0px' }}
            className="md:snap-center flex flex-col pb-16 overflow-visible "
          >
            <CaseStudy05AuctionHouseNew
              isExpanded={expandedCaseStudy === '05-auction-house'}
              onToggle={() =>
                setExpandedCaseStudy(
                  expandedCaseStudy === '05-auction-house'
                    ? null
                    : '05-auction-house'
                )
              }
            />
          </motion.section>
        </div>
      </FadeIn>
      <Footer />
    </motion.main>
  );
}
