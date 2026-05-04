"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { CANVAS_CONFIG } from "../Canvas";

gsap.registerPlugin(Draggable);

export type Pax = 2 | 4 | 6 | 8 | 10 | 12;
export type SeatStatus = "available" | "occupied" | "unavailable" | "reserved";
export type PaxRow = {
  pax: Pax;
  quantity: number;
};

export const SEAT_CONFIG = {
  CHAIR_WIDTH: 30,
  CHAIR_HEIGHT: 18,
  CHAIR_GAP: 8,
  CHAIR_PADDING: 10,
  BASE_TABLE_WIDTH: 50,
  BASE_SEAT_HEIGHT: 85,
};

export const getSeatDimensions = (pax: number) => {
  const {
    CHAIR_WIDTH,
    CHAIR_GAP,
    CHAIR_PADDING,
    BASE_TABLE_WIDTH,
    BASE_SEAT_HEIGHT,
  } = SEAT_CONFIG;
  const chairsCount = pax / 2;
  const seat_width =
    BASE_TABLE_WIDTH +
    (chairsCount * CHAIR_WIDTH + (chairsCount - 1) * CHAIR_GAP + CHAIR_PADDING);
  const seat_height = BASE_SEAT_HEIGHT;

  return { seat_width, seat_height };
};

export interface SeatComponents extends SeatMetadata {
  id: string;
  pax: Pax;
  type: "round" | "square";
  status: SeatStatus;
  label?: string;
}

export interface SeatItemProps extends SeatComponents {
  onPositionChange?: (id: string, newX: number, newY: number) => void;
}

const statusColorMap: Record<SeatStatus, { bg: string; border: string }> = {
  available: {
    bg: "#A9E861",
    border: "#91cf4a",
  },
  occupied: {
    bg: "#FF6B6B",
    border: "#DB4848",
  },
  unavailable: {
    bg: "#DCE6F2",
    border: "#A5AEB8",
  },
  reserved: {
    bg: "#4D98DB",
    border: "#2771B8",
  },
};

interface SeatMetadata {
  x: number;
  y: number;
  seat_width: number;
  seat_height: number;
  rotation?: number;
  lastupdated?: string;
}

export const SeatItem = ({
  status = "available",
  id,
  label,
  pax,
  x,
  y,
  seat_width,
  seat_height,
  onPositionChange,
}: SeatItemProps) => {
  const seatRef = useRef<HTMLDivElement>(null);

  const { CANVAS_WIDTH, CANVAS_HEIGHT } = CANVAS_CONFIG;

  useGSAP(() => {
    if (!seatRef.current) return;
    gsap.set(seatRef.current, { x: x, y: y });

    const canvas = seatRef.current?.closest(".canvas-container");
    const viewport = seatRef.current?.closest(".canvas-viewport");

    let isPanningRight = false;
    let currentDrag: Draggable | null = null;
    const PAN_SPEED = 4;

    let panDirX = 0; // -1 表示需要向左卷(看到左边场景)、1 表示向右、0 表示不卷
    let panDirY = 0; // -1 表示向上卷、1 表示向下、0 表示不卷

  
    const handleTicker = () => {
      // 向左移动画布，相当于把容器往左推 (deltaX 为负)
      if ((panDirX !== 0 || panDirY !== 0) && currentDrag && canvas) {
         const deltaX = -panDirX * PAN_SPEED;
         const deltaY = -panDirY * PAN_SPEED;
        // 1. 发送事件，让 Canvas 容器向左移动
        window.dispatchEvent(
          new CustomEvent("auto-pan", {
            detail: { deltaX, deltaY },
          }),
        );

        // 2. 最稳妥的方案：手动把当前 Seat 元素的 x 给加回来！
        // 不能直接修改 currentDrag.x，但是可以通过 gsap 修改它的目标 DOM
        const target = currentDrag.target;
       const currentX = gsap.getProperty(target, "x") as number;
       const currentY = gsap.getProperty(target, "y") as number;


        // 把 DOM 往回拉 PAN_SPEED 的距离
        gsap.set(target, {
          x: currentX + panDirX * PAN_SPEED,
          y: currentY + panDirY * PAN_SPEED,
        });

        // 3. 然后让 Draggable 读取 DOM 最新 x 值，重新同步它自己的内部逻辑状态
        currentDrag.update(true,true);
      }
    };
    const drags = Draggable.create(seatRef.current, {
      type: "x,y",
      bounds: canvas,
      edgeResistance: 1,
      liveSnap: false,
      onPress: function (this: Draggable) {
        window.dispatchEvent(new CustomEvent("disable-panning"));
        currentDrag = this;
        gsap.ticker.add(handleTicker);
      },

      onDrag: function () {
        if (!viewport || !canvas) return;

        const vRect = viewport.getBoundingClientRect();
        const pointerX = this.pointerX;
        const pointerY = this.pointerY;
        const threshold = 50; // must be less than 60-100 because origin coordinate is 60,60. bigger than 60 will auto trigger  onDrag

         if (pointerX > vRect.right - threshold) {
          panDirX = 1; // 靠近右侧，希望把画布往左推 (看到更多的右边)
        } else if (pointerX < vRect.left + threshold) {
          panDirX = -1; // 靠近左侧，希望把画布往右推 (看到左边)
        } else {
          panDirX = 0; // 停在中间没碰边缘
        }
        if (pointerY > vRect.bottom - threshold) {
          panDirY = 1; // 靠近底部
        } else if (pointerY < vRect.top + threshold) {
          panDirY = -1; // 靠近顶部
        } else {
          panDirY = 0;
        }
      },

      onRelease: function () {
        window.dispatchEvent(new CustomEvent("enable-panning"));
        panDirX = 0; // 👈 记得松开鼠标时归零
        panDirY = 0; // 👈 记得松开鼠标时归零
 
        gsap.ticker.remove(handleTicker);
        currentDrag = null;
      },

      onDragEnd: function () {
        const newX = Math.round(this.x);
        const newY = Math.round(this.y);
        //disable panning
        if (onPositionChange) {
          onPositionChange(id, newX, newY);
        }
      },
      cursor: "grab",
      activeCursor: "grabbing",
    });

    return () => {
      gsap.ticker.remove(handleTicker);
      drags.forEach((drag) => void drag.kill());
    };
  }, [id, onPositionChange, x, y]);

  // seat variable
  const colors = statusColorMap[status] || statusColorMap.available;
  const chairsCount = pax / 2;

  // generate chairs pax with id
  const upperChairs = Array.from(
    { length: chairsCount },
    (_, i) => `chair-${id}-top-${i}`,
  );
  const lowerChairs = Array.from(
    { length: chairsCount },
    (_, i) => `chair-${id}-bottom-${i}`,
  );

  // chair ui
  const Chair = ({ position }: { position: "top" | "bottom" }) => (
    <div
      style={{
        backgroundColor: colors.bg,
        width: SEAT_CONFIG.CHAIR_WIDTH,
        height: SEAT_CONFIG.CHAIR_HEIGHT,
      }}
      className={`   ${position === "top" ? "rounded-t-lg" : `rounded-b-lg`}`}
    />
  );

  // table ui
  const Table = () => (
    <div
      style={{
        width: `${seat_width}px`,
        height: `${seat_height}px`,
        backgroundColor: colors.bg,
        borderLeftColor: colors.border,
      }}
      className={`rounded-lg overflow-hidden border-l-6`}
    >
      {/* Table Body Content */}
      <div className=" flex flex-col overflow-hidden shadow-sm h-full w-full">
        {/* ID */}
        <div
          style={{ backgroundColor: colors.bg, width: "100%" }}
          className="border-b border-b-white text-xs text-gray-100 flex items-center p-2 truncate h-full max-h-1/4 "
        >
          {id}
        </div>
        {/* Label */}
        <div
          style={{ backgroundColor: colors.bg, width: "100%" }}
          className={` flex items-center text-white font-bold text-lg truncate p-2 h-full`}
        >
          {label}
        </div>
      </div>
    </div>
  );

  // seat ui
  return (
    // seat wrapper div // outer most part
    <div
      ref={seatRef}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      className="seat-draggable absolute flex flex-col items-center gap-1 group"
      style={{
        left: 0,
        top: 0,

        width: `${seat_width}px`,
      }}
    >
      {/* upper chair */}
      <div className="flex gap-2">
        {upperChairs.map((chairId) => (
          <Chair key={chairId} position="top" />
        ))}
      </div>

      {/* table */}
      <Table />

      {/* lower chair */}
      <div className="flex gap-2">
        {lowerChairs.map((chairId) => (
          <Chair key={chairId} position="bottom" />
        ))}
      </div>
    </div>
  );
};

// generate seat
export const generateSeat = (configs: PaxRow[], startX = 60, startY = 60) => {
  const seats: SeatComponents[] = [];
  const GAP = 20; // distance between seats
  let currentX = startX;
  let currentY = startY;

  configs.forEach((config) => {
    for (let i = 0; i < config.quantity; i++) {
      const { seat_width, seat_height } = getSeatDimensions(config.pax);
      if (currentX + seat_width > 800) {
        currentX = 60;
        const total_seat_height =
          seat_height + SEAT_CONFIG.CHAIR_HEIGHT * 2 + 8;
        currentY += total_seat_height + GAP;
      }

      const letter = String.fromCharCode(65 + i);
      const seatId = nanoid(6);
      seats.push({
        id: seatId,
        pax: config.pax,
        type: "square",
        status: "available",
        seat_width,
        seat_height,
        label: `${config.pax}Pax-${letter}`,
        x: currentX,
        y: currentY,
      });
      currentX += seat_width + GAP;
    }
  });

  return { seats };
};
export const useSeats = () => {
  const [seats, setSeats] = useState<SeatComponents[]>([]);
  const updateLayout = useCallback((configs: PaxRow[]) => {
    const { seats: newSeats } = generateSeat(configs);
    setSeats(newSeats);
  }, []);

  useEffect(() => {
    const { seats: initialSeats } = generateSeat([]);
    setSeats(initialSeats);
    updateLayout([]);
  }, [updateLayout]);

  return { seats, setSeats, updateLayout };
};
