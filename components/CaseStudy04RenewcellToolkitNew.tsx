'use client';

import { CardItem, CardLine } from '@/components/CardLine';
import { CaseStudySection } from '@/components/CaseStudySection';
import { getRenewcellCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

export function CaseStudy04RenewcellToolkitNew() {
  return (
    <CaseStudySection title="renewcell / circulose">
      <CardLine backgroundColor={getRenewcellCardLineColor(0)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.Title>renewcell / circulose</StyleCard.Title>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.ImagePlaceholder filename="renewcell-01.jpg" />
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(1)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>what it was</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              an embeddable web system built to educate users about a new textile
              material at the point of purchase.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              developed for a publicly traded company operating at global scale.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              delivered as a lightweight, brand-safe integration for third-party
              websites.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(2)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>
              key challenge: embedding at massive scale
            </StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              needed to run across unknown environments with unpredictable traffic.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              payload size, execution cost, and reliability were hard constraints.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              the widget could not degrade host site performance.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(3)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>performance as a hard constraint</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              delivered as a small, cdn-served script.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              minimized execution paths to reduce runtime overhead.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>designed to fail gracefully.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(4)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>branding without duplication</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              supported multiple visual variants without branching the codebase.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>treated branding as configuration.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              preserved creative consistency without sacrificing performance.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(5)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>
              key challenge: analytics under legal constraints
            </StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              traditional analytics were not viable.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              tracking had to remain compliant without cookies or third-party scripts.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              insight was required without legal exposure.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(6)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>privacy-preserving analytics</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              used beacon-based impression and interaction tracking.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              optimized data collection for usefulness, not volume.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>avoided user-level identification.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(7)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>data ingestion and analysis</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              handled large volumes of low-latency events efficiently.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              minimized network and infrastructure costs.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              structured analytics to answer concrete questions.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getRenewcellCardLineColor(8)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>outcome</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              enabled large-scale rollout with predictable performance and compliance.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              balanced branding, performance, and legal constraints.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              demonstrated careful system design under regulatory pressure.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>
    </CaseStudySection>
  );
}
