"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Observer from "gsap/src/Observer";
import { useRef } from "react";
import type { ThemeConfig } from "../Menu";

gsap.registerPlugin(Observer);

interface CanvasProps {
  children: React.ReactNode;
  activeTheme: ThemeConfig;
}

export const CANVAS_CONFIG = {
  GRID_SIZE: 15,
  CANVAS_WIDTH: 2000,
  CANVAS_HEIGHT: 1000,
};

export const Canvas = ({ children, activeTheme }: CanvasProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } = CANVAS_CONFIG;
  useGSAP(() => {
    const gsapContext = gsap.context(() => {
      gsap.set(containerRef.current, { x: 0, y: 0 });

      const observer = Observer.create({
        target: viewportRef.current,
        type: "wheel,touch,pointer",
        preventDefault: true,
        dragMinimum: 0,
        ignore: ".seat-draggable",
        onPress: (self) => {
          if (self.target instanceof HTMLElement) {
            self.target.style.cursor = "grabbing";
          }
        },
        onRelease: (self) => {
          if (self.target instanceof HTMLElement) {
            self.target.style.cursor = "grab";
          }
        },
        onChange: (self) => {
          if (!self.isDragging || !viewportRef.current || !containerRef.current)
            return;

          const x = gsap.getProperty(containerRef.current, "x") as number;
          const y = gsap.getProperty(containerRef.current, "y") as number;

          let newX = x + self.deltaX;
          let newY = y + self.deltaY;

          const minX = -(
            CANVAS_CONFIG.CANVAS_WIDTH - viewportRef.current.clientWidth
          );
          const minY = -(
            CANVAS_CONFIG.CANVAS_HEIGHT - viewportRef.current.clientHeight
          );
          newX = Math.min(0, Math.max(newX, minX < 0 ? minX : 0));
          newY = Math.min(0, Math.max(newY, minY < 0 ? minY : 0));
          gsap.set(containerRef.current, {
            x: newX,
            y: newY,
          });
        },
      });

      const handleDisable = () => observer.disable();
      const handleEnable = () => observer.enable();

      const handleAutoPan = (e: Event) => {
        const { deltaX = 0, deltaY = 0 } = (e as CustomEvent).detail;
        if (!containerRef.current || !viewportRef.current) return;

        const x = gsap.getProperty(containerRef.current, "x") as number;
        const y = gsap.getProperty(containerRef.current, "y") as number;
        let newX = x + deltaX;
        let newY = y + deltaY;

        const minX = -(CANVAS_WIDTH - viewportRef.current.clientWidth);
        const minY = -(CANVAS_HEIGHT - viewportRef.current.clientHeight);

        newX = Math.min(0, Math.max(newX, minX < 0 ? minX : 0)); 
        // newX = gsap.utils.clamp(minX, 0, newX); same
        newY = Math.min(0, Math.max(newY, minY < 0 ? minY : 0));

        gsap.set(containerRef.current, { x: newX, y: newY });
      };

      window.addEventListener("disable-panning", handleDisable);
      window.addEventListener("enable-panning", handleEnable);
      window.addEventListener("auto-pan", handleAutoPan);

      return () => {
        window.removeEventListener("disable-panning", handleDisable);
        window.removeEventListener("enable-panning", handleEnable);
        window.removeEventListener("auto-pan", handleAutoPan);
        gsapContext.revert();
      };
    }, []);
  });

  return (
    <div
      ref={viewportRef}
      className="canvas-viewport relative w-full h-[80vh] overflow-hidden border rounded-xl border-gray-200 bg-[#000000] shadow-inner cursor-grab  "
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Container */}
      <div
        ref={containerRef}
        className="canvas-container absolute origin-top-left"
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          left: "0px",
          top: "0px",
          border: `2px solid ${activeTheme.line}`,
          boxSizing: "border-box",
          backgroundColor: activeTheme.color,
          backgroundImage: `
            linear-gradient(to right, ${activeTheme.line}B3 1px, transparent 1px),
            linear-gradient(to bottom, ${activeTheme.line}B3 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      >
        <div className="relative w-full h-full">
          <div style={{ position: "absolute", left: "0px", top: "0px" }}>
            {children}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/50 px-2 py-1 rounded text-[10px] pointer-events-none text-black">
        Bounded Canvas (max: {CANVAS_WIDTH}x{CANVAS_HEIGHT})
      </div>
    </div>
  );
};
