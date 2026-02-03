'use client';

import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { getSocialGraphCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

export function CaseStudy03SocialGraphNew() {
  return (
    <CardLine backgroundColor={getSocialGraphCardLineColor(0)} alwaysVisibleCount={99}>
        <CardItem aspectRatio="square">
          <div className="p-4 h-full">
            <StyleCard.Title font="badger">social graph</StyleCard.Title>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.TitleCorner
              font="badger"
              title="a system built to understand markets by modeling relationships between users and communities rather than events or funnels."
            />
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="my role">
              designed the data model and analytical approach.
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="what i'm proud of">
              turning abstract graph theory into practical market insight.
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="technologies">
              neo4j, graph algorithms, custom analysis pipelines
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>structure beats aggregates</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              traditional analytics struggled to explain influence and
              discovery. modeling the market as a graph made underlying
              structure visible.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>
              strategy from relationships
            </StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              community detection and centrality analysis revealed leverage
              points that directly informed positioning and go-to-market
              decisions.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>
  );
}
