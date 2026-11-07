import React, { useEffect, useRef, useState } from 'react';

export type RevealAnimation = 'fade-up' | 'fade-down' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number; // Milliseconds (e.g. 100, 150)
  duration?: number; // Milliseconds (default 650)
  threshold?: number; // 0.0 - 1.0 (default 0.15)
  rootMargin?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 650,
  threshold = 0,
  rootMargin = '0px 0px 80px 0px',
  as: Component = 'div',
  className = '',
  style = {},
  ...rest
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const updateMotion = (e: MediaQueryListEvent | MediaQueryList) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) setIsVisible(true);
      };
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updateMotion);
      }
    }

    const node = elementRef.current;
    if (!node) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const triggerReveal = () => {
      if (delay > 0) {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
      } else {
        setIsVisible(true);
      }
    };

    // If already in viewport or scrolled past upon mount, reveal
    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 80) {
      const cleanupFn = triggerReveal();
      return () => {
        if (typeof cleanupFn === 'function') cleanupFn();
      };
    }

    let observer: IntersectionObserver | null = null;

    const onScrollOrResize = () => {
      if (!node) return;
      const currentRect = node.getBoundingClientRect();
      if (currentRect.top <= window.innerHeight + 80) {
        triggerReveal();
        cleanup();
      }
    };

    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight + 80) {
            triggerReveal();
            cleanup();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return cleanup;
  }, [threshold, rootMargin, delay]);

  // Compute CSS styles based on animation type and visibility
  const getTransform = () => {
    if (prefersReducedMotion || isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (animation) {
      case 'fade-up':
        return 'translate3d(0, 22px, 0)';
      case 'fade-down':
        return 'translate3d(0, -22px, 0)';
      case 'slide-left':
        return 'translate3d(24px, 0, 0)';
      case 'slide-right':
        return 'translate3d(-24px, 0, 0)';
      case 'scale-up':
        return 'scale(0.95)';
      case 'fade-in':
      default:
        return 'none';
    }
  };

  const animationStyle: React.CSSProperties = prefersReducedMotion
    ? { ...style, opacity: 1 }
    : {
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      };

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? 'is-revealed' : 'is-hidden'} ${className}`}
      style={animationStyle}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
