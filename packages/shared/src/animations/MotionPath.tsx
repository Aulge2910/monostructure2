"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(MotionPathPlugin);

export const MotionPath = () => {
  const ballRef = useRef(null);

  useGSAP(() => {
    // gsap.to(ballRef.current, {
    //   duration: 5,
    //   repeat: -1,
    //   motionPath: {
    //     // 你不需要 Path ID，直接给坐标点，GSAP 会自动连成丝滑的曲线！
    //     path: [
    //       { x: 100, y: 100 },
    //       { x: 300, y: 20 },
    //       { x: 500, y: 400 },
    //       { x: 800, y: 100 },
    //       { x: window.innerWidth + 100, y: 200 }, // 直接飞出屏幕
    //     ],
    //     curviness: 1.5, // 数字越大，转弯越圆润
    //     autoRotate: true,
    //   },
    // });

    // 动画逻辑
    gsap.to(ballRef.current, {
      duration: 5,
      repeat: -1,
      ease: "power1.inOut",
      motionPath: {
        path: "#path-id",
        align: "#path-id", // 确保物体吸附到路径上
        autoRotate: true,
        alignOrigin: [0.5, 0.5], // 🚀 的中心对齐路径
      },
    });
  }, []);

  return (
    <div className="relative h-screen w-full bg-green-600overflow-hidden bg-amber-400">
      {/* 1. 关键：SVG 不设 viewBox，或者设为与屏幕比例一致 */}
      {/* 使用 preserveAspectRatio="none" 配合 100% 宽高可以强制铺满 */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="motion-path-title"
      >
        <title id="motion-path-title">Rocket animation motion path</title>
        <path
          id="path-id"
          // 修改 d 属性：这里的数字现在代表真实的像素！
          // M50 (左侧起始) -> Q (控制点) -> L (长线到右侧)
          // 这里的 1500 代表 1500px，你可以根据需要写得更大
          d="M-50,200 Q400,-50 800,200 T1800,200"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="10"
          strokeDasharray="5,5"
        />
      </svg>

      {/* 运动的物体 */}
      <div
        ref={ballRef}
        className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl"
        style={{ position: "absolute", top: 0, left: 0 }} // 初始位置设为 0,0 方便 align
      >
        🚀
      </div>
    </div>
  );
};

 
