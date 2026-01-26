"use client";

interface GooeyFilterProps {
  stdDeviation?: number;
  matrixValues?: string;
  filterId?: string;
  colorInterpolationFilters?: "inherit" | "auto" | "linearRGB" | "sRGB";
  additionalBlur?: number; // Additional blur to apply after the gooey effect (for Safari compatibility)
}

export function GooeyFilter({
  stdDeviation = 13,
  matrixValues = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7",
  filterId = "gooeyCodeFilter",
  colorInterpolationFilters = "sRGB",
  additionalBlur,
}: GooeyFilterProps) {
  return (
    <svg
      width="1"
      height="1"
      aria-hidden
      style={{ position: "absolute", left: -9999, top: -9999, overflow: "hidden" }}
    >
      <defs>
        <filter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters={colorInterpolationFilters}
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={stdDeviation} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values={matrixValues} result="gooey" />
          {additionalBlur !== undefined && additionalBlur > 0 && (
            <feGaussianBlur in="gooey" stdDeviation={additionalBlur} result="gooeyBlur" />
          )}
        </filter>
      </defs>
    </svg>
  );
}

export default GooeyFilter;
