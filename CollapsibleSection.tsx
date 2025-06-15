
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
        className="w-full bg-slate-900 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors duration-200 overflow-hidden group"
    >
      <summary 
        className="flex justify-center items-center p-4 sm:p-6 cursor-pointer bg-slate-800 group-hover:bg-slate-750 transition-colors duration-200 text-violet-400 text-lg sm:text-xl font-bold select-none list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-t-2xl"
        // Added focus-visible styles for accessibility
      >
        <div className="flex items-center gap-2 sm:gap-3">
            {titleIcon && <i className={`${titleIcon}`}></i>}
            <h2>{title}</h2>
            <i className={`fas fa-chevron-down transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}></i>
        </div>
      </summary>
      {/* Conditional rendering of children wrapper for smoother CSS transition */}
      {isOpen && (
        <div className={`p-4 sm:p-6 pt-0 transition-all duration-500 ease-out animate-fadeIn`}>
            <div className="pt-4 sm:pt-6 border-t border-slate-700"> {/* Added border-t for better separation */}
                {children}
            </div>
        </div>
      )}
      {/* Basic animation for fadeIn - can be defined in a global CSS or Tailwind config if used often */}
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
