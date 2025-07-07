import React from 'react';
import { Decimal } from 'decimal.js';
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade } from '../../types';
import { useGameContext } from '../../contexts/GameContext';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases } from '../../utils';

const RegularUpgradesPanel: React.FC = () => {
  const { gameState, buyGenericUpgradeHandler } = useGameContext();

  return (
    <div className="upgrades-section w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
      <h2 className="text-[var(--title-regular-upgrades)] text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-arrow-up mr-2"></i>Melhorias Regulares (PI)
      </h2>
      <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {gameState.upgradesData.filter(u => !u.hidden).map(upgrade => (
          <UpgradeItem
            key={upgrade.id}
            upgrade={upgrade}
            currency={gameState.incubationPower}
            currencySymbol="PI"
            onBuy={(id, quantity) => buyGenericUpgradeHandler(id, quantity, 'regular')}
            calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg as RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, gameState.transcendenceSpamPenaltyActive, gameState.embryoUpgradesData, gameState.dualCoreUpgradeCostMultiplier, gameState.activeEggFormIds, gameState.legendaryUpgradesData)}
            calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg as RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, gameState.transcendenceSpamPenaltyActive, gameState.embryoUpgradesData, gameState.dualCoreUpgradeCostMultiplier, gameState.activeEggFormIds, gameState.legendaryUpgradesData)}
            formatNumber={formatNumber}
          />
        ))}
      </div>
    </div>
  );
};

export default RegularUpgradesPanel;
