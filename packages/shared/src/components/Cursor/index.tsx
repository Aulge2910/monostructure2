"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

export const Cursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const trailIds = ["trail-1", "trail-2", "trail-3", "trail-4", "trail-5"];
  useGSAP(
    () => {
      gsap.set([outerRef.current, innerRef.current, ...trailsRef.current], {
        xPercent: -50,
        yPercent: -50,
      });

      const xOuterTo = gsap.quickTo(outerRef.current, "x", {
        duration: 0.6,
        ease: "power3",
      });
      const yOuterTo = gsap.quickTo(outerRef.current, "y", {
        duration: 0.6,
        ease: "power3",
      });

      const xInnerTo = gsap.quickTo(innerRef.current, "x", {
        duration: 0.1,
        ease: "power3",
      });
      const yInnerTo = gsap.quickTo(innerRef.current, "y", {
        duration: 0.1,
        ease: "power3",
      });

      const moveCursor = (e: MouseEvent) => {
        xOuterTo(e.clientX);
        yOuterTo(e.clientY);

        xInnerTo(e.clientX);
        yInnerTo(e.clientY);

        gsap.to(trailsRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          stagger: -0.05,
          ease: "power2.out",
        });
      };

      gsap.to(outerRef.current, {
        backgroundPositionX: "-200%",
        duration: 1.5,
        repeat: -1,
        ease: "linear",
      });

      window.addEventListener("mousemove", moveCursor);

      const handleHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isHoverable = target.closest('a, button, [data-cursor="big"]');

        if (isHoverable) {
          gsap.to(outerRef.current, {
            scale: 3,

            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(innerRef.current, { opacity: 0, duration: 0.2 });
        } else {
          gsap.to(outerRef.current, {
            scale: 1,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderWidth: 1,
            duration: 0.4,
          });
          gsap.to(innerRef.current, { opacity: 1, duration: 0.2 });
        }
      };

      window.addEventListener("mouseover", handleHover);

      return () => window.removeEventListener("mousemove", moveCursor);
    },
    { scope: outerRef },
  );

  return (
    <div>
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-amber-300 rounded-full pointer-events-none z-9999 mix-blend-difference will-change-transform "
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-4 h-4 border border-red-600 rounded-full pointer-events-none z-9999 mix-blend-difference will-change-transform"
      />{" "}
      {trailIds.map((id, i) => (
        <div
          key={id}
          ref={(el) => {
            trailsRef.current[i] = el;
          }}
          className="fixed top-0 left-0 w-4 h-4 border bg-red-400 rounded-full pointer-events-none z-9999 mix-blend-screen"
          style={{ opacity: 1 - i * 0.2 }}
        />
      ))}
    </div>
  );
};
