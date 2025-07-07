
import { useEffect } from 'react';
import { Decimal } from 'decimal.js';
import {
    GameState, SerializableGameState, SerializableEmbryoStats, EmbryoStats, EmbryoItem,
    EmbryoEquipmentSlotKey, SerializableBankedResourceInfo, SerializableEnemy, DailyMission, SerializableDailyMission,
    MetaUpgrade, MetaUpgradeEffect, SerializableMetaUpgrade, FusedAttribute, SerializableOldEnemyStatusEffect,
    PlayerCollectibleEgg, SerializablePlayerCollectibleEgg, SerializableEffectObject, RegularUpgrade, SerializableRegularUpgrade,
    TranscendentalBonus, SerializableTranscendentalBonus, EtPermanentUpgrade, SerializableEtPermanentUpgrade, SpecialUpgrade,
    SerializableSpecialUpgrade, ActiveAbility as GameActiveAbilityType, SerializableActiveAbility, LegendaryUpgrade, SerializableLegendaryUpgrade,
    SecretRuptureUpgrade, SecretRuptureUpgradeParams, SerializableSecretRuptureUpgradeParams, SerializableSecretRuptureUpgrade,
    Achievement, SerializableAchievement, EmbryoUpgrade, SerializableEmbryoUpgrade, HiddenDiscoveryState, SerializableHiddenDiscoveryState,
    TranscendenceInfoModalData, SerializableTranscendenceInfoModalData, TranscendenceMilestoneInfo, SerializableTranscendenceMilestoneInfo,
    ActiveTemporaryBuffState, SerializableActiveTemporaryBuffState, EggTeamBattleState, SerializableEggTeamBattleState, BattleEgg, SerializableBattleEgg,
    BattleStatusEffectInstance, SerializableBattleStatusEffect, 
    FloatingText, SerializableFloatingText, BankedResourceInfo, EmbryoItemRarity, GameEvent, MissionRewardType, MissionStatus, BattleAbilityInstance, SerializableBattleAbilityInstance,
    BattleStats, BattleReward, SerializableBattleStats, SerializableBattleReward, SerializableLastAcquiredEggInfo, ExpeditionRewardOption, SerializableSacredRelicUpgrade,
    SerializableEmbryoItem
} from '../types';
import { Enemy } from '../types';
import { GAME_SAVE_KEY } from '../constants';
import { serializeFusedAttributes } from '../utils';


const serializeEmbryoStats = (stats: EmbryoStats): SerializableEmbryoStats => ({
    currentHp: stats.currentHp.toString(),
    maxHp: stats.maxHp.toString(),
    attack: stats.attack.toString(),
    defense: stats.defense.toString(),
    speed: stats.speed.toString(),
    critChance: stats.critChance.toString(),
    poisonChance: stats.poisonChance.toString(),
    poisonDurationSeconds: stats.poisonDurationSeconds.toString(),
    bossDamageBonus: stats.bossDamageBonus.toString(),
    doubleHitChance: stats.doubleHitChance.toString(),
    lifestealRate: stats.lifestealRate.toString(),
    chaosEffectChance: stats.chaosEffectChance.toString(),
    enemyDelayChance: stats.enemyDelayChance.toString(),
    damageReflection: stats.damageReflection.toString(),
    critResistance: stats.critResistance.toString(),
    periodicShieldValue: stats.periodicShieldValue.toString(),
    dodgeChance: stats.dodgeChance.toString(),
    overallDamageReduction: stats.overallDamageReduction.toString(),
    hpRegenPerInterval: stats.hpRegenPerInterval.toString(),
    hpRegenPerMinute: stats.hpRegenPerMinute.toString(),
    modularExpGainMultiplier: stats.modularExpGainMultiplier.toString(),
    shieldOnXpFull: stats.shieldOnXpFull.toString(),
    outgoingDamageMultiplier: stats.outgoingDamageMultiplier.toString(),
    embryoIpps: stats.embryoIpps.toString(),
    embryoClicksPerClick: stats.embryoClicksPerClick.toString(),
    currentShield: stats.currentShield.toString(),
    maxShield: stats.maxShield.toString(),
    critDamageMultiplier: stats.critDamageMultiplier.toString(),
    positiveChaosEffectDuplicationChance: stats.positiveChaosEffectDuplicationChance.toString(),
});

const serializeEmbryoItem = (item: EmbryoItem): SerializableEmbryoItem => ({
    id: item.id,
    instanceId: item.instanceId,
    name: item.name,
    description: item.description,
    icon: item.icon,
    rarity: item.rarity,
    equipmentType: item.equipmentType,
    storeCategory: item.storeCategory,
    cost: item.cost.map(c => ({
        currency: c.currency,
        amount: c.amount.toString(),
    })),
    effects: item.effects.map(eff => ({
        stat: eff.stat,
        type: eff.type,
        value: eff.value.toString(),
    })),
    isEquipped: item.isEquipped,
    isFused: item.isFused,
    fusedName: item.fusedName,
    fusedAttributes: serializeFusedAttributes(item.fusedAttributes),
    rerollCostET: item.rerollCostET?.toString(),
});


const serializeBankedResourceInfo = (info: BankedResourceInfo): SerializableBankedResourceInfo => ({
    depositedAmount: info.depositedAmount.toString(),
    depositTimestamp: info.depositTimestamp,
});


const serializeCurrentEnemy = (enemy: Enemy | null): SerializableEnemy | null => {
    if (!enemy) return null;
    return {
        id: enemy.id,
        name: enemy.name,
        icon: enemy.icon,
        isBoss: enemy.isBoss,
        currentHp: enemy.currentHp.toString(),
        maxHp: enemy.maxHp.toString(),
        attack: enemy.attack.toString(),
        defense: enemy.defense.toString(),
        speed: enemy.speed.toString(),
        critChance: enemy.critChance.toString(),
        critDamageMultiplier: enemy.critDamageMultiplier.toString(),
        dodgeChance: enemy.dodgeChance.toString(),
        baseAttack: enemy.baseAttack.toString(),
        baseDefense: enemy.baseDefense.toString(),
        baseSpeed: enemy.baseSpeed.toString(),
        baseCritChance: enemy.baseCritChance.toString(),
        baseCritDamageMultiplier: enemy.baseCritDamageMultiplier.toString(),
        baseDodgeChance: enemy.baseDodgeChance.toString(),
        attackIntervalSeconds: enemy.attackIntervalSeconds.toString(),
        attackTimerSeconds: enemy.attackTimerSeconds.toString(),
        activeStatusEffects: enemy.activeStatusEffects.map((eff): SerializableOldEnemyStatusEffect => ({
            type: eff.type,
            durationSeconds: eff.durationSeconds.toString(),
            potency: eff.potency?.toString(),
            tickIntervalSeconds: eff.tickIntervalSeconds?.toString(),
            lastTickTimestamp: eff.lastTickTimestamp,
            appliedByPlayer: eff.appliedByPlayer
        })),
    };
};

const serializeDailyMission = (mission: DailyMission): SerializableDailyMission => {
    return {
      ...mission, 
      targetValue: mission.targetValue.toString(),
      currentProgress: mission.currentProgress.toString(),
      reward: {
        ...mission.reward, 
        value: mission.reward.value.toString(),
        buffDuration: mission.reward.buffDuration?.toString(),
      },
    };
};

const serializeEffectObject = (effect: { [key: string]: Decimal | boolean | string | undefined | { [subKey:string]: any } }): SerializableEffectObject => {
    return Object.fromEntries(
        Object.entries(effect).map(([k, v]) => {
            if (v instanceof Decimal) return [k, v.toString()];
            if (typeof v === 'object' && v !== null && !(v instanceof Decimal)) {
                const subObjectSerialized: { [key: string]: string | boolean | number | undefined | EmbryoItemRarity } = {};
                for (const subKey in v) {
                    if (Object.prototype.hasOwnProperty.call(v, subKey)) {
                        const subValue = (v as any)[subKey];
                        if (subValue instanceof Decimal) {
                            subObjectSerialized[subKey] = subValue.toString();
                        } else {
                            subObjectSerialized[subKey] = subValue;
                        }
                    }
                }
                return [k, subObjectSerialized];
            }
            return [k, v as string | boolean | undefined];
        })
    );
};


const serializeMetaUpgradeEffect = (effect: MetaUpgradeEffect): SerializableMetaUpgrade['effect'] => {
    const serializedEffect: any = {};
    for (const key in effect) {
        if (Object.prototype.hasOwnProperty.call(effect, key)) {
            const value = (effect as any)[key];
            if (value instanceof Decimal) {
                serializedEffect[key] = value.toString();
            } else if (typeof value === 'object' && value !== null && !(value instanceof Decimal)) {
                const nestedSerialized: { [k: string]: any } = {};
                for (const nestedKey in value) {
                    if (Object.prototype.hasOwnProperty.call(value, nestedKey)) {
                        const nestedValue = value[nestedKey];
                        if (nestedValue instanceof Decimal) {
                            nestedSerialized[nestedKey] = nestedValue.toString();
                        } else {
                            nestedSerialized[nestedKey] = nestedValue;
                        }
                    }
                }
                serializedEffect[key] = nestedSerialized;
            } else {
                serializedEffect[key] = value;
            }
        }
    }
    return serializedEffect;
};

const serializeMetaUpgrade = (upgrade: MetaUpgrade): SerializableMetaUpgrade => ({
    id: upgrade.id,
    name: upgrade.name,
    description: upgrade.description,
    icon: upgrade.icon,
    category: upgrade.category,
    cost: upgrade.cost.toString(),
    purchased: upgrade.purchased.toString(),
    maxLevel: upgrade.maxLevel?.toString(),
    costMultiplier: upgrade.costMultiplier?.toString(),
    effect: serializeMetaUpgradeEffect(upgrade.effect),
});

const serializeCollectibleEggs = (eggs: PlayerCollectibleEgg[]): SerializablePlayerCollectibleEgg[] => {
    return eggs.map(egg => ({
        definitionId: egg.definitionId,
        collectedTimestamp: egg.collectedTimestamp,
        instanceId: egg.instanceId,
    }));
};

const serializeFloatingText = (text: FloatingText): SerializableFloatingText => {
    return text; 
};

const serializeBattleStats = (stats: BattleStats): SerializableBattleStats => {
    const damageDealtByEgg: { [key: string]: string } = {};
    for (const key in stats.damageDealtByEgg) {
        damageDealtByEgg[key] = new Decimal(stats.damageDealtByEgg[key]).toString();
    }
    const healingDoneByEgg: { [key: string]: string } = {};
    for (const key in stats.healingDoneByEgg) {
        healingDoneByEgg[key] = new Decimal(stats.healingDoneByEgg[key]).toString();
    }
    return { damageDealtByEgg, healingDoneByEgg };
};

const serializeBattleRewards = (rewards: BattleReward[]): SerializableBattleReward[] => {
    return rewards.map(r => ({
        ...r,
        amount: r.amount ? new Decimal(r.amount).toString() : undefined,
    }));
};

const serializeBattleStatusEffectInstance = (effect: BattleStatusEffectInstance): SerializableBattleStatusEffect => ({ 
    instanceId: effect.instanceId,
    definitionId: effect.definitionId,
    name: effect.name,
    icon: effect.icon,
    description: effect.description,
    type: effect.type,
    effectType: effect.effectType,
    remainingDurationTurns: effect.remainingDurationTurns,
    currentPotency: effect.currentPotency.toString(),
    statToChange: effect.statToChange,
    originalValueBeforeEffect: effect.originalValueBeforeEffect?.toString(),
    ticksApplied: effect.ticksApplied,
    stacks: effect.stacks,
    appliedByInstanceId: effect.appliedByInstanceId,
    reflectionPercentage: effect.reflectionPercentage?.toString(),
    appliedMaxHpReduction: effect.appliedMaxHpReduction?.toString(),
});

const serializeBattleAbilityInstance = (ability: BattleAbilityInstance): SerializableBattleAbilityInstance => {
  return ability;
};

const serializeBattleEgg = (egg: BattleEgg): SerializableBattleEgg => ({
    instanceId: egg.instanceId,
    definitionId: egg.definitionId,
    name: egg.name,
    icon: egg.icon,
    currentHp: egg.currentHp.toString(),
    maxHp: egg.maxHp.toString(),
    level: egg.level,
    rarity: egg.rarity,
    baseAttack: egg.baseAttack.toString(), 
    baseDefense: egg.baseDefense.toString(), 
    baseSpeed: egg.baseSpeed.toString(), 
    currentAttack: egg.currentAttack.toString(), 
    currentDefense: egg.currentDefense.toString(), 
    currentSpeed: egg.currentSpeed.toString(), 
    statusEffects: egg.statusEffects.map(serializeBattleStatusEffectInstance),
    isUsingAbility: egg.isUsingAbility,
    avatarAnimationState: egg.avatarAnimationState,
    currentResource: egg.currentResource?.toString(),
    maxResource: egg.maxResource?.toString(),
    resourceName: egg.resourceName,
    abilities: egg.abilities.map(serializeBattleAbilityInstance),
});

const serializeActiveTemporaryBuff = (buff: GameState['activeTemporaryBuffs'][0]): SerializableActiveTemporaryBuffState => {
    if (!buff) return null as any; // This shouldn't be called with null, but for safety.
    return {
        id: buff.id,
        remainingDuration: buff.remainingDuration.toString(),
        name: buff.name,
        icon: buff.icon,
        description: buff.description,
        effect: serializeEffectObject(buff.effect as any), 
        source: buff.source,
    };
};

const serializeEggTeamBattleState = (battleState: EggTeamBattleState): SerializableEggTeamBattleState => ({
    isActive: battleState.isActive,
    battleName: battleState.battleName,
    currentRound: battleState.currentRound,
    totalRounds: battleState.totalRounds,
    maxRounds: battleState.maxRounds,
    combatSpeed: battleState.combatSpeed,
    isPaused: battleState.isPaused,
    roundTimer: battleState.roundTimer,
    roundDuration: battleState.roundDuration,
    enemyTeam: battleState.enemyTeam.map(serializeBattleEgg),
    playerTeam: battleState.playerTeam.map(serializeBattleEgg),
    battleLog: battleState.battleLog,
    floatingTexts: battleState.floatingTexts.map(serializeFloatingText),
    isTeamSetupActive: battleState.isTeamSetupActive,
    playerTeamLineup: battleState.playerTeamLineup.map(eggOrNull => eggOrNull ? serializeBattleEgg(eggOrNull) : null),
    selectedInventoryEggInstanceIdForPlacement: battleState.selectedInventoryEggInstanceIdForPlacement,
    turnOrder: battleState.turnOrder,
    currentTurnIndex: battleState.currentTurnIndex,
    currentActingEggId: battleState.currentActingEggId,
    battlePhase: battleState.battlePhase,
    isBattleOver: battleState.isBattleOver,
    winner: battleState.winner,
    battleStats: serializeBattleStats(battleState.battleStats),
    battleRewards: serializeBattleRewards(battleState.battleRewards),
    lastPlayerStatusApplication: battleState.lastPlayerStatusApplication,
    lastOpponentStatusApplication: battleState.lastOpponentStatusApplication,
    isExpeditionMode: battleState.isExpeditionMode,
    currentExpeditionStage: battleState.currentExpeditionStage,
    expeditionOutcome: battleState.expeditionOutcome,
    expeditionPlayerTeamSnapshot: battleState.expeditionPlayerTeamSnapshot ? battleState.expeditionPlayerTeamSnapshot.map(serializeBattleEgg) : null,
    expeditionDamageDealt: battleState.expeditionDamageDealt.toString(),
    expeditionEggsDefeated: battleState.expeditionEggsDefeated,
    acquiredExpeditionUpgradeIds: battleState.acquiredExpeditionUpgrades.map(u => u.id),
    expeditionTeamBuffs: battleState.expeditionTeamBuffs.map(b => serializeActiveTemporaryBuff(b) as any),
});

const serializeHiddenDiscoveriesData = (discoveries: HiddenDiscoveryState[]): SerializableHiddenDiscoveryState[] => {
    return discoveries.map(d => ({
        id: d.id,
        isDiscovered: d.isDiscovered,
    }));
};

const serializeOfflineGainData = (data: GameState['offlineGainData']): SerializableGameState['offlineGainData'] => {
    if (!data) return null;
    return {
        time: data.time.toString(),
        gain: data.gain.toString(),
    };
};

const serializeTranscendenceMilestoneInfo = (milestones: TranscendenceMilestoneInfo[]): SerializableTranscendenceMilestoneInfo[] => {
    return milestones.map(m => ({
        count: m.count,
        description: m.description,
        rewardType: m.rewardType,
        value: m.value instanceof Decimal ? m.value.toString() : m.value,
        isAchieved: m.isAchieved,
    }));
};

const serializeTranscendenceInfoData = (data: GameState['transcendenceInfoData']): SerializableGameState['transcendenceInfoData'] => {
    if (!data) return null;
    return {
        currentTranscendenceCount: data.currentTranscendenceCount.toString(),
        accumulatedPI: data.accumulatedPI.toString(),
        requiredPiToTranscendNext: data.requiredPiToTranscendNext.toString(),
        etToGainNext: data.etToGainNext.toString(),
        newGlobalMultiplierPercentage: data.newGlobalMultiplierPercentage.toString(),
        milestones: serializeTranscendenceMilestoneInfo(data.milestones),
    };
};

const serializeSacredRelicsData = (relics: GameState['sacredRelicsData']): SerializableSacredRelicUpgrade[] => {
    // The SacredRelicUpgrade type is already serializable (no Decimal fields).
    return relics;
};


const serializeGameState = (gs: GameState): SerializableGameState => {
    return {
        incubationPower: gs.incubationPower.toString(),
        temporaryEggs: gs.temporaryEggs.toString(),
        clicksPerClick: gs.clicksPerClick.toString(),
        ipps: gs.ipps.toString(),
        effectiveClicksPerClick: gs.effectiveClicksPerClick.toString(),
        effectiveIpps: gs.effectiveIpps.toString(),
        transcendentEssence: gs.transcendentEssence.toString(),
        currentStageIndex: gs.currentStageIndex,
        gameFinished: gs.gameFinished,
        maxIncubationPowerAchieved: gs.maxIncubationPowerAchieved.toString(),
        userNickname: gs.userNickname,
        totalClicksEver: gs.totalClicksEver.toString(),
        totalClicksThisRun: gs.totalClicksThisRun.toString(),
        hasPurchasedRegularUpgradeThisRun: gs.hasPurchasedRegularUpgradeThisRun,
        transcendenceCount: gs.transcendenceCount.toString(),
        transcendencePassiveBonus: gs.transcendencePassiveBonus.toString(),
        unlockedEggForms: gs.unlockedEggForms,
        activeEggFormIds: gs.activeEggFormIds,
        unlockedAchievements: gs.unlockedAchievements,
        achievementsData: gs.achievementsData.map(a => ({ ...a, bonus: a.bonus ? serializeEffectObject(a.bonus) : undefined, effect: a.effect ? serializeEffectObject(a.effect) : undefined }) as SerializableAchievement),
        unlockedTraits: gs.unlockedTraits,
        activeTraits: gs.activeTraits,
        maxActiveTraits: gs.maxActiveTraits,
        isSoundEnabled: gs.isSoundEnabled,
        isMusicEnabled: gs.isMusicEnabled,
        lastPlayedTimestamp: gs.lastPlayedTimestamp,
        offlineIncubationRate: gs.offlineIncubationRate.toString(),
        lastClickTime: gs.lastClickTime,
        activeIdleTime: gs.activeIdleTime.toString(),
        abyssalIdleBonusTime: gs.abyssalIdleBonusTime.toString(),
        transcendenceThreshold: gs.transcendenceThreshold.toString(),
        essencePerPI: gs.essencePerPI.toString(),
        finalEggThreshold: gs.finalEggThreshold.toString(),
        goldenBlessingMultiplier: gs.goldenBlessingMultiplier.toString(),
        criticalClickChance: gs.criticalClickChance.toString(),
        effectiveCriticalClickChance: gs.effectiveCriticalClickChance.toString(),
        softCapThresholdCPC: gs.softCapThresholdCPC.toString(),
        softCapThresholdIPPS: gs.softCapThresholdIPPS.toString(),
        softCapScalingFactor: gs.softCapScalingFactor.toString(),
        currentEventData: gs.currentEventData, 
        explosaoIncubadoraTimer: gs.explosaoIncubadoraTimer.toString(),
        overclockCascaTimer: gs.overclockCascaTimer.toString(),
        impactoCriticoTimer: gs.impactoCriticoTimer.toString(),
        furiaIncubadoraTimer: gs.furiaIncubadoraTimer.toString(),
        lastUsedActiveAbilityId: gs.lastUsedActiveAbilityId,
        curiosoTimer: gs.curiosoTimer.toString(),
        activeTemporaryBuffs: gs.activeTemporaryBuffs.map(serializeActiveTemporaryBuff),
        transcendenceSpamPenaltyActive: gs.transcendenceSpamPenaltyActive,
        transcendenceSpamPenaltyDuration: gs.transcendenceSpamPenaltyDuration.toString(),
        lastLeadKeyClickTimestamp: gs.lastLeadKeyClickTimestamp,
        lastTitheRitualTimestamp: gs.lastTitheRitualTimestamp,
        upgradesData: gs.upgradesData.map(u => ({ ...u, baseCost: u.baseCost.toString(), costMultiplier: u.costMultiplier.toString(), effect: serializeEffectObject(u.effect), purchased: u.purchased.toString(), maxLevel: u.maxLevel?.toString() }) as SerializableRegularUpgrade),
        transcendentalBonusesData: gs.transcendentalBonusesData.map(b => ({ ...b, baseCost: b.baseCost.toString(), costMultiplier: b.costMultiplier.toString(), effect: serializeEffectObject(b.effect), purchased: b.purchased.toString(), maxLevel: b.maxLevel?.toString() }) as SerializableTranscendentalBonus),
        etPermanentUpgradesData: gs.etPermanentUpgradesData.map(epu => ({ ...epu, baseCost: epu.baseCost.toString(), costMultiplier: epu.costMultiplier.toString(), effect: serializeEffectObject(epu.effect), purchased: epu.purchased.toString(), maxLevel: epu.maxLevel?.toString() }) as SerializableEtPermanentUpgrade),
        specialUpgradesData: gs.specialUpgradesData.map(su => ({ ...su, effect: serializeEffectObject(su.effect), purchased: su.purchased.toString() }) as SerializableSpecialUpgrade),
        activeAbilitiesData: gs.activeAbilitiesData.map(aa => ({ ...aa, cost: aa.cost.toString(), cooldown: aa.cooldown.toString(), cooldownRemaining: aa.cooldownRemaining.toString(), tempEffectDuration: aa.tempEffectDuration?.toString(), effect: serializeEffectObject(aa.effect) }) as SerializableActiveAbility),
        legendaryUpgradesData: gs.legendaryUpgradesData.map(lu => ({ ...lu, effect: serializeEffectObject(lu.effect) }) as SerializableLegendaryUpgrade),
        secretRuptureUpgradesData: gs.secretRuptureUpgradesData.map(sru => ({ ...sru, params: sru.params ? Object.fromEntries(Object.entries(sru.params).map(([k,v]) => [k, v instanceof Decimal ? v.toString() : v])) as SerializableSecretRuptureUpgradeParams : undefined }) as SerializableSecretRuptureUpgrade),
        secretRuptureSystemUnlocked: gs.secretRuptureSystemUnlocked,
        sacredRelicsData: serializeSacredRelicsData(gs.sacredRelicsData),
        perfectCycleBuffTimer: gs.perfectCycleBuffTimer.toString(),
        stagnantTimeBuffTimer: gs.stagnantTimeBuffTimer.toString(),
        phoenixGlowCritClicksRemaining: gs.phoenixGlowCritClicksRemaining.toString(),
        eloGeneticoBonusMultiplier: gs.eloGeneticoBonusMultiplier.toString(),
        showSacredRelicChoiceModal: gs.showSacredRelicChoiceModal,
        availableSacredRelicChoices: serializeSacredRelicsData(gs.availableSacredRelicChoices),
        showNicknameModal: gs.showNicknameModal,
        showTraitModal: gs.showTraitModal,
        showEventModal: gs.showEventModal,
        showAchievementPopup: gs.showAchievementPopup,
        achievementPopupData: gs.achievementPopupData,
        showSettingsModal: gs.showSettingsModal,
        showOfflineGainModal: gs.showOfflineGainModal,
        offlineGainData: serializeOfflineGainData(gs.offlineGainData),
        showTranscendenceInfoModal: gs.showTranscendenceInfoModal,
        transcendenceInfoData: serializeTranscendenceInfoData(gs.transcendenceInfoData),
        totalUpgradesPurchasedEver: gs.totalUpgradesPurchasedEver.toString(),
        activePlayTime: gs.activePlayTime.toString(),
        globalAbilityCooldownMultiplier: gs.globalAbilityCooldownMultiplier.toString(),
        servoDoOvoActiveMultiplier: gs.servoDoOvoActiveMultiplier.toString(),
        mestreDaEvolucaoBonus: gs.mestreDaEvolucaoBonus.toString(),
        modularEXP: gs.modularEXP.toString(),
        enemiesDefeatedTotal: gs.enemiesDefeatedTotal.toString(),
        enemiesDefeatedThisRun: gs.enemiesDefeatedThisRun.toString(),
        abilitiesUsedThisRun: gs.abilitiesUsedThisRun,
        currentEnemy: serializeCurrentEnemy(gs.currentEnemy),
        combatLog: gs.combatLog,
        embryoLevel: gs.embryoLevel.toString(),
        embryoCurrentEXP: gs.embryoCurrentEXP.toString(),
        embryoEXPToNextLevel: gs.embryoEXPToNextLevel.toString(),
        embryoIcon: gs.embryoIcon,
        embryoUpgradesData: gs.embryoUpgradesData.map(eu => ({ ...eu, effect: serializeEffectObject(eu.effect), purchased: eu.purchased.toString(), cost: eu.cost?.toString(), baseCost: eu.baseCost?.toString(), costMultiplier: eu.costMultiplier?.toString(), maxLevel: eu.maxLevel?.toString() }) as SerializableEmbryoUpgrade),
        embryoBaseStats: serializeEmbryoStats(gs.embryoBaseStats),
        embryoEffectiveStats: serializeEmbryoStats(gs.embryoEffectiveStats),
        embryoInventory: gs.embryoInventory.map(serializeEmbryoItem),
        equippedEmbryoItems: gs.equippedEmbryoItems,
        embryoShopItems: gs.embryoShopItems.map(serializeEmbryoItem),
        showEmbryoInventoryModal: gs.showEmbryoInventoryModal,
        currentSlotToEquip: gs.currentSlotToEquip,
        showCombatModal: gs.showCombatModal,
        showEmbryoModal: gs.showEmbryoModal,
        plasmaPulseClickCounter: gs.plasmaPulseClickCounter.toString(),
        lastInteractionTime: gs.lastInteractionTime,
        rupturePathChoicesCount: gs.rupturePathChoicesCount.toString(),
        runsWithFiveDifferentTraitsCount: gs.runsWithFiveDifferentTraitsCount.toString(),
        incubatorTypesOwnedThisRun: Array.from(gs.incubatorTypesOwnedThisRun),
        totalRunsTranscended: gs.totalRunsTranscended.toString(),
        firstBossDefeatedThisRun: gs.firstBossDefeatedThisRun,
        uniqueEnemiesDefeatedThisRunByEmbryo: Array.from(gs.uniqueEnemiesDefeatedThisRunByEmbryo),
        embryoLevel10ReachedCount: gs.embryoLevel10ReachedCount.toString(),
        dailyLoginTracker: gs.dailyLoginTracker,
        quantumCoreActiveRandomTraitId: gs.quantumCoreActiveRandomTraitId,
        quantumCoreActiveRandomTraitDuration: gs.quantumCoreActiveRandomTraitDuration.toString(),
        quantumCoreInternalCooldown: gs.quantumCoreInternalCooldown.toString(),
        orbInverseGlobalPIProductionMultiplier: gs.orbInverseGlobalPIProductionMultiplier.toString(),
        orbInverseModularEXPGainMultiplier: gs.orbInverseModularEXPGainMultiplier.toString(),
        orbInverseAbilitiesDisabled: gs.orbInverseAbilitiesDisabled,
        entropySeedModularEXPGainMultiplier: gs.entropySeedModularEXPGainMultiplier.toString(),
        entropySeedGlobalPIProductionDebuff: gs.entropySeedGlobalPIProductionDebuff.toString(),
        entropySeedPassiveProductionBuff: gs.entropySeedPassiveProductionBuff.toString(),
        entropySeedSpecialUpgradesDisabled: gs.entropySeedSpecialUpgradesDisabled,
        dualCoreMaxEggFormsActive: gs.dualCoreMaxEggFormsActive,
        dualCoreUpgradeCostMultiplier: gs.dualCoreUpgradeCostMultiplier.toString(),
        dualCoreEXPGainDebuff: gs.dualCoreEXPGainDebuff.toString(),
        dualCoreETGainDebuff: gs.dualCoreETGainDebuff.toString(),
        cosmicBank: {
            pi: serializeBankedResourceInfo(gs.cosmicBank.pi),
            et: serializeBankedResourceInfo(gs.cosmicBank.et),
            modularExp: serializeBankedResourceInfo(gs.cosmicBank.modularExp),
        },
        dailyMissions: gs.dailyMissions.map(serializeDailyMission),
        lastMissionGenerationDate: gs.lastMissionGenerationDate,
        unlockedSkinIds: gs.unlockedSkinIds,
        activeSkinId: gs.activeSkinId,
        forjaRessonanteBuffTimer: gs.forjaRessonanteBuffTimer.toString(),
        toqueTrinoBuffTimer: gs.toqueTrinoBuffTimer.toString(),
        fusaoBioquantumNextClickBuff: gs.fusaoBioquantumNextClickBuff,
        esporoIncandescenteIntervalTimer: gs.esporoIncandescenteIntervalTimer.toString(),
        esporoIncandescenteBuffTimer: gs.esporoIncandescenteBuffTimer.toString(),
        furyPassiveBonusAmount: gs.furyPassiveBonusAmount.toString(),
        furyPassiveBonusTimer: gs.furyPassiveBonusTimer.toString(),
        hiddenDiscoveriesData: serializeHiddenDiscoveriesData(gs.hiddenDiscoveriesData),
        spentModularEXPThisRun: gs.spentModularEXPThisRun,
        embryoTookDamageThisRun: gs.embryoTookDamageThisRun,
        reservatorioPsiquicoActive: gs.reservatorioPsiquicoActive,
        justTranscended: gs.justTranscended,
        metaUpgradesUnlocked: gs.metaUpgradesUnlocked,
        metaUpgradesData: gs.metaUpgradesData.map(serializeMetaUpgrade),
        fusionSelectedInventoryItemIds: gs.fusionSelectedInventoryItemIds,
        lastFusedItem: gs.lastFusedItem ? serializeEmbryoItem(gs.lastFusedItem) : null,
        periodicShieldCycleTimerSeconds: gs.periodicShieldCycleTimerSeconds.toString(),
        periodicShieldClickCounter: gs.periodicShieldClickCounter.toString(),
        collectibleEggs: serializeCollectibleEggs(gs.collectibleEggs),
        eggFragments: gs.eggFragments.toString(),
        eggFragmentCostForRandomRoll: gs.eggFragmentCostForRandomRoll.toString(),
        lastAcquiredCollectibleEggs: gs.lastAcquiredCollectibleEggs.map(e => ({...e}) as SerializableLastAcquiredEggInfo),
        eggTeamBattleState: serializeEggTeamBattleState(gs.eggTeamBattleState),
        distorcaoRecorrenteClickCounter: gs.distorcaoRecorrenteClickCounter.toString(),
        distorcaoRecorrenteStacks: gs.distorcaoRecorrenteStacks.toString(),
        distorcaoRecorrenteTimer: gs.distorcaoRecorrenteTimer.toString(),
        pulsoDaPerfeicaoClickCounter: gs.pulsoDaPerfeicaoClickCounter.toString(),
        espiralInternaTimer: gs.espiralInternaTimer.toString(),
        espiralInternaStacks: gs.espiralInternaStacks.toString(),
        espiralInternaIntervalTimer: gs.espiralInternaIntervalTimer.toString(),
        eggFormsActivatedThisRun: Array.from(gs.eggFormsActivatedThisRun),
        primordialTriggerUsedThisRun: gs.primordialTriggerUsedThisRun,
        imortalidadePIBonus: gs.imortalidadePIBonus.toString(),
        visaoFractalBuffTimer: gs.visaoFractalBuffTimer.toString(),
    };
};


export const useAutoSave = (gameState: GameState) => {
    useEffect(() => {
        const handle = setInterval(() => {
            try {
                const stateToSave = serializeGameState(gameState);
                localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(stateToSave));
            } catch (e) {
                console.error("Failed to save game state:", e);
            }
        }, 5000); // Save every 5 seconds

        return () => clearInterval(handle);
    }, [gameState]);
};
