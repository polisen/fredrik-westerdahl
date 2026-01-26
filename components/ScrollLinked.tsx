"use client"

import { useApp } from "@/context/AppContext"
import { motion } from "motion/react"
import { usePathname } from "next/navigation"

export default function ScrollLinked() {
    const { scrollYProgress } = useApp()
    const pathname = usePathname()
    const isInsightPage = pathname.startsWith('/insights/')


    const scrollYNumber = scrollYProgress ?? 0

    const IS_AT_ENDS = scrollYNumber < .002 || isInsightPage

    return (
        <>
            <motion.div
                id="scroll-indicator"
                className="fixed right-0 inset-y-0 w-1 md:w-2.5 z-50 origin-top bg-[#21de73]"
                style={{
                    scaleY: scrollYNumber < .002 ? 0 : scrollYNumber,

                }}
                transition={{ type: "easeInOut", duration: .2 }}
                initial={{ scaleY: 0, }}
                animate={{ filter: !IS_AT_ENDS ? "blur(0px)" : "blur(4px)", y: IS_AT_ENDS ? "40px" : "0px", opacity: IS_AT_ENDS ? 0 : 1 }}
            />
        </>
    )
}
