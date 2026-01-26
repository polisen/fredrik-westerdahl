'use client';

import { Suspense, useState, lazy, useEffect } from "react";
import { motion, MotionConfig, useMotionValue } from "motion/react";
import { transition } from "./settings";
import useMeasure from "react-use-measure";

// Dynamically import Shapes to avoid SSR issues with framer-motion-3d
const Shapes = lazy(() => import("./Shapes").then(module => ({ default: module.Shapes })));

export default function Button3D() {
  const [ref, bounds] = useMeasure({ scroll: false });
  const [isHover, setIsHover] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resetMousePosition = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <MotionConfig transition={transition}>
      <motion.button
        ref={ref}
        initial={false}
        animate={isHover ? "hover" : "rest"}
        whileTap="press"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.5 },
          press: { scale: 1.4 }
        }}
        onHoverStart={() => {
          resetMousePosition();
          setIsHover(true);
        }}
        onHoverEnd={() => {
          resetMousePosition();
          setIsHover(false);
        }}
        onTapStart={() => setIsPress(true)}
        onTap={() => setIsPress(false)}
        onTapCancel={() => setIsPress(false)}
        onPointerMove={(e) => {
          mouseX.set(e.clientX - bounds.x - bounds.width / 2);
          mouseY.set(e.clientY - bounds.y - bounds.height / 2);
        }}
        style={{
          appearance: 'none',
          border: 'none',
          cursor: 'default',
          backgroundColor: '#acc7ed',
          color: '#fff',
          borderRadius: '60px',
          outline: 'none',
          margin: 0,
          padding: '12px 25px',
          fontSize: '48px',
          fontWeight: 600,
          lineHeight: '48px',
          letterSpacing: '-1px',
          position: 'relative',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            right: '-1px',
            bottom: '-1px',
            borderRadius: '60px',
            background: 'linear-gradient(60deg, #61dafb 0%, #d6cbf6 30%, #f2056f 70%)'
          }}
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 }
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-15px',
              right: '20px',
              width: '100px',
              height: '30px',
              filter: 'blur(20px)',
              background: '#db07d1'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-15px',
              left: '20px',
              width: '100px',
              height: '30px',
              filter: 'blur(20px)',
              background: '#61dafb'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              bottom: '-100px',
              left: '-100px',
              right: '-100px',
              width: 'calc(100% + 200px)',
              pointerEvents: 'none'
            }}
          >
            {isMounted && (
              <Suspense fallback={null}>
                <Shapes
                  isHover={isHover}
                  isPress={isPress}
                  mouseX={mouseX}
                  mouseY={mouseY}
                />
              </Suspense>
            )}
          </div>
        </motion.div>
        <motion.div
          variants={{ hover: { scale: 0.85 }, press: { scale: 1.1 } }}
          style={{
            width: '180px',
            padding: '20px 0',
            transform: 'translateZ(0)',
            fontWeight: 700,
            zIndex: 1
          }}
        >
          play
        </motion.div>
      </motion.button>
    </MotionConfig>
  );
}
