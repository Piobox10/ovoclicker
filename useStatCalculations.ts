
import { useEffect, useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EggStage, Trait, EggForm } from '../types';
import { EGG_STAGES, EGG_FORMS_DATA, TRAITS, FAGULHA_ESTELAR_IDLE_THRESHOLD_SECONDS, FAGULHA_ESTELAR_BONUS_MULTIPLIER, CHAMA_INVERSA_MAX_PI_FOR_BONUS, CHAMA_INVERSA_PI_CHUNK, CHAMA_INVERSA_PERCENT_PER_CHUNK } from '../constants';

export const useStatCalculations = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {
    
    const calculatedCurrentStageData = useMemo(() => EGG_STAGES[gameState.currentStageIndex] || EGG_STAGES[0], [gameState.currentStageIndex]);
    const calculatedNextStageThreshold = useMemo(() => EGG_STAGES[gameState.currentStageIndex + 1]?.threshold || null, [gameState.currentStageIndex]);

    useEffect(() => {
        setGameState(prev => {
            if (!prev) return prev;

            let baseClicksPerClick = new Decimal(2); 
            let baseIpps = new Decimal(0);

            // 1. Apply additive bonuses first
            prev.etPermanentUpgradesData.forEach(upg => {
                if (upg.purchased.gt(0) && upg.effect.clicksPerClick) {
                    baseClicksPerClick = baseClicksPerClick.plus((upg.effect.clicksPerClick as Decimal).times(upg.purchased));
                }
                if (upg.purchased.gt(0) && upg.effect.ipps) {
                    baseIpps = baseIpps.plus((upg.effect.ipps as Decimal).times(upg.purchased));
                }
            });
            prev.specialUpgradesData.forEach(upg => {
                if (upg.purchased.equals(1)) {
                    if (upg.effect.clicksPerClick) baseClicksPerClick = baseClicksPerClick.plus(upg.effect.clicksPerClick as Decimal);
                    if (upg.effect.ipps) baseIpps = baseIpps.plus(upg.effect.ipps as Decimal);
                }
            });
             prev.achievementsData.forEach(ach => {
                if (ach.unlocked && ach.bonus?.clicksPerClickAdditive) {
                    baseClicksPerClick = baseClicksPerClick.plus(ach.bonus.clicksPerClickAdditive as Decimal);
                }
            });

            // 2. Sum up IPPS from regular upgrades & apply per-incubator trait effects
            prev.upgradesData.forEach(upgrade => {
                if (upgrade.purchased.gt(0)) {
                    if (upgrade.effect.ipps) {
                        let singleIncubatorBaseIpps = upgrade.effect.ipps as Decimal;
                        
                        // Trait: Forno de Pedra
                        if (upgrade.id === 'basicIncubator' && prev.activeTraits.includes('stoneFurnace')) {
                            const trait = TRAITS.find(t => t.id === 'stoneFurnace');
                            if (trait?.effect.basicIncubatorIppsBonus) {
                               singleIncubatorBaseIpps = singleIncubatorBaseIpps.plus(trait.effect.basicIncubatorIppsBonus as Decimal);
                            }
                        }
                        // Trait: Cascas Interligadas - Bonus applies to each unit of this incubator type
                        if (prev.activeTraits.includes('linkedShells')) {
                            const trait = TRAITS.find(t => t.id === 'linkedShells');
                            if (trait?.effect.ippsPerUniqueIncubatorType) {
                                singleIncubatorBaseIpps = singleIncubatorBaseIpps.plus(
                                    (trait.effect.ippsPerUniqueIncubatorType as Decimal).times(prev.incubatorTypesOwnedThisRun.size)
                                );
                            }
                        }
                        baseIpps = baseIpps.plus(singleIncubatorBaseIpps.times(upgrade.purchased));
                    }
                    if (upgrade.effect.clicksPerClick) {
                        baseClicksPerClick = baseClicksPerClick.plus((upgrade.effect.clicksPerClick as Decimal).times(upgrade.purchased));
                    }
                }
            });
            
            // Embryo Upgrades (additive to base)
            prev.embryoUpgradesData.forEach(eUpg => {
                if (eUpg.purchased) {
                    if (eUpg.effect.ipps) baseIpps = baseIpps.plus(eUpg.effect.ipps as Decimal);
                    if (eUpg.id === 'embryoVitalPulse' && eUpg.effect.bonusPIPerEmbryoLevel) {
                        baseIpps = baseIpps.plus((eUpg.effect.bonusPIPerEmbryoLevel as Decimal).times(prev.embryoLevel));
                    }
                }
            });

            // 3. Apply Multipliers
            let clicksPerClickMultiplier = new Decimal(1);
            let ippsMultiplier = new Decimal(1);
            let globalProductionMultiplier = new Decimal(1);

            // Transcendental Bonuses
            prev.transcendentalBonusesData.forEach(bonus => {
                if (bonus.purchased.gt(0)) {
                    if (bonus.effect.clicksPerClickMultiplier) {
                        clicksPerClickMultiplier = clicksPerClickMultiplier.times(
                            (bonus.effect.clicksPerClickMultiplier as Decimal).pow(bonus.purchased)
                        );
                    }
                    if (bonus.effect.ippsMultiplier) {
                        ippsMultiplier = ippsMultiplier.times(
                            (bonus.effect.ippsMultiplier as Decimal).pow(bonus.purchased)
                        );
                    }
                }
            });

            // Special Upgrades (multipliers)
            prev.specialUpgradesData.forEach(upg => {
                if (upg.purchased.equals(1)) {
                    if (upg.effect.incubationPowerMultiplier) globalProductionMultiplier = globalProductionMultiplier.times(upg.effect.incubationPowerMultiplier as Decimal);
                    if (upg.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(upg.effect.clicksPerClickMultiplier as Decimal);
                    if (upg.effect.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(upg.effect.ippsMultiplier as Decimal);
                    if (upg.effect.globalMultiplier) globalProductionMultiplier = globalProductionMultiplier.times(upg.effect.globalMultiplier as Decimal);
                    if (upg.effect.transcendenceProductionMultiplier && prev.transcendenceCount.gt(0)) {
                        globalProductionMultiplier = globalProductionMultiplier.times((upg.effect.transcendenceProductionMultiplier as Decimal).pow(prev.transcendenceCount));
                    }
                    if (upg.effect.globalGainMultiplier) {
                        clicksPerClickMultiplier = clicksPerClickMultiplier.times(upg.effect.globalGainMultiplier as Decimal);
                        ippsMultiplier = ippsMultiplier.times(upg.effect.globalGainMultiplier as Decimal);
                    }
                }
            });

            // Achievement Bonuses
            prev.achievementsData.forEach(ach => {
                if (ach.unlocked && ach.bonus) {
                    if (ach.bonus.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(ach.bonus.clicksPerClickMultiplier as Decimal);
                    if (ach.bonus.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(ach.bonus.ippsMultiplier as Decimal);
                    if (ach.bonus.incubationPowerMultiplier) globalProductionMultiplier = globalProductionMultiplier.times(ach.bonus.incubationPowerMultiplier as Decimal);
                    const complexBonus = ach.bonus as any; // Type assertion for complex bonus structures
                    if (complexBonus.finalMultiplierBoost) {
                        clicksPerClickMultiplier = clicksPerClickMultiplier.times(complexBonus.finalMultiplierBoost as Decimal);
                        ippsMultiplier = ippsMultiplier.times(complexBonus.finalMultiplierBoost as Decimal);
                    }
                }
            });
            
            // Servo do Ovo (Night Production)
            if (prev.servoDoOvoActiveMultiplier.gt(1)) {
                globalProductionMultiplier = globalProductionMultiplier.times(prev.servoDoOvoActiveMultiplier);
            }

            // Egg Forms
            prev.activeEggFormIds.forEach(formId => {
                const form = EGG_FORMS_DATA.find(f => f.id === formId);
                if (form) {
                    if (form.activeBonus.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(form.activeBonus.clicksPerClickMultiplier as Decimal);
                    if (form.activeBonus.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(form.activeBonus.ippsMultiplier as Decimal);
                    if (form.activeBonus.idleProductionBonus && typeof form.activeBonus.idleProductionBonus === 'object' && prev.abyssalIdleBonusTime.gt(0)) {
                        const idleBonus = form.activeBonus.idleProductionBonus as { rate: Decimal; max: Decimal };
                        const bonusFromIdle = Decimal.min(idleBonus.max, prev.abyssalIdleBonusTime.times(idleBonus.rate));
                        ippsMultiplier = ippsMultiplier.times(new Decimal(1).plus(bonusFromIdle));
                    }
                    if (form.collectionBonus.incubationPowerMultiplier) {
                        globalProductionMultiplier = globalProductionMultiplier.times(form.collectionBonus.incubationPowerMultiplier as Decimal);
                    }
                }
            });

            // Traits
            let activeTraitsObjects = prev.activeTraits.map(id => TRAITS.find(t => t.id === id)).filter(Boolean) as Trait[];
            if (prev.quantumCoreActiveRandomTraitId && prev.quantumCoreActiveRandomTraitDuration.gt(0)) {
                const randomTrait = TRAITS.find(t => t.id === prev.quantumCoreActiveRandomTraitId);
                if (randomTrait) activeTraitsObjects.push(randomTrait);
            }

            activeTraitsObjects.forEach(trait => {
                if (trait.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(trait.effect.clicksPerClickMultiplier as Decimal);
                if (trait.effect.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(trait.effect.ippsMultiplier as Decimal);
                if (trait.id === 'noRushTrait' && trait.effect.passiveIppsMultiplier) ippsMultiplier = ippsMultiplier.times(trait.effect.passiveIppsMultiplier as Decimal);
                if (trait.id === 'frostShell' && trait.effect.ippsMultiplierDebuff) { // Casca Gélida IPPS debuff
                    ippsMultiplier = ippsMultiplier.times(trait.effect.ippsMultiplierDebuff as Decimal);
                }
            });
            
            // Secret Rupture Upgrades (Passive Effects)
            prev.secretRuptureUpgradesData.forEach(sru => {
                if (sru.obtained && prev.secretRuptureSystemUnlocked) {
                    if (sru.effectType === 'globalMultiplierPerTranscendence') {
                        globalProductionMultiplier = globalProductionMultiplier.times(new Decimal(1).plus(new Decimal(0.01).times(prev.transcendenceCount)));
                    }
                    if (sru.id === 'stellarSparkSecret' && prev.activeIdleTime.gte(FAGULHA_ESTELAR_IDLE_THRESHOLD_SECONDS)) {
                        ippsMultiplier = ippsMultiplier.times(new Decimal(1).plus(FAGULHA_ESTELAR_BONUS_MULTIPLIER));
                    }
                    if (sru.id === 'inverseFlame' && prev.incubationPower.lt(CHAMA_INVERSA_MAX_PI_FOR_BONUS)) {
                        const diff = CHAMA_INVERSA_MAX_PI_FOR_BONUS.minus(prev.incubationPower);
                        const bonusChunks = diff.dividedBy(CHAMA_INVERSA_PI_CHUNK).floor();
                        const bonusPercent = bonusChunks.times(CHAMA_INVERSA_PERCENT_PER_CHUNK);
                        globalProductionMultiplier = globalProductionMultiplier.times(new Decimal(1).plus(Decimal.min(1, bonusPercent))); // Cap at +100%
                    }
                }
            });

            // Temporary Buffs (from abilities or events)
            if (prev.activeTemporaryBuff && prev.activeTemporaryBuff.remainingDuration.gt(0)) {
                const buff = prev.activeTemporaryBuff;
                if (buff.effect.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(buff.effect.ippsMultiplier as Decimal);
                if (buff.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(buff.effect.clicksPerClickMultiplier as Decimal);
                if (buff.effect.globalProductionMultiplier) globalProductionMultiplier = globalProductionMultiplier.times(buff.effect.globalProductionMultiplier as Decimal);
                if (buff.id === 'curiousBuff' && buff.effect.ippsMultiplier) {
                    ippsMultiplier = ippsMultiplier.times(buff.effect.ippsMultiplier as Decimal);
                }
                 if(buff.id === 'rupturePathBuff' && buff.effect.globalProductionMultiplier){ // Ensure Rupture Path buff applies correctly
                    globalProductionMultiplier = globalProductionMultiplier.times(buff.effect.globalProductionMultiplier as Decimal);
                }
            }
            if (prev.explosaoIncubadoraTimer.gt(0)) {
                const ability = prev.activeAbilitiesData.find(a => a.id === 'explosaoIncubadora');
                if (ability?.effect.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(ability.effect.ippsMultiplier as Decimal);
            }
            if (prev.overclockCascaTimer.gt(0)) {
                const ability = prev.activeAbilitiesData.find(a => a.id === 'overclockCasca');
                if (ability?.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(ability.effect.clicksPerClickMultiplier as Decimal);
            }
            if (prev.furiaIncubadoraTimer.gt(0)) {
                const ability = prev.activeAbilitiesData.find(a => a.id === 'modoFuriaIncubadora');
                if (ability?.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(ability.effect.clicksPerClickMultiplier as Decimal);
            }

            // Apply global multiplier and transcendence bonus
            // Apply post-transcendence event global production multiplier
            globalProductionMultiplier = globalProductionMultiplier.times(prev.postTranscendenceEventGlobalProductionMultiplier);

            let effectiveClicksPerClick = baseClicksPerClick.times(clicksPerClickMultiplier).times(globalProductionMultiplier).times(prev.transcendencePassiveBonus);
            let effectiveIpps = baseIpps.times(ippsMultiplier).times(globalProductionMultiplier).times(prev.transcendencePassiveBonus);

            // Soft Caps
            if (effectiveClicksPerClick.gt(prev.softCapThresholdCPC)) {
                const excessCPC = effectiveClicksPerClick.minus(prev.softCapThresholdCPC);
                effectiveClicksPerClick = prev.softCapThresholdCPC.plus(excessCPC.pow(prev.softCapScalingFactor));
            }
            if (effectiveIpps.gt(prev.softCapThresholdIPPS)) {
                const excessIPPS = effectiveIpps.minus(prev.softCapThresholdIPPS);
                effectiveIpps = prev.softCapThresholdIPPS.plus(excessIPPS.pow(prev.softCapScalingFactor));
            }
            
            // Critical Chance Calculation
            let baseCritChance = new Decimal(0.05); // Base 5%
            prev.achievementsData.forEach(ach => {
                if (ach.unlocked && ach.bonus?.criticalChanceAdditive) {
                    baseCritChance = baseCritChance.plus(ach.bonus.criticalChanceAdditive as Decimal);
                }
            });
            prev.embryoUpgradesData.forEach(eUpg => {
                if(eUpg.purchased && eUpg.effect.criticalChanceAdditive) {
                    baseCritChance = baseCritChance.plus(eUpg.effect.criticalChanceAdditive as Decimal);
                }
            });
            const effectiveCriticalClickChance = Decimal.min(1, baseCritChance); // Cap at 100%

            const newCurrentStageData = EGG_STAGES[prev.currentStageIndex] || EGG_STAGES[0];
            const newNextStageThreshold = EGG_STAGES[prev.currentStageIndex + 1]?.threshold || null;

            if (
                !effectiveClicksPerClick.equals(prev.effectiveClicksPerClick) ||
                !effectiveIpps.equals(prev.effectiveIpps) ||
                !effectiveCriticalClickChance.equals(prev.effectiveCriticalClickChance) ||
                newCurrentStageData.name !== prev.currentStageData.name ||
                (newNextStageThreshold === null && prev.nextStageThreshold !== null) ||
                (newNextStageThreshold !== null && prev.nextStageThreshold === null) ||
                (newNextStageThreshold !== null && prev.nextStageThreshold !== null && !newNextStageThreshold.equals(prev.nextStageThreshold))
            ) {
                return {
                    ...prev,
                    effectiveClicksPerClick,
                    effectiveIpps,
                    effectiveCriticalClickChance,
                    currentStageData: newCurrentStageData,
                    nextStageThreshold: newNextStageThreshold,
                };
            }

            return prev; 
        });
    }, [ // Comprehensive dependency array
        gameState.clicksPerClick, gameState.ipps, gameState.upgradesData, gameState.transcendentalBonusesData,
        gameState.specialUpgradesData, gameState.achievementsData, gameState.activeEggFormIds, gameState.activeTraits,
        gameState.transcendencePassiveBonus, gameState.transcendenceCount,
        gameState.activeTemporaryBuff, gameState.explosaoIncubadoraTimer, gameState.overclockCascaTimer,
        gameState.furiaIncubadoraTimer, gameState.impactoCriticoTimer,
        gameState.servoDoOvoActiveMultiplier, 
        gameState.softCapThresholdCPC, gameState.softCapThresholdIPPS, gameState.softCapScalingFactor,
        gameState.currentStageIndex,
        gameState.embryoUpgradesData, gameState.embryoLevel,
        gameState.secretRuptureUpgradesData, gameState.secretRuptureSystemUnlocked, gameState.activeIdleTime, gameState.incubationPower,
        gameState.incubatorTypesOwnedThisRun, gameState.totalRunsTranscended,
        gameState.quantumCoreActiveRandomTraitId, gameState.quantumCoreActiveRandomTraitDuration,
        gameState.postTranscendenceEventGlobalProductionMultiplier, // Added new flag
        setGameState 
    ]);

    return { currentStageData: calculatedCurrentStageData, nextStageThreshold: calculatedNextStageThreshold };
};
