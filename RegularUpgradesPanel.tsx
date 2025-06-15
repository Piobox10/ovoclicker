import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../../types';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases } from '../../utils';

interface RegularUpgradesPanelProps {
  gameState: Pick<GameState, 'incubationPower' | 'upgradesData' | 'activeTraits' | 'specialUpgradesData' | 'achievementsData' | 'transcendenceSpamPenaltyActive' | 'embryoUpgradesData'>;
  onBuyUpgrade: (id: string, quantity: Decimal | 'max', type: 'regular') => void;
}

const RegularUpgradesPanel: React.FC<RegularUpgradesPanelProps> = ({ gameState, onBuyUpgrade }) => {
  return (
    <div className="upgrades-section w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h2 className="text-violet-400 text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-arrow-up mr-2"></i>Melhorias Regulares (PI)
      </h2>
      <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {gameState.upgradesData.filter(u => !u.hidden).map(upgrade => (
          <UpgradeItem
            key={upgrade.id}
            upgrade={upgrade}
            currency={gameState.incubationPower}
            currencySymbol="PI"
            onBuy={(id, quantity) => onBuyUpgrade(id, quantity, 'regular')}
            calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, gameState.transcendenceSpamPenaltyActive, gameState.embryoUpgradesData)}
            calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, gameState.transcendenceSpamPenaltyActive, gameState.embryoUpgradesData)}
            formatNumber={formatNumber}
          />
        ))}
      </div>
    </div>
  );
};

export default RegularUpgradesPanel;