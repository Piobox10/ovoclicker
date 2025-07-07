
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, CosmicBankResourceType, EtPermanentUpgrade, LegendaryUpgrade } from '../types';
import { formatNumber } from '../utils';

// Helper function to calculate time elapsed (replicated from panel for hook use)
const calculateTimeElapsed = (timestamp: number | null): Decimal => {
    if (!timestamp) return new Decimal(0);
    return new Decimal(Date.now() - timestamp).dividedBy(1000); // in seconds
};

// Helper function to calculate simulated interest
const calculateSimulatedInterest = (
    bankedAmount: Decimal, 
    timeElapsedSeconds: Decimal,
    etPermanentUpgrades: EtPermanentUpgrade[],
    legendaryUpgrades: LegendaryUpgrade[], // Added for compounderCore
    transcendenceCount: Decimal // Added for compounderCore
): Decimal => {
    if (bankedAmount.isZero() || timeElapsedSeconds.isZero()) return new Decimal(0);
    
    let interestRatePerSecond = new Decimal(0.0001); // Base rate

    // Apply Banco Cósmico bonus from ET Permanent Upgrades
    const bancoCosmicoUpgrade = etPermanentUpgrades.find(upg => upg.id === 'bancoCosmico' && upg.purchased.gt(0));
    if (bancoCosmicoUpgrade && bancoCosmicoUpgrade.effect.bankInterestBonusPerLevel) {
        const bonusPerLevel = bancoCosmicoUpgrade.effect.bankInterestBonusPerLevel as Decimal;
        const totalBonusMultiplier = new Decimal(1).plus(bonusPerLevel.times(bancoCosmicoUpgrade.purchased));
        interestRatePerSecond = interestRatePerSecond.times(totalBonusMultiplier);
    }
    
    let baseInterest = bankedAmount.times(interestRatePerSecond).times(timeElapsedSeconds);

    // Apply Compounder Core bonus from Legendary Upgrades
    const compounderCoreLegendary = legendaryUpgrades.find(lu => lu.id === 'compounderCore' && lu.activated);
    if (compounderCoreLegendary && transcendenceCount.gt(0)) {
        const compounderBonusMultiplier = new Decimal(1).plus(new Decimal(0.01).times(transcendenceCount));
        baseInterest = baseInterest.times(compounderBonusMultiplier);
    }

    return baseInterest.toDecimalPlaces(2, Decimal.ROUND_DOWN);
};


export const useCosmicBank = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const handleDeposit = useCallback((resourceType: CosmicBankResourceType, amountToDeposit: Decimal) => {
        setGameState(prev => {
            if (amountToDeposit.lte(0) || amountToDeposit.isNaN()) {
                showMessage("Valor de depósito inválido.", 1500);
                return prev;
            }

            let currentResourceAmount: Decimal;
            let resourceName: string;
            const currentBankedInfo = prev.cosmicBank[resourceType];

            switch (resourceType) {
                case 'pi':
                    currentResourceAmount = prev.incubationPower;
                    resourceName = "PI";
                    break;
                case 'et':
                    currentResourceAmount = prev.transcendentEssence;
                    resourceName = "ET";
                    break;
                case 'modularExp':
                    currentResourceAmount = prev.modularEXP;
                    resourceName = "XP Modular";
                    break;
                default:
                    return prev;
            }

            if (amountToDeposit.gt(currentResourceAmount)) {
                showMessage(`${resourceName} insuficiente para depósito.`, 2000);
                return prev;
            }

            // Calculate and add previously accrued interest before new deposit
            const timeElapsedSinceLastActivity = calculateTimeElapsed(currentBankedInfo.depositTimestamp);
            const interestEarned = calculateSimulatedInterest(
                currentBankedInfo.depositedAmount, 
                timeElapsedSinceLastActivity, 
                prev.etPermanentUpgradesData,
                prev.legendaryUpgradesData, // Pass legendary upgrades
                prev.transcendenceCount // Pass transcendence count
            );
            
            const newBankedAmountBase = currentBankedInfo.depositedAmount.plus(interestEarned);
            const finalBankedAmount = newBankedAmountBase.plus(amountToDeposit);

            let interestMessage = "";
            if (interestEarned.gt(0)) {
                interestMessage = ` (incluindo +${formatNumber(interestEarned)} ${resourceName} de juros acumulados)`;
            }

            showMessage(`${formatNumber(amountToDeposit)} ${resourceName} depositado no Banco Cósmico!${interestMessage}`, 3000);

            return {
                ...prev,
                incubationPower: resourceType === 'pi' ? prev.incubationPower.minus(amountToDeposit) : prev.incubationPower,
                transcendentEssence: resourceType === 'et' ? prev.transcendentEssence.minus(amountToDeposit) : prev.transcendentEssence,
                modularEXP: resourceType === 'modularExp' ? prev.modularEXP.minus(amountToDeposit) : prev.modularEXP,
                cosmicBank: {
                    ...prev.cosmicBank,
                    [resourceType]: {
                        depositedAmount: finalBankedAmount,
                        depositTimestamp: Date.now(), // Update timestamp after consolidating
                    }
                }
            };
        });
    }, [setGameState, showMessage]);

    const handleWithdraw = useCallback((resourceType: CosmicBankResourceType) => {
        setGameState(prev => {
            const bankedInfo = prev.cosmicBank[resourceType];
            if (bankedInfo.depositedAmount.lte(0)) {
                showMessage("Nenhum recurso para sacar.", 1500);
                return prev;
            }

            const timeElapsed = calculateTimeElapsed(bankedInfo.depositTimestamp);
            const interestEarned = calculateSimulatedInterest(
                bankedInfo.depositedAmount, 
                timeElapsed, 
                prev.etPermanentUpgradesData,
                prev.legendaryUpgradesData, // Pass legendary upgrades
                prev.transcendenceCount // Pass transcendence count
            );
            const totalToWithdraw = bankedInfo.depositedAmount.plus(interestEarned);
            let resourceName: string;

            switch (resourceType) {
                case 'pi': resourceName = "PI"; break;
                case 'et': resourceName = "ET"; break;
                case 'modularExp': resourceName = "XP Modular"; break;
                default: return prev;
            }
            
            showMessage(`${formatNumber(totalToWithdraw)} ${resourceName} (com juros simulados de +${formatNumber(interestEarned)}) sacado do Banco Cósmico!`, 3000);

            return {
                ...prev,
                incubationPower: resourceType === 'pi' ? prev.incubationPower.plus(totalToWithdraw) : prev.incubationPower,
                transcendentEssence: resourceType === 'et' ? prev.transcendentEssence.plus(totalToWithdraw) : prev.transcendentEssence,
                modularEXP: resourceType === 'modularExp' ? prev.modularEXP.plus(totalToWithdraw) : prev.modularEXP,
                cosmicBank: {
                    ...prev.cosmicBank,
                    [resourceType]: {
                        depositedAmount: new Decimal(0),
                        depositTimestamp: null,
                    }
                }
            };
        });
    }, [setGameState, showMessage]);

    return { handleDeposit, handleWithdraw };
};
