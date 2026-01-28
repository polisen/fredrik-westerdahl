'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { allCaseStudies } from 'contentlayer/generated';
import { useApp } from '@/context/AppContext';

export function Navigation() {
  const pathname = usePathname();
  const { activeSection } = useApp();

  const links = [
    { href: '/', label: 'Portfolio' },
    // { href: '/creative', label: 'Creative' },
  ];

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [caseStudiesMenuOpen, setCaseStudiesMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const sortedCaseStudies = useMemo(() => {
    if (!allCaseStudies || !Array.isArray(allCaseStudies)) {
      return [];
    }
    return [...allCaseStudies].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, []);

  // Determine if Fredrik should be selected (when at intro section on home page)
  const isFredrikSelected = pathname === '/' && activeSection?.type === 'intro';
  
  // Determine if Portfolio should be selected (when on home page but not at intro)
  const isCaseStudiesSelected =
    pathname === '/' && activeSection?.type !== 'intro' && activeSection !== null;

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {caseStudiesMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 backdrop-blur-xl bg-black/10"
            onClick={() => {
              setCaseStudiesMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <motion.nav
        layout={false}
        layoutScroll
        className="fixed top-0 left-0 p-8 md:pl-8 md:py-8 z-50"
      >
        <div className="flex gap-4 items-start">
          <div className="relative">
            <Link 
              href="/" 
              className={cn(
                'h-8 bg-gray-100 px-2 rounded-md text-lg hover:underline block relative transition-opacity',
                isFredrikSelected ? 'opacity-100' : 'opacity-60'
              )}
            >
              <div className="z-30 opacity-0">Fredrik</div>
              <motion.div
                onHoverStart={() => setHoveredLink('/fredrik')}
                onHoverEnd={() => setHoveredLink(isFredrikSelected ? '/fredrik' : null)}
                className="z-30 absolute inset-0 flex items-center justify-center"
              >
                Fredrik
              </motion.div>
              {(hoveredLink === '/fredrik' || isFredrikSelected) ? (
                <motion.div
                  layoutId="active-link-fredrik"
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="absolute inset-0 z-0 pointer-events-none bg-[#fdfdfd] rounded-md"
                />
              ) : null}
            </Link>
          </div>

          {/* layoutRoot scopes shared layout to THIS container */}
          <motion.div
            layoutRoot
            className="flex shrink-0 rounded-md h-8 bg-gray-100 gap-0"
          >
            {links.map((link) => {
              const isCaseStudies = link.label === 'Portfolio';
              const showCaseStudiesList = isCaseStudies && caseStudiesMenuOpen;

              // For Case Studies, render a button with dropdown
              if (isCaseStudies) {
                return (
                  <div key={link.href} className="relative">
                    <button
                      onClick={() => {
                        setCaseStudiesMenuOpen(prev => !prev);
                      }}
                      className={cn(
                        'text-lg h-8 px-2 block relative transition-opacity hover:opacity-100',
                        caseStudiesMenuOpen || isCaseStudiesSelected ? 'opacity-100' : 'opacity-60'
                      )}
                    >
                      <div className="z-30 opacity-0">{link.label}</div>

                      <motion.div
                        onHoverStart={() => setHoveredLink(link.href)}
                        onHoverEnd={() => setHoveredLink(caseStudiesMenuOpen ? link.href : null)}
                        className="z-30 absolute inset-0 flex items-center justify-center"
                      >
                        {link.label}
                      </motion.div>

                      {(hoveredLink === link.href || caseStudiesMenuOpen || isCaseStudiesSelected) ? (
                        <motion.div
                          layoutId="active-link-portfolio"
                          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                          className="absolute inset-0 z-0 pointer-events-none bg-[#fdfdfd] rounded-md"
                        />
                      ) : null}
                    </button>

                    <AnimatePresence>
                      {showCaseStudiesList && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="fixed md:absolute top-[5rem] md:top-full left-8 right-8 md:left-0 md:right-auto md:mt-2 max-h-[60vh] overflow-y-auto flex flex-col gap-2 "
                        >
                          {sortedCaseStudies.map((caseStudy, i) => {
                            const isCurrentCaseStudy =
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
                                    "block px-2 py-1.5 text-lg hover:rounded-xl rounded-md transition-colors text-nowrap shrink-0 backdrop-blur-md bg-gray-50 w-full md:w-max",
                                    isCurrentCaseStudy ? "text-black font-medium" : "text-gray-500 hover:text-black"
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
                );
              }

              // For other links, render normally
              return (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      'text-lg h-8 px-2 block relative transition-opacity hover:opacity-100',
                      pathname === link.href ? 'opacity-100' : 'opacity-60'
                    )}
                  >
                    <div className="z-30 opacity-0">{link.label}</div>

                    <motion.div
                      onHoverStart={() => setHoveredLink(link.href)}
                      onHoverEnd={() => setHoveredLink(pathname)}
                      className="z-30 absolute inset-0 flex items-center justify-center"
                    >
                      {link.label}
                    </motion.div>

                    {(hoveredLink === link.href || pathname === link.href) ? (
                      <motion.div
                        layoutId={`active-link-${link.href.replace('/', '')}`}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className="absolute inset-0 z-0 pointer-events-none bg-[#fdfdfd] rounded-md"
                      />
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
