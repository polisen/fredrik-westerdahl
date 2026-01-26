# Mobile Carousel Quality Implementation (Path 1)

## Overview

This document describes the quality implementation path for mobile optimization, featuring a vertical carousel with page indicators. This provides a native mobile app-like experience with smooth touch interactions.

## Architecture

### Components

#### 1. VerticalCarousel Component (`components/VerticalCarousel.tsx`)

A touch-optimized vertical carousel that replaces the scroll-based layout on mobile devices.

**Features:**
- Touch/swipe gesture detection for mobile
- Smooth transitions between slides using Framer Motion
- Scroll wheel support for desktop
- Keyboard navigation (arrow keys, Page Up/Down)
- Momentum scrolling with physics-based animations
- Accessibility support (ARIA labels, focus management)

**Props:**
```typescript
interface VerticalCarouselProps {
  children: React.ReactNode[];
  onSlideChange?: (index: number) => void;
  initialSlide?: number;
  enableDesktop?: boolean; // Whether to use carousel on desktop too
}
```

**Implementation Approach:**
- Use Framer Motion's `useMotionValue`, `useTransform`, and `useDrag` hooks
- Track current slide index in state
- Calculate slide positions based on viewport height
- Implement snap-to-slide behavior
- Support both touch and mouse drag interactions
- Maintain smooth momentum scrolling

#### 2. PageIndicator Component (`components/PageIndicator.tsx`)

A bottom-positioned page indicator showing current position and allowing direct navigation.

**Features:**
- Visual dots or progress bar showing current page
- Clickable dots for direct navigation to any slide
- Smooth animations matching carousel transitions
- Responsive sizing for mobile
- Optional labels/titles for each slide

**Props:**
```typescript
interface PageIndicatorProps {
  totalSlides: number;
  currentSlide: number;
  onSlideClick?: (index: number) => void;
  labels?: string[]; // Optional labels for each slide
  variant?: 'dots' | 'progress' | 'minimal';
}
```

**Design Considerations:**
- Bottom positioning with safe area insets for mobile
- Subtle animations that don't distract from content
- Clear visual feedback for active slide
- Touch-friendly target sizes (minimum 44x44px)

### Integration

#### Main Page Modifications (`app/page.tsx`)

**Changes:**
1. Wrap all sections in `VerticalCarousel` component
2. Convert existing sections into carousel slides
3. Maintain existing section content structure
4. Integrate `PageIndicator` at bottom
5. Preserve scroll progress tracking for desktop compatibility
6. Add responsive breakpoint logic

**Structure:**
```tsx
<VerticalCarousel
  onSlideChange={(index) => {
    // Update active case study slug
    // Update scroll progress
  }}
  enableDesktop={false} // Keep scroll on desktop
>
  <section>Intro</section>
  {caseStudies.map(cs => <section key={cs.slug}>{cs}</section>)}
  <section>How I Work</section>
  <section>Technical Scope</section>
  <section>Footer</section>
</VerticalCarousel>
<PageIndicator 
  totalSlides={totalSections}
  currentSlide={currentIndex}
  onSlideClick={handleSlideClick}
/>
```

### Responsive Behavior

**Mobile (< 768px):**
- Full carousel experience with touch gestures
- Page indicator always visible at bottom
- Swipe hints on first visit (optional onboarding)
- Disable native scroll snapping

**Desktop (≥ 768px):**
- Option 1: Keep existing scroll-based layout (default)
- Option 2: Use carousel with mouse drag (configurable)
- Page indicator can be hidden or shown based on preference

**Tablet (768px - 1024px):**
- Use carousel but with larger touch targets
- Consider hybrid approach (scroll with carousel fallback)

### Technical Implementation Details

#### Touch Gesture Handling

```typescript
const { dragControls } = useDragControls();
const y = useMotionValue(0);
const slideIndex = useMotionValue(0);

// Calculate slide positions
const slideHeight = window.innerHeight;
const totalSlides = children.length;

// Handle drag end
const handleDragEnd = () => {
  const currentY = y.get();
  const newIndex = Math.round(-currentY / slideHeight);
  // Snap to nearest slide
  animate(y, -newIndex * slideHeight, {
    type: "spring",
    stiffness: 300,
    damping: 30
  });
};
```

#### Slide Transitions

- Use Framer Motion's `AnimatePresence` for enter/exit animations
- Implement parallax effects for depth (optional)
- Add fade transitions between slides
- Support for custom transition per slide

#### State Management

- Track current slide index in component state
- Sync with AppContext for navigation integration
- Update URL hash for deep linking
- Maintain scroll progress calculation for compatibility

### Enhancements

#### 1. Swipe Indicators
- Show subtle hints on first visit
- Animated arrows or dots indicating swipe direction
- Dismissible after first interaction

#### 2. Momentum Scrolling
- Physics-based animations using spring animations
- Natural deceleration on swipe
- Bounce effect at boundaries

#### 3. Keyboard Navigation
- Arrow keys: Up/Down for navigation
- Page Up/Down: Jump by sections
- Home/End: First/Last slide
- Escape: Exit carousel mode (if applicable)

#### 4. Accessibility
- ARIA labels for carousel container
- ARIA live regions for slide announcements
- Focus management when navigating
- Screen reader support
- Keyboard navigation as above

#### 5. Performance Optimizations
- Lazy load slides that are far from viewport
- Virtual scrolling for many slides (if needed)
- Optimize animations for 60fps
- Reduce re-renders with React.memo where appropriate

### Styling

#### CSS Classes
- `.vertical-carousel` - Main container
- `.carousel-slide` - Individual slide wrapper
- `.page-indicator` - Indicator container
- `.page-indicator-dot` - Individual dot
- `.page-indicator-dot-active` - Active dot state

#### Mobile-Specific Styles
- Full viewport height per slide
- Touch-friendly spacing
- Safe area insets for notched devices
- Optimized for portrait orientation

### Migration Strategy

1. **Phase 1**: Create components in isolation
2. **Phase 2**: Add to main page behind feature flag
3. **Phase 3**: Test on various devices
4. **Phase 4**: Enable for mobile users
5. **Phase 5**: Gather feedback and iterate
6. **Phase 6**: Make default for mobile (optional)

### Testing Checklist

- [ ] Touch gestures work on iOS Safari
- [ ] Touch gestures work on Android Chrome
- [ ] Scroll wheel works on desktop
- [ ] Keyboard navigation works
- [ ] Page indicator clicks navigate correctly
- [ ] Transitions are smooth (60fps)
- [ ] Deep linking works (hash navigation)
- [ ] Accessibility features work with screen readers
- [ ] Performance is acceptable on low-end devices
- [ ] No layout shifts during transitions
- [ ] Works in both portrait and landscape (if supported)

### Future Enhancements

- Horizontal swipe for case study details (optional)
- Parallax effects for visual depth
- Custom transition animations per slide
- Analytics tracking for slide views
- A/B testing framework for carousel vs scroll
- Progressive enhancement (works without JS)

### Estimated Implementation Time

- Component development: 3-4 hours
- Integration: 1-2 hours
- Testing and refinement: 1-2 hours
- **Total: 5-8 hours**

### Dependencies

- Framer Motion (already installed)
- React hooks (useState, useEffect, useRef)
- TypeScript for type safety
- Tailwind CSS for styling

### Notes

- This implementation maintains backward compatibility with desktop scroll
- Can be toggled on/off via feature flag
- Preserves all existing functionality (scroll progress, active case study tracking)
- Designed to be incrementally adoptable
