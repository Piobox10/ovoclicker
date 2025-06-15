
import React, { useEffect, useState, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  modalClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, modalClassName = "max-w-md", contentClassName = "", titleClassName="" }) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else if (isMounted) {
      // Delay unmounting to allow for exit animation
      const timer = setTimeout(() => setIsMounted(false), 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      modalContentRef.current.focus(); // Focus the modal content for accessibility
    }
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-hidden={!isOpen}
    >
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
        onKeyDown={handleKeyDown}
        tabIndex={-1} // Make it focusable
        className={`bg-slate-700 p-6 rounded-xl shadow-2xl text-slate-100 w-full transform transition-all duration-300 ease-out ${modalClassName} ${contentClassName} ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        {title && <h3 id="modal-title" className={`text-xl sm:text-2xl font-bold mb-4 text-violet-400 text-center ${titleClassName}`}>{title}</h3>}
        {children}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-700 active:scale-95"
            aria-label="Fechar modal"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
