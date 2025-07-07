
import React from 'react';
import { GameState } from '../../types';

interface AchievementsPanelProps {
  gameState: Pick<GameState, 'achievementsData' | 'unlockedAchievements'>;
  isOpen: boolean;
  onClose: () => void;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ gameState, isOpen, onClose }) => {
  const unlockedCount = gameState.unlockedAchievements.length;
  const totalCount = gameState.achievementsData.length;

  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[var(--bg-panel-secondary)] bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-[var(--border-accent)] text-[var(--text-primary)] transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }}
    >
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[var(--title-achievements)] text-lg sm:text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-trophy"></i> Conquistas ({unlockedCount}/{totalCount})
                </h2>
                <button
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-accent-hover)] transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]"
                    aria-label="Fechar Conquistas"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>

            <div className="max-h-[calc(70vh-100px)] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {gameState.achievementsData.map(ach => (
                <div
                    key={ach.id}
                    className={`p-2.5 rounded-lg border transition-opacity duration-300 ${ach.unlocked ? 'bg-green-700/30 border-green-500 opacity-100' : 'bg-[var(--bg-interactive)] border-[var(--border-secondary)] opacity-70 hover:opacity-100'}`}
                >
                    <h4 className={`text-sm font-semibold flex items-center gap-2 ${ach.unlocked ? 'text-green-300' : 'text-[var(--text-primary)]'}`}>
                    <i className={`${ach.icon} ${ach.unlocked ? 'text-yellow-400 animate-pulse' : 'text-[var(--text-secondary)]'}`}></i>
                    {ach.name}
                    </h4>
                    <p className={`text-xs mt-1 ${ach.unlocked ? 'text-slate-300' : 'text-[var(--text-secondary)]'}`}>{ach.description}</p>
                    {ach.unlocked && ach.bonusDescription && (
                    <p className="text-xs mt-0.5 text-green-400">{ach.bonusDescription}</p>
                    )}
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AchievementsPanel;