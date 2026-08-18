'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useRef } from 'react';
import { allCaseStudies } from 'contentlayer/generated';
import { useApp } from '@/context/AppContext';
import { getCaseStudyHeader } from '@/lib/caseStudyHeader';
import { MenuOverlayFooter } from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const NAV_SIZE = {
  top: { h: '2.75rem', px: '0.75rem', fs: '1.25rem', py: '3rem', scale: '1' },
  scrolled: { h: '2rem', px: '0.5rem', fs: '1.125rem', py: '2.25rem', scale: '0.73' },
} as const;

const headerPillClass = (active: boolean) =>
  cn(
    'inline-flex items-center h-10 px-3 rounded-2xl text-xl font-normal shrink-0 transition-[background-color,color] duration-700 ease-in-out backdrop-blur-xl',
    active
      ? 'bg-black text-white'
      : 'bg-white/60 text-black'
  );

const activePillClass =
  'absolute inset-0 z-0 pointer-events-none rounded-full bg-white/30 backdrop-blur-md';

const labelClass =
  'absolute inset-0 z-10 flex items-center justify-center text-black';

export function Navigation() {
  const pathname = usePathname();
  const { activeSection } = useApp();
  const navRef = useRef<HTMLElement>(null);

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [caseStudiesMenuOpen, setCaseStudiesMenuOpen] = useState(false);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          motionOk: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const reduceMotion = context.conditions?.reduceMotion;

          if (reduceMotion) {
            gsap.set(nav, {
              '--nav-h': NAV_SIZE.scrolled.h,
              '--nav-px': NAV_SIZE.scrolled.px,
              '--nav-fs': NAV_SIZE.scrolled.fs,
              '--nav-py': NAV_SIZE.scrolled.py,
              '--nav-scale': NAV_SIZE.scrolled.scale,
            });
            return;
          }

          gsap.fromTo(
            nav,
            {
              '--nav-h': NAV_SIZE.top.h,
              '--nav-px': NAV_SIZE.top.px,
              '--nav-fs': NAV_SIZE.top.fs,
              '--nav-py': NAV_SIZE.top.py,
              '--nav-scale': NAV_SIZE.top.scale,
            },
            {
              '--nav-h': NAV_SIZE.scrolled.h,
              '--nav-px': NAV_SIZE.scrolled.px,
              '--nav-fs': NAV_SIZE.scrolled.fs,
              '--nav-py': NAV_SIZE.scrolled.py,
              '--nav-scale': NAV_SIZE.scrolled.scale,
              ease: 'none',
              scrollTrigger: {
                start: 0,
                end: 320,
                scrub: 0.5,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: navRef }
  );

  const sortedCaseStudies = useMemo(() => {
    if (!allCaseStudies || !Array.isArray(allCaseStudies)) {
      return [];
    }
    return [...allCaseStudies].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, []);

  const PROJECT_SLUGS = ['02-arbitrage-platform', '03-social-graph'];

  const caseStudies = useMemo(
    () => sortedCaseStudies.filter((cs) => !PROJECT_SLUGS.includes(cs.slug)),
    [sortedCaseStudies]
  );
  const projects = useMemo(
    () => sortedCaseStudies.filter((cs) => PROJECT_SLUGS.includes(cs.slug)),
    [sortedCaseStudies]
  );

  const isFredrikSelected = pathname === '/' && activeSection?.type === 'intro';

  const isCaseStudiesSelected =
    pathname === '/' &&
    activeSection?.type === 'case-study' &&
    caseStudies.some((cs) => cs.slug === activeSection.identifier);

  const isProjectsSelected =
    pathname === '/' &&
    activeSection?.type === 'case-study' &&
    projects.some((cs) => cs.slug === activeSection.identifier);

  const menuOpen = caseStudiesMenuOpen || projectsMenuOpen;

  const closeMenus = () => {
    setCaseStudiesMenuOpen(false);
    setProjectsMenuOpen(false);
  };

  const scrollToId = (id: string) => {
    if (pathname !== '/') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const navItemShell =
    'block relative h-[length:var(--nav-h)] px-[length:var(--nav-px)] text-[length:var(--nav-fs)]';

  const dropdownClass =
    'fixed md:absolute top-[5.5rem] md:top-full left-8 right-8 md:left-0 md:right-auto md:mt-5 max-h-[min(70vh,calc(100dvh-8rem))] overflow-y-auto flex flex-col gap-2.5 z-50 pb-28';

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 backdrop-blur-xl bg-black/10"
            onClick={closeMenus}
          />
        )}
      </AnimatePresence>

      <MenuOverlayFooter open={menuOpen} />

      <motion.nav
        ref={navRef}
        layout={false}
        layoutScroll
        className="fixed top-0 left-0 right-0 w-full pl-4 pr-4 md:pl-10 md:pr-10 z-50 [--nav-h:2.75rem] [--nav-px:0.75rem] [--nav-fs:1.25rem] [--nav-py:3rem] [--nav-scale:1]"
        style={{
          paddingTop: 'var(--nav-py)',
          paddingBottom: 'var(--nav-py)',
        }}
      >
        <div className="flex gap-4 items-start w-full">
          <motion.div
            layoutRoot
            className="relative isolate flex items-center gap-0 shrink-0 rounded-full bg-white/60 backdrop-blur-xl p-1"
          >
            {/* About */}
            <div className="relative">
              <Link
                href="/"
                className={navItemShell}
                onClick={closeMenus}
              >
                <div className="opacity-0">About</div>
                {(hoveredLink === '/fredrik' ||
                  (!hoveredLink && !menuOpen && isFredrikSelected)) ? (
                  <motion.div
                    layoutId="active-nav-indicator"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className={activePillClass}
                  />
                ) : null}
                <motion.div
                  onHoverStart={() => setHoveredLink('/fredrik')}
                  onHoverEnd={() =>
                    setHoveredLink(isFredrikSelected ? '/fredrik' : null)
                  }
                  className={labelClass}
                >
                  About
                </motion.div>
              </Link>
            </div>

            {/* Case Studies */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCaseStudiesMenuOpen((prev) => !prev);
                  setProjectsMenuOpen(false);
                }}
                className={navItemShell}
              >
                <div className="opacity-0">Case Studies</div>
                {(hoveredLink === '/case-studies' ||
                  (!hoveredLink &&
                    (caseStudiesMenuOpen || isCaseStudiesSelected))) ? (
                  <motion.div
                    layoutId="active-nav-indicator"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className={activePillClass}
                  />
                ) : null}
                <motion.div
                  onHoverStart={() => setHoveredLink('/case-studies')}
                  onHoverEnd={() =>
                    setHoveredLink(caseStudiesMenuOpen ? '/case-studies' : null)
                  }
                  className={labelClass}
                >
                  Case Studies
                </motion.div>
              </button>
              <AnimatePresence>
                {caseStudiesMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={dropdownClass}
                  >
                    {caseStudies.map((caseStudy, i) => {
                      const isCurrent =
                        pathname === '/' &&
                        activeSection?.type === 'case-study' &&
                        activeSection.identifier === caseStudy.slug;
                      const { years, visitUrl } = getCaseStudyHeader(
                        caseStudy.slug
                      );
                      const scrollToCase = () => {
                        scrollToId(caseStudy.slug);
                        closeMenus();
                      };
                      return (
                        <motion.div
                          key={caseStudy._id}
                          initial={{ opacity: 0, x: -10, filter: 'blur(16px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, x: -10, filter: 'blur(16px)' }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 w-max"
                        >
                          <Link
                            href={`/#${caseStudy.slug}`}
                            onClick={(e) => {
                              if (pathname === '/') e.preventDefault();
                              scrollToCase();
                            }}
                            className={cn(
                              headerPillClass(isCurrent),
                              'capitalize'
                            )}
                          >
                            {caseStudy.title}
                          </Link>
                          {years ? (
                            <button
                              type="button"
                              onClick={scrollToCase}
                              className={headerPillClass(isCurrent)}
                            >
                              {years}
                            </button>
                          ) : null}
                          {visitUrl ? (
                            <a
                              href={visitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={cn(headerPillClass(isCurrent), 'gap-1')}
                            >
                              Visit
                              <ArrowUpRight className="size-4" />
                            </a>
                          ) : null}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Projects */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProjectsMenuOpen((prev) => !prev);
                  setCaseStudiesMenuOpen(false);
                }}
                className={navItemShell}
              >
                <div className="opacity-0">Projects</div>
                {(hoveredLink === '/projects' ||
                  (!hoveredLink &&
                    (projectsMenuOpen || isProjectsSelected))) ? (
                  <motion.div
                    layoutId="active-nav-indicator"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className={activePillClass}
                  />
                ) : null}
                <motion.div
                  onHoverStart={() => setHoveredLink('/projects')}
                  onHoverEnd={() =>
                    setHoveredLink(projectsMenuOpen ? '/projects' : null)
                  }
                  className={labelClass}
                >
                  Projects
                </motion.div>
              </button>
              <AnimatePresence>
                {projectsMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={dropdownClass}
                  >
                    {projects.map((project, i) => {
                      const isCurrent =
                        pathname === '/' &&
                        activeSection?.type === 'case-study' &&
                        activeSection.identifier === project.slug;
                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, x: -10, filter: 'blur(16px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, x: -10, filter: 'blur(16px)' }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 w-max"
                        >
                          <Link
                            href={`/#${project.slug}`}
                            onClick={(e) => {
                              if (pathname === '/') {
                                e.preventDefault();
                                scrollToId(project.slug);
                              }
                              closeMenus();
                            }}
                            className={cn(
                              headerPillClass(isCurrent),
                              'capitalize'
                            )}
                          >
                            {project.title}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
