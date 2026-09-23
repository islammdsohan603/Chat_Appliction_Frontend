import React, { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal — Triggers smooth entrance animations when element enters viewport.
 * Supported effects: 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'scale-up'
 */
export const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = "",
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [threshold, once]);

  // Initial vs Animated classes
  const getAnimationStyles = () => {
    const baseTransition = {
      transitionProperty: "opacity, transform, filter",
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      transitionDelay: `${delay}ms`,
    };

    if (!isVisible) {
      switch (animation) {
        case "fade-up":
          return {
            ...baseTransition,
            opacity: 0,
            transform: "translate3d(0, 40px, 0)",
          };
        case "fade-down":
          return {
            ...baseTransition,
            opacity: 0,
            transform: "translate3d(0, -40px, 0)",
          };
        case "fade-left":
          return {
            ...baseTransition,
            opacity: 0,
            transform: "translate3d(-50px, 0, 0)",
          };
        case "fade-right":
          return {
            ...baseTransition,
            opacity: 0,
            transform: "translate3d(50px, 0, 0)",
          };
        case "zoom-in":
        case "scale-up":
          return {
            ...baseTransition,
            opacity: 0,
            transform: "scale3d(0.85, 0.85, 1)",
          };
        default:
          return {
            ...baseTransition,
            opacity: 0,
            transform: "translate3d(0, 30px, 0)",
          };
      }
    }

    return {
      ...baseTransition,
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)",
    };
  };

  return (
    <div ref={domRef} style={getAnimationStyles()} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
