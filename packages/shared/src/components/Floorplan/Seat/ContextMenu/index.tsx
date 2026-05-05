import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
}

export const ContextMenu = ({
  visible,
  onClose,
}: ContextMenuProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClick = () => onClose();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [onClose]);

  if (!visible || !mounted) return null;
  return createPortal(
    <div className="fixed z-1000 w-56 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100 pointer-events-auto">
      <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        Seat Options
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[#777fef] hover:text-white transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span>Change Status</span>
        </div>
        <FaChevronRight size={14} className="opacity-50" />
      </button>

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        onClick={() => {
          if (confirm("Delete?")) console.log("Deleted");
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <FaTrashAlt size={16} />
        <span>Delete Seat</span>
      </button>
    </div>,
    document.body,
  );
};
