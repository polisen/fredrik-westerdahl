'use client';

import { allCaseStudies } from 'contentlayer/generated';
import { CaseStudyItem } from '@/components/CaseStudyItem';
import { StyleCard } from '@/components/StyleCard';
import Image from 'next/image';

// Helper function to parse markdown sections
function parseMarkdownSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Match **Section** followed by content until next **Section** or end
  // Use [\s\S] instead of . to match any character including newlines (works without 's' flag)
  const sectionRegex = /\*\*(.+?)\*\*\n([\s\S]+?)(?=\n\*\*|$)/g;
  let match;
  
  while ((match = sectionRegex.exec(markdown)) !== null) {
    const sectionName = match[1].trim();
    const content = match[2].trim();
    sections[sectionName] = content;
  }
  
  return sections;
}

interface CaseStudy05AuctionHouseNewProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function CaseStudy05AuctionHouseNew({ isExpanded, onToggle }: CaseStudy05AuctionHouseNewProps = {} as CaseStudy05AuctionHouseNewProps) {
  const caseStudy = allCaseStudies.find((cs) => cs.slug === '05-auction-house');
  
  if (!caseStudy) return null;

  const theme = (caseStudy as any).theme;
  const primaryColor = theme?.primary;

  // Parse markdown sections
  const rawMarkdown = (caseStudy as any).body?.raw || '';
  const sections = parseMarkdownSections(rawMarkdown);

  return (
    <CaseStudyItem
      number={caseStudy.order || 5}
      title={caseStudy.title || ''}
      subtitle={caseStudy.subtitle || ''}
      color={primaryColor}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {/* Title card */}
      <div className="rounded-lg py-2 px-8">
        <StyleCard.Title>
          {caseStudy.tagline || caseStudy.title}
        </StyleCard.Title>
      </div>

      {/* Context section */}
      {sections['Context'] && (
        <div className="rounded-lg py-2 px-8">
          <StyleCard.Paragraph title="Context">
            <p>{sections['Context']}</p>
          </StyleCard.Paragraph>
        </div>
      )}

      {/* Problem section */}
      {sections['Problem'] && (
        <div className="rounded-lg py-2 px-8">
          <StyleCard.Paragraph title="Problem">
            <p>{sections['Problem']}</p>
          </StyleCard.Paragraph>
        </div>
      )}

      {/* Key decisions section */}
      {sections['Key decisions'] && (
        <div className="rounded-lg py-2 px-8">
          <StyleCard.Paragraph title="Key decisions">
            <p>{sections['Key decisions']}</p>
          </StyleCard.Paragraph>
        </div>
      )}

      {/* Outcome section */}
      {sections['Outcome'] && (
        <div className="rounded-lg py-2 px-8 pb-32">
          <StyleCard.Paragraph title="Outcome">
            <p>{sections['Outcome']}</p>
          </StyleCard.Paragraph>
        </div>
      )}
    </CaseStudyItem>
  );
}
