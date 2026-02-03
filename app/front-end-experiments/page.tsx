'use client';

import dynamic from 'next/dynamic';
import { FadeIn } from '@/components/FadeIn';
import { SectionReveal } from '@/components/scroll-effects/SectionReveal';
import { TechGooeyGraphCard } from '@/components/TechGooeyGraphCard';
import { HeaderGooeyCluster } from '@/components/HeaderGooeyCluster';

const Button3D = dynamic(() => import('@/components/3d/Button3D'), {
  ssr: false,
});

const PhysicsTerrarium = dynamic(
  () =>
    import('@/components/PhysicsTerrarium').then((m) => ({
      default: m.PhysicsTerrarium,
    })),
  { ssr: false }
);

export default function FrontEndExperimentsPage() {
  return (
    <div
      className="min-h-screen w-full bg-white"
      style={{ paddingTop: 'calc(24vh + 60px)' }}
    >
      <FadeIn>
        <div className="max-w-3xl mx-auto px-5 pb-24">
          <p className="text-gray-600 text-lg mb-16">
            A curated set of UI and interaction experiments — focused on motion,
            layout, and interface behavior.
          </p>

          <div className="flex flex-col gap-20">
            {/* 1. 3D Hover Button */}
            <article className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-gray-900">
                3D Hover Button
              </h2>
              <div className="flex justify-center min-h-[200px] items-center rounded-xl bg-gray-50/80 border border-gray-100 p-8">
                <Button3D />
              </div>
              <ul className="text-gray-600 text-base leading-relaxed list-disc list-inside space-y-1.5">
                <li>Motion and interaction states (hover, press) with 3D transforms</li>
                <li>Pointer-driven parallax and gradient reveal on hover</li>
                <li>WebGL/Three.js shapes (via react-three-fiber) for depth; kept optional and lazy-loaded</li>
                <li>Performance-first: MotionConfig and reduced work when idle</li>
              </ul>
            </article>

            {/* 2. Gooey Tech Graph */}
            <article className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Gooey Tech Graph
              </h2>
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white min-h-[320px]">
                <TechGooeyGraphCard className="min-h-[320px] border-0 rounded-xl" />
              </div>
              <ul className="text-gray-600 text-base leading-relaxed list-disc list-inside space-y-1.5">
                <li>SVG feGaussianBlur + feColorMatrix for gooey blob merging</li>
                <li>Drag-and-drop and spring/repel physics for layout</li>
                <li>Responsive layout with ResizeObserver; label and sr-only list for accessibility</li>
                <li>Safari fallback when SVG filters are not applied to DOM</li>
              </ul>
            </article>

            {/* 3. Physics-driven Blob Cluster */}
            <article className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Physics-driven Blob Cluster
              </h2>
              <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 h-[280px]">
                <HeaderGooeyCluster className="rounded-xl" />
              </div>
              <ul className="text-gray-600 text-base leading-relaxed list-disc list-inside space-y-1.5">
                <li>Real-time physics (spring, repel, bounds) in requestAnimationFrame</li>
                <li>Gooey filter for organic merging; hover scale on blobs</li>
                <li>Seeded random for stable layout across mounts</li>
                <li>Lightweight: no drag, no extra deps beyond motion and the filter</li>
              </ul>
            </article>

            {/* 4. Physics Terrarium */}
            <article className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Physics Terrarium
              </h2>
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white min-h-[320px]">
                <PhysicsTerrarium className="min-h-[320px] w-full" />
              </div>
              <ul className="text-gray-600 text-base leading-relaxed list-disc list-inside space-y-1.5">
                <li>2D rigid-body physics (Matter.js): pills bounce off walls and stack</li>
                <li>Drag and flick to throw; flat, grotesque pill styling with black outlines</li>
                <li>Reduced-motion: static layout of the same pills when preferred</li>
                <li>Resize-safe: engine recreated when container bounds change</li>
              </ul>
            </article>

            {/* 5. Section Reveal on Scroll */}
            <article className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Section Reveal on Scroll
              </h2>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <SectionReveal
                  className="min-h-[100vh] flex items-center justify-center bg-gray-50"
                  yRange={[40, -40]}
                  opacityRange={[0.05, 0.35, 0.65, 0.95]}
                >
                  <div className="text-center px-8 py-12 max-w-md">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      This block fades and moves in and out as you scroll.
                      Y, opacity, and scale are driven by scroll progress with
                      spring smoothing. Respects <code className="text-sm bg-gray-200/80 px-1 rounded">prefers-reduced-motion</code>.
                    </p>
                  </div>
                </SectionReveal>
              </div>
              <ul className="text-gray-600 text-base leading-relaxed list-disc list-inside space-y-1.5">
                <li>Scroll-linked transforms: y, opacity, scale with configurable ranges</li>
                <li>useScroll (target + offset) and useSpring for smooth, responsive feel</li>
                <li>Accessibility: reduced-motion disables spring, keeps instant updates</li>
                <li>Reusable across breakpoints; offset and ranges are props</li>
              </ul>
            </article>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
