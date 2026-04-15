"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrambleTextPlugin);


interface ScrambleTextProps {
  scrambledText?: string;
  originText?: string;
}
export const ScrambleText = ({
  scrambledText = "My Password is : 45ygerdsfjx459",
  originText="Guess My Password"
}:ScrambleTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      gsap.to(textRef.current, {
        duration: 2,
        scrambleText: {
          text: scrambledText,
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
    <div ref={containerRef} className="">
      <div ref={textRef} className="text-xl font-bold">
        {originText}
      </div>
    </div>
  );
};
