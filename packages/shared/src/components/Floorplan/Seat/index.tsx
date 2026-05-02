"use client";

import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export type Pax = 2 | 4 | 6 | 8 | 10 | 12;
export type SeatStatus = "available" | "occupied" | "unavailable" | "reserved";
export type PaxRow = {
  id: string;
  pax: Pax;
  quantity: number;
};

export const getSeatDimensions = (pax: number) => {
  const CHAIR_WIDTH = 40;
  const CHAIR_GAP = 8;
  const PADDING = 10;
  const BASE_TABLE_WIDTH = 50;

  const chairsCount = pax / 2;
  const width =
    BASE_TABLE_WIDTH +
    (chairsCount * CHAIR_WIDTH + (chairsCount - 1) * CHAIR_GAP + PADDING);
  const height = 140;

  return { width, height };
};

export interface SeatComponents extends SeatMetadata {
  id: string;
  pax: Pax;
  type: "round" | "square";
  status: SeatStatus;
  label?: string;
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
  width: number;
  height: number;
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
  width,
}: SeatComponents) => {
  // seat variable
  const colors = statusColorMap[status] || statusColorMap.available;
  const chairsCount = pax / 2;

  // generate chairs pax with id
  const upperChairs = Array.from(
    { length: chairsCount },
    (_, i) => `seat-${id}-top-${i}`,
  );
  const lowerChairs = Array.from(
    { length: chairsCount },
    (_, i) => `seat-${id}-bottom-${i}`,
  );

  // chair ui
  const Chair = ({ position }: { position: "top" | "bottom" }) => (
    <div
      style={{ backgroundColor: colors.bg }}
      className={`w-10 h-6  ${
        position === "top" ? "rounded-t-xl" : `rounded-b-xl`
      }`}
    />
  );

  // table ui
  const Table = () => (
    <div
      style={{
        width: `${width}px`,
        backgroundColor: colors.bg,
        borderLeftColor: colors.border,
      }}
      className={`transition-all duration-300 border-l-6 rounded-lg   overflow-hidden shadow-sm`}
    >
      {/* ID */}
      <div
        style={{ backgroundColor: colors.bg, width: "100%" }}
        className="h-8 text-xs text-gray-100 flex items-center px-3 truncate  "
      >
        {id}
      </div>
      {/* Label */}
      <div
        style={{ backgroundColor: colors.bg }}
        className={`h-10 flex px-3 items-center text-white font-bold text-lg truncate`}
      >
        {label}
      </div>
    </div>
  );

  // seat ui
  // seat ui
  return (
    <div
      className="absolute flex flex-col items-center gap-1 group" // 1. 改为 absolute
      style={{
        left: `${x}px`, // 2. 绑定生成的 x
        top: `${y}px`, // 3. 绑定生成的 y
        width: `${width}px`, // 4. 绑定生成的 width
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
};;

// generate seat
export const generateSeat = (configs: PaxRow[], startX = 60, startY = 60) => {
  const seats: SeatComponents[] = [];
  const GAP = 20;
  let currentX = startX; // 不再写死 60，而是使用传入的值
  let currentY = startY;

  configs.forEach((config) => {
    for (let i = 0; i < config.quantity; i++) {
      const { width, height } = getSeatDimensions(config.pax);
      const letter = String.fromCharCode(65 + i);

      seats.push({
        id: nanoid(6),
        pax: config.pax,
        type: "square",
        status: "available",
        width,
        height,
        label: `${config.pax}Pax-${letter}`,
        x: currentX,
        y: currentY,
      });

      currentX += width + GAP;
      if (currentX > 800) {
        currentX = 60;
        currentY += height + GAP;
      }
    }
  });

  return seats;
};
export const useSeats = () => {
  const [seats, setSeats] = useState<SeatComponents[]>([]);

  useEffect(() => {
    const initialData = generateSeat([]);
    setSeats(initialData);
  }, []);

  return { seats, setSeats };
};
