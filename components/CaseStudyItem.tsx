'use client';

import { m, motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { GooContainer } from '@/components/GooContainer';
import { cn } from '@/lib/utils';

interface CaseStudyItemProps {
  number: number;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  color?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function CaseStudyItem({
  number,
  title,
  subtitle,
  children,
  color,
  isExpanded: controlledIsExpanded,
  onToggle: controlledOnToggle,
}: CaseStudyItemProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(400);

  // Use controlled state if provided, otherwise use internal state
  const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded;

  // Measure content height using a hidden measurement container
  useEffect(() => {
    if (measureRef.current) {
      const fullHeight = measureRef.current.scrollHeight;
      setContentHeight(Math.max(fullHeight, 400));
    }
  }, [children]);

  const handleToggle = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsExpanded(!internalIsExpanded);
    }
  };

  return (
    <motion.div className="relative" onClick={handleToggle}>
      {/* Responsive layout: single column on mobile, two columns on desktop */}
      <div className="w-full py-2 px-2 md:px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 md:pl-24 gap-4 items-start">
          {/* Column 1: Header card */}
          <GooContainer
          shape="rectangle"
            color={color}
            className={`md:sticky md:top-32 z-10 rounded-lg p-12 py-6 md:p-12 flex flex-col justify-between ${
              'max-h-[20vh] md:max-h-[50vh] md:aspect-video'
            }`}
            // backgroundImage='url("/sublink_image.jpeg")'
        >
            <div className="text-sm text-gray-500">{number}</div>
            <div>
              <div className="font-semibold tracking-tight uppercase text-sm mb-1">
                {title}
              </div>
              <div className="text-xs text-gray-600">{subtitle}</div>
            </div>
          </GooContainer>
            {}
          {/* Column 2: Expandable container with cards */}
          <div className="relative expandable-container md:max-w-xl">
            {/* Hidden measurement container */}
            <div
              ref={measureRef}
              className="invisible absolute flex  flex-col gap-2"
              style={{ width: '100%' }}
            >
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    className: `${child.props.className || ''} w-full`,
                  } as any);
                }
                return child;
              })}
            </div>

            <motion.div
              className="relative overflow-hidden"
              initial={false}
              animate={{
                height: isExpanded ? contentHeight : 400,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{
                maskImage: !isExpanded
                  ? 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
                  : 'none',
                WebkitMaskImage: !isExpanded
                  ? 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
                  : 'none',
              }}
            >
              {/* Cards container - vertical flex */}
              <div ref={contentRef} className="flex flex-col md:pt-6  gap-2 pb-16">
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                      className: `${child.props.className || ''} w-full`,
                    } as any);
                  }
                  return child;
                })}
              </div>
            </motion.div>

            {/* Read more button */}
          </div>
        </div>
      </div>
      {/* Sticky bottom border */}
      <div className={cn('z-50',isExpanded ? 'sticky bottom-0 left-0 right-0' : '')}>
        <div className={
          cn(
            "read-more-button absolute bottom-4 right-5 md:right-32 text-lg font-medium text-[#555555] hover:text-[#0f0f0f] transition-colors  pointer-events-none",
          )
        }>
          {isExpanded ? 'Read less +' : 'Read more +'}
        </div>
        <div className={cn(' h-px bg-black/10  z-50')} />
      </div>
    </motion.div>
  );
}
