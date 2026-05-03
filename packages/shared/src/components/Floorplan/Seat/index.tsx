"use client";

import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

export type Pax = 2 | 4 | 6 | 8 | 10 | 12;
export type SeatStatus = "available" | "occupied" | "unavailable" | "reserved";
export type PaxRow = {
  pax: Pax;
  quantity: number;
};

export const SEAT_CONFIG = {
  CHAIR_WIDTH: 40,
  CHAIR_HEIGHT: 24,
  CHAIR_GAP: 8,
  CHAIR_PADDING: 10,
  BASE_TABLE_WIDTH: 50,
};

export const getSeatDimensions = (pax: number) => {
  const { CHAIR_WIDTH, CHAIR_GAP, CHAIR_PADDING, BASE_TABLE_WIDTH } =
    SEAT_CONFIG;
  const chairsCount = pax / 2;
  const seat_width =
    BASE_TABLE_WIDTH +
    (chairsCount * CHAIR_WIDTH + (chairsCount - 1) * CHAIR_GAP + CHAIR_PADDING);
  const seat_height = 100;
  return { seat_width, seat_height };
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
}: SeatComponents) => {
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
      className={`   ${position === "top" ? "rounded-t-xl" : `rounded-b-xl`}`}
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
      className={`rounded-lg overflow-hidden border-l-4`}
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
      className="absolute flex flex-col items-center gap-1 group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
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
