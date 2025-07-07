
import { useEffect, useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EggStage, Trait, EggForm, RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade } from '../types';
import { EGG_STAGES, EGG_FORMS_DATA, TRAITS, REEXPORT_SECRET_TRAIT_AUTOPHAGY as SECRET_TRAIT_AUTOPHAGY } from '../constants';

export const useStatCalculations = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {
    
    const calculatedCurrentStageData = useMemo(() => EGG_STAGES[gameState.currentStageIndex] || EGG_STAGES[0], [gameState.currentStageIndex]);
    const calculatedNextStageThreshold = useMemo(() => EGG_STAGES[gameState.currentStageIndex + 1]?.threshold || null, [gameState.currentStageIndex]);

    useEffect(() => {
        setGameState(prev => {
            if (!prev) return prev;

            // --- Calculation Start ---

            // 1. Base Values
            let baseClicksPerClick = new Decimal(2); 
            let baseIpps = new Decimal(0);
            let globalAbilityCooldownMultiplier = new Decimal(1);

            // 2. Additive Bonuses (from permanent sources)
            prev.upgradesData.forEach(upgrade => {
                if (upgrade.purchased.gt(0)) {
                    if (upgrade.effect.ipps) baseIpps = baseIpps.plus(upgrade.effect.ipps.times(upgrade.purchased));
                    if (upgrade.effect.clicksPerClick) baseClicksPerClick = baseClicksPerClick.plus(upgrade.effect.clicksPerClick.times(upgrade.purchased));
                }
            });

            prev.specialUpgradesData.forEach(upg => {
                if (upg.purchased.equals(1)) {
                    if (upg.effect.clicksPerClick) baseClicksPerClick = baseClicksPerClick.plus(upg.effect.clicksPerClick as Decimal);
                    if (upg.effect.ipps) baseIpps = baseIpps.plus(upg.effect.ipps as Decimal);
                }
            });
            
            prev.embryoUpgradesData.forEach(eUpg => {
                if (eUpg.purchased.gt(0)) { 
                    if (eUpg.effect.ipps) baseIpps = baseIpps.plus(eUpg.effect.ipps as Decimal);
                    if (eUpg.id === 'embryoVitalPulse' && eUpg.effect.bonusPIPerEmbryoLevel) {
                        baseIpps = baseIpps.plus((eUpg.effect.bonusPIPerEmbryoLevel as Decimal).times(prev.embryoLevel));
                    }
                }
            });

            // Add embryo's own contribution to base values before multipliers
            baseClicksPerClick = baseClicksPerClick.plus(prev.embryoEffectiveStats.embryoClicksPerClick || 0);
            baseIpps = baseIpps.plus(prev.embryoEffectiveStats.embryoIpps || 0);

            // 3. Multiplicative Bonuses
            let clicksPerClickMultiplier = new Decimal(1);
            let ippsMultiplier = new Decimal(1);
            let globalProductionMultiplier = new Decimal(1);

            // Traits
            const allActiveTraits: Trait[] = [...prev.activeTraits, prev.quantumCoreActiveRandomTraitId]
                .map(id => TRAITS.find(t => t.id === id))
                .filter((t): t is Trait => !!t);

            allActiveTraits.forEach(trait => {
                if (trait.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(trait.effect.clicksPerClickMultiplier as Decimal);
                if (trait.effect.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(trait.effect.ippsMultiplier as Decimal);
                if (trait.effect.passiveIppsMultiplier) ippsMultiplier = ippsMultiplier.times(trait.effect.passiveIppsMultiplier as Decimal);
                if (trait.effect.ippsMultiplierDebuff) ippsMultiplier = ippsMultiplier.times(trait.effect.ippsMultiplierDebuff as Decimal);
            });
            
            // Trait: Autofagia (Special case)
            const autophagyTrait = allActiveTraits.find(t => t.id === SECRET_TRAIT_AUTOPHAGY.id);
            if (autophagyTrait && prev.embryoEffectiveStats.maxHp.gt(0)) {
                const missingHpPercent = prev.embryoEffectiveStats.maxHp.minus(prev.embryoEffectiveStats.currentHp).div(prev.embryoEffectiveStats.maxHp).times(100);
                const ippsBonus = Decimal.min(
                    (autophagyTrait.effect.maxIppsBonusFromAutophagy as Decimal), 
                    missingHpPercent.times(autophagyTrait.effect.ippsBonusPerMissingHpPercent as Decimal)
                );
                ippsMultiplier = ippsMultiplier.plus(ippsBonus);
            }

            // Get the amplification multiplier once
            const amplificacaoMultiplier = prev.specialUpgradesData
                .find(su => su.id === 'stage25Bonus' && su.purchased.equals(1))
                ?.effect.activeEggFormBonusMultiplier as Decimal | undefined || new Decimal(1);

            // Active Egg Forms
            prev.activeEggFormIds.forEach(formId => {
                const form = EGG_FORMS_DATA.find(f => f.id === formId);
                if(form) {
                    if(form.activeBonus.clicksPerClickMultiplier) {
                        const bonus = (form.activeBonus.clicksPerClickMultiplier as Decimal).minus(1);
                        clicksPerClickMultiplier = clicksPerClickMultiplier.times(new Decimal(1).plus(bonus.times(amplificacaoMultiplier)));
                    }
                    if(form.activeBonus.ippsMultiplier) {
                         const bonus = (form.activeBonus.ippsMultiplier as Decimal).minus(1);
                         ippsMultiplier = ippsMultiplier.times(new Decimal(1).plus(bonus.times(amplificacaoMultiplier)));
                    }
                    if(form.activeBonus.incubationPowerMultiplier) {
                        const bonus = (form.activeBonus.incubationPowerMultiplier as Decimal).minus(1);
                        globalProductionMultiplier = globalProductionMultiplier.times(new Decimal(1).plus(bonus.times(amplificacaoMultiplier)));
                    }
                    if(form.activeBonus.globalAbilityCooldownReduction) {
                         const reduction = (form.activeBonus.globalAbilityCooldownReduction as Decimal).times(amplificacaoMultiplier);
                         globalAbilityCooldownMultiplier = globalAbilityCooldownMultiplier.times(new Decimal(1).minus(reduction));
                    }
                    // Abyssal Egg bonus calculation
                    if (form.id === 'abyssalEgg' && typeof form.activeBonus.idleProductionBonus === 'object') {
                        const idleBonusConf = form.activeBonus.idleProductionBonus as { rate: Decimal; max: Decimal };
                        const bonusFromAbyssal = Decimal.min(idleBonusConf.max, prev.abyssalIdleBonusTime.times(idleBonusConf.rate));
                        ippsMultiplier = ippsMultiplier.plus(bonusFromAbyssal);
                    }
                }
            });
            
            // Achievements
            prev.achievementsData.forEach(ach => {
                if (ach.unlocked && ach.bonus) {
                    if (ach.bonus.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(ach.bonus.clicksPerClickMultiplier as Decimal);
                    if (ach.bonus.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(ach.bonus.ippsMultiplier as Decimal);
                    if (ach.bonus.incubationPowerMultiplier) globalProductionMultiplier = globalProductionMultiplier.times(ach.bonus.incubationPowerMultiplier as Decimal);
                }
            });
            
            // Transcendental Bonuses (They are additive to the multiplier)
            prev.transcendentalBonusesData.forEach(bonus => {
                if (bonus.purchased.gt(0)) {
                    const purchasedCount = bonus.purchased;
                    if (bonus.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.plus((bonus.effect.clicksPerClickMultiplier as Decimal).times(purchasedCount));
                    if (bonus.effect.ippsMultiplier) ippsMultiplier = ippsMultiplier.plus((bonus.effect.ippsMultiplier as Decimal).times(purchasedCount));
                    if (bonus.effect.incubationPowerMultiplier) globalProductionMultiplier = globalProductionMultiplier.plus((bonus.effect.incubationPowerMultiplier as Decimal).times(purchasedCount));
                }
            });
            
            // Special Upgrades (multiplicative part)
             prev.specialUpgradesData.forEach(upg => {
                if (upg.purchased.equals(1)) {
                   if (upg.effect.incubationPowerMultiplier) globalProductionMultiplier = globalProductionMultiplier.times(upg.effect.incubationPowerMultiplier as Decimal);
                   if (upg.effect.clicksPerClickMultiplier) clicksPerClickMultiplier = clicksPerClickMultiplier.times(upg.effect.clicksPerClickMultiplier as Decimal);
                   if (upg.effect.ippsMultiplier) ippsMultiplier = ippsMultiplier.times(upg.effect.ippsMultiplier as Decimal);
                   if (upg.effect.globalAbilityCooldownMultiplierReduction) globalAbilityCooldownMultiplier = globalAbilityCooldownMultiplier.times(new Decimal(1).minus(upg.effect.globalAbilityCooldownMultiplierReduction as Decimal));
                }
             });

            // Global Transcendence Bonus
            globalProductionMultiplier = globalProductionMultiplier.times(prev.transcendencePassiveBonus);
            
            // Sacred Relics Multipliers
            if (prev.perfectCycleBuffTimer.gt(0)) globalProductionMultiplier = globalProductionMultiplier.times(5);
            if (prev.stagnantTimeBuffTimer.gt(0)) ippsMultiplier = ippsMultiplier.times(4); // +300%
            const coroaRelic = prev.sacredRelicsData.find(r => r.id === 'coroaDaCascaLendaria' && r.obtained);
            if (coroaRelic) {
                const purchasedSpecialUpgradesCount = prev.specialUpgradesData.filter(su => su.purchased.eq(1)).length;
                globalProductionMultiplier = globalProductionMultiplier.times(new Decimal(1.1).pow(purchasedSpecialUpgradesCount));
            }
            if (prev.sacredRelicsData.some(r => r.id === 'eloGeneticoRecorrente' && r.obtained)) {
                ippsMultiplier = ippsMultiplier.times(prev.eloGeneticoBonusMultiplier);
            }

            // Imortalidade de PI bonus
            if (prev.imortalidadePIBonus && prev.imortalidadePIBonus.gt(0)) {
                ippsMultiplier = ippsMultiplier.plus(prev.imortalidadePIBonus);
            }

            // Apply active temporary buffs
            let tempBuffGlobalMultiplier = new Decimal(1);
            prev.activeTemporaryBuffs.forEach(buff => {
                if (buff.effect.globalProductionMultiplier) {
                    tempBuffGlobalMultiplier = tempBuffGlobalMultiplier.times(buff.effect.globalProductionMultiplier as Decimal);
                }
                if (buff.effect.clicksPerClickMultiplierBonus) {
                    clicksPerClickMultiplier = clicksPerClickMultiplier.plus(buff.effect.clicksPerClickMultiplierBonus as Decimal);
                }
                if (buff.effect.ippsMultiplierBonus) {
                    ippsMultiplier = ippsMultiplier.plus(buff.effect.ippsMultiplierBonus as Decimal);
                }
            });
            globalProductionMultiplier = globalProductionMultiplier.times(tempBuffGlobalMultiplier);


            // Ability Timers
            if (prev.explosaoIncubadoraTimer.gt(0)) ippsMultiplier = ippsMultiplier.times(2); 
            if (prev.overclockCascaTimer.gt(0)) clicksPerClickMultiplier = clicksPerClickMultiplier.times(2); 
            if (prev.furiaIncubadoraTimer.gt(0)) {
                clicksPerClickMultiplier = clicksPerClickMultiplier.times(4);
                ippsMultiplier = new Decimal(0);
            }
            
            // Buffs from regular upgrades
            if (prev.forjaRessonanteBuffTimer.gt(0)) ippsMultiplier = ippsMultiplier.times(2);
            if (prev.esporoIncandescenteBuffTimer.gt(0)) globalProductionMultiplier = globalProductionMultiplier.times(1.1);

            // Visão Fractal buff
            if (prev.visaoFractalBuffTimer && prev.visaoFractalBuffTimer.gt(0)) {
                ippsMultiplier = ippsMultiplier.times(2); 
            }
            
            // Coração da Fúria
            if (prev.furyPassiveBonusAmount.gt(0)) ippsMultiplier = ippsMultiplier.plus(prev.furyPassiveBonusAmount);
            
            // Distorção Recorrente
            if (prev.distorcaoRecorrenteTimer.gt(0) && prev.distorcaoRecorrenteStacks.gt(0)) {
                const distorcaoBonus = new Decimal(1).plus(prev.distorcaoRecorrenteStacks.times(0.01));
                ippsMultiplier = ippsMultiplier.times(distorcaoBonus);
            }


            // 4. Final calculations
            let finalClicksPerClick = baseClicksPerClick.times(clicksPerClickMultiplier).times(globalProductionMultiplier);
            let finalIpps = baseIpps.times(ippsMultiplier).times(globalProductionMultiplier);
            
            // 5. Check and advance egg stage
            let newStageIndex = prev.currentStageIndex;
            while(EGG_STAGES[newStageIndex + 1] && prev.incubationPower.gte(EGG_STAGES[newStageIndex + 1].threshold)) {
                newStageIndex++;
            }

            const newCurrentStageData = EGG_STAGES[newStageIndex] || EGG_STAGES[0];
            const newNextStageThreshold = EGG_STAGES[newStageIndex + 1]?.threshold || null;

            // --- Update State ---
            if (
                !finalClicksPerClick.equals(prev.effectiveClicksPerClick) ||
                !finalIpps.equals(prev.effectiveIpps) ||
                newStageIndex !== prev.currentStageIndex ||
                !prev.maxIncubationPowerAchieved.equals(Decimal.max(prev.incubationPower, prev.maxIncubationPowerAchieved)) ||
                !globalAbilityCooldownMultiplier.equals(prev.globalAbilityCooldownMultiplier)
            ) {
                 return {
                    ...prev,
                    effectiveClicksPerClick: finalClicksPerClick,
                    effectiveIpps: finalIpps,
                    currentStageIndex: newStageIndex,
                    currentStageData: newCurrentStageData,
                    nextStageThreshold: newNextStageThreshold,
                    maxIncubationPowerAchieved: Decimal.max(prev.incubationPower, prev.maxIncubationPowerAchieved),
                    globalAbilityCooldownMultiplier: globalAbilityCooldownMultiplier,
                 };
            }
            return prev;
        });
    }, [gameState.transcendenceCount, gameState.activeTraits, gameState.incubationPower, gameState.transcendentalBonusesData, gameState.specialUpgradesData, gameState.achievementsData, gameState.activeEggFormIds, gameState.upgradesData, gameState.etPermanentUpgradesData, gameState.maxIncubationPowerAchieved, gameState.currentStageIndex, gameState.embryoLevel, gameState.embryoUpgradesData, gameState.plasmaPulseClickCounter, gameState.quantumCoreActiveRandomTraitId, gameState.orbInverseGlobalPIProductionMultiplier, gameState.entropySeedGlobalPIProductionDebuff, gameState.entropySeedPassiveProductionBuff, gameState.dualCoreUpgradeCostMultiplier, gameState.activeTemporaryBuffs, gameState.explosaoIncubadoraTimer, gameState.overclockCascaTimer, gameState.furiaIncubadoraTimer, gameState.curiosoTimer, gameState.forjaRessonanteBuffTimer, gameState.esporoIncandescenteBuffTimer, gameState.furyPassiveBonusAmount, gameState.sacredRelicsData, gameState.perfectCycleBuffTimer, gameState.stagnantTimeBuffTimer, gameState.eloGeneticoBonusMultiplier, gameState.embryoEffectiveStats, gameState.distorcaoRecorrenteTimer, gameState.distorcaoRecorrenteStacks, gameState.abyssalIdleBonusTime, gameState.imortalidadePIBonus, gameState.visaoFractalBuffTimer, setGameState]);

    return {
        currentStageData: calculatedCurrentStageData,
        nextStageThreshold: calculatedNextStageThreshold,
    };
};
