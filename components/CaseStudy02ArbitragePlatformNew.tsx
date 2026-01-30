'use client';

import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { getArbitrageCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

export function CaseStudy02ArbitragePlatformNew() {
  return (
    <CaseStudySection title="arbitrage platform">
      <CardLine backgroundColor={getArbitrageCardLineColor(0)}>
        <CardItem aspectRatio="square">
          <div className="p-4 h-full">
            <StyleCard.Title font="badger">arbitrage platform</StyleCard.Title>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.ImagePlaceholder filename="arbitrage-01.jpg" />
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>what it was</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              a system for surfacing time-sensitive market opportunities.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              ingested and analyzed large volumes of unstructured documents.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>treated ai as infrastructure.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>key challenge: cost at scale</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              processed hundreds of thousands of documents per day.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              naive ai usage made costs unpredictable.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              token overhead and context duplication dominated.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>cost-aware ai orchestration</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              made inference cost a first-class concern.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              reused context and instructions aggressively.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>batched work to keep behavior predictable.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>mcp-based control layer</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              implemented a custom mcp-based orchestration layer.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              separated control flow from model behavior.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              kept ai components observable and replaceable.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>high-throughput ingestion</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              built an event-driven ingestion pipeline.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              handled volume spikes safely.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              insulated downstream systems.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>analytics and feedback</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              tracked cost and failure modes as core signals.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              tuned behavior via feedback loops.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>optimized for predictability.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>outcome</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              scaled analysis while controlling costs.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              demonstrated production-grade ai system design.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              showed how architecture shapes feasibility.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>
    </CaseStudySection>
  );
}
