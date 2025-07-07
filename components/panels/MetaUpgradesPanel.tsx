import React from 'react';
import { Decimal } from 'decimal.js';
import { MetaUpgrade, UpgradeBase, EtPermanentUpgrade, RegularUpgrade, TranscendentalBonus } from '../../types';
import { useGameContext } from '../../contexts/GameContext';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';

type AdaptableMetaUpgrade = MetaUpgrade & { baseCost: Decimal; type?: string };

const MetaUpgradesPanel: React.FC = () => {
    const { gameState, buyMetaUpgradeHandler } = useGameContext();

    if (!gameState.metaUpgradesUnlocked) {
        return null;
    }

    const categories = ['Habilidades', 'Formas', 'Chips', 'Traços', 'Transcendência', 'Produção', 'Geral'] as const;
    const groupedUpgrades: Record<typeof categories[number], MetaUpgrade[]> = { Habilidades: [], Formas: [], Chips: [], Traços: [], Transcendência: [], Produção: [], Geral: [] };

    gameState.metaUpgradesData.forEach(upg => {
        if (upg.unlockCondition && !upg.unlockCondition(gameState)) return;
        if (groupedUpgrades[upg.category]) groupedUpgrades[upg.category].push(upg);
        else groupedUpgrades['Geral'].push(upg);
    });

    return (
        <CollapsibleSection title="Aprimoramentos Superiores" titleIcon="fas fa-star-of-life" initiallyOpen={true}>
        <div className="upgrades-section w-full bg-[var(--bg-panel-primary)] rounded-xl p-3 sm:p-4 border border-[var(--border-primary)]">
            <p className="text-xs text-[var(--text-secondary)] text-center mb-3">Melhore sistemas inteiros com Essência Transcendente. Desbloqueado após a primeira transcendência.</p>
            <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {categories.map(categoryName => {
                const upgradesInCategory = groupedUpgrades[categoryName];
                if (upgradesInCategory.length === 0) return null;
                return (
                <div key={categoryName}>
                    <h3 className="text-[var(--text-accent)] text-md font-semibold mb-2 sticky top-0 bg-[var(--bg-panel-primary)] py-1 z-10">{categoryName}</h3>
                    {upgradesInCategory.map(upgrade => {
                    const adaptedUpgrade: AdaptableMetaUpgrade = { ...upgrade, baseCost: upgrade.cost, type: 'meta_upgrade' };
                    return (
                        <UpgradeItem
                            key={upgrade.id}
                            upgrade={adaptedUpgrade as unknown as UpgradeBase | EtPermanentUpgrade}
                            currency={gameState.transcendentEssence}
                            currencySymbol="ET"
                            onBuy={(id, quantity) => buyMetaUpgradeHandler(id, quantity)}
                            calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg as RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData, gameState.dualCoreUpgradeCostMultiplier)}
                            calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg as RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData, gameState.dualCoreUpgradeCostMultiplier)}
                            formatNumber={formatNumber}
                        />
                    );
                    })}
                </div>
                );
            })}
            {gameState.metaUpgradesData.filter(mu => !mu.unlockCondition || mu.unlockCondition(gameState)).length === 0 && (
                <p className="text-slate-400 text-sm text-center py-4">Nenhum Aprimoramento Superior disponível ou desbloqueado no momento.</p>
            )}
            </div>
        </div>
        </CollapsibleSection>
    );
};

export default MetaUpgradesPanel;
