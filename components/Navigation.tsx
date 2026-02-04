'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { allCaseStudies } from 'contentlayer/generated';
import { useApp } from '@/context/AppContext';

export function Navigation() {
  const pathname = usePathname();
  const { activeSection } = useApp();

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [caseStudiesMenuOpen, setCaseStudiesMenuOpen] = useState(false);

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

  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);

  // Determine if Fredrik should be selected (when at intro section on home page)
  const isFredrikSelected = pathname === '/' && activeSection?.type === 'intro';

  // Determine if Case Studies should be selected (when a case study is in view)
  const isCaseStudiesSelected =
    pathname === '/' &&
    activeSection?.type === 'case-study' &&
    caseStudies.some((cs) => cs.slug === activeSection.identifier);

  // Determine if Projects should be selected (when a project is in view)
  const isProjectsSelected =
    pathname === '/' &&
    activeSection?.type === 'case-study' &&
    projects.some((cs) => cs.slug === activeSection.identifier);

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {(caseStudiesMenuOpen || projectsMenuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 backdrop-blur-xl bg-black/10"
            onClick={() => {
              setCaseStudiesMenuOpen(false);
              setProjectsMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <motion.nav
        layout={false}
        layoutScroll
        className="fixed top-0 left-0 right-0 w-full p-8 pl-4 pr-4 md:pl-10 md:pr-10 md:py-8 z-50"
      >
        <div className="flex gap-4 items-start w-full">
          {/* layoutRoot + shared layoutId for morph animation between Fredrik and nav buttons */}
          <motion.div layoutRoot className="flex items-center gap-0 shrink-0 rounded-md h-8 bg-gray-100">
            {/* Fredrik - inside layoutRoot for shared animation */}
            <div className="relative">
              <Link
                href="/"
                className={cn(
                  'h-8 px-2 rounded-md backdrop-blur-md text-lg hover:underline shadow-md block relative transition-opacity',
                  isFredrikSelected ? 'opacity-100' : 'bg-gray-100/80 opacity-80 hover:opacity-100'
                )}
              >
                <div className="z-30 opacity-0">About</div>
                <motion.div
                  onHoverStart={() => setHoveredLink('/fredrik')}
                  onHoverEnd={() => setHoveredLink(isFredrikSelected ? '/fredrik' : null)}
                  className="z-30 absolute inset-0 flex items-center justify-center"
                >
                  About
                </motion.div>
                {(hoveredLink === '/fredrik' || (!hoveredLink && isFredrikSelected)) ? (
                  <motion.div
                    layoutId="active-nav-indicator"
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="absolute inset-0 z-0 pointer-events-none bg-[#fdfdfd] rounded-md"
                  />
                ) : null}
              </Link>
            </div>

            {/* Case Studies dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCaseStudiesMenuOpen((prev) => !prev);
                  setProjectsMenuOpen(false);
                }}
                className={cn(
                  'text-lg h-8 px-2 block relative transition-opacity hover:opacity-100',
                  caseStudiesMenuOpen || isCaseStudiesSelected ? 'opacity-100' : 'opacity-60'
                )}
              >
                <div className="z-30 opacity-0">Case Studies</div>
                <motion.div
                  onHoverStart={() => setHoveredLink('/case-studies')}
                  onHoverEnd={() => setHoveredLink(caseStudiesMenuOpen ? '/case-studies' : null)}
                  className="z-30 absolute inset-0 flex items-center justify-center"
                >
                  Case Studies
                </motion.div>
                {(hoveredLink === '/case-studies' || (!hoveredLink && (caseStudiesMenuOpen || isCaseStudiesSelected))) ? (
                  <motion.div
                    layoutId="active-nav-indicator"
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="absolute inset-0 z-0 pointer-events-none bg-[#fdfdfd] rounded-md"
                  />
                ) : null}
              </button>
              <AnimatePresence>
                {caseStudiesMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="fixed md:absolute top-[5rem] md:top-full left-8 right-8 md:left-0 md:right-auto md:mt-2 max-h-[60vh] overflow-y-auto flex flex-col gap-2 z-50"
                  >
                    {caseStudies.map((caseStudy, i) => {
                      const isCurrent =
                        pathname === '/' &&
                        activeSection?.type === 'case-study' &&
                        activeSection.identifier === caseStudy.slug;
                      return (
                        <motion.div
                          key={caseStudy._id}
                          initial={{ opacity: 0, x: -10, filter: 'blur(16px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, x: -10, filter: 'blur(16px)' }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            href={`/#${caseStudy.slug}`}
                            onClick={(e) => {
                              if (pathname === '/') {
                                e.preventDefault();
                                const element = document.getElementById(caseStudy.slug);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }
                              setCaseStudiesMenuOpen(false);
                            }}
                            className={cn(
                              'block px-2 py-1.5 text-lg hover:rounded-xl rounded-md transition-colors text-nowrap shrink-0 backdrop-blur-md bg-gray-50 w-full md:w-max',
                              isCurrent ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                            )}
                          >
                            {caseStudy.title}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Projects dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProjectsMenuOpen((prev) => !prev);
                  setCaseStudiesMenuOpen(false);
                }}
                className={cn(
                  'text-lg h-8 px-2 block relative transition-opacity hover:opacity-100',
                  projectsMenuOpen || isProjectsSelected ? 'opacity-100' : 'opacity-60'
                )}
              >
                <div className="z-30 opacity-0">Projects</div>
                <motion.div
                  onHoverStart={() => setHoveredLink('/projects')}
                  onHoverEnd={() => setHoveredLink(projectsMenuOpen ? '/projects' : null)}
                  className="z-30 absolute inset-0 flex items-center justify-center"
                >
                  Projects
                </motion.div>
                {(hoveredLink === '/projects' || (!hoveredLink && (projectsMenuOpen || isProjectsSelected))) ? (
                  <motion.div
                    layoutId="active-nav-indicator"
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="absolute inset-0 z-0 pointer-events-none bg-[#fdfdfd] rounded-md"
                  />
                ) : null}
              </button>
              <AnimatePresence>
                {projectsMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="fixed md:absolute top-[5rem] md:top-full left-8 right-8 md:left-0 md:right-auto md:mt-2 max-h-[60vh] overflow-y-auto flex flex-col gap-2 z-50"
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
                        >
                          <Link
                            href={`/#${project.slug}`}
                            onClick={(e) => {
                              if (pathname === '/') {
                                e.preventDefault();
                                const element = document.getElementById(project.slug);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }
                              setProjectsMenuOpen(false);
                            }}
                            className={cn(
                              'block px-2 py-1.5 text-lg hover:rounded-xl rounded-md transition-colors text-nowrap shrink-0 backdrop-blur-md bg-gray-50 w-full md:w-max',
                              isCurrent ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
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

          {/* CV button - green, far right of screen, opens PDF */}
          <a
            href="/fredrik_westerdahl_cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto h-8 px-4 rounded-md bg-gray-100/80 text-black text-lg font-medium shadow-md hover:bg-white transition-colors flex items-center justify-center"
          >
            CV
          </a>
        </div>
      </motion.nav>
    </>
  );
}
