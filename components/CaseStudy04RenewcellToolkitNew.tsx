'use client';

import Script from 'next/script';
import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { CaseStudyTagRow } from '@/components/CaseStudyTagRow';
import { CirculoseEmbedCard } from '@/components/CirculoseEmbedCard';
import { MediaCardItem } from '@/components/MediaCardItem';
import { getRenewcellCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

const CIRCULOSE_TAGS = [
  'Embeddable',
  'Textile',
  'Point of purchase',
  'Global scale',
  'Lead engineer',
  'CDN',
  'Beacon API',
  'Privacy-preserving',
  'Google Cloud',
];

export function CaseStudy04RenewcellToolkitNew() {
  return (
    <CaseStudySection title="circulose" years="2023–2024" visitUrl="https://www.circulose.com/">
      <Script
        src="/renewcell/circulose-bundle.js"
        strategy="lazyOnload"
      />
      <CardLine backgroundColor={getRenewcellCardLineColor(0)}>
      <MediaCardItem type="image" src="/renewcell/circulose.png" alt="Made with Circulose" />

        <MediaCardItem
          type="video"
          src="/renewcell/circulose.webm"
          loop
          muted
          playsInline
          autoPlay
        />
        <MediaCardItem type="image" src="/renewcell/jeans.webp" alt="Made with Circulose" />


      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(1)} alwaysVisibleCount={99}>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="what" contentAlign="left">
              an embeddable web system built for a publicly traded textile
              company to educate customers about a new material at the point of
              purchase, operating at global scale.
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <CirculoseEmbedCard />
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="my role">
              lead engineer. responsible for system design, performance,
              analytics, and production delivery.
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="technologies">
              cdn delivery, lightweight javascript, beacon api, custom
              ingestion pipelines, google cloud
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>embedding at massive scale</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              the widget needed to load quickly, execute safely inside unknown
              environments, and fail gracefully. bundle size, execution cost,
              and reliability were treated as hard constraints.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>
              privacy-preserving analytics
            </StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              traditional analytics tools weren&apos;t viable. a lightweight,
              beacon-based approach provided meaningful insight without
              cookies, third-party scripts, or legal exposure.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CaseStudyTagRow
        tags={CIRCULOSE_TAGS}
        backgroundColor={getRenewcellCardLineColor(1)}
      />
    </CaseStudySection>
  );
}
