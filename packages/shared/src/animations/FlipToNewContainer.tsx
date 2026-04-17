"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip);

export const FlipToNewContainer = () => {
  const [isInNewContainer, setIsInNewContainer] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const toggleContainer = () => {
    flipState.current = Flip.getState(boxRef.current, {
      props: "backgroundColor, borderRadius,padding",
    });
    setIsInNewContainer(!isInNewContainer);
  };

  //biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
 
    if (!flipState.current || !boxRef.current) return;
    const ctx = gsap.context(() => {
      Flip.from(flipState.current as Flip.FlipState, {
        targets: "[data-flip-id='the-box']",
        duration: 3,
        clearProps: "all",
        // fade:true, 用在swap item 比较适合
        ease: "power1.inOut",
        // 假设你想保护 box 里的文字不被拉伸
        // fitChild: ".text-element", 比如有image在内容的时候
        scale: true, //通常需要放，自动调整 flip后的size
        // simple:true, 当只有简单的位移， 可以用这个， 适合用在很多box的时候（极少用到）
        spin: true, //可以写函数
        //      spin: (index, target) => {
        // if (target.classList.contains("clockwise")) {
        //   return 1;
        // } else if (target.classList.contains("counter-clockwise")) {
        //   return -1;
        // } else {
        //   return 0;
        // }
        stagger: 0.4,
        // nested: true ， 如果有子元素在一起，可以用这个，优化nested偏移
        // toggleClass: your-class , 用这个可以丝滑切换css， better dont use in react
        absolute: true, // 解决布局问题， 比较丝滑
        onComplete: () => {
          flipState.current = null;
        },
      });
    });
    return () => ctx.revert(); // 
  }, [isInNewContainer]); // must be use this

  return (
    <div className="flex w-full bg-amber-300 items-center gap-10 p-10">
      <button
        type="button"
        onClick={toggleContainer}
        className="border flex items-center justify-center rounded-xl bg-amber-500 p-5 hover:bg-amber-700 hover:text-white"
      >
        toggle button
      </button>

      <div className="flex gap-20">
        {/* original container */}
        <div className="w-80 h-80 border-2 border-dashed bg-gray-300 p-4 flex items-start justify-start">
          {!isInNewContainer && (
            <div
              ref={boxRef}
              data-flip-id="the-box"
              className="w-20 h-20 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
            >
              BOX
            </div>
          )}
        </div>

        {/* new container */}
        <div className="w-80 h-80 border-2 border-dashed bg-red-300 p-4 flex items-end justify-end">
          {isInNewContainer && (
            <div
              ref={boxRef}
              data-flip-id="the-box"
              className="w-32 h-32 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
            >
              BOX
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
