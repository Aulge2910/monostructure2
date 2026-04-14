"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrambleTextPlugin);

export const ScrambleText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      gsap.to(textRef.current, {
        duration: 2,
        scrambleText: {
          text: "My Password is : 45ygerdsfjx459",
          chars: "10", // random char of "1,0"
          revealDelay: 0.6,
          //first 0.6 second will be random 101010
          //the next 0.6 second to replace the text
          speed: 0.2, // speed of chars changing
          newClass: "myClass",
        },
      });
    },
    { scope: containerRef },
  );
  return (
    <div ref={containerRef}>
      <div ref={textRef} className="text-xl font-bold">
        Guess The Password
      </div>
    </div>
  );
};
