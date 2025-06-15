
import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../../types';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases } from '../../utils';

interface EtBonusesDisplayPanelProps {
  gameState: Pick<GameState, 'transcendentEssence' | 'transcendentalBonusesData' | 'activeTraits' | 'specialUpgradesData' | 'achievementsData' | 'embryoUpgradesData'>;
  onBuyTranscendentalBonus: (id: string, quantity: Decimal | 'max', type: 'transcendental') => void;
}

const EtBonusesDisplayPanel: React.FC<EtBonusesDisplayPanelProps> = ({ gameState, onBuyTranscendentalBonus }) => {
  return (
    <div className="upgrades-section w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h3 className="text-purple-400 text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-star mr-2"></i>Bônus Transcendentais (ET)
      </h3>
      <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
        {gameState.transcendentalBonusesData.map(upgrade => (
          <UpgradeItem
            key={upgrade.id}
            upgrade={upgrade}
            currency={gameState.transcendentEssence}
            currencySymbol="ET"
            onBuy={(id, quantity) => onBuyTranscendentalBonus(id, quantity, 'transcendental')}
            calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
            calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
            formatNumber={formatNumber}
          />
        ))}
        {gameState.transcendentalBonusesData.length === 0 && <p className="text-xs text-slate-400 text-center">Nenhum bônus disponível.</p>}
      </div>
    </div>
  );
};

export default EtBonusesDisplayPanel;
    