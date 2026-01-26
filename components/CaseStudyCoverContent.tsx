'use client';

import { ReactNode } from 'react';
import type { CaseStudy as CaseStudyType } from 'contentlayer/generated';

interface CaseStudyCoverContentProps {
  caseStudy: CaseStudyType;
  relatedInsights?: ReactNode;
}

export function CaseStudyCoverContent({
  caseStudy,
  relatedInsights,
}: CaseStudyCoverContentProps) {
  return (
    <>
      <div className="mb-3 z-50 md:mb-4  ">
        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold tracking-tight mb-2 md:mb-3 leading-tight text-[color:var(--case-fg)]">
          {caseStudy.title}
        </h2>
        {caseStudy.subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl font-normal text-[color:var(--case-muted)]">
            {caseStudy.subtitle}
          </p>
        )}
      </div>
      {caseStudy.tagline && (
        <p className="text-base md:text-lg font-medium italic mt-2 md:mt-3  md:mb-6 text-[color:var(--case-muted)]">
          {caseStudy.tagline}
        </p>
      )}
      {relatedInsights && (
        <div className="mt-auto color-black hidden md:block">{relatedInsights}</div>
      )}
    </>
  );
}
