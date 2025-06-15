
import { useState, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, SerializableGameState, SerializableEmbryoStats, SerializableEmbryoItem, EmbryoStats, EmbryoItem, EmbryoItemRarity, EmbryoItemEffect, EmbryoEquipmentSlotKey } from '../types'; // Added EmbryoEquipmentSlotKey
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, LegendaryUpgrade, SecretRuptureUpgrade, SecretRuptureUpgradeParams, SerializableSecretRuptureUpgradeParams, SerializableSecretRuptureUpgrade } from '../types';
import { Achievement } from '../types';
import { ActiveAbility } from '../types';
import { Enemy } from '../types';
import { EmbryoUpgrade } from '../types';
import { EGG_STAGES, INITIAL_REGULAR_UPGRADES, INITIAL_TRANSCENDENTAL_BONUSES, INITIAL_ET_PERMANENT_UPGRADES, INITIAL_SPECIAL_UPGRADES, EGG_FORMS_DATA, INITIAL_ACHIEVEMENTS, INITIAL_ACTIVE_ABILITIES, INITIAL_GAME_STATE, GAME_SAVE_KEY, TRANSCENDENCE_MILESTONES_CONFIG, INITIAL_LEGENDARY_UPGRADES, INITIAL_SECRET_RUPTURE_UPGRADES, INITIAL_EMBRYO_UPGRADES, EMBRYO_INITIAL_ICON, ENEMY_PLACEHOLDER_ICONS, BOSS_PLACEHOLDER_ICONS, BOSS_INTERVAL, BASE_ENEMY_HP, ENEMY_HP_SCALING_FACTOR, BOSS_HP_MULTIPLIER, INITIAL_EMBRYO_SHOP_ITEMS } from '../constants';
import { calculateOfflineIncubationPower, getEmbryoNextLevelEXP, getEmbryoVisuals, safeDecimal, safeEffectDecimal } from '../utils';

// Helper to spawn enemy, moved here as it's primarily used during game load / reset
export function spawnNextEnemyOnLoad(prevState: GameState, initialSpawn: boolean = false): GameState {
    const defeatedCount = initialSpawn ? new Decimal(0) : prevState.enemiesDefeatedTotal;
    const isBoss = defeatedCount.plus(1).modulo(BOSS_INTERVAL).isZero();

    let enemyName: string;
    let enemyIcon: string;
    let enemyBaseHPForCalc = BASE_ENEMY_HP;

    if (isBoss) {
        enemyName = `Chefe: Guardião das Eras ${defeatedCount.dividedToIntegerBy(BOSS_INTERVAL).plus(1).toString()}`; 
        enemyIcon = BOSS_PLACEHOLDER_ICONS[defeatedCount.dividedToIntegerBy(BOSS_INTERVAL).modulo(BOSS_PLACEHOLDER_ICONS.length).toNumber()];
        enemyBaseHPForCalc = enemyBaseHPForCalc.times(BOSS_HP_MULTIPLIER);
    } else {
        const nameSuffix = defeatedCount.modulo(5).plus(1);
        const nameBase = ["Casulo Fraturado", "Lodo Temporal", "Reflexo do Medo", "Eco Distorcido", "Cisco Cósmico"];
        enemyName = `${nameBase[defeatedCount.modulo(nameBase.length).toNumber()]} ${nameSuffix.toString()}`;
        enemyIcon = ENEMY_PLACEHOLDER_ICONS[defeatedCount.modulo(ENEMY_PLACEHOLDER_ICONS.length).toNumber()];
    }

    const maxHP = enemyBaseHPForCalc.times(ENEMY_HP_SCALING_FACTOR.pow(defeatedCount)).floor();
    const newEnemy: Enemy = {
        id: `enemy_${Date.now()}_${defeatedCount.toString()}`,
        name: enemyName,
        icon: enemyIcon,
        currentHP: maxHP,
        maxHP: maxHP,
        isBoss: isBoss,
    };

    let newCombatLog = prevState.combatLog;
    if (!initialSpawn) {
       newCombatLog = [`Novo oponente aparece: ${newEnemy.name}!`, ...newCombatLog].slice(0,5);
    } else if (prevState.combatLog.length === 0) {
       newCombatLog = [`O primeiro confronto aguarda: ${newEnemy.name}!`];
    }
    return {...prevState, currentEnemy: newEnemy, combatLog: newCombatLog };
}

const deserializeEmbryoStats = (serializable?: SerializableEmbryoStats, initial?: EmbryoStats): EmbryoStats => {
    const defaultStats = initial || INITIAL_GAME_STATE.embryoBaseStats; // Fallback to absolute initial
    if (!serializable) return { ...defaultStats };
    return {
        currentHp: safeDecimal(serializable.currentHp, defaultStats.currentHp.toString()),
        maxHp: safeDecimal(serializable.maxHp, defaultStats.maxHp.toString()),
        attack: safeDecimal(serializable.attack, defaultStats.attack.toString()),
        defense: safeDecimal(serializable.defense, defaultStats.defense.toString()),
        speed: safeDecimal(serializable.speed, defaultStats.speed.toString()),
        critChance: safeDecimal(serializable.critChance, defaultStats.critChance.toString()),
        poisonChance: safeDecimal(serializable.poisonChance, defaultStats.poisonChance.toString()),
        bossDamageBonus: safeDecimal(serializable.bossDamageBonus, defaultStats.bossDamageBonus.toString()),
        doubleHitChance: safeDecimal(serializable.doubleHitChance, defaultStats.doubleHitChance.toString()),
        lifestealRate: safeDecimal(serializable.lifestealRate, defaultStats.lifestealRate.toString()),
        chaosEffectChance: safeDecimal(serializable.chaosEffectChance, defaultStats.chaosEffectChance.toString()),
        // New Defensive Stats
        enemyDelayChance: safeDecimal(serializable.enemyDelayChance, defaultStats.enemyDelayChance.toString()),
        damageReflection: safeDecimal(serializable.damageReflection, defaultStats.damageReflection.toString()),
        critResistance: safeDecimal(serializable.critResistance, defaultStats.critResistance.toString()),
        periodicShieldValue: safeDecimal(serializable.periodicShieldValue, defaultStats.periodicShieldValue.toString()),
        dodgeChance: safeDecimal(serializable.dodgeChance, defaultStats.dodgeChance.toString()),
        overallDamageReduction: safeDecimal(serializable.overallDamageReduction, defaultStats.overallDamageReduction.toString()),
        hpRegenPerInterval: safeDecimal(serializable.hpRegenPerInterval, defaultStats.hpRegenPerInterval.toString()),
    };
};

const deserializeEmbryoItem = (serializable: SerializableEmbryoItem, initialItemData: EmbryoItem[]): EmbryoItem => {
    const baseItem = initialItemData.find(i => i.id === serializable.id) || {} as EmbryoItem; // Find base for default effects, etc.
    return {
        ...baseItem, // Spread base item first to get defaults for icon, name, etc.
        ...serializable,
        rarity: serializable.rarity as EmbryoItemRarity, 
        cost: {
            currency: serializable.cost.currency as 'modularEXP' | 'incubationPower' | 'transcendentEssence',
            amount: safeDecimal(serializable.cost.amount),
        },
        effects: serializable.effects.map(eff => {
          const deserializedEffect: EmbryoItemEffect = {
            stat: eff.stat, 
            type: eff.type, 
            value: safeDecimal(eff.value),
          };
          return deserializedEffect;
        }),
    };
};


export const useLoadGame = (): [GameState, React.Dispatch<React.SetStateAction<GameState>>, boolean] => {
    const [isLoading, setIsLoading] = useState(true);
    const [gameState, setGameState] = useState<GameState>(() => {
        const minimalInitialState = {
            ...INITIAL_GAME_STATE,
            upgradesData: INITIAL_REGULAR_UPGRADES.map(u => ({...u})),
            transcendentalBonusesData: INITIAL_TRANSCENDENTAL_BONUSES.map(b => ({...b})),
            etPermanentUpgradesData: INITIAL_ET_PERMANENT_UPGRADES.map(epu => ({...epu})),
            specialUpgradesData: INITIAL_SPECIAL_UPGRADES.map(su => ({...su})),
            achievementsData: INITIAL_ACHIEVEMENTS.map(ach => ({...ach})),
            activeAbilitiesData: INITIAL_ACTIVE_ABILITIES.map(aa => ({...aa})),
            legendaryUpgradesData: INITIAL_LEGENDARY_UPGRADES.map(lu => ({...lu})),
            secretRuptureUpgradesData: INITIAL_SECRET_RUPTURE_UPGRADES.map(sru => ({...sru})),
            embryoUpgradesData: INITIAL_EMBRYO_UPGRADES.map(eu => ({...eu})),
            embryoShopItems: INITIAL_EMBRYO_SHOP_ITEMS.map(item => ({...item})),
            currentStageData: EGG_STAGES[0],
            nextStageThreshold: EGG_STAGES[1]?.threshold || null,
        };
        return minimalInitialState;
    });

    useEffect(() => {
        const savedGame = localStorage.getItem(GAME_SAVE_KEY);
        let loadedState: GameState;

        if (savedGame) {
            try {
                const parsed = JSON.parse(savedGame) as Partial<SerializableGameState>;
                const initialSpecialUpgrades = INITIAL_SPECIAL_UPGRADES.map(su => ({...su}));
                const initialAchievements = INITIAL_ACHIEVEMENTS.map(ach => ({...ach}));
                const initialLegendaryUpgrades = INITIAL_LEGENDARY_UPGRADES.map(lu => ({...lu}));
                const initialSecretRuptureUpgradesSource = INITIAL_SECRET_RUPTURE_UPGRADES.map(sru => ({...sru}));
                const initialEmbryoUpgrades = INITIAL_EMBRYO_UPGRADES.map(eu => ({...eu}));
                const allPossibleEmbryoItemsForDeserialization = INITIAL_EMBRYO_SHOP_ITEMS.map(i => ({...i}));


                loadedState = {
                    ...INITIAL_GAME_STATE,
                    // ... (all existing Decimal and primitive parsers) ...
                    incubationPower: safeDecimal(parsed.incubationPower, INITIAL_GAME_STATE.incubationPower.toString()),
                    temporaryEggs: safeDecimal(parsed.temporaryEggs, INITIAL_GAME_STATE.temporaryEggs.toString()),
                    clicksPerClick: safeDecimal(parsed.clicksPerClick, INITIAL_GAME_STATE.clicksPerClick.toString()),
                    ipps: safeDecimal(parsed.ipps, INITIAL_GAME_STATE.ipps.toString()),
                    effectiveClicksPerClick: safeDecimal(parsed.effectiveClicksPerClick, INITIAL_GAME_STATE.effectiveClicksPerClick.toString()),
                    effectiveIpps: safeDecimal(parsed.effectiveIpps, INITIAL_GAME_STATE.effectiveIpps.toString()),
                    transcendentEssence: safeDecimal(parsed.transcendentEssence, INITIAL_GAME_STATE.transcendentEssence.toString()),
                    maxIncubationPowerAchieved: safeDecimal(parsed.maxIncubationPowerAchieved, INITIAL_GAME_STATE.maxIncubationPowerAchieved.toString()),
                    totalClicksEver: safeDecimal(parsed.totalClicksEver, INITIAL_GAME_STATE.totalClicksEver.toString()),
                    totalClicksThisRun: safeDecimal(parsed.totalClicksThisRun, INITIAL_GAME_STATE.totalClicksThisRun.toString()),
                    transcendenceCount: safeDecimal(parsed.transcendenceCount, INITIAL_GAME_STATE.transcendenceCount.toString()),
                    transcendencePassiveBonus: safeDecimal(parsed.transcendencePassiveBonus, INITIAL_GAME_STATE.transcendencePassiveBonus.toString()),
                    offlineIncubationRate: safeDecimal(parsed.offlineIncubationRate, INITIAL_GAME_STATE.offlineIncubationRate.toString()),
                    activeIdleTime: safeDecimal(parsed.activeIdleTime, INITIAL_GAME_STATE.activeIdleTime.toString()),
                    abyssalIdleBonusTime: safeDecimal(parsed.abyssalIdleBonusTime, INITIAL_GAME_STATE.abyssalIdleBonusTime.toString()),
                    transcendenceThreshold: safeDecimal(parsed.transcendenceThreshold, INITIAL_GAME_STATE.transcendenceThreshold.toString()),
                    essencePerPI: safeDecimal(parsed.essencePerPI, INITIAL_GAME_STATE.essencePerPI.toString()),
                    finalEggThreshold: safeDecimal(parsed.finalEggThreshold, INITIAL_GAME_STATE.finalEggThreshold.toString()),
                    goldenBlessingMultiplier: safeDecimal(parsed.goldenBlessingMultiplier, INITIAL_GAME_STATE.goldenBlessingMultiplier.toString()),
                    criticalClickChance: safeDecimal(parsed.criticalClickChance, INITIAL_GAME_STATE.criticalClickChance.toString()),
                    effectiveCriticalClickChance: safeDecimal(parsed.effectiveCriticalClickChance, INITIAL_GAME_STATE.effectiveCriticalClickChance.toString()),
                    softCapThresholdCPC: safeDecimal(parsed.softCapThresholdCPC, INITIAL_GAME_STATE.softCapThresholdCPC.toString()),
                    softCapThresholdIPPS: safeDecimal(parsed.softCapThresholdIPPS, INITIAL_GAME_STATE.softCapThresholdIPPS.toString()),
                    softCapScalingFactor: safeDecimal(parsed.softCapScalingFactor, INITIAL_GAME_STATE.softCapScalingFactor.toString()),
                    transcendenceSpamPenaltyDuration: safeDecimal(parsed.transcendenceSpamPenaltyDuration, INITIAL_GAME_STATE.transcendenceSpamPenaltyDuration.toString()),
                    explosaoIncubadoraTimer: safeDecimal(parsed.explosaoIncubadoraTimer, INITIAL_GAME_STATE.explosaoIncubadoraTimer.toString()),
                    overclockCascaTimer: safeDecimal(parsed.overclockCascaTimer, INITIAL_GAME_STATE.overclockCascaTimer.toString()),
                    impactoCriticoTimer: safeDecimal(parsed.impactoCriticoTimer, INITIAL_GAME_STATE.impactoCriticoTimer.toString()),
                    furiaIncubadoraTimer: safeDecimal(parsed.furiaIncubadoraTimer, INITIAL_GAME_STATE.furiaIncubadoraTimer.toString()),
                    curiosoTimer: safeDecimal(parsed.curiosoTimer, INITIAL_GAME_STATE.curiosoTimer.toString()),
                    totalUpgradesPurchasedEver: safeDecimal(parsed.totalUpgradesPurchasedEver, INITIAL_GAME_STATE.totalUpgradesPurchasedEver.toString()),
                    activePlayTime: safeDecimal(parsed.activePlayTime, INITIAL_GAME_STATE.activePlayTime.toString()),
                    globalAbilityCooldownMultiplier: safeDecimal(parsed.globalAbilityCooldownMultiplier, INITIAL_GAME_STATE.globalAbilityCooldownMultiplier.toString()),
                    servoDoOvoActiveMultiplier: safeDecimal(parsed.servoDoOvoActiveMultiplier, INITIAL_GAME_STATE.servoDoOvoActiveMultiplier.toString()),
                    mestreDaEvolucaoBonus: safeDecimal(parsed.mestreDaEvolucaoBonus, INITIAL_GAME_STATE.mestreDaEvolucaoBonus.toString()),

                    // New Post-Transcendence Event Flags
                    postTranscendenceEventUpgradeCostMultiplier: safeDecimal(parsed.postTranscendenceEventUpgradeCostMultiplier, INITIAL_GAME_STATE.postTranscendenceEventUpgradeCostMultiplier.toString()),
                    postTranscendenceEventGlobalProductionMultiplier: safeDecimal(parsed.postTranscendenceEventGlobalProductionMultiplier, INITIAL_GAME_STATE.postTranscendenceEventGlobalProductionMultiplier.toString()),
                    areEmbryoUpgradesDisabledThisRun: parsed.areEmbryoUpgradesDisabledThisRun ?? INITIAL_GAME_STATE.areEmbryoUpgradesDisabledThisRun,
                    postTranscendenceEventEnemyEXPMultiplier: safeDecimal(parsed.postTranscendenceEventEnemyEXPMultiplier, INITIAL_GAME_STATE.postTranscendenceEventEnemyEXPMultiplier.toString()),

                    currentStageIndex: parsed.currentStageIndex ?? INITIAL_GAME_STATE.currentStageIndex,
                    gameFinished: parsed.gameFinished ?? INITIAL_GAME_STATE.gameFinished,
                    animationFrameId: INITIAL_GAME_STATE.animationFrameId,
                    lastTick: INITIAL_GAME_STATE.lastTick,
                    userNickname: parsed.userNickname || INITIAL_GAME_STATE.userNickname,
                    hasPurchasedRegularUpgradeThisRun: parsed.hasPurchasedRegularUpgradeThisRun ?? INITIAL_GAME_STATE.hasPurchasedRegularUpgradeThisRun,
                    unlockedEggForms: Array.isArray(parsed.unlockedEggForms) ? parsed.unlockedEggForms : INITIAL_GAME_STATE.unlockedEggForms,
                    activeEggFormIds: Array.isArray(parsed.activeEggFormIds) ? parsed.activeEggFormIds : INITIAL_GAME_STATE.activeEggFormIds,
                    unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : INITIAL_GAME_STATE.unlockedAchievements,
                    unlockedTraits: Array.isArray(parsed.unlockedTraits) ? parsed.unlockedTraits : INITIAL_GAME_STATE.unlockedTraits,
                    activeTraits: Array.isArray(parsed.activeTraits) ? parsed.activeTraits : INITIAL_GAME_STATE.activeTraits,
                    maxActiveTraits: parsed.maxActiveTraits ?? INITIAL_GAME_STATE.maxActiveTraits,
                    isSoundEnabled: parsed.isSoundEnabled ?? INITIAL_GAME_STATE.isSoundEnabled,
                    isMusicEnabled: parsed.isMusicEnabled ?? INITIAL_GAME_STATE.isMusicEnabled,
                    lastPlayedTimestamp: parsed.lastPlayedTimestamp ?? Date.now(),
                    lastClickTime: parsed.lastClickTime ?? Date.now(),
                    currentEventData: parsed.currentEventData || null, // Will hold post-transcendence event if modal was open
                    lastUsedActiveAbilityId: parsed.lastUsedActiveAbilityId || null,
                    transcendenceSpamPenaltyActive: parsed.transcendenceSpamPenaltyActive ?? false,
                    lastLeadKeyClickTimestamp: parsed.lastLeadKeyClickTimestamp || 0,
                    lastTitheRitualTimestamp: parsed.lastTitheRitualTimestamp || 0,
                    secretRuptureSystemUnlocked: typeof parsed.secretRuptureSystemUnlocked === 'string' ? parsed.secretRuptureSystemUnlocked === 'true' : (parsed.secretRuptureSystemUnlocked ?? INITIAL_GAME_STATE.secretRuptureSystemUnlocked),
                    // showNicknameModal: parsed.showNicknameModal ?? INITIAL_GAME_STATE.showNicknameModal, // OLD LOGIC
                    showTraitModal: parsed.showTraitModal ?? INITIAL_GAME_STATE.showTraitModal,
                    showEventModal: parsed.showEventModal ?? INITIAL_GAME_STATE.showEventModal,
                    showAchievementPopup: parsed.showAchievementPopup ?? INITIAL_GAME_STATE.showAchievementPopup,
                    achievementPopupData: parsed.achievementPopupData || null,
                    showSettingsModal: parsed.showSettingsModal ?? INITIAL_GAME_STATE.showSettingsModal,
                    showOfflineGainModal: parsed.showOfflineGainModal ?? INITIAL_GAME_STATE.showOfflineGainModal,
                    combatLog: Array.isArray(parsed.combatLog) ? parsed.combatLog : [],
                    embryoIcon: parsed.embryoIcon || getEmbryoVisuals(safeDecimal(parsed.embryoLevel, INITIAL_GAME_STATE.embryoLevel.toString())).icon,
                    showCombatModal: parsed.showCombatModal ?? INITIAL_GAME_STATE.showCombatModal,
                    showEmbryoModal: parsed.showEmbryoModal ?? INITIAL_GAME_STATE.showEmbryoModal,
                    showEmbryoInventoryModal: parsed.showEmbryoInventoryModal ?? INITIAL_GAME_STATE.showEmbryoInventoryModal,
                    currentSlotToEquip: parsed.currentSlotToEquip ?? INITIAL_GAME_STATE.currentSlotToEquip,
                    message: null,

                    // New Trait Field Deserialization
                    plasmaPulseClickCounter: safeDecimal(parsed.plasmaPulseClickCounter, INITIAL_GAME_STATE.plasmaPulseClickCounter.toString()),
                    lastInteractionTime: parsed.lastInteractionTime ?? INITIAL_GAME_STATE.lastInteractionTime,
                    rupturePathChoicesCount: safeDecimal(parsed.rupturePathChoicesCount, INITIAL_GAME_STATE.rupturePathChoicesCount.toString()),
                    runsWithFiveDifferentTraitsCount: safeDecimal(parsed.runsWithFiveDifferentTraitsCount, INITIAL_GAME_STATE.runsWithFiveDifferentTraitsCount.toString()),
                    incubatorTypesOwnedThisRun: new Set(Array.isArray(parsed.incubatorTypesOwnedThisRun) ? parsed.incubatorTypesOwnedThisRun : []),
                    totalRunsTranscended: safeDecimal(parsed.totalRunsTranscended, INITIAL_GAME_STATE.totalRunsTranscended.toString()),
                    firstBossDefeatedThisRun: parsed.firstBossDefeatedThisRun ?? INITIAL_GAME_STATE.firstBossDefeatedThisRun,
                    uniqueEnemiesDefeatedThisRunByEmbryo: new Set(Array.isArray(parsed.uniqueEnemiesDefeatedThisRunByEmbryo) ? parsed.uniqueEnemiesDefeatedThisRunByEmbryo : []),
                    embryoLevel10ReachedCount: safeDecimal(parsed.embryoLevel10ReachedCount, INITIAL_GAME_STATE.embryoLevel10ReachedCount.toString()),
                    dailyLoginTracker: parsed.dailyLoginTracker || INITIAL_GAME_STATE.dailyLoginTracker,
                    quantumCoreActiveRandomTraitId: parsed.quantumCoreActiveRandomTraitId || null,
                    quantumCoreActiveRandomTraitDuration: safeDecimal(parsed.quantumCoreActiveRandomTraitDuration, INITIAL_GAME_STATE.quantumCoreActiveRandomTraitDuration.toString()),
                    quantumCoreInternalCooldown: safeDecimal(parsed.quantumCoreInternalCooldown, INITIAL_GAME_STATE.quantumCoreInternalCooldown.toString()),


                    upgradesData: (Array.isArray(parsed.upgradesData) ? parsed.upgradesData : INITIAL_REGULAR_UPGRADES).map(u => {
                        const initial = INITIAL_REGULAR_UPGRADES.find(initU => initU.id === u.id) || INITIAL_REGULAR_UPGRADES[0];
                        return { ...initial, ...u, baseCost: safeDecimal(u.baseCost, initial.baseCost.toString()), costMultiplier: safeDecimal(u.costMultiplier, initial.costMultiplier.toString()), effect: safeEffectDecimal(u.effect, initial.effect as { [key: string]: Decimal | boolean }), purchased: safeDecimal(u.purchased, initial.purchased.toString()), hidden: u.hidden !== undefined ? u.hidden : initial.hidden, };
                    }),
                    transcendentalBonusesData: (Array.isArray(parsed.transcendentalBonusesData) ? parsed.transcendentalBonusesData : INITIAL_TRANSCENDENTAL_BONUSES).map(b => {
                        const initial = INITIAL_TRANSCENDENTAL_BONUSES.find(initB => initB.id === b.id) || INITIAL_TRANSCENDENTAL_BONUSES[0];
                        return { ...initial, ...b, baseCost: safeDecimal(b.baseCost, initial.baseCost.toString()), costMultiplier: safeDecimal(b.costMultiplier, initial.costMultiplier.toString()), effect: safeEffectDecimal(b.effect, initial.effect as { [key: string]: Decimal | boolean }), purchased: safeDecimal(b.purchased, initial.purchased.toString()) };
                    }),
                    etPermanentUpgradesData: (Array.isArray(parsed.etPermanentUpgradesData) ? parsed.etPermanentUpgradesData : INITIAL_ET_PERMANENT_UPGRADES).map(epu => {
                        const initial = INITIAL_ET_PERMANENT_UPGRADES.find(initEPU => initEPU.id === epu.id) || INITIAL_ET_PERMANENT_UPGRADES[0];
                        return { ...initial, ...epu, baseCost: safeDecimal(epu.baseCost, initial.baseCost.toString()), costMultiplier: safeDecimal(epu.costMultiplier, initial.costMultiplier.toString()), effect: safeEffectDecimal(epu.effect, initial.effect as { [key: string]: Decimal | boolean }), purchased: safeDecimal(epu.purchased, initial.purchased.toString()), maxLevel: epu.maxLevel ? safeDecimal(epu.maxLevel, initial.maxLevel?.toString() || undefined) : undefined, };
                    }),
                    specialUpgradesData: (Array.isArray(parsed.specialUpgradesData) ? parsed.specialUpgradesData : initialSpecialUpgrades).map(su => {
                        const initial = initialSpecialUpgrades.find(initSU => initSU.id === su.id) || initialSpecialUpgrades[0];
                        return { ...initial, ...su, effect: safeEffectDecimal(su.effect, initial.effect as { [key: string]: Decimal | boolean }), purchased: safeDecimal(su.purchased, initial.purchased.toString()) };
                    }),
                    achievementsData: initialAchievements.map(initAch => {
                        const savedAchUnlocked = parsed.unlockedAchievements ? parsed.unlockedAchievements.includes(initAch.id) : initAch.unlocked;
                        const bonus = initAch.bonus ? Object.fromEntries(Object.entries(initAch.bonus).map(([k,val]) => [k, (typeof val === 'object' || typeof val === 'boolean') ? val : new Decimal(val as any)])) : undefined;
                        const effect = initAch.effect ? Object.fromEntries(Object.entries(initAch.effect).map(([k,val]) => [k, new Decimal(val as any)])) : undefined;
                        return {...initAch, bonus, effect, unlocked: savedAchUnlocked};
                    }),
                    activeAbilitiesData: (Array.isArray(parsed.activeAbilitiesData) ? parsed.activeAbilitiesData : INITIAL_ACTIVE_ABILITIES).map(aa => {
                        const initial = INITIAL_ACTIVE_ABILITIES.find(initAA => initAA.id === aa.id) || INITIAL_ACTIVE_ABILITIES[0];
                        return { ...initial, ...aa, cost: safeDecimal(aa.cost, initial.cost.toString()), cooldown: safeDecimal(aa.cooldown, initial.cooldown.toString()), cooldownRemaining: safeDecimal(aa.cooldownRemaining, initial.cooldownRemaining.toString()), tempEffectDuration: aa.tempEffectDuration ? safeDecimal(aa.tempEffectDuration, initial.tempEffectDuration?.toString()) : undefined, effect: safeEffectDecimal(aa.effect, initial.effect as { [key: string]: Decimal | boolean }) };
                    }),
                    legendaryUpgradesData: (Array.isArray(parsed.legendaryUpgradesData) ? parsed.legendaryUpgradesData : initialLegendaryUpgrades).map(lu => {
                         const initial = initialLegendaryUpgrades.find(initLU => initLU.id === lu.id) || initialLegendaryUpgrades[0];
                         return { ...initial, ...lu, effect: safeEffectDecimal(lu.effect, initial.effect as { [key: string]: Decimal | boolean }) };
                    }),
                    secretRuptureUpgradesData: (Array.isArray(parsed.secretRuptureUpgradesData) ? parsed.secretRuptureUpgradesData : initialSecretRuptureUpgradesSource).map(sru_serializable => {
                        const initial = initialSecretRuptureUpgradesSource.find(initSRU => initSRU.id === sru_serializable.id) || initialSecretRuptureUpgradesSource[0];
                        let deserializedParams: SecretRuptureUpgradeParams | undefined = undefined;
                        if (sru_serializable.params) {
                            deserializedParams = {};
                            const sParams = sru_serializable.params as SerializableSecretRuptureUpgradeParams;
                            if (sParams.basePIForBonus !== undefined) deserializedParams.basePIForBonus = safeDecimal(sParams.basePIForBonus);
                            if (sParams.piChunkForBonus !== undefined) deserializedParams.piChunkForBonus = safeDecimal(sParams.piChunkForBonus);
                            if (sParams.percentPerChunk !== undefined) deserializedParams.percentPerChunk = safeDecimal(sParams.percentPerChunk);
                            if (sParams.idleThresholdSeconds !== undefined) deserializedParams.idleThresholdSeconds = safeDecimal(sParams.idleThresholdSeconds);
                            if (sParams.bonusMultiplier !== undefined) deserializedParams.bonusMultiplier = safeDecimal(sParams.bonusMultiplier);
                            if (sParams.critEchoTriggerChance !== undefined) deserializedParams.critEchoTriggerChance = safeDecimal(sParams.critEchoTriggerChance);
                        }
                        return { ...initial, ...sru_serializable, params: deserializedParams || initial.params };
                    }),

                    activeTemporaryBuff: parsed.activeTemporaryBuff ? { ...parsed.activeTemporaryBuff, remainingDuration: safeDecimal(parsed.activeTemporaryBuff.remainingDuration, '0'), effect: safeEffectDecimal(parsed.activeTemporaryBuff.effect, INITIAL_GAME_STATE.activeTemporaryBuff?.effect || {}) } : null,
                    offlineGainData: parsed.offlineGainData ? { time: safeDecimal(parsed.offlineGainData.time), gain: safeDecimal(parsed.offlineGainData.gain) } : null,

                    transcendenceInfoData: parsed.transcendenceInfoData ? {
                        ...INITIAL_GAME_STATE.transcendenceInfoData, // Ensure all keys are present
                        currentTranscendenceCount: safeDecimal(parsed.transcendenceInfoData.currentTranscendenceCount, '0'),
                        accumulatedPI: safeDecimal(parsed.transcendenceInfoData.accumulatedPI, '0'),
                        requiredPiToTranscendNext: safeDecimal(parsed.transcendenceInfoData.requiredPiToTranscendNext, '0'),
                        etToGainNext: safeDecimal(parsed.transcendenceInfoData.etToGainNext, '0'),
                        newGlobalMultiplierPercentage: safeDecimal(parsed.transcendenceInfoData.newGlobalMultiplierPercentage, '0'),
                        milestones: (Array.isArray(parsed.transcendenceInfoData.milestones) ? parsed.transcendenceInfoData.milestones : []).map(m => {
                            let val = m.value;
                            if (m.rewardType === 'OFFLINE_GAIN_MULTIPLIER_INCREASE' && typeof m.value === 'string') {
                                val = safeDecimal(m.value);
                            }
                            return { ...m, value: val, isAchieved: m.isAchieved ?? false };
                        }),
                    } : null,
                    
                    embryoBaseStats: deserializeEmbryoStats(parsed.embryoBaseStats, INITIAL_GAME_STATE.embryoBaseStats),
                    embryoEffectiveStats: deserializeEmbryoStats(parsed.embryoEffectiveStats, INITIAL_GAME_STATE.embryoEffectiveStats), 
                    embryoInventory: Array.isArray(parsed.embryoInventory) ? parsed.embryoInventory.map(item => deserializeEmbryoItem(item, allPossibleEmbryoItemsForDeserialization)) : [],
                    equippedEmbryoItems: parsed.equippedEmbryoItems || { weapon: null, armor: null, passiveChip: null },
                    embryoShopItems: Array.isArray(parsed.embryoShopItems) ? parsed.embryoShopItems.map(item => deserializeEmbryoItem(item, allPossibleEmbryoItemsForDeserialization)) : INITIAL_EMBRYO_SHOP_ITEMS.map(i => ({...i})),


                    modularEXP: safeDecimal(parsed.modularEXP, '0'),
                    enemiesDefeatedTotal: safeDecimal(parsed.enemiesDefeatedTotal, '0'),
                    currentEnemy: parsed.currentEnemy ? { ...parsed.currentEnemy, id: parsed.currentEnemy.id || 'enemy_default', name: parsed.currentEnemy.name || 'Unknown Enemy', icon: parsed.currentEnemy.icon || ENEMY_PLACEHOLDER_ICONS[0], isBoss: parsed.currentEnemy.isBoss || false, currentHP: safeDecimal(parsed.currentEnemy.currentHP), maxHP: safeDecimal(parsed.currentEnemy.maxHP, '1') } : null,
                    embryoLevel: safeDecimal(parsed.embryoLevel, INITIAL_GAME_STATE.embryoLevel.toString()),
                    embryoCurrentEXP: safeDecimal(parsed.embryoCurrentEXP, '0'),
                    embryoEXPToNextLevel: safeDecimal(parsed.embryoEXPToNextLevel, getEmbryoNextLevelEXP(safeDecimal(parsed.embryoLevel, INITIAL_GAME_STATE.embryoLevel.toString())).toString()),
                    embryoUpgradesData: (Array.isArray(parsed.embryoUpgradesData) ? parsed.embryoUpgradesData : initialEmbryoUpgrades).map(eu => {
                        const initial = initialEmbryoUpgrades.find(initEU => initEU.id === eu.id) || initialEmbryoUpgrades[0];
                        return { ...initial, ...eu, cost: safeDecimal(eu.cost, initial.cost.toString()), effect: safeEffectDecimal(eu.effect, initial.effect as { [key: string]: Decimal | boolean }), purchased: eu.purchased !== undefined ? eu.purchased : initial.purchased };
                    }),
                    currentStageData: EGG_STAGES[parsed.currentStageIndex ?? INITIAL_GAME_STATE.currentStageIndex] || EGG_STAGES[0],
                    nextStageThreshold: EGG_STAGES[(parsed.currentStageIndex ?? INITIAL_GAME_STATE.currentStageIndex) + 1]?.threshold || null,
                };

                // Logic for showing nickname modal on load
                let finalShowNicknameModal = INITIAL_GAME_STATE.showNicknameModal; // Default to true if initial state says so
                if (parsed.userNickname && parsed.userNickname !== 'Jogador') {
                    // If a custom nickname is already saved, don't show the modal initially
                    finalShowNicknameModal = false;
                }
                // If parsed.showNicknameModal is explicitly saved (e.g., user quit with it open), respect that
                if (parsed.showNicknameModal !== undefined) {
                    finalShowNicknameModal = parsed.showNicknameModal;
                }
                loadedState.showNicknameModal = finalShowNicknameModal;


                const currentTime = Date.now();
                const offlineTimeInSeconds = new Decimal(currentTime).minus(loadedState.lastPlayedTimestamp).dividedBy(1000);
                if (offlineTimeInSeconds.greaterThan(60)) {
                    const baseIppsForOffline = loadedState.effectiveIpps; 
                    const offlineGainedIP = calculateOfflineIncubationPower(
                        offlineTimeInSeconds,
                        baseIppsForOffline, 
                        loadedState.offlineIncubationRate,
                        loadedState.unlockedAchievements.includes('incansavel'),
                        loadedState.specialUpgradesData,
                        loadedState.transcendenceCount
                    );
                    if (offlineGainedIP.greaterThan(0)) {
                        loadedState.incubationPower = loadedState.incubationPower.plus(offlineGainedIP);
                        loadedState.showOfflineGainModal = true;
                        loadedState.offlineGainData = { time: offlineTimeInSeconds, gain: offlineGainedIP };
                    }
                }
                loadedState.lastPlayedTimestamp = currentTime;

                if (!loadedState.currentEnemy) {
                    loadedState = spawnNextEnemyOnLoad(loadedState, true);
                }
            } catch (e) {
                console.error("Failed to parse saved game, starting new game:", e);
                localStorage.removeItem(GAME_SAVE_KEY);
                loadedState = {...INITIAL_GAME_STATE,
                    upgradesData: INITIAL_REGULAR_UPGRADES.map(u => ({...u})),
                    transcendentalBonusesData: INITIAL_TRANSCENDENTAL_BONUSES.map(b => ({...b})),
                    etPermanentUpgradesData: INITIAL_ET_PERMANENT_UPGRADES.map(epu => ({...epu})),
                    specialUpgradesData: INITIAL_SPECIAL_UPGRADES.map(su => ({...su})),
                    achievementsData: INITIAL_ACHIEVEMENTS.map(ach => ({...ach})),
                    activeAbilitiesData: INITIAL_ACTIVE_ABILITIES.map(aa => ({...aa})),
                    legendaryUpgradesData: INITIAL_LEGENDARY_UPGRADES.map(lu => ({...lu})),
                    secretRuptureUpgradesData: INITIAL_SECRET_RUPTURE_UPGRADES.map(sru => ({...sru})),
                    embryoUpgradesData: INITIAL_EMBRYO_UPGRADES.map(eu => ({...eu})),
                    embryoShopItems: INITIAL_EMBRYO_SHOP_ITEMS.map(item => ({...item})), 
                    currentStageData: EGG_STAGES[0],
                    nextStageThreshold: EGG_STAGES[1]?.threshold || null,
                    message: null,
                };
                loadedState = spawnNextEnemyOnLoad(loadedState, true);
            }
        } else {
            loadedState = {...INITIAL_GAME_STATE,
                upgradesData: INITIAL_REGULAR_UPGRADES.map(u => ({...u})),
                transcendentalBonusesData: INITIAL_TRANSCENDENTAL_BONUSES.map(b => ({...b})),
                etPermanentUpgradesData: INITIAL_ET_PERMANENT_UPGRADES.map(epu => ({...epu})),
                specialUpgradesData: INITIAL_SPECIAL_UPGRADES.map(su => ({...su})),
                achievementsData: INITIAL_ACHIEVEMENTS.map(ach => ({...ach})),
                activeAbilitiesData: INITIAL_ACTIVE_ABILITIES.map(aa => ({...aa})),
                legendaryUpgradesData: INITIAL_LEGENDARY_UPGRADES.map(lu => ({...lu})),
                secretRuptureUpgradesData: INITIAL_SECRET_RUPTURE_UPGRADES.map(sru => ({...sru})),
                embryoUpgradesData: INITIAL_EMBRYO_UPGRADES.map(eu => ({...eu})),
                embryoShopItems: INITIAL_EMBRYO_SHOP_ITEMS.map(item => ({...item})), 
                currentStageData: EGG_STAGES[0],
                nextStageThreshold: EGG_STAGES[1]?.threshold || null,
                message: null,
            };
            loadedState = spawnNextEnemyOnLoad(loadedState, true);
        }

        setGameState(loadedState);
        setIsLoading(false);
    }, []); 

    return [gameState, setGameState, isLoading];
};
