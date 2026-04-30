"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

interface SplitTextResponsiveProps {
  text?: string;
}

export const ElasticSplitTextResponsive = ({
  text = "Ready-To-Go-Strategies",
}: SplitTextResponsiveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      document.fonts.ready.then(() => {
        new SplitText(textRef.current, {
          type: "chars,words",
          charsClass: "char",
          smartWrap: true,
          ignore: "sup",
          aria: "none",
          mask: "lines",

          // 将所有动画逻辑（入场 + Hover）都合并在 onSplit 中
          onSplit: (self) => {
            const chars = self.chars;

            // --- 逻辑 A: 重新 Split 时的入场碎裂动画 ---
            // 注意：去掉了 repeat: -1，让它变为单次执行，否则会和 hover 打架
            gsap.from(chars, {
              autoAlpha: 0,
              yPercent: "random([-40, 40])",
              rotation: "random(-30, 30)",
              duration: 1,
              stagger: {
                from: "random",
                amount: 0.5,
              },
              ease: "back.out",
            });

            // --- 逻辑 B: 初始化 Hover 交互动画 (弹性缩放) ---
            chars.forEach((char) => {
              gsap.set(char, {
                transformOrigin: "center center",
                position: "relative",
              });

              const tl = gsap.timeline({ paused: true });
              tl.to(char, {
                scaleX: 1.45,
                scaleY: 0.8,
                duration: 0.2,
                ease: "power2.out",
                color: "#519BC2",
                overwrite: "auto", // 开启 overwrite，防止连续快速 hover 造成动画队列拥堵
              });
              tl.to(char, {
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 0.2,
                color: "#000000",
                ease: "elastic.out(1.2, 0.4)",
                overwrite: "auto",
              });

              char.addEventListener("mouseenter", () => {
                tl.restart();
              });
            });
          },
        }); 
      });
    },
    { dependencies: [text], scope: containerRef },
  ); 

  return (
    <div ref={containerRef}>
      <h1
        ref={textRef}
        key={text}
        className="text-4xl font-bold cursor-default"
      >
        {text}
      </h1>
    </div>
  );
}; 
