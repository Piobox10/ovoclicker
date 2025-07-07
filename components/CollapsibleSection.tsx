
import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  titleIcon?: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, titleIcon, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <details 
        open={isOpen} 
        onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
        className="w-full bg-[var(--bg-panel-primary)] rounded-2xl border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-colors duration-200 group" // Removed overflow-hidden
    >
      <summary 
        className="flex justify-center items-center p-4 sm:p-6 cursor-pointer bg-[var(--bg-panel-secondary)] group-hover:bg-[var(--bg-interactive-hover)] transition-colors duration-200 text-[var(--text-accent)] text-lg sm:text-xl font-bold select-none list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel-primary)] rounded-t-2xl"
      >
        <div className="flex items-center gap-2 sm:gap-3">
            {titleIcon && <i className={`${titleIcon}`}></i>}
            <h2>{title}</h2>
            <i className={`fas fa-chevron-down transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}></i>
        </div>
      </summary>
      {isOpen && (
        <div className={`p-4 sm:p-6 pt-0 transition-all duration-500 ease-out animate-fadeIn`}>
            <div className="pt-4 sm:pt-6 border-t border-[var(--border-primary)]">
                {children}
            </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </details>
  );
};

export default CollapsibleSection;
