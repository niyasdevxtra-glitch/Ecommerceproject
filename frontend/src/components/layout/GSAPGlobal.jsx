import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPGlobal() {
  const location = useLocation();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Small timeout to ensure DOM is fully rendered before querying
      setTimeout(() => {
        const headers = document.querySelectorAll("h1:not(.no-reveal), h2:not(.no-reveal)");
        
        headers.forEach((header) => {
          gsap.fromTo(header, 
            { y: 50, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 1.2, 
              ease: "power4.out",
              scrollTrigger: {
                trigger: header,
                start: "top 90%", // Start animating slightly before it enters full view
                toggleActions: "play none none reverse", // Play on enter, reverse if scrolling way back up
              }
            }
          );
        });
      }, 100);
    });

    return () => ctx.revert();
  }, [location.pathname]); // Re-run whenever the route changes

  return null; // This is a logic-only component
}
