"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

// 注册插件
gsap.registerPlugin(MorphSVGPlugin);

export const MorphSvg = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const isPlay = useRef(true);

  // 定义两个形状的 Path Data
  const playPath = "M20 15 L80 50 L20 85 Z"; // 三角形
  const pausePath = "M20 15 H40 V85 H20 Z M60 15 H80 V85 H60 Z"; // 两个矩形

  const { contextSafe } = useGSAP();

  // 点击切换形状
  const toggleMorph = contextSafe(() => {
    if (isPlay.current) {
      gsap.to(pathRef.current, {
        duration: 0.6,
        morphSVG: {
          shape: pausePath,
          shapeIndex: 12, // 调整这个值可以改变旋转和形变的扭曲感
        },
        ease: "power2.inOut",
      });
    } else {
      gsap.to(pathRef.current, {
        duration: 0.6,
        repeat: 1,
        yoyo: true, // 变过去再变回来
        ease: "sine.inOut", // 使用平滑的曲线
        morphSVG: playPath, // 也可以直接传入字符串
      });
    }
    isPlay.current = !isPlay.current;
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-900">
      <button type="button"
        onClick={toggleMorph}
        className="cursor-pointer p-8 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          aria-labelledby="motion-path-title"
        >
          {" "}
          <title id="motion-path-title">Rocket animation motion path</title>
          <path ref={pathRef} d={playPath} fill="#3b82f6" />
        </svg>
      </button>
      <p className="mt-4 text-zinc-400 font-mono text-sm">点击按钮进行 Morph</p>
    </div>
  );
};

 