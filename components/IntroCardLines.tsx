import { CardItem, CardLine } from "@/components/CardLine";
import { StyleCard } from "@/components/StyleCard";

export function IntroCardLines() {
  return (
    <>
      <CardLine>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.TitleCorner
              title="hey!"
              tagline="my name is fredrik."
            />
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
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
      </CardLine>

      <CardLine>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroHeading>
              dreaming about products
            </StyleCard.IntroHeading>
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

      <CardLine>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.TitleCorner
              title="full‑stack, in practice"
              tagline="what i can do"
            />
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
            <StyleCard.IntroList title="native" items={["expo", "react-native"]} />
          </div>
        </CardItem>
        <CardItem aspectRatio="square">
          <div className="p-4">
            <StyleCard.IntroList
              title="infra"
              items={[
                "most often on google cloud platform",
                "also aws, azure, and digitalocean",
              ]}
            />
          </div>
        </CardItem>
      </CardLine>
    </>
  );
}
