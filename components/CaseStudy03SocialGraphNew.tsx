'use client';

import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { getSocialGraphCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

export function CaseStudy03SocialGraphNew() {
  return (
    <CaseStudySection title="social graph">
      <CardLine backgroundColor={getSocialGraphCardLineColor(0)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.Title>social graph</StyleCard.Title>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.ImagePlaceholder filename="social-graph-01.jpg" />
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getSocialGraphCardLineColor(1)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>what it was</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              a system for understanding markets through relationships.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              focused on users, communities, and influence.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>treated the market as a graph.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getSocialGraphCardLineColor(2)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>key challenge: structure over metrics</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              traditional analytics failed to explain discovery and momentum.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              structure needed to emerge from relationships.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>aggregates were insufficient.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getSocialGraphCardLineColor(3)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>graph-first data model</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              designed relationships as first-class entities.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              modeled users, interactions, and communities.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>avoided premature flattening.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getSocialGraphCardLineColor(4)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>community detection and influence</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>applied community detection.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              identified influential nodes via structural measures.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>avoided vanity metrics.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getSocialGraphCardLineColor(5)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>strategic applications</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              informed positioning and go-to-market strategy.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              revealed invisible leverage points.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>treated analysis as a decision tool.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getSocialGraphCardLineColor(6)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>outcome</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              produced clearer insight into influence and momentum.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              demonstrated the value of graph-based thinking.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              changed the questions the system could answer.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>
    </CaseStudySection>
  );
}
