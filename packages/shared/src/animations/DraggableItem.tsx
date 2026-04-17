"use client";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";
import { InertiaPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, InertiaPlugin);

export const DraggableItem = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);  
    const targetRef = useRef<HTMLDivElement>(null);  
    const parentRef = useRef<HTMLDivElement>(null);  
  useGSAP(
    () => {
      if (!boxRef.current || !parentRef.current || !targetRef.current ||!containerRef.current) return;
      Draggable.create(boxRef.current, {
        type: "x,y",
        bounds: containerRef.current,
        dragResistance: 0.1,
        edgeResistance: 0.9,
        // bounds: {minX: 10, maxX: 300, minY: 50, maxY: 500} 或 bounds: {minRotation: 0, maxRotation: 270}
        zIndexBoost: true,
        // allowContextMenu: true,
        // clickableTest:true,  对时候，默认不会被拖 for svg link etc， instead 点击事件会正常发生,自定义哪些元素是“可点击”的。
        // dragClickables: true 强行让那些原本“可点击”的元素（如 <a>）也能被拖拽
        // allowEventDefault: false,
        // autoScroll: 2, 如果很长的section，可以开启， 到达边缘无需松手，浏览器自动滚动
        inertia: true,
        
        // snap: function (value) {
        //   return Math.round(value / 90) * 90;
        // }, //和rotation搭配用

        // liveSnap: {
        //   rotation: function (value) {
        //     return Math.round(value / 10) * 10;
        //   },
        // },
  //       	liveSnap: {
	// 	//snaps to the closest point in the array, but only when it's within 15px (new in GSAP 1.20.0 release):
	// 	points: [
	// 		{ x: 0, y: 0 },
	// 		{ x: 100, y: 0 },
	// 		{ x: 200, y: 50 }
	// 	],
	// 	radius: 55
	// },
//   liveSnap: {
//   // 核心逻辑：将当前的坐标值四舍五入到最接近的 15 的倍数
//   x: function(value) {
//     return Math.round(value / 15) * 15;
//   },
//   y: function(value) {
//     return Math.round(value / 15) * 15;
//   },
//   radius:8,
//   // 此时不需要设置 radius，因为函数会实时锁定每一个 15px 的位置
// },
snap: {
      x: function(value) {
        // 这个 value 是 GSAP 根据你甩的手速预测的“最终停止点”, 15因为网格是15px
        return Math.round(value / 15) * 15;
      },
      y: function(value) {
        return Math.round(value / 15) * 15;
      }
    },

        onPress: () => console.log("pressed"),
        onDragEnd: function () {
          if (this.hitTest(targetRef.current)) {
            gsap.to(targetRef.current, {
              backgroundColor: "rgba(34, 197, 94, 0.3)",
            });
          } else {
            gsap.to(targetRef.current, { backgroundColor: "transparent" });
          }
        },

        onDrag: function () {
          if (this.hitTest(targetRef.current)) {
            gsap.to(targetRef.current, { backgroundColor: "green" });
          } else {
            gsap.to(targetRef.current, { backgroundColor: "white" });
          }
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div className="w-full border h-[600px]" ref={containerRef}>
      <div
        id="target"
        ref={targetRef}
        className="w-40 h-40 border-4 border-red-500 absolute right-10 top-10"
      >
        拖到我这里来
      </div>

      {/* 这是你拖拽的蓝色方块 */}
      <div
        className="bg-[white] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:15px_15px] w-full h-full"
        ref={parentRef}
      >
        <div
          ref={boxRef}
          className="w-20 h-20 bg-blue-500 absolute  "
        />
      </div>
    </div>
  );
};
