'use client';

import { allCaseStudies } from 'contentlayer/generated';
import { StyleCard } from '@/components/StyleCard';
import { CardItem, CardLine } from '@/components/CardLine';

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

export function CaseStudy02ArbitragePlatformNew() {
  const caseStudy = allCaseStudies.find((cs) => cs.slug === '02-arbitrage-platform');
  
  if (!caseStudy) return null;

  // Parse markdown sections
  const rawMarkdown = (caseStudy as any).body?.raw || '';
  const sections = parseMarkdownSections(rawMarkdown);

  return (
    <CardLine>
      {/* Title card */}
      <CardItem aspectRatio="square">
        <div className="p-4">
          <StyleCard.Title>
            {caseStudy.tagline || caseStudy.title}
          </StyleCard.Title>
        </div>
      </CardItem>

      {/* Context section */}
      {sections['Context'] && (
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.Paragraph title="Context">
              <p>{sections['Context']}</p>
            </StyleCard.Paragraph>
          </div>
        </CardItem>
      )}

      {/* Problem section */}
      {sections['Problem'] && (
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.Paragraph title="Problem">
              <p>{sections['Problem']}</p>
            </StyleCard.Paragraph>
          </div>
        </CardItem>
      )}

      {/* Key decisions section */}
      {sections['Key decisions'] && (
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.Paragraph title="Key decisions">
              <p>{sections['Key decisions']}</p>
            </StyleCard.Paragraph>
          </div>
        </CardItem>
      )}

      {/* Outcome section */}
      {sections['Outcome'] && (
        <CardItem aspectRatio="video">
          <div className="p-4 pb-16">
            <StyleCard.Paragraph title="Outcome">
              <p>{sections['Outcome']}</p>
            </StyleCard.Paragraph>
          </div>
        </CardItem>
      )}
    </CardLine>
  );
}
