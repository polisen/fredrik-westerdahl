"use client"

import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { usePathname } from "next/navigation"

const scrollBarSpring = { stiffness: 70, damping: 20 }

export default function ScrollLinked() {
    const pathname = usePathname()
    const isInsightPage = pathname.startsWith('/insights/')

    const { scrollYProgress } = useScroll()
    const progress = useSpring(scrollYProgress, scrollBarSpring)
    const height = useTransform(progress, (v) =>
        v < 0.002 ? "1%" : `${v * 100}%`
    )
    const opacity = useTransform(progress, (v) => (v < 0.002  ? 0 : 1))

    return (
        <motion.div
            id="scroll-indicator"
            className="fixed top-2 right-2 bottom-2 w-1 md:w-2.5 z-50 bg-gray-100 rounded-2xl backdrop-blur-md backdrop-invert-0 origin-top"
            style={{
                height: isInsightPage ? "0%" : height,
                opacity: isInsightPage ? 0 : opacity,
            }}
            initial={{ height: "0%" }}
        />
    )
}
