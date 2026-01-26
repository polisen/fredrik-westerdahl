'use client';

import React from 'react';
import { motion } from 'motion/react';
import { GooContainer } from '@/components/GooContainer';
import { GooSvg } from '@/components/GooSvg';

interface HeaderProps {
  children?: React.ReactNode;
}

/**
 * Header - A header component with SVG shapes cast to the goo layer.
 *
 * Contains:
 * - Red bar: SVG rectangle (replacing div-based implementation)
 * - Green highlighter: Smooth curved SVG path (inverted U/V shape)
 *
 * Both shapes are rendered in the goo layer via customShape.
 * Regular content can be passed as children to render on top.
 */
export function Header({ children }: HeaderProps) {
  // Green highlighter path - smooth inverted U/V curve
  // Starts upper-left, curves down to center-bottom, curves back up to upper-right
  // Using cubic Bezier curves for smooth transitions
  const highlighterPath = 'M 5 20 C 15 40, 25 60, 50 75 C 75 60, 85 40, 95 20';

  return (
    <div id="intro" className="relative snap-center  shrink-0 !h-[70dvh] w-full">
      <div className="justify-end h-full  flex flex-col p-16 pl-32 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Fredrik Westerdahl
        </h1>
        <h2 className="text-lg  text-gray-600 font-medium ">
          Senior Software Engineer (Systems & Architecture)
        </h2>
        <p className="text-base  text-gray-600 leading-relaxed max-w-full md:max-w-xl">
          End-to-end problem solver designing, shipping, and operating
          production systems under real technical, product, and business
          constraints.
        </p>
      </div>
      <div className="absolute inset-0">
        <GooContainer
          shape="custom"
          // backgroundStyle={{ backgroundColor: 'red' }}
          customShape={
            <GooSvg viewBox="0 0 100 100" animate={true}>
              {/* Red bar - SVG rectangle */}
              <motion.rect
                x="45"
                y="82"
                width="10"
                height="20"
                fill="#cffe01"
                fillOpacity={0.8}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              <motion.circle
                cx="50"
                cy="36"
                r="12"
                fill="#cffe01"
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                initial={{ opacity: 0, scale: 0.8 }}
                fillOpacity={0.8}
              />

              {/* Green highlighter - smooth curved path with thick stroke */}
              <motion.path
                d={highlighterPath}
                fill="none"
                stroke="#cffe01"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.85}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.2,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
              />
            </GooSvg>
          }
        >
          {children || <div className=""></div>}
        </GooContainer>
      </div>
    </div>
  );
}
