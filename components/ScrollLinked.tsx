"use client"

import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { usePathname } from "next/navigation"

const scrollBarSpring = { stiffness: 120, damping: 16 }

export default function ScrollLinked() {
    const pathname = usePathname()
    const isInsightPage = pathname.startsWith('/insights/')

    const { scrollYProgress } = useScroll()
    const progress = useSpring(scrollYProgress, scrollBarSpring)
    const height = useTransform(progress, (v) =>
        v < 0.002 ? "0%" : `${v * 100}%`
    )
    const opacity = useTransform(progress, (v) => (v < 0.002 || v > 0.994 ? 0 : 1))
    const x = useTransform(progress, (v) => (v < 0.002 || v > 0.994 ? 40 : 0))
    const filter = useTransform(
        progress,
        (v) => (v < 0.002 || v > 0.994 ? "blur(4px)" : "blur(0px)")
    )

    return (
        <motion.div
            id="scroll-indicator"
            className="fixed top-2 right-2 bottom-2 w-1 md:w-2.5 z-50 bg-gray-200/60 rounded-md backdrop-blur-md backdrop-invert-0 origin-top"
            style={{
                height: isInsightPage ? "0%" : height,
                opacity: isInsightPage ? 0 : opacity,
                x: isInsightPage ? 40 : x,
                filter: isInsightPage ? "blur(4px)" : filter,
            }}
            initial={{ height: "0%" }}
        />
    )
}
