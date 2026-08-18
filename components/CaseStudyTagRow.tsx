'use client';

import { CardItem, CardLine } from '@/components/CardLine';

type CaseStudyTagRowProps = {
  tags: string[];
  /** Match the case study text-card row color. */
  backgroundColor: string;
};

/** Last Flickity row under a case study — short clarifying tag pills. */
export function CaseStudyTagRow({ tags, backgroundColor }: CaseStudyTagRowProps) {
  if (!tags.length) return null;

  return (
    <CardLine
      backgroundColor={backgroundColor}
      heightVariant="tags"
      alwaysVisibleCount={99}
    >
      {tags.map((tag) => (
        <CardItem key={tag} aspectRatio="pill">
          {tag}
        </CardItem>
      ))}
    </CardLine>
  );
}
