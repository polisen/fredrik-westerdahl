'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function FooterNavigation() {
    const links = [
        { href: '/fredrik_westerdahl_cv.pdf', label: 'Download PDF CV', external: true, primary: true },
        { href: 'mailto:fredrik@sublink.to', label: 'fredrik@sublink.to', external: true },
        { href: 'https://github.com/polisen', label: 'GitHub', external: true },
    ];

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 right-0 p-4 md:p-8  pointer-events-none"
        >
            <div className="flex gap-4 items-start pointer-events-auto">
                <div className="flex h-10 shrink-0 rounded-md bg-gray-100 gap-0 items-center p-1 overflow-x-auto md:overflow-x-visible hide-scrollbar"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {links.map((link) => (
                        <div key={link.label}>
                            <Link
                                href={link.href}
                                target={link.external ? '_blank' : undefined}
                                className={cn(
                                    'text-lg h-8 px-3 relative flex items-center justify-center transition-all rounded-sm whitespace-nowrap shrink-0',
                                    link.primary
                                        ? 'bg-[#21de73] text-black rounded-md font-medium opacity-100 hover:brightness-105'
                                        : 'hover:opacity-100 opacity-60 text-black'
                                )}
                            >
                                {link.label}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
}
