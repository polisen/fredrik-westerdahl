'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { CaseStudy as CaseStudyType } from 'contentlayer/generated';
import { hexToRgba, getCaseTheme } from '@/lib/case-study-utils';

interface CaseStudyScrollContainerProps {
  children: ReactNode;
  caseStudy: CaseStudyType;
  className?: string;
  totalPages?: number;
}

export const CaseStudyScrollContainer = forwardRef<
  HTMLDivElement,
  CaseStudyScrollContainerProps
>(({ children, caseStudy, className, totalPages }, ref) => {
  const theme = getCaseTheme(caseStudy);

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col md:flex-row h-auto md:h-full md:overflow-x-auto md:flex-nowrap hide-scrollbar px-8  rounded-3xl md:scroll-smooth md:snap-x md:scroll-padding-x-8 md:snap-mandatory',
        className
      )}
      style={{
        ['--case-bg' as string]: theme.background,
        ['--case-fg' as string]: theme.foreground,
        ['--case-muted' as string]: hexToRgba(theme.foreground, 0.65),
        ['--case-border' as string]: hexToRgba(theme.foreground, 0.15),
        ['--case-pill-bg' as string]: hexToRgba(theme.foreground, 0.08),
        ['--case-accent' as string]: theme.primary ?? theme.foreground,
        // Ensure scrollbar is hidden
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      } as React.CSSProperties}
    >
      {/* Left padding spacer */}
      <div className="hidden md:block md:snap-start shrink-0 w-6" />

      {children}

      {/* Right padding spacer */}
      <div className="hidden md:block shrink-0 w-14" />
    </div>
  );
});

CaseStudyScrollContainer.displayName = 'CaseStudyScrollContainer';
