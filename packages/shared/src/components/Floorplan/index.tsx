"use client";
import { Canvas } from "./Canvas";
import { SeatItem, useSeats } from "./Seat";
import { Menu } from "./Menu";
export const Floorplan = () => {
  const { seats,setSeats, updateLayout } = useSeats();
  return (
    <div className="w-full min-h-screen p-4 border flex flex-wrap">
      <h1 className="block w-full p-4 font-bold text-xl">Floor Plan Editor</h1>
      <div className="w-[70%] p-4">
        <Canvas>
          {seats.map((seat) => (
            <SeatItem key={seat.id} {...seat} />
          ))}
        </Canvas>
      </div>
      <div className="w-[30%] p-4">
        <Menu seats={seats} setSeats={setSeats} updateLayout={updateLayout}  />
      </div>
    </div>
  );
};
