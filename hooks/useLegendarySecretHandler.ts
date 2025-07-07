
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../types';
import { TITHE_RITUAL_COOLDOWN_MS, TITHE_RITUAL_SACRIFICE_PERCENTAGE, LEAD_KEY_COOLDOWN_MS, TRAITS } from '../constants';
import { formatNumber } from '../utils';

export const useLegendarySecretHandler = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const handleActivateLegendaryUpgrade = useCallback((upgradeId: string) => {
        setGameState(prev => {
            const legendaryUpgrade = prev.legendaryUpgradesData.find(lu => lu.id === upgradeId);
            if (!legendaryUpgrade || !legendaryUpgrade.unlockedSystem || legendaryUpgrade.activated) {
                return prev;
            }
            // Check for specific conditions if any, e.g., only one legendary active at a time
            // For now, allow activating if available
            const updatedLegendaryUpgrades = prev.legendaryUpgradesData.map(lu => 
                lu.id === upgradeId ? { ...lu, activated: true } : lu
            );
            showMessage(`Relíquia Lendária "${legendaryUpgrade.name}" ativada!`, 2500);
            return { ...prev, legendaryUpgradesData: updatedLegendaryUpgrades };
        });
    }, [setGameState, showMessage]);

    const handleLeadKeyClick = useCallback(() => {
        setGameState(prev => {
            const leadKeyUpgrade = prev.secretRuptureUpgradesData.find(sru => sru.id === 'leadKey' && sru.obtained);
            if (!leadKeyUpgrade) return prev;

            if (Date.now() - prev.lastLeadKeyClickTimestamp < LEAD_KEY_COOLDOWN_MS) {
                showMessage("Chave de Chumbo ainda recarregando.", 2000);
                return prev;
            }
            showMessage("Chave de Chumbo usada! +1 Ovo Temporário.", 2500);
            return {
                ...prev,
                temporaryEggs: prev.temporaryEggs.plus(1),
                lastLeadKeyClickTimestamp: Date.now(),
            };
        });
    }, [setGameState, showMessage]);

    const handleTitheRitualClick = useCallback(() => {
        setGameState(prev => {
            const titheRitualUpgrade = prev.secretRuptureUpgradesData.find(sru => sru.id === 'titheRitual' && sru.obtained);
            if (!titheRitualUpgrade) return prev;

            if (Date.now() - prev.lastTitheRitualTimestamp < TITHE_RITUAL_COOLDOWN_MS) {
                showMessage("Ritual do Dízimo ainda recarregando.", 2000);
                return prev;
            }

            let totalLevelsSacrificed = new Decimal(0);
            const sacrificedUpgradesData = prev.upgradesData.map(upg => {
                const levelsToSacrifice = upg.purchased.times(TITHE_RITUAL_SACRIFICE_PERCENTAGE).floor();
                if (levelsToSacrifice.gt(0)) {
                    totalLevelsSacrificed = totalLevelsSacrificed.plus(levelsToSacrifice);
                    return { ...upg, purchased: upg.purchased.minus(levelsToSacrifice) };
                }
                return upg;
            });

            if (totalLevelsSacrificed.isZero()) {
                showMessage("Nenhum nível de melhoria para sacrificar.", 2000);
                return prev;
            }
            
            showMessage(`Ritual do Dízimo realizado! Sacrificou ${formatNumber(totalLevelsSacrificed)} níveis de melhorias. +1 Ovo Temporário.`, 3000);
            return {
                ...prev,
                upgradesData: sacrificedUpgradesData,
                temporaryEggs: prev.temporaryEggs.plus(1),
                lastTitheRitualTimestamp: Date.now(),
            };
        });
    }, [setGameState, showMessage]);
    
    // Call this when 'The Last Trait' secret upgrade is obtained
    const grantRandomExtraTrait = useCallback(() => {
        setGameState(prev => {
            const availableTraits = TRAITS.filter(t => !prev.unlockedTraits.includes(t.id) && !prev.activeTraits.includes(t.id));
            if (availableTraits.length > 0) {
                const randomTrait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
                showMessage(`O Último Traço concedeu: ${randomTrait.name}! Ele está ativo.`, 3000);
                // This logic bypasses normal trait selection and max trait limits for this specific upgrade
                return {
                    ...prev,
                    unlockedTraits: [...new Set([...prev.unlockedTraits, randomTrait.id])],
                    activeTraits: [...new Set([...prev.activeTraits, randomTrait.id])] 
                    // Note: This could exceed maxActiveTraits, which is the point of this secret.
                };
            } else {
                showMessage("O Último Traço não encontrou novos traços para conceder.", 2000);
            }
            return prev;
        });
    }, [setGameState, showMessage]);


    return { handleActivateLegendaryUpgrade, handleLeadKeyClick, handleTitheRitualClick, grantRandomExtraTrait };
};
