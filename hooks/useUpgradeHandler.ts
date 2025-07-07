
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade } from '../types';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases, playSound } from '../utils'; // Added playSound

// Type for updateMissionProgress function
type UpdateMissionProgressFn = (metric: string, incrementValue: Decimal, associatedData?: any) => void;

export const useUpgradeHandler = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void,
    updateMissionProgress: UpdateMissionProgressFn 
) => {
    const buyGenericUpgradeHandler = useCallback((
        upgradeId: string, 
        quantity: Decimal | 'max', 
        type: 'regular' | 'transcendental' | 'et_permanent'
    ) => {
        setGameState(prev => {
            let upgradeListKey: keyof GameState;
            let currencyField: keyof GameState;
            let currencyName: string;

            switch (type) {
                case 'regular':
                    upgradeListKey = 'upgradesData';
                    currencyField = 'incubationPower';
                    currencyName = 'Poder de Incubação';
                    break;
                case 'transcendental':
                    upgradeListKey = 'transcendentalBonusesData';
                    currencyField = 'transcendentEssence';
                    currencyName = 'Essência Transcendente';
                    break;
                case 'et_permanent':
                    upgradeListKey = 'etPermanentUpgradesData';
                    currencyField = 'transcendentEssence';
                    currencyName = 'Essência Transcendente';
                    break;
                default:
                    return prev; 
            }
            
            const currentUpgradeList = prev[upgradeListKey] as (RegularUpgrade[] | TranscendentalBonus[] | EtPermanentUpgrade[]);
            const upgrade = currentUpgradeList.find(u => u.id === upgradeId);

            if (!upgrade) return prev;

            if ('maxLevel' in upgrade && upgrade.maxLevel && upgrade.purchased.gte(upgrade.maxLevel)) {
                 showMessage('Nível máximo já atingido.', 1500);
                 return prev;
            }

            const currentCurrency = prev[currencyField] as Decimal;
            const isSpamPenaltyActiveForThisType = type === 'regular' && prev.transcendenceSpamPenaltyActive;
            
            let numToBuy = quantity === 'max' 
                ? calculateGenericMaxPurchases(currentCurrency, upgrade, prev.activeTraits, prev.specialUpgradesData, prev.achievementsData, isSpamPenaltyActiveForThisType, prev.embryoUpgradesData, prev.dualCoreUpgradeCostMultiplier) 
                : quantity as Decimal;

            if ('maxLevel' in upgrade && upgrade.maxLevel) {
                numToBuy = Decimal.min(numToBuy, (upgrade.maxLevel as Decimal).minus(upgrade.purchased));
            }

            if (numToBuy.lessThanOrEqualTo(0)) {
                if (quantity !== 'max') showMessage('Não é possível comprar mais.', 1500);
                else if (quantity === 'max') showMessage(`${currencyName} insuficiente para o próximo nível.`, 1500);
                return prev;
            }

            const totalCost = calculateGenericUpgradeCost(upgrade, numToBuy, undefined, prev.activeTraits, prev.specialUpgradesData, prev.achievementsData, isSpamPenaltyActiveForThisType, prev.embryoUpgradesData, prev.dualCoreUpgradeCostMultiplier);

            if (currentCurrency.greaterThanOrEqualTo(totalCost)) {
                const updatedList = currentUpgradeList.map(u =>
                    u.id === upgradeId ? { ...u, purchased: u.purchased.plus(numToBuy) } : u
                );
                showMessage(`${upgrade.name} ${type === 'et_permanent' ? 'melhorado' : 'comprado'} ${formatNumber(numToBuy)}x!`, 1500);
                playSound('purchase.mp3', prev.isSoundEnabled, 0.6);


                let updatedState = {
                    ...prev,
                    [currencyField]: currentCurrency.minus(totalCost),
                    totalUpgradesPurchasedEver: type !== 'et_permanent' ? prev.totalUpgradesPurchasedEver.plus(numToBuy) : prev.totalUpgradesPurchasedEver,
                    [upgradeListKey]: updatedList
                };

                if (type === 'regular') {
                    updatedState.hasPurchasedRegularUpgradeThisRun = true;
                    const purchasedUpgradeInfo = updatedState.upgradesData.find(u => u.id === upgradeId);
                    if (purchasedUpgradeInfo && purchasedUpgradeInfo.type === 'ipps') {
                        const newIncubatorTypesOwned = new Set(prev.incubatorTypesOwnedThisRun);
                        newIncubatorTypesOwned.add(upgradeId);
                        updatedState.incubatorTypesOwnedThisRun = newIncubatorTypesOwned;
                    }
                }
                
                if (upgrade.id === 'basicIncubator' && updatedState.upgradesData.find(u => u.id === 'basicIncubator')?.purchased.gte(100)) {
                     const industrialIncubationAch = updatedState.achievementsData.find(a => a.id === 'industrialIncubation');
                     if (industrialIncubationAch && industrialIncubationAch.unlocked && industrialIncubationAch.unlocksUpgrade) {
                        const targetUpgradeId = industrialIncubationAch.unlocksUpgrade;
                        const targetUpgrade = updatedState.upgradesData.find(u => u.id === targetUpgradeId);
                        if (targetUpgrade && targetUpgrade.hidden) {
                            updatedState.upgradesData = updatedState.upgradesData.map(u => u.id === targetUpgradeId ? {...u, hidden: false} : u);
                            showMessage(`Melhoria "${targetUpgrade.name}" desbloqueada através de conquista!`, 2500);
                        }
                     }
                }
                return updatedState;
            } else {
                showMessage(`${currencyName} insuficiente!`, 1500);
                return prev;
            }
        });
    }, [setGameState, showMessage, updateMissionProgress]);

    // This handler is being functionally replaced by the automatic activation system.
    // Keeping it for now to minimize diff, but its primary call path from SpecialUpgradeItem is removed.
    const buySpecialUpgradeHandler = useCallback((sUpgradeId: string) => {
        setGameState(prev => {
            if (prev.entropySeedSpecialUpgradesDisabled) {
                showMessage("Melhorias de Estágio estão desabilitadas nesta run devido ao evento Semente da Entropia.", 2000);
                return prev;
            }

            const sUpgrade = prev.specialUpgradesData.find(su => su.id === sUpgradeId);
            if (!sUpgrade || sUpgrade.purchased.equals(1)) {
                if (sUpgrade?.purchased.equals(1)) showMessage(`${sUpgrade.name} já ativado.`, 1500);
                return prev;
            }

            if (prev.currentStageIndex < sUpgrade.stageRequired) {
                showMessage("Requisito de estágio não atingido.", 1500);
                return prev;
            }
            
            if (sUpgrade.id === 'stage9Bonus' && prev.temporaryEggs.lessThanOrEqualTo(0)) {
                showMessage("Nenhum Ovo Temporário para converter.", 1500);
                return prev;
            }

            const updatedSpecialUpgrades = prev.specialUpgradesData.map(su =>
                su.id === sUpgradeId ? { ...su, purchased: new Decimal(1) } : su
            );
            
            let message = `Melhoria Especial "${sUpgrade.name}" ativada!`;
            let newIncubationPower = prev.incubationPower;
            let newTranscendentEssence = prev.transcendentEssence;
            let newTemporaryEggs = prev.temporaryEggs;

            if (sUpgrade.id === 'stage9Bonus' && sUpgrade.effect.piPerTemporaryEgg) {
                const piGained = prev.temporaryEggs.times(sUpgrade.effect.piPerTemporaryEgg as Decimal);
                newIncubationPower = newIncubationPower.plus(piGained);
                newTemporaryEggs = new Decimal(0);
                message += ` Ganhou ${formatNumber(piGained)} PI.`;
            }
            if (sUpgrade.id === 'stage13Bonus' && sUpgrade.effect.bonusET) {
                newTranscendentEssence = newTranscendentEssence.plus(sUpgrade.effect.bonusET as Decimal);
                message += ` Ganhou ${formatNumber(sUpgrade.effect.bonusET as Decimal)} ET.`;
            }

            showMessage(message, 2000);
            playSound('purchase_special.mp3', prev.isSoundEnabled, 0.7); 

            return { 
                ...prev, 
                specialUpgradesData: updatedSpecialUpgrades,
                incubationPower: newIncubationPower,
                transcendentEssence: newTranscendentEssence,
                temporaryEggs: newTemporaryEggs,
            };
        });
    }, [setGameState, showMessage]);

    return { buyGenericUpgradeHandler, buySpecialUpgradeHandler };
};
