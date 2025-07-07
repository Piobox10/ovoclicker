
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, MetaUpgrade, RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade } from '../types';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases, playSound } from '../utils';

export const useMetaUpgradeHandler = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const buyMetaUpgradeHandler = useCallback((
        upgradeId: string, 
        quantity: Decimal | 'max'
    ) => {
        setGameState(prev => {
            if (!prev.metaUpgradesUnlocked) {
                showMessage("Sistema de Aprimoramentos Superiores ainda não desbloqueado.", 2000);
                return prev;
            }

            const upgrade = prev.metaUpgradesData.find(u => u.id === upgradeId);
            if (!upgrade) {
                showMessage("Aprimoramento Superior não encontrado.", 1500);
                return prev;
            }
            
            if (upgrade.unlockCondition && !upgrade.unlockCondition(prev)) {
                showMessage("Condições para este Aprimoramento Superior não atingidas.", 2000);
                return prev;
            }

            if (upgrade.maxLevel && upgrade.purchased.gte(upgrade.maxLevel)) {
                 showMessage('Nível máximo já atingido para este Aprimoramento Superior.', 1500);
                 return prev;
            }

            const currentCurrency = prev.transcendentEssence; 

            // Adapt MetaUpgrade for costing functions
            const adaptedUpgradeForCosting = {
                ...upgrade,
                baseCost: upgrade.cost, 
            } as unknown as (RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade); // Cast carefully

            
            let numToBuy = quantity === 'max' 
                ? calculateGenericMaxPurchases(currentCurrency, adaptedUpgradeForCosting, prev.activeTraits, prev.specialUpgradesData, prev.achievementsData, false, prev.embryoUpgradesData, prev.dualCoreUpgradeCostMultiplier) 
                : quantity as Decimal;

            if (upgrade.maxLevel) {
                numToBuy = Decimal.min(numToBuy, upgrade.maxLevel.minus(upgrade.purchased));
            }

            if (numToBuy.lessThanOrEqualTo(0)) {
                if (quantity !== 'max' && upgrade.maxLevel && upgrade.purchased.plus(numToBuy).gt(upgrade.maxLevel)) {
                     showMessage('Não é possível comprar além do nível máximo.', 1500);
                } else if (quantity !== 'max') {
                    showMessage('Não é possível comprar esta quantidade.', 1500);
                }
                 else if (quantity === 'max') {
                    showMessage(`Essência Transcendente insuficiente para o próximo nível.`, 1500);
                }
                return prev;
            }
            
            const totalCost = calculateGenericUpgradeCost(adaptedUpgradeForCosting, numToBuy, undefined, prev.activeTraits, prev.specialUpgradesData, prev.achievementsData, false, prev.embryoUpgradesData, prev.dualCoreUpgradeCostMultiplier);


            if (currentCurrency.greaterThanOrEqualTo(totalCost)) {
                const updatedList = prev.metaUpgradesData.map(u =>
                    u.id === upgradeId ? { ...u, purchased: u.purchased.plus(numToBuy) } : u
                );
                showMessage(`${upgrade.name} melhorado ${formatNumber(numToBuy)}x!`, 1500);
                playSound('purchase_meta.mp3', prev.isSoundEnabled, 0.7); 

                return {
                    ...prev,
                    transcendentEssence: currentCurrency.minus(totalCost),
                    metaUpgradesData: updatedList
                };
            } else {
                showMessage(`Essência Transcendente insuficiente! Necessário: ${formatNumber(totalCost)} ET.`, 1500);
                return prev;
            }
        });
    }, [setGameState, showMessage]);

    return { buyMetaUpgradeHandler };
};
