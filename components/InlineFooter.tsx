'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'motion/react';
import { useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
export function InlineFooter() {
    const ref = useRef(null);
    const { setInlineFooterInView } = useApp();
    const isInView = useInView(ref, {
        once: false,
        amount: 0.3,
        margin: "-200px"
    });
    // Update global state when visibility changes
    useEffect(() => {
        setInlineFooterInView(isInView);
    }, [isInView, setInlineFooterInView]);
    const links = [
        { href: '/fredrik_westerdahl_cv.pdf', label: 'Download PDF CV', external: true, primary: true },
        { href: 'mailto:fredrik@sublink.to', label: 'fredrik@sublink.to', external: true },
        { href: 'https://github.com/polisen', label: 'GitHub', external: true },
    ];
    return (
        <motion.div
            ref={ref}
            className="w-full flex items-center justify-center py-8 md:py-16"
        >
            <motion.div
                className="relative overflow-hidden w-full bg-gray-100/80 backdrop-blur-sm rounded-2xl p-4 md:p-8"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isInView ? {
                    opacity: 1,
                    y: 0,
                    scale: 1
                } : {
                    opacity: 0,
                    y: 40,
                    scale: 0.95
                }}
                transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1] // Smooth easing curve
                }}
            >
                <motion.div
                    className="flex items-center justify-start md:justify-center flex-row gap-4 flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible hide-scrollbar"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {links.map((link, index) => (
                        <motion.div
                            key={link.label}
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? {
                                opacity: 1,
                                y: 0
                            } : {
                                opacity: 0,
                                y: 20
                            }}
                            transition={{
                                duration: 0.5,
                                delay: isInView ? index * 0.1 : 0,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                        >
                            {/* Glow effect for primary button when in view */}
                            {link.primary && isInView && (
                                <motion.div
                                    className="absolute inset-0 bg-[#21de73] rounded-xl blur-xl opacity-40"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 0.4, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                />
                            )}
                            <Link
                                href={link.href}
                                target={link.external ? '_blank' : undefined}
                                className={cn(
                                    'relative flex items-center justify-center transition-all whitespace-nowrap min-h-[44px] shrink-0',
                                    link.primary
                                        ? 'text-base md:text-xl px-6 md:px-8 py-3.5 md:py-4 bg-[#21de73] text-black rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform'
                                        : 'text-sm md:text-lg px-5 md:px-6 py-3 md:py-3 hover:opacity-100 opacity-70 text-black bg-white/50 rounded-lg hover:bg-white/80 hover:scale-105 transform'
                                )}
                            >
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
                {/* Expanded state decorative elements */}
                {isInView && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200/50 flex items-center justify-center"
                    >
                        <p className="text-xs md:text-sm text-gray-500">
                            Let&apos;s build something together
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}
