import { createPortal } from "react-dom";
import {ScrollSmoother} from "gsap/ScrollSmoother";
import { useEffect, useState } from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(()=> {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const smoother = ScrollSmoother.get();

      if (smoother) {
        smoother.paused(true);
      }
      document.body.style.overflow = "hidden";
    }, 10);  

    return () => {
      clearTimeout(timer);
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.paused(false);
      }
      document.body.style.overflow = "unset";
    };
  }, [isOpen]); 

  if (!mounted || !isOpen) return null;

  const ModalUI = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* overlay of modal) */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/*  modal container*/}
      <div className="relative bg-white w-full max-w-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* part of title, header */}
        <div className="w-full p-6 flex flex-col items-center gap-4 border-b border-gray-100">
          <img
            src="/images/blackwelllogo3-1.png"
            alt="logo"
            className="h-8 bg-black"
          />
          <span className="font-semibold text-2xl">{title}</span>

          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* main body or content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
  return createPortal(ModalUI, document.body);
};
export default Modal;
