"use client";
import { useState } from "react";
import { Canvas } from "./Canvas";
import { ContextMenu, type ContextMenuComponents } from "./ContextMenu";
import { Menu, type ThemeConfig } from "./Menu";
import { type SeatComponents, SeatItem, useSeats } from "./Seat";

export const Floorplan = () => {
  const { seats, setSeats, updateLayout } = useSeats();
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>({
    theme: "BLACK",
    color: "#ffffff",
    line: "#000000",
  });

   const [menu, setMenu] = useState<ContextMenuComponents>({
     x: 0,
     y: 0,
     visible: false,
     targetId: null,
   });

     const handleCloseMenu = () => {
       setMenu((prev) => ({ ...prev, visible: false }));
     };

     const handleDeleteSeat = (id: string) => {
       setSeats((current) => current.filter((s) => s.id !== id));
     };

     const handleChangeStatus = (id: string, newStatus: string) => {
       setSeats((current) =>
         current.map((s) =>
           s.id === id ? { ...s, status: newStatus as SeatComponents["status"] } : s,
         ),
       );
     };

  return (
    <div
      role="none"
      className="w-full min-h-screen p-4 border flex flex-wrap"
      onContextMenu={(e) => e.preventDefault()}
    >
      <h1 className="block w-full p-4 font-bold text-xl">Floor Plan Editor</h1>
      <div className="w-[70%] p-4">
        <Canvas activeTheme={activeTheme}>
          {seats.map((seat) => (
            <SeatItem
              key={seat.id}
              {...seat}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenu({
                  x: e.clientX,
                  y: e.clientY,
                  visible: true,
                  targetId: seat.id,
                });
              }}
              onPositionChange={(id, newX, newY) => {
                setSeats((current) =>
                  current.map((s) =>
                    s.id === id ? { ...s, x: newX, y: newY } : s,
                  ),
                );
              }}
            />
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
      <ContextMenu
        {...menu}
        onClose={handleCloseMenu}
        onDelete={handleDeleteSeat}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
};
