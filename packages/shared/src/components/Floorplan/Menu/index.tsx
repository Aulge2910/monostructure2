"use client";

import { useState } from "react";
import {
  generateSeat,
  type Pax,
  type PaxRow,
  type SeatComponents,
} from "../Seat";

type THEME = "GREEN" | "BLUE" | "RED" | "PANTONE" | "BLACK" | "WHITE";

export interface ThemeConfig {
  theme: THEME;
  color: string;
  line: string;
}


const themeColorMap: Record<THEME, ThemeConfig> = {
  BLACK: {
    theme: "BLACK",
    color: "#000000",
    line: "#FFFFFF",
  },
  WHITE: {
    theme: "WHITE",
    color: "#FFFFFF",
    line: "#000000",
  },
  GREEN: {
    theme: "GREEN",
    color: "#0D4F1F",
    line: "#FFFFFF",
  },
  BLUE: {
    theme: "BLUE",
    color: "#4A4B9D",
    line: "#E9E7F6",
  },
  RED: {
    theme: "RED",
    color: "#A81E32",
    line: "#C5B4B8",
  },
  PANTONE: {
    theme: "PANTONE",
    color: "#BB7A8C",
    line: "#E99D96",
  },
};

interface MenuProps {
  seats: SeatComponents[];
  setSeats: React.Dispatch<React.SetStateAction<SeatComponents[]>>;
  updateLayout: (configs: PaxRow[]) => void;
  setActiveTheme: (config: ThemeConfig) => void;
}

export const Menu = ({ seats, setSeats, updateLayout, setActiveTheme }: MenuProps) => {
  const paxOptions: Pax[] = [2, 4, 6, 8, 10, 12];
  const [rows, setRows] = useState<PaxRow[]>([{ pax: 2, quantity: 1 }]);

  const updateRow = (targetPax: number, field: keyof PaxRow, value: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.pax === targetPax ? { ...row, [field]: value } : row,
      ),
    );
  };
  // get all the selected paxes
  const selectedPaxes = rows.map((r) => r.pax);

  // add new rows of paxes
  const addNewSeatPaxInput = () => {
    const nextAvailable = paxOptions.find((p) => !selectedPaxes.includes(p));
    if (nextAvailable) {
      setRows([...rows, { pax: nextAvailable, quantity: 1 }]);
    }
  };

  const getCurrentTheme = (theme: THEME) => {
    const currentTheme = themeColorMap[theme];
    setActiveTheme(currentTheme);
  };

  return (
    <div className="w-full p-4 border rounded-xl border-gray-100 shadow-lg flex flex-col gap-4 items-center">
      <h1 className="text-center font-bold text-xl">Floor Plan Editor Menu</h1>
      <div className="border border-gray-100 w-3/4" />

      <div className="flex w-full flex-wrap gap-2">
        <p className="block text-center w-full font-bold">Seats Option</p>{" "}
        {/* select pax */}
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          {rows.map((row, index) => (
            <div
              key={row.pax}
              className="flex gap-4 w-full items-center justify-center"
            >
              {/* Pax Select */}
              <div className="flex flex-col shrink-0 flex-1 w-full">
                <select
                  id="select_pax"
                  value={row.pax}
                  onChange={(e) =>
                    updateRow(row.pax, "pax", Number(e.target.value))
                  }
                  className="h-14 p-4 border border-gray-200 rounded-lg outline-none bg-zinc-50"
                >
                  {paxOptions.map((p) => {
                    const isOccupied =
                      selectedPaxes.includes(p) && p !== row.pax;
                    return (
                      <option key={p} value={p} disabled={isOccupied}>
                        {p} Pax {isOccupied ? "" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Quantity Input */}
              <div className="flex flex-col shrink-0 flex-1">
                <input
                  id="quantity_input"
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) =>
                    updateRow(row.pax, "quantity", e.target.valueAsNumber || 0)
                  }
                  className="h-14 p-4 border border-gray-200 rounded-lg outline-none w-full"
                />
              </div>

              {/* delete button */}

              <button
                type="button"
                onClick={() => setRows(rows.filter((_, i) => i !== index))}
                disabled={rows.length === 1}
                className="h-14 p-4 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-wrap gap-2">
        <p className="block text-center w-full font-bold">Theme</p>
        <div className="grid grid-cols-6 gap-2 p-4 w-full items-center justify-center text-white [&_button]:border [&_button]:shadow-md">
          {(Object.keys(themeColorMap) as THEME[]).map((theme) => (
            <button
              key={theme}
              type="button"
              className={`min-h-12 max-w-12 p-4 rounded-md font-bold transition-all ${
                theme === "WHITE" ? "text-black" : "text-white"
              }`}
              style={{
                backgroundImage: `
          linear-gradient(to right, ${themeColorMap[theme].line} 1px, transparent 1px),
          linear-gradient(to bottom, ${themeColorMap[theme].line} 1px, transparent 1px)
        `,
                backgroundSize: `${15}px ${15}px`,
                backgroundColor: themeColorMap[theme].color,
              }}
              onClick={() => getCurrentTheme(theme)}
            />
           
            
          ))}
        </div>
      </div>

      {/* button */}
      <div className="flex w-full gap-1 flex-wrap my-4">
        <div className="flex w-full gap-2  ">
          <button
            type="button"
            onClick={addNewSeatPaxInput}
            disabled={rows.length >= paxOptions.length}
            className="border w-1/2 p-4 text-sm rounded-lg font-bold text-[#297aad] hover:text-[#66a0c4] disabled:text-gray-300"
          >
            Add SeatPax Option
          </button>
          <button
            type="button"
            onClick={() => {
              setSeats([]);
              setRows([{ pax: 2, quantity: 1 }]);
            }}
            disabled={seats.length === 0}
            className="border w-1/2 p-4 text-sm rounded-lg font-bold text-[#297aad] hover:text-[#66a0c4] disabled:text-gray-300"
          >
            Clear
          </button>
        </div>

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => {
              updateLayout(rows);
            }}
            className="border w-1/2 p-4 bg-[#5f64aa] text-white rounded-lg hover:bg-[#777fef] ml-auto"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => {
              const { seats: newSeats } = generateSeat(rows);
              setSeats((prev) => [...prev, ...newSeats]);
            }}
            className="border w-1/2 p-4 bg-[#5f64aa] text-white rounded-lg hover:bg-[#777fef] ml-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
