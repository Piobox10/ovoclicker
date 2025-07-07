import React from 'react';
import { GameState, HiddenDiscoveryState } from '../../types';
// CollapsibleSection import removed

interface HiddenDiscoveriesPanelProps {
  gameState: Pick<GameState, 'hiddenDiscoveriesData'>;
  isOpen: boolean;
  onClose: () => void;
}

const HiddenDiscoveriesPanel: React.FC<HiddenDiscoveriesPanelProps> = ({ gameState, isOpen, onClose }) => {
  const discoveries = gameState.hiddenDiscoveriesData;

  if (!isOpen || !discoveries || discoveries.length === 0) {
    return null; 
  }

  return (
    <div 
        className="fixed inset-0 bg-[var(--modal-backdrop-color)] flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose} // Close on backdrop click
        role="dialog"
        aria-modal="true"
        aria-labelledby="hidden-discoveries-title"
        aria-hidden={!isOpen}
    >
        <div
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
            className={`bg-[var(--bg-panel-secondary)] p-4 sm:p-6 rounded-xl shadow-2xl text-[var(--text-primary)] w-full max-w-lg transform transition-all duration-300 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 id="hidden-discoveries-title" className="text-[var(--title-hidden-discoveries)] text-lg sm:text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-search-plus"></i> Descobertas Secretas
                </h2>
                <button
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-accent-hover)] transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]"
                    aria-label="Fechar Descobertas Secretas"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>

            <div className="max-h-[calc(70vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {discoveries.map((discovery) => (
                    <div
                        key={discovery.id}
                        className={`p-3 rounded-lg border transition-all duration-300 ease-in-out transform hover:scale-[1.02]
                        ${discovery.isDiscovered 
                            ? 'bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-700 border-amber-500 shadow-amber-500/30 shadow-lg' 
                            : 'bg-[var(--bg-interactive)] border-[var(--border-secondary)] shadow-md'}`} 
                            // Changed default background for non-discovered to --bg-interactive
                    >
                        <h4 className={`text-sm font-semibold flex items-center gap-2 mb-1
                        ${discovery.isDiscovered ? 'text-yellow-200' : 'text-[var(--text-primary)]'}`}
                        >
                        <i className={`${discovery.iconToDisplay} ${discovery.isDiscovered ? 'text-yellow-300' : 'text-[var(--text-secondary)]'}`}></i>
                        {discovery.nameToDisplay}
                        </h4>
                        <p className={`text-xs ${discovery.isDiscovered ? 'text-yellow-100 opacity-90' : 'text-[var(--text-secondary)] italic'}`}>
                        {discovery.descriptionToDisplay}
                        </p>
                    </div>
                    ))}
                </div>
                {!discoveries.some(d => d.isDiscovered) && (
                    <p className="text-center text-xs text-[var(--text-secondary)] mt-4 py-4">
                    Continue explorando para revelar os segredos do universo...
                    </p>
                )}
            </div>
        </div>
    </div>
  );
};

export default HiddenDiscoveriesPanel;