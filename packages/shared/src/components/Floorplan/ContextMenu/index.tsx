import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";

import type { SeatStatus } from "../Seat";

const STATUS_OPTIONS: { value: SeatStatus; label: string; color: string }[] = [
  { value: "available", label: "Available", color: "bg-[#A9E861]" },
  { value: "occupied", label: "Occupied", color: "bg-[#FF6B6B]" },
  { value: "unavailable", label: "Unavailable", color: "bg-[#DCE6F2]" },
  { value: "reserved", label: "Reserved", color: "bg-[#4D98DB]" },
];


export interface ContextMenuComponents {
  x: number;
  y: number;
  visible: boolean;
  targetId: string | null;
}

export interface ContextMenuProps extends ContextMenuComponents {
  onClose: () => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: string) => void;
}

export const ContextMenu = ({
  x,
  y,
  visible,
  targetId,
  onClose,
  onDelete,
  onChangeStatus,
}: ContextMenuProps) => {
  const [mounted, setMounted] = useState(false);
 const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  if (!visible) {
    setShowStatusMenu(false);
    return;
  }


    const handleClick = (e: MouseEvent) => {
      if (e.button === 0) {
        onClose();
      }
    };


    const timer = setTimeout(() => {
      window.addEventListener("pointerdown", handleClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", handleClick);
    };
  }, [onClose, visible]);
  if (!visible || !mounted) return null;
  return createPortal(
    <div
      role="none"
      style={{
        top: y + 2,
        left: x + 2,
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      className="fixed z-1000 w-56 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl p-2   animate-in fade-in zoom-in-95 duration-100 pointer-events-auto"
    >
      <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        Seat Options for {targetId}
      </div>

      <div
        role="none"
        className="relative group"
        onMouseEnter={() => setShowStatusMenu(true)}
        onMouseLeave={() => setShowStatusMenu(false)}
      >
        <button
          type="button"
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[#777fef] hover:text-white transition-colors rounded-md"
        >
          <div className="flex items-center gap-2">
            <span>Change Status</span>
          </div>
          <FaChevronRight
            size={14}
            className={`transition-transform duration-200 ${showStatusMenu ? "auto" : "opacity-50"}`}
          />
        </button>

        {showStatusMenu && (
          <div
            role="none"
            className="absolute -top-2 -right-50 w-50 z-1010 pr-2 rounded-xl border"
          >
            {/* 这个内层 div 才是真正看得见、白色的弹出框 */}
            <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-2 animate-in fade-in slide-in-from-left-2 duration-150">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (targetId) onChangeStatus(targetId, opt.value);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-md text-left"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${opt.color} shadow-sm border border-black/10`}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* <button
        type="button"
        onClick={() => {
          if (targetId) onChangeStatus(targetId, "reserved");
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[#777fef] hover:text-white transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span>Change Status</span>
        </div>
        <FaChevronRight size={14} className="opacity-50" />
      </button> */}

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        onClick={() => {
          if (targetId && confirm(`Confirm delete this seat: ${targetId} ?`)) {
            onDelete(targetId);
          }
          onClose();
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
