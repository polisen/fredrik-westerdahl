'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { springConfigs } from '@/lib/springConfigs';
import AsciiWave from './AsciiWave';

// Helper function to check if a container is actually scrollable
function checkIfContainerIsScrollable(container: HTMLElement): boolean {
  // Check computed overflow styles first - this is the most reliable indicator
  // A container is scrollable if it has overflow styles that enable scrolling
  const style = window.getComputedStyle(container);
  const hasOverflowScroll =
    style.overflow === 'auto' ||
    style.overflow === 'scroll' ||
    style.overflowY === 'auto' ||
    style.overflowY === 'scroll' ||
    style.overflowX === 'auto' ||
    style.overflowX === 'scroll';

  // If overflow styles are set, the container is scrollable (even if content doesn't overflow yet)
  if (hasOverflowScroll) {
    return true;
  }

  // Without overflow styles, the container is not scrollable
  // Even if content overflows, the window will scroll instead
  return false;
}

export function AnimatedHeader() {
  const pathname = usePathname();
  const { scrollContainerRef } = useApp();

  // Use useScroll for window scroll (default)
  const windowScroll = useScroll();

  // Create a motion value for container scroll
  const containerScrollY = useMotionValue(0);

  // State to track if container is scrollable
  const [isContainerScrollable, setIsContainerScrollable] = useState(false);

  // Check if container is scrollable
  useEffect(() => {
    const container = scrollContainerRef?.current;

    if (!container) {
      setIsContainerScrollable(false);
      return;
    }

    // Check if container is scrollable
    const checkScrollable = () => {
      setIsContainerScrollable(checkIfContainerIsScrollable(container));
    };

    // Initial check
    checkScrollable();

    // Re-check on resize (content might change)
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollContainerRef]);

  // Track container scroll if available and scrollable
  useEffect(() => {
    const container = scrollContainerRef?.current;

    if (!container || !isContainerScrollable) {
      return;
    }

    const updateScroll = () => {
      containerScrollY.set(container.scrollTop);
    };

    // Set initial value
    updateScroll();

    container.addEventListener('scroll', updateScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', updateScroll);
    };
  }, [scrollContainerRef, containerScrollY, isContainerScrollable]);

  // Compute sizes based on viewport
  const [startSize, setStartSize] = useState(0);
  const [endSize] = useState(16); // px, final font size
  const [totalH, setTotalH] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSizes = () => {
      // Use visualViewport for better Chrome mobile compatibility
      // visualViewport accounts for address bar and safe areas
      const viewportHeight = 
        typeof window !== 'undefined' && window.visualViewport
          ? window.visualViewport.height
          : window.innerHeight;
      
      setStartSize(window.innerWidth * 0.05); // 5vw starting size
      setTotalH(viewportHeight * 0.28); // 28% of viewport height
      setIsMobile(window.innerWidth < 768); // md breakpoint
      setIsReady(true);
    };
    updateSizes();
    
    // Listen to both window resize and visualViewport resize
    // visualViewport resize fires when address bar shows/hides on Chrome
    window.addEventListener('resize', updateSizes);
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateSizes);
      window.visualViewport.addEventListener('scroll', updateSizes);
    }
    
    return () => {
      window.removeEventListener('resize', updateSizes);
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateSizes);
        window.visualViewport.removeEventListener('scroll', updateSizes);
      }
    };
  }, []);

  // Use container scroll if available and scrollable, otherwise window scroll
  const baseScrollY =
    scrollContainerRef?.current && isContainerScrollable
      ? containerScrollY
      : windowScroll.scrollY;

  // Apply spring smoothing to the base scroll value (only if not reduced motion)
  // Always call useSpring (hooks must be called unconditionally), but use the original value if reduced motion
  const prefersReducedMotion = useReducedMotion();
  const springedScrollY = useSpring(baseScrollY, springConfigs.subtle);
  const smoothBaseScrollY = prefersReducedMotion ? baseScrollY : springedScrollY;

  // On non-main routes, force header to collapsed state by using a high scroll value
  // This ensures the top header is always minimized on routes other than "/"
  const isMainRoute = pathname === '/';
  const scrollY = useTransform(smoothBaseScrollY, (val) => {
    if (!isMainRoute && totalH > 0) {
      // Return a value that represents fully scrolled (collapsed state)
      // Use a value higher than totalH / 0.8 to ensure collapsed state
      return totalH / 0.8 + 400;
    }
    return val;
  });

  // Map scroll to progress value (0–1)
  const scrollRange = totalH * (1 / 0.6);
  const p = useTransform(scrollY, [0, scrollRange], [0, 1]);

  // Animate scale and header height
  // Text should finish scaling when header reaches collapsed state
  // On mobile, make collapsed state 30% larger (0.4 * 1.3 = 0.52)
  const collapsedScale = useMemo(() => (isMobile ? 0.52 : 0.4), [isMobile]);
  const textScale = useTransform(scrollY, [0, totalH / 0.8], [1, collapsedScale]);
  const headerHeight = useTransform(
    scrollY,
    [0, totalH / 0.8],
    [totalH + 60, 48]
  );

  // Animate top offset for main name to keep it centered when collapsed
  // When expanded: align to bottom. When collapsed: center in 48px
  // Using flexbox approach: position at 50% and use translateY to center
  // For expanded state, calculate pixel position. For collapsed, use 50% with -50% translateY
  const nameTopExpanded = totalH + 60 - 48 - 8;
  const nameTopCollapsed = 24; // 50% of 48px

  const nameTop = useTransform(
    scrollY,
    [0, totalH / 0.8],
    [nameTopExpanded, nameTopCollapsed]
  );

  // TranslateY to center: -50% when collapsed to properly center the scaled element
  // Convert numeric value to percentage string for CSS
  const nameTranslateYValue = useTransform(
    scrollY,
    [0, totalH / 0.8],
    [0, -50]
  );
  const nameTranslateY = useTransform(nameTranslateYValue, (val) => `${val}%`);

  // Animate top offset for nav links to keep them centered when collapsed
  // When expanded: top-3 (12px). When collapsed: center in 48px
  // For text-xs, approximate height is ~14px, so center at (48-14)/2 = 17px
  const navLinksTop = useTransform(scrollY, [0, totalH / 0.8], [12, 17]);

  // Secondary bar should stick below the main header
  // It starts collapsing AFTER the main header finishes collapsing
  // Scale much slower (4-5x) for a more graceful animation
  const secondaryBarHeight = useTransform(
    scrollY,
    [totalH / 0.8, totalH * 2.8],
    [totalH + 60, 48]
  );
  const secondaryTop = headerHeight;

  // Scale for secondary bar text - smaller when expanded, same when collapsed
  // When expanded: 0.8 (smaller), when collapsed: 0.525 (perfect as is)
  const secondaryTextScale = useTransform(
    scrollY,
    [totalH / 0.8, totalH * 2.8],
    [0.8, 0.525]
  );

  // Inverse scale for scroll container width - ensures scroll boundaries match visual boundaries
  // When content is scaled to 0.525, wrapper needs to be 1/0.525 ≈ 190% wide
  // When content is scaled to 0.8, wrapper needs to be 1/0.8 = 125% wide
  // Calculate inverse scale: 1 / scale, with a minimum value to avoid division by zero
  const inverseScale = useTransform(
    secondaryTextScale,
    (scale) => 1 / Math.max(scale, 0.01)
  );

  // Convert inverse scale to percentage width string
  const wrapperWidth = useTransform(inverseScale, (val) => `${val * 100}%`);

  // Animate top offset for secondary menu to keep it centered when collapsed
  // When expanded: positioned higher (with more padding). When collapsed: center in 48px
  // Position higher when expanded by reducing the starting value
  const secondaryMenuTop = useTransform(
    scrollY,
    [totalH / 0.8, totalH * 3.0],
    [totalH - 60, 12] // Higher position when expanded (was totalH + 0, now totalH - 60)
  );

  // Animate padding bottom for secondary menu - more padding when expanded
  const secondaryMenuPaddingBottom = useTransform(
    scrollY,
    [totalH / 0.8, totalH * 3.0],
    [12, 0] // More padding when expanded, none when collapsed
  );

  // Opacity for bio text - fades out aggressively when secondary bar is about 50% collapsed
  const bioTextOpacity = useTransform(
    scrollY,
    [totalH / 0.8, totalH / 0.8 + (totalH * 2.8 - totalH / 0.8) * 0.5],
    [1, 0]
  );

  // Blur for bio text - blurs as it fades out
  const bioTextBlur = useTransform(
    scrollY,
    [
      totalH / 0.8 + (totalH * 2.8 - totalH / 0.8) * 0.3,
      totalH / 0.8 + (totalH * 2.8 - totalH / 0.8) * 0.5,
    ],
    [0, 10]
  );

  // Opacity for AsciiWave - fades out as main header collapses
  const asciiWaveOpacity = useTransform(
    scrollY,
    [0, totalH / 0.8],
    [0.3, 0]
  );

  // Background color transition for main header - fluorescent yellow to white
  const headerBgColor = useTransform(
    scrollY,
    [0, totalH / 0.8],
    ['rgb(212, 249, 25)', 'rgb(255, 255, 255)']
  );

  // Text color for name - black throughout (visible on both yellow and white)
  const nameTextColor = useTransform(
    scrollY,
    [0, totalH / 0.8],
    ['rgb(0, 0, 0)', 'rgb(0, 0, 0)']
  );

  // Text color for nav links - black throughout
  const navTextColor = useTransform(
    scrollY,
    [0, totalH / 0.8],
    ['rgb(0, 0, 0)', 'rgb(0, 0, 0)']
  );

  // Text color for tagline - black throughout
  const taglineTextColor = useTransform(
    scrollY,
    [0, totalH / 0.8],
    ['rgb(0, 0, 0)', 'rgb(0, 0, 0)']
  );

  // Hide tagline once scrolled beyond 15px
  const [showTagline, setShowTagline] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (val) => {
      setShowTagline(val < 15);
      setIsScrolled(val > 40);
    });
    return unsubscribe;
  }, [scrollY]);

  // Navigation items for the secondary bar
  const secondaryNavItems = [{ label: 'Portfolio', path: '/' }];

  // Don't render until we have calculated sizes
  if (!isReady) {
    return null;
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[60] overflow-hidden backdrop-blur-sm border-b border-black/10"
        style={{ 
          height: headerHeight,
          backgroundColor: headerBgColor,
        }}
      >
        <motion.div className="relative h-full max-w-screen-2xl mx-auto ">
          {/* AsciiWave background */}
          <motion.div
            className="w-full absolute inset-0 z-0"
            style={{ opacity: asciiWaveOpacity }}
          >
            <AsciiWave />
          </motion.div>

          {/* Tagline fades out on scroll - positioned at top */}

          <motion.span
            className="absolute left-5 top-3 text-[10px] uppercase tracking-[0.15em] leading-tight pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: showTagline ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ 
              maxWidth: '300px',
              color: taglineTextColor as any,
            }}
          >
            portfolio of Fredrik Westerdahl
          </motion.span>

          {/* Name positioned at bottom of container */}
          <motion.div
            className="absolute left-5 md:left-36 origin-left"
            style={{
              scale: textScale,
              top: nameTop,
              y: nameTranslateY,
            }}
          >
            <Link
              href="/"
              className="text-3xl md:text-5xl font-semibold tracking-tight transition-colors whitespace-nowrap"
            >
              <motion.span style={{ color: nameTextColor as any }}>
                Fredrik Westerdahl
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop nav items - positioned at top right */}
          <motion.nav
            className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-wider absolute right-5"
            style={{ top: navLinksTop }}
          >
            <motion.a
              href="https://github.com/polisen"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: navTextColor }}
            >
              GitHub
            </motion.a>
            <motion.a
              href="/fredrik_westerdahl_cv.pdf"
              download
              className="transition-colors"
              style={{ color: navTextColor }}
            >
              Download CV
            </motion.a>
          </motion.nav>
        </motion.div>
      </motion.header>

      {/* Secondary sticky bar - sticks below main header */}
      <motion.div
        className="fixed left-0 right-0 z-[60] backdrop-blur-sm bg-gradient-to-br from-white/90 to-gray-100/90 border-b border-black/10 overflow-hidden"
        style={{ top: secondaryTop, height: secondaryBarHeight }}
      >
        <div className="max-w-screen-2xl mx-auto px-5 h-full relative">
          <motion.div
            className="absolute top-3 md:left-36"
            style={{
              opacity: bioTextOpacity,
              filter: `blur(${bioTextBlur}px)`,
            }}
          >
            <div className="font-semibold tracking-tight space-y-1">
              <div className="text-2xl">
                Software Engineer — Systems & Architecture
              </div>
              <div className="text-base text-gray-700 max-w-4xl">
                Designing and operating production systems under real-world
                constraints.
              </div>
            </div>
          </motion.div>

          {/* Horizontal navigation menu - positioned at bottom when expanded */}
          <div className="absolute left-5 md:left-32 inset-x-0 px-3 bottom-0 overflow-x-auto scrollbar-hide">
            {/* Wrapper with inverse scale width to fix scroll boundaries */}
            <motion.div
              className="origin-left "
              style={{
                width: wrapperWidth,
              }}
            >
              <motion.div
                className=" w-max origin-left "
                style={{ scale: secondaryTextScale, top: secondaryMenuTop }}
              >
                <motion.div
                  className="flex items-center w-full gap-8 pl-3"
                  style={{ paddingBottom: secondaryMenuPaddingBottom }}
                >
                  {secondaryNavItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="text-3xl md:text-5xl font-semibold tracking-tight hover:text-gray-600 transition-all whitespace-nowrap"
                        style={{ opacity: isActive ? 1 : 0.4 }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
