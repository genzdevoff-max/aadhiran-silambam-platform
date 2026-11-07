import React, { useEffect, useRef, useState } from 'react';

export interface AnimatedCounterProps {
  value: number;
  duration?: number; // ms
  suffix?: string;
  prefix?: string;
  className?: string;
  formatCommas?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1600,
  suffix = '',
  prefix = '',
  className = '',
  formatCommas = true,
}) => {
  const [currentVal, setCurrentVal] = useState<number>(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    // If reduced motion is requested, display target value immediately
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentVal(value);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setCurrentVal(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.unobserve(entry.target);

            const startTime = performance.now();
            const startVal = 0;
            const endVal = value;

            const updateCount = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quartic easing: 1 - (1 - t)^4
              const easeOut = 1 - Math.pow(1 - progress, 4);
              const computed = Math.round(startVal + (endVal - startVal) * easeOut);
              setCurrentVal(computed);

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                setCurrentVal(endVal);
              }
            };

            requestAnimationFrame(updateCount);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  const formatted = formatCommas ? currentVal.toLocaleString() : currentVal.toString();

  return (
    <span ref={containerRef} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
