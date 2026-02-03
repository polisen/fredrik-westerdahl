'use client';

import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { MediaCardItem } from '@/components/MediaCardItem';
import { getAuctionHouseCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

const LILLA_IMAGES = ['lilla_1.png', 'lilla_2.png', 'lilla_3.png', 'lilla_4.png'];

export function CaseStudy05AuctionHouseNew() {
  return (
    <CaseStudySection title="lilla auktionsstudion" visitUrl="https://www.lillaauktionsstudion.se/">
      <CardLine backgroundColor={'#fff'}>
        {LILLA_IMAGES.map((filename) => (
          <MediaCardItem
            key={filename}
            type="image"
            src={`/lilla/${filename}`}
            alt="Lilla auktionsstudion"
          />
        ))}
      </CardLine>

      <CardLine backgroundColor={getAuctionHouseCardLineColor(0)} alwaysVisibleCount={99}>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.TitleCorner
              font="badger"
              title="a production auction platform built for a small auction house running live and online auctions, including payments, seller onboarding, customer service tooling, and email marketing."
            />
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="my role">
              consultant and lead developer. full responsibility for system
              design, implementation, and delivery.
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="technologies">
              next.js, node.js, payment integrations, email systems, cloud
              hosting
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>domain-first auction workflows</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              the platform was modeled around how auctions actually operate:
              listings, bids, settlements, and sellers. generic ecommerce
              abstractions were deliberately avoided.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>
              production delivery under pressure
            </StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              delivered a full-featured system within strict constraints,
              prioritizing clarity and maintainability over unnecessary
              flexibility.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>
    </CaseStudySection>
  );
}
