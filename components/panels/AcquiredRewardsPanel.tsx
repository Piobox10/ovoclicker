import React from 'react';
import { ExpeditionRewardOption } from '../../types';

interface AcquiredRewardsPanelProps {
  rewards: ExpeditionRewardOption[];
}

const AcquiredRewardsPanel: React.FC<AcquiredRewardsPanelProps> = ({ rewards }) => {
  if (rewards.length === 0) {
    return null;
  }

  return (
    <div className="acquired-rewards-panel bg-slate-900/60 p-2 rounded-lg border border-purple-800 backdrop-blur-sm">
      <h4 className="text-xs text-center text-purple-300 mb-1.5 font-semibold">Vantagens da Expedição</h4>
      <div className="flex flex-wrap justify-center items-center gap-2">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="relative group"
            title={`${reward.name} (${reward.rarity})`}
          >
            <i className={`${reward.icon} text-lg sm:text-xl p-2 bg-slate-800 text-slate-200 rounded-md border border-slate-700`}></i>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              <p className="font-bold">{reward.name}</p>
              <p className="text-slate-300">{reward.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcquiredRewardsPanel;