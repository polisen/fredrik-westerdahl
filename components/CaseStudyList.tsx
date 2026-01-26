"use client";

import { CaseStudy } from './CaseStudy';
import type { CaseStudy as CaseStudyType } from 'contentlayer/generated';
import { FadeIn } from './FadeIn';

interface CaseStudyListProps {
    caseStudies: CaseStudyType[];
}

export function CaseStudyList({ caseStudies }: CaseStudyListProps) {
    // Sort by order
    const sorted = [...caseStudies].sort((a, b) => (a.order || 99) - (b.order || 99));

    return (
        <div className="flex flex-col gap-12">
            {sorted.map((cs) => (
                <FadeIn key={cs._id}>
                    <CaseStudy caseStudy={cs} />
                </FadeIn>
            ))}
        </div>
    );
}
