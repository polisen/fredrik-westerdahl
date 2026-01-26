import React from 'react';

interface ColumnProps {
  index: number; // 1-based column index (1, 2, 3, or 4)
  children: React.ReactNode;
}

// This component is used as a marker to specify which column a child belongs to
// The actual rendering and layout is handled by CaseStudyItem
export function Column({ index, children }: ColumnProps) {
  // Store the column index as a prop that CaseStudyItem can read
  return <>{children}</>;
}
