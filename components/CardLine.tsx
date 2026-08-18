"use client";

import "flickity/dist/flickity.min.css";
import { motion, animate, useMotionTemplate, useMotionValue } from "motion/react";
import Flickity from "react-flickity-component";
import {
  createContext,
  Children,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useApp } from "@/context/AppContext";
import { getContrastingTextColor } from "@/lib/cardLineColors";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CardLineTextColorContext = createContext<string>("#0f0f0f");

/** Minimal Flickity instance shape we use (library has no TS types). */
interface FlickityInstance {
  applyForce: (force: number) => void;
  startAnimation: () => void;
  dragEnd: () => void;
  resize: () => void;
  on: (event: string, fn: (...args: unknown[]) => void) => void;
  off: (event: string, fn: (...args: unknown[]) => void) => void;
  element: HTMLElement;
  select: (index: number, isWrapped?: boolean, isInstant?: boolean) => void;
}

interface CardLineProps {
  children: ReactNode;
  title?: string;
  alwaysVisibleCount?: number;
  heightVariant?: "regular" | "tall" | "large" | "half" | "tags";
  /**
   * Multiplier on the resolved height (e.g. 0.66 collapsed → 1 selected).
   * Animated with a spring when it changes.
   */
  heightScale?: number;
  outerPadding?: boolean;
  backgroundColor?: string;
  showTitle?: boolean;
  /** Fired on click when the row wasn't dragged (for exclusive expand). */
  onActivate?: () => void;
}

interface CardItemProps {
  children: ReactNode;
  /** "square" | "video" (13/9) | "pill" (content width) | number (width/height) */
  aspectRatio?: "square" | "video" | "pill" | number;
  className?: string;
  /** Optional text color; when omitted, uses WCAG AA contrasting color from the card line background. */
  textColor?: string;
  /** When true, card background is transparent (e.g. for image/video cards). */
  noBackground?: boolean;
  /** Corner radius; default matches the soft card look. */
  borderRadius?: string;
}

const cardItemRevealVariants = {
  hidden: { opacity: 0, filter: "blur(32px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

export function CardItem({
  children,
  aspectRatio = "square",
  className,
  textColor,
  noBackground = false,
  borderRadius = "2.25rem",
}: CardItemProps) {
  const { scrollContainerRef } = useApp();
  const reducedMotion = useReducedMotion();
  const defaultTextColor = useContext(CardLineTextColorContext);
  const effectiveTextColor = textColor ?? defaultTextColor;
  const isPill = aspectRatio === "pill";

  const widthStyle = isPill
    ? "max-content"
    : aspectRatio === "square"
      ? "var(--cardline-height, 40vh)"
      : typeof aspectRatio === "number"
        ? `calc(var(--cardline-height, 40vh) * ${aspectRatio})`
        : "calc(var(--cardline-height, 40vh) * 13 / 9)";

  return (
    <motion.div
      className={`max-w-[80dvw] overflow-hidden ${className ?? ""}`}
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      whileTap={
        reducedMotion
          ? undefined
          : isPill
            ? { scale: 0.97 }
            : {
                borderRadius: "3.5rem",
                scaleX: 0.96,
                scaleY: 0.98,
              }
      }
      viewport={{
        once: true,
        amount: 0.1,
        root: scrollContainerRef ?? undefined,
      }}
      variants={cardItemRevealVariants}
      transition={{
        borderRadius: { type: "spring", stiffness: 80, damping: 9, mass: 0.85 },
        scaleX: { type: "spring", stiffness: 80, damping: 9, mass: 0.85 },
        scaleY: { type: "spring", stiffness: 86, damping: 10, mass: 0.75 },
        scale: { type: "spring", stiffness: 80, damping: 9, mass: 0.85 },
        opacity: { duration: 0.5, ease: "easeOut" },
        filter: { duration: 0.5, ease: "easeOut" },
      }}
      style={{
        borderRadius: isPill ? "9999px" : borderRadius,
        height: "var(--cardline-height, 40vh)",
        width: widthStyle,
        backgroundColor: noBackground ? "transparent" : "var(--cardline-bg, #f3f4f6)",
      }}
    >
      <div
        className={
          isPill
            ? "h-full min-h-0 flex items-center px-5 text-lg whitespace-nowrap"
            : "h-full min-h-0 flex flex-col"
        }
        style={{ color: effectiveTextColor }}
      >
        {children}
      </div>
    </motion.div>
  );
}

const flickityOptions = {
  initialIndex: 0,
  freeScroll: true,
  draggable: true,
  contain: true,
  cellAlign: "left" as const,
  prevNextButtons: false,
  pageDots: false,
};

export function CardLine({
  children,
  title,
  alwaysVisibleCount = 1,
  heightVariant = "regular",
  heightScale = 1,
  outerPadding = true,
  backgroundColor,
  showTitle = true,
  onActivate,
}: CardLineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [flkty, setFlkty] = useState<FlickityInstance | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragMovedRef = useRef(false);
  const childItems = Children.toArray(children);
  const reducedMotion = useReducedMotion();
  const defaultTextColor = useMemo(
    () => getContrastingTextColor(backgroundColor ?? "#f3f4f6", 0.9),
    [backgroundColor]
  );

  const baseHeight =
    heightVariant === "large"
      ? "60vh"
      : heightVariant === "tall"
        ? "50vh"
        : heightVariant === "half"
          ? "calc(40vh * 0.66)"
          : heightVariant === "tags"
            ? "2.75rem"
            : "40vh";

  const scaleMv = useMotionValue(heightScale);
  const animatedHeight = useMotionTemplate`calc((${baseHeight}) * ${scaleMv})`;

  useEffect(() => {
    if (reducedMotion) {
      scaleMv.set(heightScale);
      return;
    }
    const controls = animate(scaleMv, heightScale, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      mass: 0.9,
    });
    return () => controls.stop();
  }, [heightScale, reducedMotion, scaleMv]);

  useEffect(() => {
    if (!flkty) return;
    const unsub = scaleMv.on("change", () => {
      flkty.resize();
    });
    return unsub;
  }, [flkty, scaleMv]);

  useEffect(() => {
    if (!flkty) return;

    const onDragStart = (...args: unknown[]) => {
      const ev = args[0] as Event;
      ev.preventDefault();
      dragMovedRef.current = true;
      setIsDragging(true);
    };
    const onDragEnd = () => setIsDragging(false);

    const onWheel = (ev: WheelEvent) => {
      if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
        ev.preventDefault();
        flkty.applyForce(-ev.deltaX / 16);
        flkty.startAnimation();
        flkty.dragEnd();
      }
    };

    flkty.on("dragStart", onDragStart);
    flkty.on("dragEnd", onDragEnd);
    flkty.element.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      flkty.off("dragStart", onDragStart);
      flkty.off("dragEnd", onDragEnd);
      flkty.element.removeEventListener("wheel", onWheel);
    };
  }, [flkty]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(max-width: 768px)");
    const listener = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(query.matches);
    if ("addEventListener" in query) {
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    }
    const legacyQuery = query as MediaQueryList & {
      addListener: (cb: (event: MediaQueryListEvent) => void) => void;
      removeListener: (cb: (event: MediaQueryListEvent) => void) => void;
    };
    legacyQuery.addListener(listener);
    return () => legacyQuery.removeListener(listener);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, []);

  const containerPaddingClass = outerPadding ? "px-4 md:px-10" : "px-0";
  const carouselClass = outerPadding
    ? "overflow-hidden -mx-4 md:-mx-10"
    : "overflow-hidden";

  return (
    <CardLineTextColorContext.Provider value={defaultTextColor}>
      <motion.div
        className={`w-full ${containerPaddingClass} relative origin-center`}
        style={{
          cursor: isDragging
            ? "grabbing"
            : isHovered
              ? "grab"
              : onActivate
                ? "pointer"
                : "default",
          height: animatedHeight,
          ["--cardline-bg" as string]: backgroundColor ?? "#f3f4f6",
          ["--cardline-height" as string]: animatedHeight,
        }}
        onPointerDown={() => {
          dragMovedRef.current = false;
        }}
        onClick={() => {
          if (dragMovedRef.current || isDragging) return;
          onActivate?.();
        }}
        onMouseEnter={() => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
          }
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            if (flkty) flkty.select(0, false, reducedMotion);
          }, 500);
        }}
      >
      {showTitle && title ? (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="sticky pl-0.5 top-[86px]">
            <div className="inline-block bg-white/80 p-1 backdrop-blur-md text-lg rounded-2xl shadow-sm ml-4 md:ml-10 pointer-events-auto">
              {title}
            </div>
          </div>
        </div>
      ) : null}

      <Flickity
        options={flickityOptions}
        flickityRef={setFlkty}
        className={carouselClass}
      >
        {childItems.map((child, index) => {
          const shouldShow =
            isMobile || isHovered || index < alwaysVisibleCount;
          const isFirst = index === 0;
          const isLast = index === childItems.length - 1;
          const leftPaddingClass =
            outerPadding && isFirst ? "pl-4 md:pl-10" : "";
          const rightPaddingClass = outerPadding
            ? isLast
              ? "pr-4 md:pr-10"
              : "pr-2"
            : isLast
              ? "pr-0"
              : "pr-2";
          const cellClass = [
            "shrink-0 w-auto ",
            leftPaddingClass,
            rightPaddingClass,
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div
              key={(child as { key?: string | number }).key ?? index}
              className={cellClass}
            >
              <motion.div
                initial={{
                  opacity: index < alwaysVisibleCount ? 1 : 0,
                  filter:
                    index < alwaysVisibleCount ? "blur(0px)" : "blur(10px)",
                }}
                animate={{
                  opacity: shouldShow ? 1 : 0,
                  filter: shouldShow ? "blur(0px)" : "blur(10px)",
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="relative cursor-pointer h-full"
              >
                {child}
              </motion.div>
            </div>
          );
        })}
      </Flickity>
    </motion.div>
    </CardLineTextColorContext.Provider>
  );
}
