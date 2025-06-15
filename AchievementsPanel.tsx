import React from 'react';
import { GameState } from '../../types';
import CollapsibleSection from '../CollapsibleSection';

interface AchievementsPanelProps {
  gameState: Pick<GameState, 'achievementsData' | 'unlockedAchievements'>;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ gameState }) => {
  const unlockedCount = gameState.unlockedAchievements.length;
  const totalCount = gameState.achievementsData.length;

  return (
    <CollapsibleSection 
        title={`Conquistas (${unlockedCount}/${totalCount})`}
        titleIcon="fas fa-trophy"
    >
      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {gameState.achievementsData.map(ach => (
          <div
            key={ach.id}
            className={`p-2.5 rounded-lg border transition-opacity duration-300 ${ach.unlocked ? 'bg-green-700/30 border-green-500 opacity-100' : 'bg-slate-800 border-slate-700 opacity-60 hover:opacity-100'}`}
          >
            <h4 className={`text-sm font-semibold flex items-center gap-2 ${ach.unlocked ? 'text-green-300' : 'text-slate-300'}`}>
              <i className={`${ach.icon} ${ach.unlocked ? 'text-yellow-400 animate-pulse' : 'text-slate-500'}`}></i>
              {ach.name}
            </h4>
            <p className={`text-xs mt-1 ${ach.unlocked ? 'text-slate-300' : 'text-slate-400'}`}>{ach.description}</p>
            {ach.unlocked && ach.bonusDescription && (
              <p className="text-xs mt-0.5 text-green-400">{ach.bonusDescription}</p>
            )}
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};

export default AchievementsPanel;