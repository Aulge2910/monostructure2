"use client";
import { Canvas } from "./Canvas";
import { SeatItem, useSeats } from "./Seat";
import { Menu } from "./Menu";
export const Floorplan = () => {
  const { seats,setSeats } = useSeats();
  return (
    <div className="w-full p-4 border flex">
      <div className="w-[70%] p-4">
        <h1 className="text-2xl font-bold">Floorplan Editor</h1>
        <Canvas>
        
            {seats.map((seat) => (
              <SeatItem key={seat.id} {...seat} />
            ))}
 
        </Canvas>
      </div>
      <div className="w-[30%] h-screen">
        <Menu seats={seats} setSeats={setSeats}/>
      </div>
    </div>
  );
};
