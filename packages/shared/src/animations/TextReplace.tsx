"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(TextPlugin);
 
interface TextReplaceProps {
  replacedText?: string;
  originText?: string;
}
export const TextReplace = ({
  replacedText = "Guess45yg myds 922",
  originText = "Guess My Password",
}: TextReplaceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      gsap.to(textRef.current, {
        duration: 2,
        // text: replacedText,
        text: {
          value: replacedText,
          type: "diff", // 只会动画化文本中的差异， 跳过相同的部分
          delimiter: "", // 根据什么 分隔
          //   padSpace: true 避免文本塌陷，当origintext比较长时
          // preserveSpaces:true 会保留原本的空格间隔
          // rtl:true,
          // speed:4 , 1-20   ,  larger num, faster
        },
        ease: "none",
      });
    },
    { scope: containerRef },
  );
  return (
    <div ref={containerRef} className="bg-amber-300">
      <div ref={textRef} className="text-xl font-bold">
        {originText}
      </div>
    </div>
  );
};