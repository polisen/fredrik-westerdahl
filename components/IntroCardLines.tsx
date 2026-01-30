import { CardItem, CardLine } from "@/components/CardLine";
import { MediaCardItem } from "@/components/MediaCardItem";
import { getCardLineColor } from "@/lib/cardLineColors";
import { StyleCard } from "@/components/StyleCard";

export function IntroCardLines() {
  return (
    <>
      <CardLine heightVariant="large" backgroundColor={getCardLineColor(0)}>
        <MediaCardItem
          type="image"
          src="/headshot.jpeg"
          alt="Fredrik"
        />
      </CardLine>

      <CardLine backgroundColor={getCardLineColor(1)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>hey — i&apos;m fredrik.</StyleCard.IntroHeading>
          </div>
        </CardItem>
       
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i&apos;ve been building digital things since i was around 11.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i enjoy work where performance, cost, legal boundaries, and
              changing requirements actually matter — because that&apos;s where
              good decisions show.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i work end-to-end across frontend and backend.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getCardLineColor(2)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>i&apos;m a full-stack developer</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i&apos;m comfortable moving between goal-setting, design,
              implementation, strategy, and analysis. most of the problems i
              care about live between layers, not inside them.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4 h-full">
            <StyleCard.CornerLabel label="tools & systems">
              typescript, next.js, react, node.js, express, event-driven
              systems, firestore, rtdb, postgresql, neo4j, gcp, aws, docker,
              analytics, payments, ai apis
            </StyleCard.CornerLabel>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getCardLineColor(3)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>i&apos;ve been a founder and worked in startups</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i&apos;ve spent much of my career working in early and growth-stage
              environments, where uncertainty is the default. i care about
              delivery in real-life scenarios, working with people, and making
              sure things actually happen.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              to me, leadership is empathy and responsibility — with enough
              tolerance for discomfort to keep going when things are unclear,
              and enough judgment to know when to pivot.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor={getCardLineColor(4)}>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>i dream about systems</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              the essence of any product, no matter how simple, can be broken down into a system — a chain of interactions leading to a certain result.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              the subjective experience of that system by a user is essentially that product in practice.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i have a certain knack for boiling it down into something satisfactory and achievable. — i can zoom out, and ask alignment questions that few others do.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

    </>
  );
}
