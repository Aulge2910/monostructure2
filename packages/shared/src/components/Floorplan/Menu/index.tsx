"use client";
import { nanoid } from "nanoid";
import { useState } from "react";
import {
  generateSeat,
  getSeatDimensions,
  type Pax,
  type PaxRow,
  type SeatComponents,
} from "../Seat";

interface MenuProps {
  seats: SeatComponents[];
  setSeats: React.Dispatch<React.SetStateAction<SeatComponents[]>>;
}

export const Menu = ({ seats, setSeats }: MenuProps) => {
  const paxOptions: Pax[] = [2, 4, 6, 8, 10, 12];
  const [rows, setRows] = useState<PaxRow[]>([
    { id: "initial-row", pax: 2, quantity: 1 },
  ]);

  const updateRow = (index: number, field: keyof PaxRow, value: number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  // get all the selected paxes
  const selectedPaxes = rows.map((r) => r.pax);

  // add new rows of paxes
  const addMore = () => {
    const nextAvailable = paxOptions.find((p) => !selectedPaxes.includes(p));
    if (nextAvailable) {
      setRows([...rows, { id: nanoid(), pax: nextAvailable, quantity: 1 }]);
    }
  };

  const UpdateSeatAmount = () => {
    setSeats((currentSeats) => {
      let updatedSeats = [...currentSeats];
      const GAP = 20;

      // 我们只需要依赖现有的座位来进行循环生成即可，每次顺延最后一个
      rows.forEach((row) => {
        const existingOfPax = updatedSeats.filter((s) => s.pax === row.pax);
        const currentCount = existingOfPax.length;
        const targetCount = row.quantity;

        if (currentCount < targetCount) {
          const diff = targetCount - currentCount;
          const extraRows = [{ ...row, quantity: diff }];

          // 每次生成新的一批前，找到当前画布最末尾的一个元素的坐标
          let startX = 60;
          let startY = 60;

          if (updatedSeats.length > 0) {
            const lastSeat = updatedSeats[updatedSeats.length - 1];
            const { width, height } = getSeatDimensions(lastSeat.pax);

            startX = lastSeat.x + width + GAP;
            startY = lastSeat.y;

            // 马上在外面判断一次，如果最尾部的这个即将生成的下一个 X 大于了，则直接挪到下一排去
            if (startX > 800) {
              startX = 60;
              startY = lastSeat.y + height + GAP;
            }
          }

          // 把计算好真正起始值的 startX 和 startY 塞进去，里面也会自动帮忙断行
          const newPieces = generateSeat(extraRows, startX, startY);
          updatedSeats = [...updatedSeats, ...newPieces];
        } else if (currentCount > targetCount) {
          // 裁员逻辑
          const toRemoveCount = currentCount - targetCount;
          let removedSoFar = 0;
          for (let i = updatedSeats.length - 1; i >= 0; i--) {
            if (
              updatedSeats[i].pax === row.pax &&
              removedSoFar < toRemoveCount
            ) {
              updatedSeats.splice(i, 1);
              removedSoFar++;
            }
          }
        }
      });

      // 过滤掉不在清单里的 Pax
      const activePaxes = rows.map((r) => r.pax);
      updatedSeats = updatedSeats.filter((s) => activePaxes.includes(s.pax));

      return updatedSeats;
    });
  };

  return (
    <div className="w-full p-4 border">
      <h1>Floor Plan Editor Menu</h1>

      <div className="flex w-full">
        <h1>Select Your Seats Option</h1>
      </div>
      {/* select pax */}
      <div className="flex flex-col items-center justify-center">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="flex gap-4 w-full items-center justify-center"
          >
            {/* Pax Select */}
            <div className="flex flex-col shrink-0 flex-1">
              <label
                htmlFor={`select_pax-${row.id}`}
                className="text-[10px] font-bold text-gray-400 uppercase"
              >
                Seat Pax
              </label>
              <select
                id="select_pax"
                value={row.pax}
                onChange={(e) =>
                  updateRow(index, "pax", Number(e.target.value))
                }
                className="h-14 p-4 border border-gray-200 rounded-lg outline-none bg-zinc-50"
              >
                {paxOptions.map((p) => {
                  const isOccupied = selectedPaxes.includes(p) && p !== row.pax;
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
              <label
                htmlFor={`quantity_input-${row.id}`}
                className="text-[10px] font-bold text-gray-400 uppercase w-full"
              >
                Quantity
              </label>
              <input
                id="quantity_input"
                type="number"
                min={1}
                value={row.quantity}
                onChange={(e) =>
                  updateRow(index, "quantity", e.target.valueAsNumber || 0)
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

        <div className="flex w-full gap-1 flex-wrap p-4 ">
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={addMore}
              disabled={rows.length >= paxOptions.length}
              className="w-1/2 p-4 text-sm rounded-lg font-bold text-[#297aad] hover:text-[#66a0c4] disabled:text-gray-300"
            >
              + Add More
            </button>
            <button
              type="button"
              onClick={() => {
                setSeats([]);
                setRows([{ id: "initial-row", pax: 2, quantity: 1 }]);
              }}
              disabled={seats.length === 0}
              className="w-1/2 p-4 text-sm rounded-lg font-bold text-[#297aad] hover:text-[#66a0c4] disabled:text-gray-300"
            >
              Clear
            </button>
          </div>

          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={UpdateSeatAmount}
              className="w-1/2 p-4 bg-[#5f64aa] text-white rounded-lg hover:bg-[#777fef] ml-auto"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => {
                const newSeats = generateSeat(rows);
                setSeats((prev) => [...prev, ...newSeats]);
              }}
              className="w-1/2 p-4 bg-[#5f64aa] text-white rounded-lg hover:bg-[#777fef] ml-auto"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
