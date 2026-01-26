'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Default fade gradient mask style
export const FADE_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 50%, transparent)',
  maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 50%, transparent)',
};

interface MaskWrapperProps {
  children: ReactNode;
  className?: string;
  maskStyle?: React.CSSProperties;
  hiddenOnDesktop?: boolean;
  maskEnabled?: boolean; // External control for mask state
}

export function MaskWrapper({
  children,
  className,
  maskStyle = FADE_MASK_STYLE,
  hiddenOnDesktop = false,
  maskEnabled,
}: MaskWrapperProps) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If maskEnabled is provided, use it directly (external control)
  // Otherwise, fall back to existing hiddenOnDesktop logic
  // Always disable masking on mobile, even when explicitly enabled
  const shouldApplyMask =
    maskEnabled !== undefined
      ? maskEnabled && !isMobile
      : hiddenOnDesktop
        ? !isMobile
        : true;
  const appliedStyle = shouldApplyMask ? maskStyle : undefined;

  return (
    <div
      className={cn('h-full overflow-y-auto overflow-x-hidden', className)}
      style={appliedStyle}
    >
      {children}
    </div>
  );
}
