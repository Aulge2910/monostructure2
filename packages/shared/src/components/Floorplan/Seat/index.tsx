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
  CHAIR_WIDTH: 35,
  CHAIR_HEIGHT: 20,
  CHAIR_GAP: 8,
  CHAIR_PADDING: 10,
  BASE_TABLE_WIDTH: 50,
  BASE_SEAT_HEIGHT: 90,
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
  onContextMenu?: (
    e: MouseEvent | PointerEvent | React.MouseEvent,
    id: string,
  ) => void;
}

const statusColorMap: Record<
  SeatStatus,
  { bg: string; tableBorder: string; chairBorder: string }
> = {
  available: {
    bg: "#A9E861",
    tableBorder: "#88BD4B",
    chairBorder: "#88BD4B",
  },
  occupied: {
    bg: "#FF6B6B",

    tableBorder: "#BD3E3E",
    chairBorder: "#BD3E3E",
  },
  unavailable: {
    bg: "#CDCCD9",

    tableBorder: "#83828F",
    chairBorder: "#83828F",
  },
  reserved: {
    bg: "#6B99FF",

    tableBorder: "#476ABA",
    chairBorder: "#476ABA",
  },
};
//  reserved: {
//     bg: "#168aad",
//     border: "#2a6f97",
//   },
// #3D3B4F drak grey blue

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
  onContextMenu,
}: SeatItemProps) => {
  const seatRef = useRef<HTMLDivElement>(null);
  const { GRID_SIZE } = CANVAS_CONFIG;

  useGSAP(() => {
    if (!seatRef.current) return;
    gsap.set(seatRef.current, { x: x, y: y });

    const canvas = seatRef.current?.closest(".canvas-container");
    const viewport = seatRef.current?.closest(".canvas-viewport");

    let currentDrag: Draggable | null = null;
    const PAN_SPEED = 4;

    let panDirX = 0; // -1 leftward 1 rightward, 0 means no panning
    let panDirY = 0; // -1 upward 1 downward, 0 means no panning

    const handleTicker = () => {
      if ((panDirX !== 0 || panDirY !== 0) && currentDrag && canvas) {
        const deltaX = -panDirX * PAN_SPEED;
        const deltaY = -panDirY * PAN_SPEED;

        window.dispatchEvent(
          new CustomEvent("auto-pan", {
            detail: { deltaX, deltaY },
          }),
        );

        const target = currentDrag.target;
        const currentX = gsap.getProperty(target, "x") as number;
        const currentY = gsap.getProperty(target, "y") as number;

        gsap.set(target, {
          x: currentX + panDirX * PAN_SPEED,
          y: currentY + panDirY * PAN_SPEED,
        });

        currentDrag.update(true, true);
      }
    };
    const drags = Draggable.create(seatRef.current, {
      type: "x,y",
      bounds: canvas,
      edgeResistance: 1,
      liveSnap: false,
      dragClickables: true,

      onPress: function (this: Draggable, e: PointerEvent | MouseEvent) {
        if (e.button === 2 || e.type === "contextmenu") {
          e.preventDefault();
          e.stopPropagation();

          if (onContextMenu) {
            onContextMenu(e, id);
          }

          // 右键不触发拖拽
          return;
        }

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
          panDirX = 1;
        } else if (pointerX < vRect.left + threshold) {
          panDirX = -1;
        } else {
          panDirX = 0;
        }
        if (pointerY > vRect.bottom - threshold) {
          panDirY = 1;
        } else if (pointerY < vRect.top + threshold) {
          panDirY = -1;
        } else {
          panDirY = 0;
        }
      },

      onRelease: () => {
        window.dispatchEvent(new CustomEvent("enable-panning"));
        panDirX = 0;
        panDirY = 0;

        gsap.ticker.remove(handleTicker);
        currentDrag = null;
      },

      onDragEnd: function () {
        const newX = Math.round(this.x / GRID_SIZE) * GRID_SIZE;
        const newY = Math.round(this.y / GRID_SIZE) * GRID_SIZE;

        gsap.to(this.target, {
          duration: 0.2,
          x: newX,
          y: newY,
          onComplete: () => {
            if (onPositionChange) {
              onPositionChange(id, newX, newY);
            }
          },
        });
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
        borderTopColor: position === "top" ? colors.chairBorder : "transparent",
        borderBottomColor:
          position === "bottom" ? colors.chairBorder : "transparent",
      }}
      className={`   ${position === "top" ? "rounded-t-lg border-t-4" : `rounded-b-lg border-b-4`}`}
    />
  );

  // table ui
  const Table = () => (
    <div
      style={{
        width: `${seat_width}px`,
        height: `${seat_height}px`,
        backgroundColor: colors.bg,
        borderLeftColor: colors.tableBorder,
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

    // biome-ignore lint/a11y/noStaticElementInteractions: seat wrapper handles pointer events
    <div
      ref={seatRef}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        // <-- 加上这块代码
        if (onContextMenu) {
          onContextMenu(e, id);
        }
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
