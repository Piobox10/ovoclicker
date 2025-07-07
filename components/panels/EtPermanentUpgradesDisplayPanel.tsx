import React from 'react';
import { Decimal } from 'decimal.js';
import { useGameContext } from '../../contexts/GameContext';
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade } from '../../types';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases } from '../../utils';

const EtPermanentUpgradesDisplayPanel: React.FC = () => {
    const { gameState, buyGenericUpgradeHandler } = useGameContext();

    return (
        <div className="upgrades-section w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
        <h3 className="text-[var(--title-et-permanent)] text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
            <i className="fas fa-shield-alt mr-2"></i>Melhorias Permanentes (ET)
        </h3>
        <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {gameState.etPermanentUpgradesData.map(upgrade => (
            <UpgradeItem
                key={upgrade.id}
                upgrade={upgrade}
                currency={gameState.transcendentEssence}
                currencySymbol="ET"
                onBuy={(id, quantity) => buyGenericUpgradeHandler(id, quantity, 'et_permanent')}
                calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg as RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData, gameState.dualCoreUpgradeCostMultiplier)}
                calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg as RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData, gameState.dualCoreUpgradeCostMultiplier)}
                formatNumber={formatNumber}
            />
            ))}
            {gameState.etPermanentUpgradesData.length === 0 && <p className="text-xs text-[var(--text-secondary)] text-center">Nenhuma melhoria permanente disponível.</p>}
        </div>
        </div>
    );
};

export default EtPermanentUpgradesDisplayPanel;
