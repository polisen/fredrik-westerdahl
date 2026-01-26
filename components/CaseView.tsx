"use client";

import { useMemo } from 'react';
import { useMDXComponent } from 'next-contentlayer/hooks';
import type { CaseStudy as CaseStudyType } from 'contentlayer/generated';
import { allCaseStudies, allInsights } from 'contentlayer/generated';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CaseViewProps {
    caseStudy: CaseStudyType;
}

export function CaseView({ caseStudy }: CaseViewProps) {
    const MDXContent = useMDXComponent(caseStudy.body.code);
    const router = useRouter();
    const theme = caseStudy.theme ?? {
        background: '#F3F4F6',
        foreground: '#111827',
        primary: '#111827',
    };

    const hexToRgba = (hex: string, alpha: number) => {
        const normalized = hex.replace('#', '');
        const expanded = normalized.length === 3
            ? normalized.split('').map((c) => c + c).join('')
            : normalized;
        const r = parseInt(expanded.slice(0, 2), 16);
        const g = parseInt(expanded.slice(2, 4), 16);
        const b = parseInt(expanded.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

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
                        <Link
                            key={insight._id}
                            href={insight.url}
                            className={cn(
                                "block px-2 py-1.5 text-lg hover:rounded-xl rounded-md transition-colors text-nowrap shrink-0 backdrop-blur-md w-full md:w-max",
                                "bg-[color:var(--case-pill-bg)] text-[color:var(--case-muted)] hover:text-[color:var(--case-fg)]"
                            )}
                        >
                            {insight.title}
                        </Link>
                    ))}
                </div>
            </div>
        ) : null;

    const { previousCase, nextCase } = useMemo(() => {
        const sorted = [...allCaseStudies].sort((a, b) => (a.order || 0) - (b.order || 0));
        const index = sorted.findIndex((item) => item.slug === caseStudy.slug);
        if (index === -1) {
            return { previousCase: null, nextCase: null };
        }
        return {
            previousCase: index > 0 ? sorted[index - 1] : null,
            nextCase: index < sorted.length - 1 ? sorted[index + 1] : null,
        };
    }, [caseStudy.slug]);

    return (
        <div className="w-full h-screen p-4">
        <motion.div
            layoutId={`case-study-card-${caseStudy.slug}`}
            layout="preserve-aspect"
            className="w-full h-full flex flex-col md:grid rounded-3xl md:grid-cols-2 md:gap-10 lg:gap-16 border-0 md:overflow-hidden px-6 sm:px-8 md:px-14 lg:px-20 py-12 md:py-16"
            style={{
                backgroundColor: theme.background,
                color: theme.foreground,
                ['--case-bg' as string]: theme.background,
                ['--case-fg' as string]: theme.foreground,
                ['--case-muted' as string]: hexToRgba(theme.foreground, 0.65),
                ['--case-border' as string]: hexToRgba(theme.foreground, 0.15),
                ['--case-pill-bg' as string]: hexToRgba(theme.foreground, 0.08),
                ['--case-accent' as string]: theme.primary ?? theme.foreground,
            }}
        >
            {/* Left Column: Header Section (Mobile: full width, Desktop: left column) */}
            <div className="flex flex-col mb-10 md:mb-0 md:h-full md:overflow-hidden pb-8 md:pb-0 border-b md:border-b-0 md:border-r border-[color:var(--case-border)] md:pr-10 lg:pr-16">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => previousCase && router.push(previousCase.url)}
                        disabled={!previousCase}
                        className={cn(
                            "h-9 px-3 rounded-md text-sm transition-colors",
                            "bg-[color:var(--case-pill-bg)] text-[color:var(--case-fg)]",
                            "disabled:opacity-40 disabled:cursor-not-allowed"
                        )}
                        aria-label="Previous case study"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        onClick={() => nextCase && router.push(nextCase.url)}
                        disabled={!nextCase}
                        className={cn(
                            "h-9 px-3 rounded-md text-sm transition-colors",
                            "bg-[color:var(--case-pill-bg)] text-[color:var(--case-fg)]",
                            "disabled:opacity-40 disabled:cursor-not-allowed"
                        )}
                        aria-label="Next case study"
                    >
                        →
                    </button>
                </div>
                <div className="mb-4 md:mb-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-3 md:mb-4 leading-tight text-[color:var(--case-fg)]">
                        {caseStudy.title}
                    </h1>
                    {caseStudy.subtitle && (
                        <p className="text-lg sm:text-xl md:text-2xl font-normal text-[color:var(--case-muted)]">
                            {caseStudy.subtitle}
                        </p>
                    )}
                </div>
                {caseStudy.tagline && (
                    <p className="text-base md:text-lg font-medium italic mt-2 md:mt-3 mb-8 md:mb-10 text-[color:var(--case-muted)]">
                        {caseStudy.tagline}
                    </p>
                )}
                
                {/* Related Insights (part of left column on desktop) */}
                {relatedInsightsContent && (
                    <div className="mt-auto hidden md:block">
                        {relatedInsightsContent}
                    </div>
                )}
            </div>

            {/* Right Column: Case Study Content (Mobile: full width, Desktop: right column) */}
            <div className="flex-1 md:h-full md:overflow-y-auto md:overflow-x-hidden prose prose-base md:prose-lg max-w-none text-[color:var(--case-muted)] prose-p:leading-relaxed prose-p:text-[color:var(--case-muted)] prose-headings:font-semibold prose-headings:text-[color:var(--case-fg)] prose-headings:mt-8 prose-headings:mb-4 prose-strong:text-[color:var(--case-fg)] prose-strong:font-semibold prose-a:text-[color:var(--case-accent)] hover:prose-a:text-[color:var(--case-fg)]">
                <MDXContent />
            </div>

            {relatedInsightsContent && (
                <div className="mt-10 md:hidden">
                    {relatedInsightsContent}
                </div>
            )}
        </motion.div>
        </div>
    );
}
