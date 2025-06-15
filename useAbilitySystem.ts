import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../types';
import { formatNumber } from '../utils';

export const useAbilitySystem = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const buyActiveAbilityHandler = useCallback((abilityId: string) => {
        setGameState(prev => {
            const ability = prev.activeAbilitiesData.find(a => a.id === abilityId);
            if (!ability || ability.purchased) {
                if(ability?.purchased) showMessage("Habilidade já comprada.", 1500);
                return prev;
            }

            if (prev.incubationPower.lessThan(ability.cost)) {
                showMessage("PI insuficiente para comprar habilidade.", 1500);
                return prev;
            }

            const updatedAbilities = prev.activeAbilitiesData.map(a =>
                a.id === abilityId ? { ...a, purchased: true } : a
            );
            
            showMessage(`Habilidade "${ability.name}" comprada!`, 2000);
            return {
                ...prev,
                incubationPower: prev.incubationPower.minus(ability.cost),
                activeAbilitiesData: updatedAbilities,
            };
        });
    }, [setGameState, showMessage]);

    const activateAbilityHandler = useCallback((abilityId: string) => {
        setGameState(prev => {
            const ability = prev.activeAbilitiesData.find(a => a.id === abilityId);
            if (!ability || !ability.purchased || ability.cooldownRemaining.gt(0)) {
                if(ability && ability.cooldownRemaining.gt(0)) showMessage("Habilidade em recarga.", 1500);
                return prev;
            }

            let newState = { ...prev };
            let effectAppliedMessage = `Habilidade "${ability.name}" ativada!`;

            // Apply direct effects and start timers for temporary effects
            if (ability.effect.instantIppsGain && ability.effect.instantIppsGain instanceof Decimal) {
                const ippsGain = newState.effectiveIpps.times(ability.effect.instantIppsGain);
                newState.incubationPower = newState.incubationPower.plus(ippsGain);
                effectAppliedMessage += ` Ganhou ${formatNumber(ippsGain)} PI instantaneamente.`;
            }
            if (ability.effect.reActivateLast && newState.lastUsedActiveAbilityId && ability.id === 'ecoCosmico') {
                // Simplified: Re-triggering would require more complex state management or calling activateAbility again
                // For now, just a message. Full re-activation is complex.
                const lastAbility = newState.activeAbilitiesData.find(ab => ab.id === newState.lastUsedActiveAbilityId);
                if (lastAbility) {
                     effectAppliedMessage += ` Ecoando ${lastAbility.name} com 50% de efeito (simulado).`;
                } else {
                    effectAppliedMessage += ` Não foi possível ecoar a última habilidade.`;
                }
            }


            // Set timers for temporary effects
            if (ability.tempEffectDuration && ability.tempEffectDuration.gt(0)) {
                if (ability.id === 'explosaoIncubadora') newState.explosaoIncubadoraTimer = ability.tempEffectDuration;
                else if (ability.id === 'overclockCasca') newState.overclockCascaTimer = ability.tempEffectDuration;
                else if (ability.id === 'impactoCritico') newState.impactoCriticoTimer = ability.tempEffectDuration;
                else if (ability.id === 'modoFuriaIncubadora') newState.furiaIncubadoraTimer = ability.tempEffectDuration;
                // Add other temp effects here
            }

            const effectiveCooldown = ability.cooldown.times(newState.globalAbilityCooldownMultiplier);
            const updatedAbilities = newState.activeAbilitiesData.map(a =>
                a.id === abilityId ? { ...a, cooldownRemaining: effectiveCooldown } : a
            );

            showMessage(effectAppliedMessage, 2500);
            return {
                ...newState,
                activeAbilitiesData: updatedAbilities,
                lastUsedActiveAbilityId: abilityId !== 'ecoCosmico' ? abilityId : newState.lastUsedActiveAbilityId, // Don't set ecoCosmico as last used for itself
            };
        });
    }, [setGameState, showMessage]);

    return { buyActiveAbilityHandler, activateAbilityHandler };
};
