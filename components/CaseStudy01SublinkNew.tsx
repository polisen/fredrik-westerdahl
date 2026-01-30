'use client';

import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { MediaCardItem } from '@/components/MediaCardItem';
import { getSublinkCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

const SUBLINK_IMAGES = [
  'sublink_1.png',
  'sublink_2.png',
  'sublink_3.png',
  'sublink_4.png',
  'sublink_5.png',
  'sublink_6.png',
  'sublink_7.png',
  'sublink_8.png',
];

export function CaseStudy01SublinkNew() {
  return (
    <CaseStudySection title="sublink">
      <CardLine backgroundColor={getSublinkCardLineColor(0)}>
        {SUBLINK_IMAGES.map((filename) => (
          <MediaCardItem
            key={filename}
            type="image"
            src={`/sublink/${filename}`}
            alt="Sublink"
          />
        ))}
      </CardLine>

      <CardLine backgroundColor={getSublinkCardLineColor(1)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>project overview</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="what it was">
              a funded saas platform (€1.4m) built to help creators collaborate
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
    </CaseStudySection>
  );
}
