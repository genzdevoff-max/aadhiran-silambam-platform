import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Central scroll position management component for React Router client-side navigation.
 * Resets window scroll position to the top (scrollY = 0) whenever the route pathname changes,
 * ensuring users landing from footer links or internal navigation always start at the top of the page.
 * Deliberately preserves and supports in-page anchor links (e.g., #contact, #disciplines).
 * Handles asynchronous / lazy-loaded route chunks seamlessly across desktop, tablet, and mobile.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  // useLayoutEffect runs synchronously before browser paint
  useLayoutEffect(() => {
    // If navigation includes an intentional in-page anchor target, scroll to that element
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const resetScroll = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      } catch {
        window.scrollTo(0, 0);
      }

      if (document.documentElement && document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body && document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };

    // 1. Immediate synchronous scroll reset before paint
    resetScroll();

    // 2. Next animation frame confirmation
    const raf1 = requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });

    // 3. Timed confirmations to catch lazy-loaded Suspense chunks settling into DOM
    const t1 = setTimeout(resetScroll, 80);
    const t2 = setTimeout(resetScroll, 200);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, hash]);

  return null;
};
