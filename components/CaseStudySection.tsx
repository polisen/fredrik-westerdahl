'use client';

import { ReactNode, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface CaseStudySectionProps {
  title: string;
  years?: string;
  visitUrl?: string;
  children: ReactNode;
}

const pillClass =
  'inline-flex items-center h-8 px-2 rounded-2xl bg-gray-100 text-black text-lg font-normal shadow-sm pointer-events-auto shrink-0 transition-[background-color,color] duration-700 ease-in-out group-data-[stuck]:bg-black group-data-[stuck]:text-white';

export function CaseStudySection({
  title,
  years,
  visitUrl,
  children,
}: CaseStudySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pills = pillsRef.current;
      if (!section || !pills) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      gsap.set(pills, { transformOrigin: 'left center', x: 0 });

      const stuckX = () =>
        window.matchMedia('(min-width: 768px)').matches ? -24 : -16;

      const setStuck = (stuck: boolean) => {
        pills.toggleAttribute('data-stuck', stuck);
        const x = stuck ? stuckX() : 0;
        if (reduceMotion) {
          gsap.set(pills, { scale: stuck ? 0.94 : 1, x });
          return;
        }
        gsap.to(pills, {
          scale: stuck ? 0.94 : 1,
          x,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: true,
        });
      };

      ScrollTrigger.create({
        trigger: section,
        start: 'top 86px',
        end: 'bottom 86px',
        onEnter: () => setStuck(true),
        onLeaveBack: () => setStuck(false),
        onEnterBack: () => setStuck(true),
        onLeave: () => setStuck(false),
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="relative">
      <div
        ref={pillsRef}
        className="group inset-2 sticky top-[86px] left-[4px] z-30 pointer-events-none pb-2 flex items-center gap-2 ml-8 md:ml-16 pr-4 md:pr-10 will-change-transform"
      >
        <div className={`${pillClass} capitalize`}>{title?.toWellFormed()}</div>
        {years ? <div className={pillClass}>{years}</div> : null}
        {visitUrl && (
          <a
            href={visitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pillClass} gap-1 hover:bg-neutral-200 group-data-[stuck]:hover:bg-neutral-800`}
          >
            Visit
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
