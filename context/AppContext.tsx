'use client';

import { createContext, useContext, useState, ReactNode, useMemo, RefObject } from 'react';

export type ActiveSection = 
  | { type: 'intro', identifier: 'intro' }
  | { type: 'case-study', identifier: string } // slug
  | { type: 'how-i-work', identifier: 'how-i-work' }
  | { type: 'technical-scope', identifier: 'technical-scope' };

interface AppContextType {
    scrollYProgress: number | null;
    setScrollYProgress: (progress: number | null) => void;
    inlineFooterInView: boolean;
    setInlineFooterInView: (inView: boolean) => void;
    activeSection: ActiveSection | null;
    setActiveSection: (section: ActiveSection | null) => void;
    // Keep for backward compatibility - derived from activeSection
    activeCaseStudySlug: string | null;
    setActiveCaseStudySlug: (slug: string | null) => void;
    scrollContainerRef: RefObject<HTMLElement> | null;
    setScrollContainerRef: (ref: RefObject<HTMLElement> | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [scrollYProgress, setScrollYProgress] = useState<number | null>(0);
    const [inlineFooterInView, setInlineFooterInView] = useState(false);
    const [activeSection, setActiveSection] = useState<ActiveSection | null>(null);
    const [scrollContainerRef, setScrollContainerRef] = useState<RefObject<HTMLElement> | null>(null);

    // Derive activeCaseStudySlug from activeSection for backward compatibility
    const activeCaseStudySlug = useMemo(() => {
        if (activeSection?.type === 'case-study') {
            return activeSection.identifier;
        }
        return null;
    }, [activeSection]);

    // setActiveCaseStudySlug for backward compatibility - converts to activeSection
    const setActiveCaseStudySlug = (slug: string | null) => {
        if (slug === null) {
            setActiveSection(null);
        } else {
            setActiveSection({ type: 'case-study', identifier: slug });
        }
    };

    const value: AppContextType = {
        scrollYProgress,
        setScrollYProgress,
        inlineFooterInView,
        setInlineFooterInView,
        activeSection,
        setActiveSection,
        activeCaseStudySlug,
        setActiveCaseStudySlug,
        scrollContainerRef,
        setScrollContainerRef,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
