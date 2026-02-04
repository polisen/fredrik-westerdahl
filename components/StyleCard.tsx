'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type TitleFontId, getTitleFontClass } from '@/lib/titleFonts';

// Main wrapper component - no styling, just passes through children
export function StyleCard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Variant 1: Title - Large H1/H2 text, bottom-right aligned, wraps (inherits text color from CardItem when not set)
StyleCard.Title = function Title({
  children,
  font = 'default',
}: {
  children: ReactNode;
  font?: TitleFontId;
}) {
  const fontClass = getTitleFontClass(font);
  return (
    <div className="h-full flex flex-col justify-end items-end text-right">
      <h1
        className={cn(
          'text-2xl md:text-3xl font-medium leading-[1.2] tracking-tight',
          fontClass
        )}
        style={{ color: 'inherit' }}
      >
        {children}
      </h1>
    </div>
  );
};

// Variant 2: Paragraph - Small title, body text, expandable "Read more" functionality
interface ParagraphProps {
  title: string;
  children: ReactNode;
  expandedContent?: ReactNode;
  defaultExpanded?: boolean;
  textColor?: string;
}

StyleCard.Paragraph = function Paragraph({
  title,
  children,
  expandedContent,
  defaultExpanded = false,
  textColor,
}: ParagraphProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const color = textColor ?? 'inherit';
  const isDefaultDark = color === '#0f0f0f' || color === 'inherit';

  return (
    <div className="flex flex-col">
      {/* Small title - tiny, bold, matching image (12-14px) */}
      <h3 className="text-xs font-bold" style={{ color }}>
        {title}
      </h3>

      {/* Body text - main content, always visible (18-20px) */}
      <div className="text-lg md:text-xl font-normal" style={{ color }}>
        {children}
      </div>

      {/* Expanded content - shown when expanded */}
      {expandedContent && isExpanded && (
        <div className="text-lg font-normal leading-[1.5] space-y-3 mt-3" style={{ color }}>
          {expandedContent}
        </div>
      )}

      {/* Truncated/faded preview when collapsed */}
      {expandedContent && !isExpanded && (
        <div className="text-lg font-normal leading-[1.5] mt-3" style={{ color: isDefaultDark ? '#AAAAAA' : color }}>
          {expandedContent}
        </div>
      )}

      {/* Read more button */}
      {expandedContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-lg font-bold mt-4 text-left transition-colors"
          style={{ color: isDefaultDark ? '#555555' : color }}
          onMouseEnter={(e) => {
            if (isDefaultDark) {
              e.currentTarget.style.color = color === 'inherit' ? 'inherit' : '#0f0f0f';
            }
          }}
          onMouseLeave={(e) => {
            if (isDefaultDark) {
              e.currentTarget.style.color = '#555555';
            }
          }}
          type="button"
        >
          {isExpanded ? 'Read less +' : 'Read more +'}
        </button>
      )}
    </div>
  );
};

// Variant 3: End - Title in top-left, subtitle in bottom-right
interface EndProps {
  title: string;
  subtitle: string;
}

StyleCard.End = function End({ title, subtitle }: EndProps) {
  return (
    <div className="flex flex-col justify-between min-h-[200px]" style={{ color: 'inherit' }}>
      {/* Top-left title */}
      <h3 className="text-xs font-bold">
        {title}
      </h3>

      {/* Bottom-right subtitle */}
      <div className="flex justify-end mt-auto pt-4">
        <h2 className="text-lg md:text-xl font-normal text-right">
          {subtitle}
        </h2>
      </div>
    </div>
  );
};

// Variant: Label (big, like a title) top-left; body (paragraph-sized) bottom, left or right aligned
interface CornerLabelProps {
  label: string;
  children: ReactNode;
  contentAlign?: 'left' | 'right';
}

StyleCard.CornerLabel = function CornerLabel({ label, children, contentAlign = 'right' }: CornerLabelProps) {
  const isLeft = contentAlign === 'left';
  return (
    <div className="flex flex-col justify-between min-h-0 h-full" style={{ color: 'inherit' }}>
      <h2 className="text-2xl md:text-3xl font-medium leading-[1.2] tracking-tight shrink-0">
        {label}
      </h2>
      <div
        className={cn(
          'flex mt-auto pt-4 text-xl md:text-2xl font-normal leading-[1.5] shrink-0',
          isLeft ? 'justify-start text-left' : 'justify-end text-right'
        )}
      >
        {children}
      </div>
    </div>
  );
};

StyleCard.IntroHeading = function IntroHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h2 className="text-3xl text-right md:text-4xl font-medium leading-[1.2] tracking-tight" style={{ color: 'inherit' }}>
      {children}
    </h2>
  );
};

StyleCard.IntroParagraph = function IntroParagraph({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="text-xl md:text-2xl font-normal leading-[1.5]" style={{ color: 'inherit' }}>
      {children}
    </p>
  );
};

StyleCard.IntroQuote = function IntroQuote({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <blockquote className="text-lg md:text-xl font-medium leading-[1.5]" style={{ color: 'inherit' }}>
      {children}
    </blockquote>
  );
};

StyleCard.TitleCorner = function TitleCorner({
  title,
  tagline,
  font = 'default',
}: {
  title: string;
  tagline?: string;
  font?: TitleFontId;
}) {
  const fontClass = getTitleFontClass(font);
  return (
    <div className="flex flex-col justify-between h-full" style={{ color: 'inherit' }}>
      <p
        className={cn(
          'text-2xl md:text-[1.75rem] font-medium leading-[1.2] tracking-tight',
          fontClass
        )}
      >
        {title}
      </p>
      {tagline ? (
        <div className="flex justify-end">
          <p className="text-xl md:text-2xl font-normal text-right">
            {tagline}
          </p>
        </div>
      ) : null}
    </div>
  );
};

StyleCard.IntroList = function IntroList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="space-y-2" style={{ color: 'inherit' }}>
      <p className="text-base md:text-lg font-medium">
        {title}
      </p>
      <ul className="list-disc pl-4 text-base md:text-lg font-normal space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

StyleCard.ImagePlaceholder = function ImagePlaceholder({
  filename,
}: {
  filename: string;
}) {
  return (
    <div className="flex items-center justify-center h-full" style={{ color: 'inherit' }}>
      <p className="text-lg md:text-xl font-medium">
        {filename}
      </p>
    </div>
  );
};
