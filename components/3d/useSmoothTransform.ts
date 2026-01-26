import { useSpring, useTransform, MotionValue } from "motion/react";

export function useSmoothTransform(
  value: MotionValue<number>,
  springOptions: { stiffness: number; damping: number },
  transformer: (v: number) => number
) {
  return useSpring(useTransform(value, transformer), springOptions);
}
