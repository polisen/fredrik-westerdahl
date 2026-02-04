import dynamic from 'next/dynamic';
import { CardItem, CardLine } from '@/components/CardLine';
import { MediaCardItem } from '@/components/MediaCardItem';
import { getIntroCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';
import { ArrowUpRight } from 'lucide-react';

const PhysicsTerrarium = dynamic(
  () =>
    import('@/components/PhysicsTerrarium').then((m) => ({
      default: m.PhysicsTerrarium,
    })),
  { ssr: false }
);

export function IntroCardLines() {
  return (
    <>
      <CardLine
        heightVariant="large"
        backgroundColor={getIntroCardLineColor(0)}
        alwaysVisibleCount={3}
      >
        <MediaCardItem type="image" src="/headshot.jpeg" alt="Fredrik" />
        <CardItem
          aspectRatio={350 / 450}
          className="max-w-none bg-white group  relative p-0"
        >
          <div className="absolute bg-white inset-0 flex items-center justify-center overflow-hidden rounded-lg">
            <div
              className="h-full w-auto shrink-0 pointer-events-none block scale-[1.015] origin-center"
              style={{ aspectRatio: '350/450' }}
            >
              <iframe
                src="/fredrik_westerdahl_cv.pdf#toolbar=0&navpanes=0&scrollbar=0"
                title="Fredrik Westerdahl CV"
                className="block h-full w-full rounded-lg bg-white border-0 p-0 m-0 align-top pointer-events-none select-none"
              />
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-24 rounded-b-lg pointer-events-none"
            style={{
              mask: 'linear-gradient(to top, black 50%, transparent)',
              WebkitMask: 'linear-gradient(to top, black 50%, transparent)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            aria-hidden
          />
          <a
            href="/fredrik_westerdahl_cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 cursor-pointer"
          >
            <span className="sr-only">Open CV</span>
          </a>
          <div
            className="absolute right-4 bottom-4 z-20 pointer-events-none flex size-10 items-center justify-center rounded-full bg-gray-200/80 backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] group-hover:[&>svg]:brightness-125"
            aria-hidden
          >
            <ArrowUpRight className="size-5 text-gray-700 transition-all duration-200" />
          </div>
        </CardItem>
      </CardLine>
{/* 
      <CardLine
        backgroundColor={getIntroCardLineColor(1)}
        alwaysVisibleCount={5}
      >
        <CardItem aspectRatio="square">
          <div className="flex flex-col justify-between h-full p-4">
            <div className="text-left">
              <StyleCard.IntroHeading>hey!</StyleCard.IntroHeading>
              <StyleCard.IntroHeading>i&apos;m fredrik.</StyleCard.IntroHeading>
            </div>
            <div className="text-right">
              <StyleCard.IntroParagraph>
                i&apos;m a full-stack developer. founder-minded.
              </StyleCard.IntroParagraph>
            </div>
          </div>
        </CardItem>

        <CardItem aspectRatio="video">
          <div className="flex flex-col justify-between h-full p-4">
            <div className="text-left">
              <StyleCard.IntroParagraph>
                i have been building digital products since i was around 11.
              </StyleCard.IntroParagraph>
            </div>
            <div className="text-right">
              <StyleCard.IntroParagraph>
                i dream about systems and architectures
              </StyleCard.IntroParagraph>
            </div>
          </div>
        </CardItem>

        <CardItem aspectRatio="video">
          <div className="p-4">
            <StyleCard.IntroParagraph>
              i work end-to-end — from goal-setting and design to
              implementation, infrastructure, and iteration.
            </StyleCard.IntroParagraph>
          </div>
        </CardItem>
     
      </CardLine> */}
    </>
  );
}
