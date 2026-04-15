"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

interface SplitTextResponsiveProps {
  id:string;
  text?:string;
}

export const SplitTextResponsive = ({
  text = "Ready-To-Go-Strategies",
}: SplitTextResponsiveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(textRef.current, {
          type: "chars,words",
          charsClass: "char",
          smartWrap: true,
          ignore: "sup",
          aria: "none",
          mask: "lines",
          onSplit: (self) => {
            return gsap.from(self.chars, {
              autoAlpha: 0,
              yPercent: "random([-40, 40])",
              rotation: "random(-30, 30)",
              duration: 1,
              stagger: {
                from: "random",
                amount: 0.5,
                repeat: -1, // if -1, onComplete will never trigger
                yoyo: true,
              },
              ease: "back.out",
              onComplete: () => {
                self.revert();
              },
            });
          },
        });
      });
    },
    { dependencies: [text], scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <h1 ref={textRef} key={text}>
        {text}
      </h1>
    </div>
  );
};


