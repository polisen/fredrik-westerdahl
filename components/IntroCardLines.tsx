import { CardItem, CardLine } from "@/components/CardLine";
import { StyleCard } from "@/components/StyleCard";

export function IntroCardLines() {
  return (
    <>
      <CardLine  backgroundColor="#957bf1">
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>about</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.ImagePlaceholder filename="me-portrait.jpg" />
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor="#ff5a0d" heightVariant="large">
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.TitleCorner title="hey!" tagline="my name is fredrik"/>
          </div>
        </CardItem>
       
        <CardItem  aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i’ve been creating digital things since i was around 11, mostly
              because i was curious about what was possible. on the internet, no
              one really knows how old you are, only whether what you made works
              or not.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i tend to think both inside and outside the box, and sometimes i
              can see around corners—not because i’m special, but because i’ve
              spent a long time watching things fail and understanding why.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>dreaming about products</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i really love thinking about products. to me, a product is an
              experience—without someone feeling the result, it’s just stuff
              floating in space.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i’m especially drawn to digital products, because they’re
              naturally informational and keep extending the bounds of human
              cognition.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroQuote>
              “a good product solves a problem. a great product invents a new
              problem and solves it.”
            </StyleCard.IntroQuote>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor="#fd2c50">
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>I&apos;m a full stack developer.</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              if you enjoy dreaming, you also need to be able to try ideas out.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i move pretty freely between goal setting, design, implementation,
              strategy, and analysis. a lot of that comes from a lifetime of
              having ideas, making plans, executing them, and then seeing why
              they didn’t work.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              over the last five to six years, that process has become more
              reliable, and i’ve been working professionally as a software
              engineer during that time.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i usually build across the stack:
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroList
              title="frontend"
              items={["typescript", "next.js"]}
            />
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroList
              title="backend"
              items={["node.js", "express", "microservices"]}
            />
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroList
              title="infrastructure"
              items={[
                "most often on google cloud platform",
                "also aws, azure, and digitalocean",
              ]}
            />
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor="#ceff58">
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>founder and startup work</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>i’m going to be serious for a moment.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i care about delivery in real-life scenarios. i make sure things
              actually happen.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i work with people and try to lift them up when i can. to me,
              leadership is empathy and responsibility, mixed with a willingness
              to be uncomfortable for sustained periods of time.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              that discomfort is where good judgment tends to form—knowing when
              to push forward, when to pivot, and when to stop.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              and no, i’m not actually insane. here’s a picture of me making pasta.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.ImagePlaceholder filename="pasta.jpg" />
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              could a crazy person make a carbonara like this?
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>i don’t think so.</StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor="#fee144">
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>digital products are systems</StyleCard.IntroHeading>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>here are some systems i’ve built:</StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              a modular saas platform built from first principles, using a block-based, domain-driven architecture. owned end-to-end, from early sketches to production.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              a cohesive visual language that tied product, interface, and interaction together rather than treating ui as decoration.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              a high-throughput, event-driven system in production for a publicly traded textile company, processing millions of events under strict cost and reliability constraints.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              real-time data and permissions layers, with custom authorization and visibility models across firestore and rtdb.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              event-driven backends and integrations, including serverless apis, webhooks, and background processing for payments, analytics, and external systems.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              analytics and feedback loops used to validate assumptions, detect failure modes, and guide roadmap decisions.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              ai-augmented systems built with cost awareness, clear orchestration boundaries, safety constraints, and observability—treated as infrastructure, not novelty.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
      </CardLine>

      <CardLine backgroundColor="#04bffe">
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>case studies</StyleCard.IntroHeading>
          </div>
        </CardItem>
      </CardLine>
    </>
  );
}
