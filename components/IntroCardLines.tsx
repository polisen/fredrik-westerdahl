import { CardItem, CardLine } from "@/components/CardLine";
import { MediaCardItem } from "@/components/MediaCardItem";
import { getIntroCardLineColor } from "@/lib/cardLineColors";
import { StyleCard } from "@/components/StyleCard";

export function IntroCardLines() {
  return (
    <>
      <CardLine heightVariant="large" backgroundColor={getIntroCardLineColor(0)}>
        <MediaCardItem
          type="image"
          src="/headshot.jpeg"
          alt="Fredrik"
        />
      </CardLine>

      <CardLine
        backgroundColor={getIntroCardLineColor(1)}
        alwaysVisibleCount={5}
      >
      <CardItem aspectRatio="square">
        <div className="flex flex-col justify-between h-full p-4">
          <div className="text-left">
            <StyleCard.IntroHeading>hey — i&apos;m fredrik.</StyleCard.IntroHeading>
          </div>
          <div className="text-right">
            <StyleCard.IntroHeading>full-stack developer. founder-minded.</StyleCard.IntroHeading>
          </div>
        </div>
      </CardItem>

      <CardItem aspectRatio="video">
        <div className="flex flex-col justify-between h-full p-4">
          <div className="text-left">
            <StyleCard.IntroParagraph>
              building digital systems since i was around 11.
            </StyleCard.IntroParagraph>
          </div>
          <div className="text-right">
            <StyleCard.IntroParagraph>
              mostly where performance, cost, and real constraints actually matter.
            </StyleCard.IntroParagraph>
          </div>
        </div>
      </CardItem>

      <CardItem aspectRatio="video">
        <div className="flex flex-col justify-between h-full p-4">
          <div className="text-left">
            <StyleCard.IntroParagraph>i think in systems.</StyleCard.IntroParagraph>
          </div>
          <div className="text-right">
            <StyleCard.IntroParagraph>
              products are chains of decisions — the user experience is how those decisions feel in practice.
            </StyleCard.IntroParagraph>
          </div>
        </div>
      </CardItem>

      <CardItem aspectRatio="video">
        <div className="p-4">
          <StyleCard.IntroParagraph>
            i work end-to-end — from goal-setting and design
            to implementation, infrastructure, and iteration.
          </StyleCard.IntroParagraph>
        </div>
      </CardItem>

      <CardItem aspectRatio="square">
        <div className="p-4 h-full">
          <StyleCard.CornerLabel label="tools & systems">
            typescript, next.js, react, node, gcp, databases, payments, analytics, ai apis
          </StyleCard.CornerLabel>
        </div>
      </CardItem>
    </CardLine>
    </>
  );
}
