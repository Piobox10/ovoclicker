
import { useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, SerializableGameState, SerializableEmbryoStats, SerializableEmbryoItem, EmbryoStats, EmbryoItem, EmbryoEquipmentSlotKey } from '../types'; // Added EmbryoEquipmentSlotKey
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, LegendaryUpgrade, SecretRuptureUpgradeParams, SerializableSecretRuptureUpgradeParams, SerializableSecretRuptureUpgrade } from '../types';
import { Enemy } from '../types';
import { EmbryoUpgrade } from '../types';
import { GAME_SAVE_KEY } from '../constants';

const serializeEmbryoStats = (stats: EmbryoStats): SerializableEmbryoStats => ({
    currentHp: stats.currentHp.toString(),
    maxHp: stats.maxHp.toString(),
    attack: stats.attack.toString(),
    defense: stats.defense.toString(),
    speed: stats.speed.toString(),
    critChance: stats.critChance.toString(),
    poisonChance: stats.poisonChance.toString(),
    bossDamageBonus: stats.bossDamageBonus.toString(),
    doubleHitChance: stats.doubleHitChance.toString(),
    lifestealRate: stats.lifestealRate.toString(),
    chaosEffectChance: stats.chaosEffectChance.toString(),
    // New Defensive Stats
    enemyDelayChance: stats.enemyDelayChance.toString(),
    damageReflection: stats.damageReflection.toString(),
    critResistance: stats.critResistance.toString(),
    periodicShieldValue: stats.periodicShieldValue.toString(),
    dodgeChance: stats.dodgeChance.toString(),
    overallDamageReduction: stats.overallDamageReduction.toString(),
    hpRegenPerInterval: stats.hpRegenPerInterval.toString(),
});

const serializeEmbryoItem = (item: EmbryoItem): SerializableEmbryoItem => ({
    ...item,
    cost: {
        currency: item.cost.currency,
        amount: item.cost.amount.toString(),
    },
    effects: item.effects.map(eff => ({
        ...eff,
        value: eff.value.toString(),
    })),
});


export const useAutoSave = (gameState: GameState) => {
    useEffect(() => {
        const saveInterval = setInterval(() => {
            const serializableState: SerializableGameState = {
                ...gameState,
                incubationPower: gameState.incubationPower.toString(),
                temporaryEggs: gameState.temporaryEggs.toString(),
                clicksPerClick: gameState.clicksPerClick.toString(),
                ipps: gameState.ipps.toString(),
                effectiveClicksPerClick: gameState.effectiveClicksPerClick.toString(),
                effectiveIpps: gameState.effectiveIpps.toString(),
                transcendentEssence: gameState.transcendentEssence.toString(),
                maxIncubationPowerAchieved: gameState.maxIncubationPowerAchieved.toString(),
                totalClicksEver: gameState.totalClicksEver.toString(),
                totalClicksThisRun: gameState.totalClicksThisRun.toString(),
                transcendenceCount: gameState.transcendenceCount.toString(),
                transcendencePassiveBonus: gameState.transcendencePassiveBonus.toString(),
                offlineIncubationRate: gameState.offlineIncubationRate.toString(),
                activeIdleTime: gameState.activeIdleTime.toString(),
                abyssalIdleBonusTime: gameState.abyssalIdleBonusTime.toString(),
                transcendenceThreshold: gameState.transcendenceThreshold.toString(),
                essencePerPI: gameState.essencePerPI.toString(),
                finalEggThreshold: gameState.finalEggThreshold.toString(),
                goldenBlessingMultiplier: gameState.goldenBlessingMultiplier.toString(),
                criticalClickChance: gameState.criticalClickChance.toString(),
                effectiveCriticalClickChance: gameState.effectiveCriticalClickChance.toString(),
                softCapThresholdCPC: gameState.softCapThresholdCPC.toString(),
                softCapThresholdIPPS: gameState.softCapThresholdIPPS.toString(),
                softCapScalingFactor: gameState.softCapScalingFactor.toString(),
                transcendenceSpamPenaltyDuration: gameState.transcendenceSpamPenaltyDuration.toString(),
                explosaoIncubadoraTimer: gameState.explosaoIncubadoraTimer.toString(),
                overclockCascaTimer: gameState.overclockCascaTimer.toString(),
                impactoCriticoTimer: gameState.impactoCriticoTimer.toString(),
                furiaIncubadoraTimer: gameState.furiaIncubadoraTimer.toString(),
                curiosoTimer: gameState.curiosoTimer.toString(),
                activeTemporaryBuff: gameState.activeTemporaryBuff ? { ...gameState.activeTemporaryBuff, remainingDuration: gameState.activeTemporaryBuff.remainingDuration.toString(), effect: Object.fromEntries(Object.entries(gameState.activeTemporaryBuff.effect).map(([k,v]) => [k, typeof v === 'boolean' || typeof v === 'string' ? v : (v as Decimal).toString()])) } : null,
                totalUpgradesPurchasedEver: gameState.totalUpgradesPurchasedEver.toString(),
                activePlayTime: gameState.activePlayTime.toString(),
                globalAbilityCooldownMultiplier: gameState.globalAbilityCooldownMultiplier.toString(),
                servoDoOvoActiveMultiplier: gameState.servoDoOvoActiveMultiplier.toString(),
                mestreDaEvolucaoBonus: gameState.mestreDaEvolucaoBonus.toString(),
                secretRuptureSystemUnlocked: gameState.secretRuptureSystemUnlocked.toString(),

                // New Trait Field Serialization
                plasmaPulseClickCounter: gameState.plasmaPulseClickCounter.toString(),
                rupturePathChoicesCount: gameState.rupturePathChoicesCount.toString(),
                runsWithFiveDifferentTraitsCount: gameState.runsWithFiveDifferentTraitsCount.toString(),
                incubatorTypesOwnedThisRun: Array.from(gameState.incubatorTypesOwnedThisRun),
                totalRunsTranscended: gameState.totalRunsTranscended.toString(),
                uniqueEnemiesDefeatedThisRunByEmbryo: Array.from(gameState.uniqueEnemiesDefeatedThisRunByEmbryo),
                embryoLevel10ReachedCount: gameState.embryoLevel10ReachedCount.toString(),
                quantumCoreActiveRandomTraitDuration: gameState.quantumCoreActiveRandomTraitDuration.toString(),
                quantumCoreInternalCooldown: gameState.quantumCoreInternalCooldown.toString(),

                // New Post-Transcendence Event Flags
                postTranscendenceEventUpgradeCostMultiplier: gameState.postTranscendenceEventUpgradeCostMultiplier.toString(),
                postTranscendenceEventGlobalProductionMultiplier: gameState.postTranscendenceEventGlobalProductionMultiplier.toString(),
                // areEmbryoUpgradesDisabledThisRun is boolean, fine
                postTranscendenceEventEnemyEXPMultiplier: gameState.postTranscendenceEventEnemyEXPMultiplier.toString(),

                upgradesData: gameState.upgradesData.map(u => ({ ...u, baseCost: u.baseCost.toString(), costMultiplier: u.costMultiplier.toString(), effect: Object.fromEntries(Object.entries(u.effect).map(([k,v]) => [k, typeof v === 'boolean' ? v : (v as Decimal).toString()])), purchased: u.purchased.toString() })),
                transcendentalBonusesData: gameState.transcendentalBonusesData.map(b => ({ ...b, baseCost: b.baseCost.toString(), costMultiplier: b.costMultiplier.toString(), effect: Object.fromEntries(Object.entries(b.effect).map(([k,v]) => [k, typeof v === 'boolean' ? v : (v as Decimal).toString()])), purchased: b.purchased.toString() })),
                etPermanentUpgradesData: gameState.etPermanentUpgradesData.map(epu => ({...epu, baseCost: epu.baseCost.toString(), costMultiplier: epu.costMultiplier.toString(), effect: Object.fromEntries(Object.entries(epu.effect).map(([k,v]) => [k, typeof v === 'boolean' ? v : (v as Decimal).toString()])), purchased: epu.purchased.toString(), maxLevel: epu.maxLevel?.toString() })),
                specialUpgradesData: gameState.specialUpgradesData.map(su => ({ ...su, effect: Object.fromEntries(Object.entries(su.effect).map(([k,v]) => [k, typeof v === 'boolean' ? v : (v as Decimal).toString()])), purchased: su.purchased.toString() })),
                activeAbilitiesData: gameState.activeAbilitiesData.map(aa => ({ ...aa, cost: aa.cost.toString(), cooldown: aa.cooldown.toString(), cooldownRemaining: aa.cooldownRemaining.toString(), tempEffectDuration: aa.tempEffectDuration?.toString(), effect: Object.fromEntries(Object.entries(aa.effect).map(([k,v]) => [k, typeof v === 'boolean' ? v : (v as Decimal).toString()])) })),
                legendaryUpgradesData: gameState.legendaryUpgradesData.map(lu => ({ ...lu, effect: Object.fromEntries(Object.entries(lu.effect).map(([k,v]) => [k, typeof v === 'boolean' ? v : (v as Decimal).toString()])) })),
                secretRuptureUpgradesData: gameState.secretRuptureUpgradesData.map(sru => {
                    const serializableParams: Partial<SerializableSecretRuptureUpgradeParams> = {};
                    if (sru.params) {
                        if (sru.params.basePIForBonus !== undefined) serializableParams.basePIForBonus = sru.params.basePIForBonus.toString();
                        if (sru.params.piChunkForBonus !== undefined) serializableParams.piChunkForBonus = sru.params.piChunkForBonus.toString();
                        if (sru.params.percentPerChunk !== undefined) serializableParams.percentPerChunk = sru.params.percentPerChunk.toString();
                        if (sru.params.idleThresholdSeconds !== undefined) serializableParams.idleThresholdSeconds = sru.params.idleThresholdSeconds.toString();
                        if (sru.params.bonusMultiplier !== undefined) serializableParams.bonusMultiplier = sru.params.bonusMultiplier.toString();
                        if (sru.params.critEchoTriggerChance !== undefined) serializableParams.critEchoTriggerChance = sru.params.critEchoTriggerChance.toString();
                    }
                    return { ...sru, params: Object.keys(serializableParams).length > 0 ? serializableParams as SerializableSecretRuptureUpgradeParams : undefined };
                }),
                offlineGainData: gameState.offlineGainData ? {time: gameState.offlineGainData.time.toString(), gain: gameState.offlineGainData.gain.toString()} : null,
                transcendenceInfoData: gameState.transcendenceInfoData ? {
                    ...gameState.transcendenceInfoData,
                    currentTranscendenceCount: gameState.transcendenceInfoData.currentTranscendenceCount.toString(),
                    accumulatedPI: gameState.transcendenceInfoData.accumulatedPI.toString(),
                    requiredPiToTranscendNext: gameState.transcendenceInfoData.requiredPiToTranscendNext.toString(),
                    etToGainNext: gameState.transcendenceInfoData.etToGainNext.toString(),
                    newGlobalMultiplierPercentage: gameState.transcendenceInfoData.newGlobalMultiplierPercentage.toString(),
                    milestones: gameState.transcendenceInfoData.milestones.map(m => ({
                        ...m,
                        value: m.value instanceof Decimal ? m.value.toString() : m.value
                    }))
                } : null,
                modularEXP: gameState.modularEXP.toString(),
                enemiesDefeatedTotal: gameState.enemiesDefeatedTotal.toString(),
                currentEnemy: gameState.currentEnemy ? { ...gameState.currentEnemy, currentHP: gameState.currentEnemy.currentHP.toString(), maxHP: gameState.currentEnemy.maxHP.toString() } : null,
                embryoLevel: gameState.embryoLevel.toString(),
                embryoCurrentEXP: gameState.embryoCurrentEXP.toString(),
                embryoEXPToNextLevel: gameState.embryoEXPToNextLevel.toString(),
                embryoUpgradesData: gameState.embryoUpgradesData.map(eu => ({...eu, cost: eu.cost.toString(), effect: Object.fromEntries(Object.entries(eu.effect).map(([k,v]) => [k, typeof v === 'boolean' ? v : (v as Decimal).toString()]))})),
                
                embryoBaseStats: serializeEmbryoStats(gameState.embryoBaseStats),
                embryoEffectiveStats: serializeEmbryoStats(gameState.embryoEffectiveStats),
                embryoInventory: gameState.embryoInventory.map(serializeEmbryoItem),
                embryoShopItems: gameState.embryoShopItems.map(serializeEmbryoItem),
                showEmbryoInventoryModal: gameState.showEmbryoInventoryModal, 
                currentSlotToEquip: gameState.currentSlotToEquip, 
            };
            delete (serializableState as any).currentStageData;
            delete (serializableState as any).nextStageThreshold;
            delete (serializableState as any).message;


            localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(serializableState));
        }, 30000); 
        return () => clearInterval(saveInterval);
    }, [gameState]); 
};
