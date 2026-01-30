'use client';

import { useState, ReactNode } from 'react';

// Main wrapper component - no styling, just passes through children
export function StyleCard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Variant 1: Title - Large H1/H2 text, left-aligned, wraps
StyleCard.Title = function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-2xl h-full flex justify-end items-end md:text-3xl font-medium text-[#0f0f0f] leading-[1.2] tracking-tight">
      {children}
    </h1>
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
  textColor = '#0f0f0f',
}: ParagraphProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="flex flex-col">
      {/* Small title - tiny, bold, matching image (12-14px) */}
      <h3 className="text-xs font-bold" style={{ color: textColor }}>
        {title}
      </h3>

      {/* Body text - main content, always visible (18-20px) */}
      <div className="text-lg md:text-xl font-normal" style={{ color: textColor }}>
        {children}
      </div>

      {/* Expanded content - shown when expanded */}
      {expandedContent && isExpanded && (
        <div className="text-lg font-normal leading-[1.5] space-y-3 mt-3" style={{ color: textColor }}>
          {expandedContent}
        </div>
      )}

      {/* Truncated/faded preview when collapsed */}
      {expandedContent && !isExpanded && (
        <div className="text-lg font-normal leading-[1.5] mt-3" style={{ color: textColor === '#0f0f0f' ? '#AAAAAA' : textColor }}>
          {expandedContent}
        </div>
      )}

      {/* Read more button */}
      {expandedContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-lg font-bold mt-4 text-left transition-colors"
          style={{ 
            color: textColor === '#0f0f0f' ? '#555555' : textColor,
          }}
          onMouseEnter={(e) => {
            if (textColor === '#0f0f0f') {
              e.currentTarget.style.color = '#0f0f0f';
            }
          }}
          onMouseLeave={(e) => {
            if (textColor === '#0f0f0f') {
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
    <div className="flex flex-col justify-between min-h-[200px]">
      {/* Top-left title */}
      <h3 className="text-xs font-bold text-[#0f0f0f] ">
        {title}
      </h3>


      {/* Bottom-right subtitle */}
      <div className="flex justify-end mt-auto pt-4">
        <h2 className="text-lg md:text-xl font-normal text-[#0f0f0f] text-right">
          {subtitle}
        </h2>
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
    <h2 className="text-2xl md:text-3xl font-medium text-[#0f0f0f] leading-[1.2] tracking-tight">
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
    <p className="text-lg md:text-xl font-normal text-[#0f0f0f] leading-[1.5]">
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
    <blockquote className="text-lg md:text-xl font-medium text-[#0f0f0f] leading-[1.5]">
      {children}
    </blockquote>
  );
};

StyleCard.TitleCorner = function TitleCorner({
  title,
  tagline,
}: {
  title: string;
  tagline?: string;
}) {
  return (
    <div className="flex flex-col justify-between h-full">
      <p className="text-3xl md:text-4xl font-medium text-[#0f0f0f]">
        {title}
      </p>
      {tagline ? (
        <div className="flex justify-end">
          <p className="text-xl md:text-2xl font-normal text-[#0f0f0f] text-right">
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
    <div className="space-y-2">
      <p className="text-base md:text-lg font-medium text-[#0f0f0f]">
        {title}
      </p>
      <ul className="list-disc pl-4 text-base md:text-lg font-normal text-[#0f0f0f] space-y-1">
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
    <div className="flex items-center justify-center h-full">
      <p className="text-lg md:text-xl font-medium text-[#0f0f0f]">
        {filename}
      </p>
    </div>
  );
};
