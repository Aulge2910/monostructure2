"use client";
import { Canvas } from "./Canvas";
import { SeatItem, useSeats } from "./Seat";
import { Menu } from "./Menu";
export const Floorplan = () => {
  const { seats,setSeats } = useSeats();
  return (
    <section className="w-full min-h-screen p-4 border flex">
      <div className="w-[70%] min-h-screen p-4">
        <h1 className="text-2xl font-bold">Floorplan Editor</h1>
        <Canvas>
          <div className="flex flex-wrap gap-10 p-4 h-full bg-amber-400">
            {seats.map((seat) => (
              <SeatItem key={seat.id} {...seat} />
            ))}
          </div>
        </Canvas>
      </div>
      <div className="w-[30%] h-screen">
        <Menu seats={seats} setSeats={setSeats}/>
      </div>
    </section>
  );
};
