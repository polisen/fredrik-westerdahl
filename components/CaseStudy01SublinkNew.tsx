'use client';

import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { CaseStudyTagRow } from '@/components/CaseStudyTagRow';
import { MediaCardItem } from '@/components/MediaCardItem';
import { getSublinkCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

/** First row — main screenshots */
const SUBLINK_IMAGES_TOP = [
  'sublink_1.png',
  'sublink_2.png',
  'sublink_3.png',
  'sublink_4.png',
  'sublink_5.png',
];

/** Middle row — former first-row item 2 + last two; half height */
const SUBLINK_IMAGES_MID = [
  'sublink_7.png',
  'sublink_6.png',
  'sublink_8.png',
];

/** Draft clarifying tags — edit freely */
const SUBLINK_TAGS = [
  'SaaS',
  'Creators',
  'Modular architecture',
  'Realtime',
  'Split payments',
  'Co-founder & CTO',
  'TypeScript',
  'Next.js',
  'Firebase',
];

export function CaseStudy01SublinkNew() {
  return (
    <CaseStudySection title="sublink" years="2023–2026">
      <CardLine backgroundColor={getSublinkCardLineColor(0)}>
        {SUBLINK_IMAGES_TOP.map((filename) => (
          <MediaCardItem
            key={filename}
            type="image"
            src={`/sublink/${filename}`}
            alt="Sublink"
          />
        ))}
      </CardLine>

      <CardLine
        backgroundColor={getSublinkCardLineColor(0)}
        heightVariant="half"
        alwaysVisibleCount={99}
      >
        {SUBLINK_IMAGES_MID.map((filename) => (
          <MediaCardItem
            key={filename}
            type="image"
            src={`/sublink/${filename}`}
            alt="Sublink"
          />
        ))}
      </CardLine>

      <CardLine backgroundColor={getSublinkCardLineColor(1)} alwaysVisibleCount={99}>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="what" contentAlign="left">
              a funded saas platform (1.4m) built to help creators collaborate
              and express themselves online. rather than shipping a single fixed
              product, the platform was designed as a modular system capable of
              supporting multiple directions over time.
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="my role">
              co-founder & cto. owned system architecture, frontend and backend
              implementation, and production delivery end-to-end.
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="technologies">
              typescript, next.js, node.js, expo, firebase, google cloud,
              realtime sync, custom authorization, analytics
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>modular architecture as the product</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              in an early-stage startup, uncertainty is constant. instead of
              optimizing for a specific audience or workflow, the system was
              designed so the architecture itself carried the value. use cases,
              branding, and positioning could change without invalidating the
              core.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>
              collaboration and trust as first-class systems
            </StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              real-time collaboration and split payments were built into the
              foundation. creators could work together live and sell together
              without needing to meet, trust, or manually settle with each other,
              removing a major coordination barrier.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CaseStudyTagRow
        tags={SUBLINK_TAGS}
        backgroundColor={getSublinkCardLineColor(1)}
      />
    </CaseStudySection>
  );
}
