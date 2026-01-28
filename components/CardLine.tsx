import { motion } from "motion/react";
import { Children, useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useHorizontalScrollDrag } from "@/lib/useHorizontalScrollDrag";
interface CardLineProps {
  children: ReactNode;
  title?: string;
  alwaysVisibleCount?: number;
  heightVariant?: "regular" | "tall" | "large";
}

interface CardItemProps {
  children: ReactNode;
  aspectRatio?: "square" | "video";
  className?: string;
}

export function CardItem({
  children,
  aspectRatio = "square",
  className,
}: CardItemProps) {
  return (
    <div
      className={`rounded-lg bg-gray-100 overflow-hidden ${className ?? ""}`}
      style={{
        height: "var(--cardline-height, 40vh)",
        width:
          aspectRatio === "square"
            ? "var(--cardline-height, 40vh)"
            : "calc(var(--cardline-height, 40vh) * 16 / 9)",
      }}
    >
      {children}
    </div>
  );
}


export function CardLine({
  children,
  title,
  alwaysVisibleCount = 1,
  heightVariant = "regular",
}: CardLineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const childItems = Children.toArray(children);

  const reducedMotion = useReducedMotion();
  const { scrollerRef, handlers } = useHorizontalScrollDrag({
    inertia: !reducedMotion,
  });

  const wrappedHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      setIsDragging(true);
      handlers.onPointerDown(e);
    },
    onPointerMove: handlers.onPointerMove,
    onPointerUp: (e: React.PointerEvent) => {
      handlers.onPointerUp(e);
      setIsDragging(false);
    },
    onPointerCancel: (e: React.PointerEvent) => {
      handlers.onPointerCancel(e);
      setIsDragging(false);
    },
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(query.matches);
    const listener = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    update();
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

  return (
    <div
      ref={scrollerRef}
      className="w-full overflow-x-auto overflow-y-hidden px-32 relative"
      style={
        {
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
          cursor: isDragging ? "grabbing" : isHovered ? "grab" : "default",
          height: "var(--cardline-height, 40vh)",
          ["--cardline-height"]:
            heightVariant === "large"
              ? "60vh"
              : heightVariant === "tall"
                ? "50vh"
                : "40vh",
        } as CSSProperties & { ["--cardline-height"]?: string }
      }
      onMouseEnter={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
          setIsHovered(false);
          const el = scrollerRef.current;
          if (el) el.scrollTo({ left: 0, behavior: reducedMotion ? "auto" : "smooth" });
        }, 500);
      }}
      {...wrappedHandlers}
    >
      {title ? (
        <div className="top-0 left-32 z-10 absolute">
          <div className="inline-block bg-white/80 p-1 backdrop-blur-md rounded-md shadow-sm">
            {title}
          </div>
        </div>
      ) : null}

      <div className="flex gap-2 min-w-max -mx-4 md:-mx-32 px-4 md:px-32">
        {childItems.map((child, index) => {
          const shouldShow = isMobile || isHovered || index < alwaysVisibleCount;
          return (
            <motion.div
              key={(child as { key?: string | number }).key ?? index}
              initial={{
                opacity: index < alwaysVisibleCount ? 1 : 0,
                filter: index < alwaysVisibleCount ? "blur(0px)" : "blur(10px)",
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
              className="relative shrink-0 cursor-pointer"
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}