
interface CanvasProps {
children: React.ReactNode

}

export const Canvas = ({children}:CanvasProps) => {
    return (
      <div
        className="relative w-full min-h-screen overflow-hidden  "
        style={{
          backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
          backgroundSize: "15px 15px",
          backgroundColor: "#FFFFFF",
        }}
      >
        {children}
      </div>
    );
}