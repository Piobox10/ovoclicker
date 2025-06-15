
import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../../types';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases } from '../../utils';

interface EtPermanentUpgradesDisplayPanelProps {
  gameState: Pick<GameState, 'transcendentEssence' | 'etPermanentUpgradesData' | 'activeTraits' | 'specialUpgradesData' | 'achievementsData' | 'embryoUpgradesData'>;
  onBuyEtPermanentUpgrade: (id: string, quantity: Decimal | 'max', type: 'et_permanent') => void;
}

const EtPermanentUpgradesDisplayPanel: React.FC<EtPermanentUpgradesDisplayPanelProps> = ({ gameState, onBuyEtPermanentUpgrade }) => {
  return (
    <div className="upgrades-section w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h3 className="text-teal-400 text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-shield-alt mr-2"></i>Melhorias Permanentes (ET)
      </h3>
      <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
        {gameState.etPermanentUpgradesData.map(upgrade => (
          <UpgradeItem
            key={upgrade.id}
            upgrade={upgrade}
            currency={gameState.transcendentEssence}
            currencySymbol="ET"
            onBuy={(id, quantity) => onBuyEtPermanentUpgrade(id, quantity, 'et_permanent')}
            calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
            calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
            formatNumber={formatNumber}
          />
        ))}
        {gameState.etPermanentUpgradesData.length === 0 && <p className="text-xs text-slate-400 text-center">Nenhuma melhoria permanente disponível.</p>}
      </div>
    </div>
  );
};

export default EtPermanentUpgradesDisplayPanel;
    