interface CanvasProps {
  children: React.ReactNode;
  activeTheme: string;
}

const GRID_SIZE = 15;

export const Canvas = ({ children, activeTheme }: CanvasProps) => {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden border rounded-xl border-gray-100 shadow-lg "
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundColor: activeTheme,
      }}
    >
      {children}
    </div>
  );
};
