"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Physics2DPlugin } from "gsap/Physics2DPlugin";

export const PhysicsEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 注册插件
      gsap.registerPlugin(Physics2DPlugin);
    },
    { scope: containerRef },
  );

  const handleAction = () => {
    // 每次点击创建 15 个小方块粒子
    const numParticles = 6;
    const container = containerRef.current;

    if (!container) return;

    for (let i = 0; i < numParticles; i++) {
      // 1. 创建 DOM 元素
      const particle = document.createElement("div");
      particle.className = "absolute w-10 h-10 rounded-sm pointer-events-none";
      particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      container.appendChild(particle);

      // 2. 初始位置设在点击区域
      gsap.set(particle, { x: "50%", y: "50%" });

      // 3. 应用物理动画
      gsap.to(particle, {
        duration: "random(1.5, 2.5)",
        physics2D: {
          velocity: "random(800, 1050)", // 初速度
          angle: "random(-360, 0)", // 向上喷射的角度范围
          gravity: 600, // 重力感
          friction: 0.005, // 轻微空气阻力
        },
        opacity: 0,
        rotation: "random(0, 360)",
        onComplete: () => {
          // 4. 动画结束后移除元素，防止 DOM 堆积
          particle.remove();
        },
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-96 h-96 border border-white/10 rounded-2xl flex items-center justify-center bg-zinc-900"
      >
        {/* 点击这个按钮触发物理效果 */}
        <button type="button"
          onClick={handleAction}
          className="px-8 py-4 bg-white text-black font-bold rounded-full active:scale-95 transition-transform z-10"
        >
          EXPLODE
        </button>

        <p className="absolute bottom-6 text-white/30 text-sm font-mono uppercase tracking-widest">
          Click to spawn physics particles
        </p>
      </div>
    </div>
  );
};

 
