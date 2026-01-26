'use client';

import { useRef } from 'react';
import { FocusableButton } from '@/components/FocusableButton';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { CaseStudyCoverContent } from '@/components/CaseStudyCoverContent';
import { CaseStudyScrollContainer } from '@/components/CaseStudyScrollContainer';
import { CaseStudyPageIndicator } from '@/components/CaseStudyPageIndicator';
import { cn } from '@/lib/utils';
import { allCaseStudies, allInsights } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Link from 'next/link';
import { lightenColor, getCaseTheme, useGradientBackgroundStyle } from '@/lib/case-study-utils';

export function CaseStudy01Sublink() {
  const caseStudy = allCaseStudies.find((cs) => cs.slug === '01-sublink');
  const MDXContent = useMDXComponent(caseStudy?.body.code || '');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Call hooks before early return to follow React rules
  const theme = caseStudy ? getCaseTheme(caseStudy) : null;
  const backgroundStyle = useGradientBackgroundStyle(theme?.background || '#F3F4F6');

  if (!caseStudy || !theme) return null;

  // Filter insights based on slugs defined in case study
  const relatedInsights = (allInsights as any[]).filter((insight: any) =>
    (caseStudy as any).insightSlugs?.includes(insight.slug)
  );

  const relatedInsightsContent =
    relatedInsights.length > 0 ? (
      <div>
        <div className="text-xs md:text-sm font-semibold uppercase tracking-wider mb-3 md:mb-4 text-[color:var(--case-muted)]">
          Related Insights
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {relatedInsights.map((insight: any) => (
            <FocusableButton key={insight._id}>
              <Link
                href={insight.url}
                className={cn(
                  'block px-2 py-1.5 text-lg hover:rounded-xl rounded-md transition-colors text-nowrap shrink-0 backdrop-blur-md w-full md:w-max',
                  'bg-[color:var(--case-pill-bg)] text-[color:var(--case-muted)] hover:text-[color:var(--case-fg)]'
                )}
              >
                {insight.title}
              </Link>
            </FocusableButton>
          ))}
        </div>
      </div>
    ) : null;

  // Create different colors for the cards
  const leftColumnColor = theme.background;
  const rightColumnColor = lightenColor(theme.background, 0.3); // Slightly lighter for contrast
  const masonryCardColor = lightenColor(theme.background, 0.5); // Even lighter for the masonry card

  // Count total pages: 1 cover card + content cards
  const totalPages = 3; // 1 cover + 2 content cards

  return (
    <>
      <CaseStudyScrollContainer
        ref={scrollContainerRef}
        caseStudy={caseStudy}
        totalPages={totalPages}
      >
        <CaseStudyCard 
          color={leftColumnColor} 
          shape="rounded"
          className=" p-8 pb-0  pt-12 xl:p-20"
          backgroundStyle={backgroundStyle}
          backgroundImage="url('/sublink_image.jpeg')"
        >
          <CaseStudyCoverContent
            caseStudy={caseStudy}
            relatedInsights={relatedInsightsContent}
          />
        </CaseStudyCard>
        <CaseStudyCard color={rightColumnColor} shape="rounded" masked={true}>
          <MDXContent />
          <MDXContent />
          <MDXContent />
          {relatedInsightsContent && (
            <div className="mt-8 md:hidden [&_*]:!text-[color:var(--case-fg)]">
              {relatedInsightsContent}
            </div>
          )}
        </CaseStudyCard>
        <CaseStudyCard color={masonryCardColor} shape="rounded" masked={true}>
          <div className="columns-2 md:columns-3 gap-4 md:gap-6 p-6 md:p-8 lg:p-12 xl:p-20">
            {/* Masonry cards with varying heights */}
            <div className="break-inside-avoid mb-4 md:mb-6 h-32 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-24 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-40 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-28 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-36 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-48 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-32 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-44 rounded-2xl bg-gray-100/50"></div>
            <div className="break-inside-avoid mb-4 md:mb-6 h-24 rounded-2xl bg-gray-100/50"></div>
          </div>
        </CaseStudyCard>
      </CaseStudyScrollContainer>
      <CaseStudyPageIndicator
        containerRef={scrollContainerRef}
        totalPages={totalPages}
        className="fixed bottom-0 left-0 right-0 z-50"
      />
    </>
  );
}
