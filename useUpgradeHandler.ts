
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade } from '../types';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases } from '../utils';

export const useUpgradeHandler = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
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
            
            // Apply postTranscendenceEventUpgradeCostMultiplier for all relevant types
            const postEventUpgradeCostMultiplier = prev.postTranscendenceEventUpgradeCostMultiplier;


            let numToBuy = quantity === 'max' 
                ? calculateGenericMaxPurchases(currentCurrency, upgrade, prev.activeTraits, prev.specialUpgradesData, prev.achievementsData, isSpamPenaltyActiveForThisType, prev.embryoUpgradesData, postEventUpgradeCostMultiplier) 
                : quantity as Decimal;

            if ('maxLevel' in upgrade && upgrade.maxLevel) {
                numToBuy = Decimal.min(numToBuy, (upgrade.maxLevel as Decimal).minus(upgrade.purchased));
            }

            if (numToBuy.lessThanOrEqualTo(0)) {
                if (quantity !== 'max') showMessage('Não é possível comprar mais.', 1500);
                else if (quantity === 'max') showMessage(`${currencyName} insuficiente para o próximo nível.`, 1500);
                return prev;
            }

            const totalCost = calculateGenericUpgradeCost(upgrade, numToBuy, undefined, prev.activeTraits, prev.specialUpgradesData, prev.achievementsData, isSpamPenaltyActiveForThisType, prev.embryoUpgradesData, postEventUpgradeCostMultiplier);

            if (currentCurrency.greaterThanOrEqualTo(totalCost)) {
                const updatedList = currentUpgradeList.map(u =>
                    u.id === upgradeId ? { ...u, purchased: u.purchased.plus(numToBuy) } : u
                );
                showMessage(`${upgrade.name} ${type === 'et_permanent' ? 'melhorado' : 'comprado'} ${formatNumber(numToBuy)}x!`, 1500);

                let updatedState = {
                    ...prev,
                    [currencyField]: currentCurrency.minus(totalCost),
                    totalUpgradesPurchasedEver: type !== 'et_permanent' ? prev.totalUpgradesPurchasedEver.plus(numToBuy) : prev.totalUpgradesPurchasedEver,
                    [upgradeListKey]: updatedList
                };

                if (type === 'regular') {
                    updatedState.hasPurchasedRegularUpgradeThisRun = true;
                    // Track unique incubator types purchased for "Cascas Interligadas" trait
                    const purchasedUpgradeInfo = updatedState.upgradesData.find(u => u.id === upgradeId);
                    if (purchasedUpgradeInfo && purchasedUpgradeInfo.type === 'ipps') {
                        const newIncubatorTypesOwned = new Set(prev.incubatorTypesOwnedThisRun);
                        newIncubatorTypesOwned.add(upgradeId);
                        updatedState.incubatorTypesOwnedThisRun = newIncubatorTypesOwned;
                    }
                }
                
                // Specific unlock logic for "Incubadora Automatizada"
                if (type === 'regular' && upgrade.id === 'basicIncubator' && updatedState.upgradesData.find(u => u.id === 'basicIncubator')?.purchased.gte(100)) {
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
    }, [setGameState, showMessage]);


    const buySpecialUpgradeHandler = useCallback((sUpgradeId: string) => {
        setGameState(prev => {
            const sUpgrade = prev.specialUpgradesData.find(su => su.id === sUpgradeId);
            if (!sUpgrade || sUpgrade.purchased.equals(1)) {
                if (sUpgrade?.purchased.equals(1)) showMessage(`${sUpgrade.name} já ativado.`, 1500);
                return prev;
            }

            if (prev.currentStageIndex < sUpgrade.stageRequired) {
                showMessage("Requisito de estágio não atingido.", 1500);
                return prev;
            }

            let newIncubationPower = prev.incubationPower;
            let newTemporaryEggs = prev.temporaryEggs;
            let newTranscendentEssence = prev.transcendentEssence;
            let effectAppliedMessage = `${sUpgrade.name} ativado!`;

            if (sUpgrade.id === 'stage9Bonus' && sUpgrade.effect.piPerTemporaryEgg) {
                if (prev.temporaryEggs.lessThanOrEqualTo(0)) {
                    showMessage("Você não tem Ovos Temporários para converter.", 2000);
                    return prev;
                }
                const piGained = prev.temporaryEggs.times(sUpgrade.effect.piPerTemporaryEgg as Decimal);
                newIncubationPower = newIncubationPower.plus(piGained);
                newTemporaryEggs = new Decimal(0);
                effectAppliedMessage = `${sUpgrade.name} ativado! Ganhou ${formatNumber(piGained)} PI e consumiu ${formatNumber(prev.temporaryEggs)} Ovos Temp.`;
            } else if (sUpgrade.id === 'stage13Bonus' && sUpgrade.effect.bonusET) {
                newTranscendentEssence = newTranscendentEssence.plus(sUpgrade.effect.bonusET as Decimal);
                effectAppliedMessage = `${sUpgrade.name} ativado! Ganhou ${formatNumber(sUpgrade.effect.bonusET as Decimal)} ET.`;
            }

            const updatedSpecialUpgrades = prev.specialUpgradesData.map(su =>
                su.id === sUpgradeId ? { ...su, purchased: new Decimal(1) } : su
            );

            showMessage(effectAppliedMessage, 2000);
            return {
                ...prev,
                specialUpgradesData: updatedSpecialUpgrades,
                incubationPower: newIncubationPower,
                temporaryEggs: newTemporaryEggs,
                transcendentEssence: newTranscendentEssence,
            };
        });
    }, [setGameState, showMessage]);

    return { buyGenericUpgradeHandler, buySpecialUpgradeHandler };
};
