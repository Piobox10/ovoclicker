import React from 'react';
import { GameState } from '../../types';
import { TRAITS } from '../../constants';

interface ActiveTraitsDisplayPanelProps {
  gameState: Pick<GameState, 'activeTraits' | 'maxActiveTraits'>;
}

const ActiveTraitsDisplayPanel: React.FC<ActiveTraitsDisplayPanelProps> = ({ gameState }) => {
  if (gameState.activeTraits.length === 0) {
    return null; // Don't show if no traits are active
  }

  const activeTraitDetails = gameState.activeTraits.map(id => TRAITS.find(t => t.id === id)).filter(Boolean);

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h2 className="text-sky-400 text-lg sm:text-xl font-bold mb-3 text-center">
        <i className="fas fa-brain mr-2"></i>Traços Ativos ({gameState.activeTraits.length}/{gameState.maxActiveTraits})
      </h2>
      <div className="space-y-2">
        {activeTraitDetails.map(trait => (
          trait && (
            <div key={trait.id} className="p-2 bg-slate-800 rounded-md border border-slate-700">
              <h3 className="text-sm font-semibold text-sky-300 flex items-center gap-1.5">
                <i className={`${trait.icon} text-sky-400`}></i> {trait.name}
              </h3>
              <p className="text-xs text-slate-400">{trait.description}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ActiveTraitsDisplayPanel;