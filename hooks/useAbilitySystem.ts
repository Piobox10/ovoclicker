
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, TranscendentalBonus, EtPermanentUpgrade } from '../types'; // Added EtPermanentUpgrade
import { formatNumber, playSound } from '../utils'; // Added playSound

// Type for updateMissionProgress function
type UpdateMissionProgressFn = (metric: string, incrementValue: Decimal, associatedData?: any) => void;

export const useAbilitySystem = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void,
    updateMissionProgress: UpdateMissionProgressFn // Added parameter
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
            playSound('purchase.mp3', prev.isSoundEnabled, 0.6);


            return {
                ...prev,
                incubationPower: prev.incubationPower.minus(ability.cost),
                activeAbilitiesData: updatedAbilities,
            };
        });
    }, [setGameState, showMessage]);

    const activateAbilityHandler = useCallback((abilityId: string) => {
        setGameState(prev => {
            if (prev.orbInverseAbilitiesDisabled) {
                showMessage("Habilidades desabilitadas nesta run devido ao evento Orbe Inverso.", 2000);
                return prev;
            }

            const ability = prev.activeAbilitiesData.find(a => a.id === abilityId);
            if (!ability || !ability.purchased || ability.cooldownRemaining.gt(0)) {
                if(ability && ability.cooldownRemaining.gt(0)) showMessage("Habilidade em recarga.", 1500);
                return prev;
            }

            let newState = { ...prev };
            let effectAppliedMessage = `Habilidade "${ability.name}" ativada!`;

            if (ability.effect.instantIppsGain && ability.effect.instantIppsGain instanceof Decimal) {
                const ippsGain = newState.effectiveIpps.times(ability.effect.instantIppsGain);
                newState.incubationPower = newState.incubationPower.plus(ippsGain);
                effectAppliedMessage += ` Ganhou ${formatNumber(ippsGain)} PI instantaneamente.`;
            }
            if (ability.effect.reActivateLast && newState.lastUsedActiveAbilityId && ability.id === 'ecoCosmico') {
                const lastAbility = newState.activeAbilitiesData.find(ab => ab.id === newState.lastUsedActiveAbilityId);
                if (lastAbility) {
                     effectAppliedMessage += ` Ecoando ${lastAbility.name} com 50% de efeito (simulado).`;
                } else {
                    effectAppliedMessage += ` Não foi possível ecoar a última habilidade.`;
                }
            }

            if (ability.tempEffectDuration && ability.tempEffectDuration.gt(0)) {
                if (ability.id === 'explosaoIncubadora') newState.explosaoIncubadoraTimer = ability.tempEffectDuration;
                else if (ability.id === 'overclockCasca') newState.overclockCascaTimer = ability.tempEffectDuration;
                else if (ability.id === 'impactoCritico') newState.impactoCriticoTimer = ability.tempEffectDuration;
                else if (ability.id === 'modoFuriaIncubadora') newState.furiaIncubadoraTimer = ability.tempEffectDuration;
            }

            let effectiveCooldown = ability.cooldown.times(newState.globalAbilityCooldownMultiplier);
            
            // Apply Ovo do Tempo Condensado relic reduction
            const ovoCondensadoRelic = newState.sacredRelicsData.find(r => r.id === 'ovoDoTempoCondensado' && r.obtained);
            if (ovoCondensadoRelic) {
                effectiveCooldown = effectiveCooldown.times(0.75);
            }
            
            // Apply Despertar Psíquico cooldown reduction
            const despertarPsiquicoBonus = newState.transcendentalBonusesData.find(b => b.id === 'despertarPsiquico' && b.purchased.gt(0));
            if (despertarPsiquicoBonus && despertarPsiquicoBonus.effect.abilityCooldownReductionPerLevel) {
                const flatReduction = (despertarPsiquicoBonus.effect.abilityCooldownReductionPerLevel as Decimal).times(despertarPsiquicoBonus.purchased);
                effectiveCooldown = Decimal.max(1, effectiveCooldown.minus(flatReduction)); // Ensure cooldown is at least 1s
            }

            let setCooldownForThisAbility = true;
            // Apply Pulso Paralelo no-cooldown chance
            const pulsoParaleloUpgrade = newState.etPermanentUpgradesData.find(upg => upg.id === 'pulsoParalelo' && upg.purchased.gt(0));
            if (pulsoParaleloUpgrade && pulsoParaleloUpgrade.effect.abilityNoCooldownChancePerLevel) {
                const noCooldownChance = (pulsoParaleloUpgrade.effect.abilityNoCooldownChancePerLevel as Decimal).times(pulsoParaleloUpgrade.purchased);
                if (Math.random() < noCooldownChance.toNumber()) {
                    setCooldownForThisAbility = false;
                    effectAppliedMessage += " Pulso Paralelo ativado! Sem recarga!";
                }
            }

            // Sacred Relic: Incandescência da Fênix Primordial
            const incandescenciaRelic = newState.sacredRelicsData.find(r => r.id === 'incandescenciaDaFenixPrimordial' && r.obtained);
            if (incandescenciaRelic) {
                newState.phoenixGlowCritClicksRemaining = new Decimal(10);
                effectAppliedMessage += " Incandescência da Fênix ativada!";
            }

            const updatedAbilities = newState.activeAbilitiesData.map(a =>
                (a.id === abilityId && setCooldownForThisAbility) ? { ...a, cooldownRemaining: effectiveCooldown } : a
            );

            // Update mission progress for activating an ability
            updateMissionProgress('abilityActivated_any_thisRun', new Decimal(1));

            // Check for Forja Ressonante
            const forjaRessonanteUpgrade = newState.upgradesData.find(u => u.id === 'forjaRessonante' && u.purchased.gt(0));
            if (forjaRessonanteUpgrade) {
                newState.forjaRessonanteBuffTimer = new Decimal(5); // 5 seconds buff
                effectAppliedMessage += " Forja Ressonante ativada!";
            }

            // Check for Fusão Bioquantum
            const fusaoBioquantumUpgrade = newState.upgradesData.find(u => u.id === 'fusaoBioquantum' && u.purchased.gt(0));
            if (fusaoBioquantumUpgrade) {
                newState.fusaoBioquantumNextClickBuff = true;
                effectAppliedMessage += " Fusão Bioquantum ativada!";
            }
            
            showMessage(effectAppliedMessage, 2000);
            playSound('ability.mp3', newState.isSoundEnabled, 0.7);

            // This line needs to be inside the updater function
            if (ability.id !== 'ecoCosmico') {
                 newState.lastUsedActiveAbilityId = abilityId;
            }

            newState.activeAbilitiesData = updatedAbilities;

            return newState;
        });
    }, [setGameState, showMessage, updateMissionProgress]);

    return { buyActiveAbilityHandler, activateAbilityHandler };
};
