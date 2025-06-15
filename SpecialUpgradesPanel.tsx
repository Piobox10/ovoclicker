import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../../types';
import SpecialUpgradeItem from '../SpecialUpgradeItem';
import { formatNumber } from '../../utils';

interface SpecialUpgradesPanelProps {
  gameState: Pick<GameState, 'specialUpgradesData' | 'currentStageIndex' | 'temporaryEggs'>;
  onBuySpecialUpgrade: (id: string) => void;
}

const SpecialUpgradesPanel: React.FC<SpecialUpgradesPanelProps> = ({ gameState, onBuySpecialUpgrade }) => {
  return (
    <div className="upgrades-section w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h2 className="text-yellow-400 text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-certificate mr-2"></i>Melhorias de Estágio
      </h2>
      <div className="max-h-[200px] sm:max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
        {gameState.specialUpgradesData.map(sUpgrade => (
          <SpecialUpgradeItem
            key={sUpgrade.id}
            sUpgrade={sUpgrade}
            onBuy={onBuySpecialUpgrade}
            isUnlocked={gameState.currentStageIndex >= sUpgrade.stageRequired}
            currentTemporaryEggs={sUpgrade.id === 'stage9Bonus' ? gameState.temporaryEggs : undefined}
            formatNumber={formatNumber}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialUpgradesPanel;