"use client";
import { Canvas } from "./Canvas";
import { SeatItem, useSeats } from "./Seat";
import { Menu } from "./Menu";
import { useState } from "react";
export const Floorplan = () => {
  const { seats,setSeats, updateLayout } = useSeats();
const [activeTheme, setActiveTheme] = useState({
  theme: "DEFAULT",
  color: "#ffffff",
});

  return (
    <div className="w-full min-h-screen p-4 border flex flex-wrap">
      <h1 className="block w-full p-4 font-bold text-xl">Floor Plan Editor</h1>
      <div className="w-[70%] p-4">
        <Canvas activeTheme={activeTheme.color}>
          {seats.map((seat) => (
            <SeatItem key={seat.id} {...seat} />
          ))}
        </Canvas>
      </div>
      <div className="w-[30%] p-4">
        <Menu
          seats={seats}
          setSeats={setSeats}
          updateLayout={updateLayout}
          setActiveTheme={setActiveTheme}
        />
      </div>
    </div>
  );
};
