'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import type { CaseStudy as CaseStudyType } from 'contentlayer/generated';
import { allInsights } from 'contentlayer/generated';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { GooContainer } from '@/components/GooContainer';
import { FocusableButton } from '@/components/FocusableButton';

const DEFAULT_THEME = {
  background: '#F3F4F6',
  foreground: '#111827',
  primary: '#111827',
};

const cardBaseClass =
  'flex h-auto md:h-full flex-col md:grid  md:grid-cols-2  mx-8 gap-8 rounded-3xl  ';

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const lightenColor = (hex: string, amount: number = 0.1) => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  const mix = (value: number) => Math.round(value + (255 - value) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

const getCaseTheme = (caseStudy: CaseStudyType) => {
  return caseStudy.theme ?? DEFAULT_THEME;
};

interface CaseStudyProps {
  caseStudy: CaseStudyType;
  linkable?: boolean;
  backgroundVariant?: 'default' | 'transparent';
}

export function CaseStudy({
  caseStudy,
  linkable = false,
  backgroundVariant = 'default',
}: CaseStudyProps) {
  const MDXContent = useMDXComponent(caseStudy.body.code);
  const router = useRouter();
  const theme = getCaseTheme(caseStudy);
  const showBackground = backgroundVariant !== 'transparent';

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

  const handleNavigate = () => {
    if (!linkable) return;
    window.history.replaceState(null, '', `/#${caseStudy.slug}`);
    router.push(caseStudy.url);
  };

  // Create two different colors for the columns
  const leftColumnColor = theme.background;
  const rightColumnColor = lightenColor(theme.background, 0.3); // Slightly lighter for contrast

  return (
    <motion.div
      layoutId={`case-study-card-${caseStudy.slug}`}
      role={linkable ? 'link' : undefined}
      tabIndex={linkable ? 0 : undefined}
      onClick={(event) => {
        if (!linkable) return;
        const target = event.target as HTMLElement | null;
        if (target?.closest('a')) return;
        handleNavigate();
      }}
      onKeyDown={(event) => {
        if (!linkable) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className={cn(
        cardBaseClass,
        'md:overflow-hidden'
      )}
      style={{
        backgroundColor: showBackground ? theme.background : 'transparent',
        color: theme.foreground,
        borderColor: showBackground
          ? hexToRgba(theme.foreground, 0.15)
          : 'transparent',
        ['--case-bg' as string]: theme.background,
        ['--case-fg' as string]: theme.foreground,
        ['--case-muted' as string]: hexToRgba(theme.foreground, 0.65),
        ['--case-border' as string]: hexToRgba(theme.foreground, 0.15),
        ['--case-pill-bg' as string]: hexToRgba(theme.foreground, 0.08),
        ['--case-accent' as string]: theme.primary ?? theme.foreground,
      }}
    >
      {/* Left Column: Header Section (Mobile: full width, Desktop: left column) */}
      <GooContainer
        shape="rectangle"
        color={leftColumnColor}
        className="flex flex-col p-6 md:p-8 lg:p-12 xl:p-20 mb-8 md:mb-0 md:h-full md:overflow-hidden pb-6 md:pb-0 border-b md:border-b-0 border-[color:var(--case-border)] md:pr-8 lg:pr-12"
      >
        <div className="mb-3 md:mb-4">
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
          <p className="text-base md:text-lg font-medium italic mt-2 md:mt-3 mb-6 md:mb-8 text-[color:var(--case-muted)]">
            {caseStudy.tagline}
          </p>
        )}

        {/* Related Insights (part of left column on desktop) */}
        {relatedInsightsContent && (
          <div className="mt-auto hidden md:block">
            {relatedInsightsContent}
          </div>
        )}
      </GooContainer>

      {/* Right Column: Case Study Content (Mobile: full width, Desktop: right column) */}
      <GooContainer
        shape="rounded"
        color={rightColumnColor}
        className="flex-1 md:h-full p-6 md:p-8 lg:p-12 xl:p-20 xl:px-12 md:overflow-y-auto md:overflow-x-hidden prose prose-sm md:prose-sm lg:prose-base max-w-none text-[color:var(--case-muted)] prose-p:leading-relaxed prose-p:text-[color:var(--case-muted)] prose-headings:font-semibold prose-headings:text-[color:var(--case-fg)] prose-headings:mt-8 prose-headings:mb-4 prose-strong:text-[color:var(--case-fg)] prose-strong:font-semibold prose-a:text-[color:var(--case-accent)] hover:prose-a:text-[color:var(--case-fg)]"
      >
        <MDXContent />
      </GooContainer>

      {relatedInsightsContent && (
        <div className="mt-8 md:hidden">{relatedInsightsContent}</div>
      )}
    </motion.div>
  );
}
