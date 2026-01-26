"use client";

interface GooeyFilterProps {
  stdDeviation?: number;
  matrixValues?: string;
  filterId?: string;
  colorInterpolationFilters?: "inherit" | "auto" | "linearRGB" | "sRGB";
}

export function GooeyFilter({
  stdDeviation = 13,
  matrixValues = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7",
  filterId = "gooeyCodeFilter",
  colorInterpolationFilters = "sRGB",
}: GooeyFilterProps) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id={filterId}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={stdDeviation}
            colorInterpolationFilters={colorInterpolationFilters}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values={matrixValues}
            result="gooey"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default GooeyFilter;
