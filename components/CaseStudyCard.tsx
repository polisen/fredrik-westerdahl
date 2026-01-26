'use client';

import { ReactNode } from 'react';
import { GooContainer } from '@/components/GooContainer';
import { MaskWrapper } from '@/components/MaskWrapper';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface CaseStudyCardProps {
  children: ReactNode;
  color?: string;
  shape?: 'rectangle' | 'rounded';
  masked?: boolean;
  className?: string;
  backgroundStyle?: React.CSSProperties;
  backgroundImage?: string;
}

export function CaseStudyCard({
  children,
  color,
  shape = 'rounded',
  masked = false,
  className,
  backgroundStyle,
  backgroundImage,
}: CaseStudyCardProps) {
  const isRectangle = shape === 'rectangle';
  const isContentCard = !isRectangle;

  const gooContainerContent = masked ? (
    <MaskWrapper
      maskEnabled={masked}
      hiddenOnDesktop={true}
      className="h-auto md:h-full p-6 md:p-8 lg:p-12 xl:p-20 xl:px-12 md:overflow-y-auto md:overflow-x-hidden prose prose-sm md:prose-sm lg:prose-base max-w-none text-[color:var(--case-muted)] prose-p:leading-relaxed prose-p:text-[color:var(--case-muted)] prose-headings:font-semibold prose-headings:text-[color:var(--case-fg)] prose-headings:mt-8 prose-headings:mb-4 prose-strong:text-[color:var(--case-fg)] prose-strong:font-semibold prose-a:text-[color:var(--case-accent)] hover:prose-a:text-[color:var(--case-fg)] hide-scrollbar"
    >
      {children}
    </MaskWrapper>
  ) : (
    children
  );

  const gooContainer = (
    <GooContainer
      shape={shape}
      color={color}
      backgroundStyle={backgroundStyle}
      backgroundImage={backgroundImage}
      className={cn(
        "flex flex-col h-auto md:h-full md:overflow-hidden",
        // Only apply text-white when not masked (cover cards)
        !masked && "text-white",
        className
      )}
    >
      {gooContainerContent}
    </GooContainer>
  );

  // Animation direction based on card type
  const animationX = isRectangle ? -20 : 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: animationX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'w-full md:min-w-[50vw] md:shrink-0 md:snap-center md:w-[45vw]',
      )}
    >
      {gooContainer}
    </motion.div>
  );
}
