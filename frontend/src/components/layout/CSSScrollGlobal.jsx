import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CSSScrollGlobal() {
  const location = useLocation();

  useEffect(() => {
    // Small timeout to wait for route's DOM to resolve fully
    const timeoutId = setTimeout(() => {
      // Find all elements that expect a CSS scroll animation
      const targets = document.querySelectorAll('.css-scroll-text, .css-scroll-item, .css-scroll-image');

      if (!targets.length) return;

      // Quick feature detection to see if the browser supports animation-timeline
      // If it DOES support it, the CSS takes over natively, so we don't strictly need IO (except maybe for some edge cases).
      // But adding the fallback class is safe even if native CSS triggers.
      
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Stop observing once visible if we want a one-shot reveal
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -10% 0px" // Trigger slightly before it hits the bottom
      });

      targets.forEach(target => observer.observe(target));

      return () => {
        targets.forEach(target => observer.unobserve(target));
        observer.disconnect();
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null;
}
