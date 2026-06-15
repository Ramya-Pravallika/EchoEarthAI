import React, { ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3 mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-950 dark:text-zinc-50">{title}</h3>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
export default Modal;
