import { allCreativeWorks } from 'contentlayer/generated';
import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';

export const metadata = {
  title: 'Experiments - Fredrik Westerdahl',
  description: 'Experiments in audio, visuals, and interactive media.',
};

// Generate spoof cards for now
const spoofCards = Array.from({ length: 12 }, (_, i) => ({
  id: `spoof-${i}`,
  title: `Experiment ${i + 1}`,
}));

export default function CreativePage() {
  const works = allCreativeWorks.sort((a, b) =>
    (b.year || '0') > (a.year || '0') ? 1 : -1
  );

  // Use spoof cards for now
  const items = spoofCards;

  return (
    <div className="min-h-screen w-full bg-white" style={{ paddingTop: 'calc(20vh)' }}>
      <FadeIn>
        <div className="w-full border-t border-black">
          {/* 3-column masonry grid with borders */}
          <div className="relative">
            {/* Vertical lane borders */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="h-full w-full grid grid-cols-3">
                <div className="border-l border-black" />
                <div className="border-l border-black" />
                <div />
              </div>
            </div>
            
            {/* Masonry columns */}
            <div className="columns-3 gap-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid border-b border-black"
                >
                  {/* Portrait aspect ratio card */}
                  <div className="aspect-[3/4] bg-gray-100 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
