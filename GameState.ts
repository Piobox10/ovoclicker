
import { Decimal } from 'decimal.js';
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, SerializableSecretRuptureUpgrade } from './Upgrades';
import { Achievement } from './Achievement';
import { ActiveAbility } from './Ability';
import { EggStage }from './Egg';
import { LegendaryUpgrade } from './Upgrades';
import { GameEvent } from './Event';
import { Enemy } from './Combat';
import { EmbryoUpgrade, EmbryoStats, EmbryoItem, EmbryoEquipmentSlotKey, EmbryoItemEffect } from './Embryo'; // Added EmbryoItemEffect

export interface ActiveTemporaryBuffState {
    id: string;
    remainingDuration: Decimal;
    name: string;
    icon: string;
    description: string;
    effect: { [key: string]: Decimal | boolean | string };
}

export interface TranscendenceMilestoneInfo {
    count: number;
    description: string;
    rewardType: 'MAX_TRAITS_INCREASE' | 'UNLOCK_EGG_FORM' | 'OFFLINE_GAIN_MULTIPLIER_INCREASE' | 'UNLOCK_LEGENDARY_UPGRADE';
    value?: string | Decimal | number;
    isAchieved?: boolean;
}

export interface TranscendenceInfoModalData {
    currentTranscendenceCount: Decimal;
    accumulatedPI: Decimal;
    requiredPiToTranscendNext: Decimal;
    etToGainNext: Decimal;
    newGlobalMultiplierPercentage: Decimal;
    milestones: TranscendenceMilestoneInfo[];
}

export interface GameDataForAchievementCheck {
    incubationPower: Decimal;
    clicksPerClick: Decimal;
    ipps: Decimal;
    transcendentEssence: Decimal;
    currentStageIndex: number;
    totalClicksEver: Decimal;
    totalClicksThisRun: Decimal;
    hasPurchasedRegularUpgradeThisRun: boolean;
    transcendenceCount: Decimal;
    unlockedEggForms: string[];
    upgrades: RegularUpgrade[];
    activeIdleTime: Decimal;
    activePlayTime: Decimal;
    totalUpgradesPurchasedEver: Decimal;
    enemiesDefeatedTotal?: Decimal;
    embryoLevel?: Decimal;
    modularEXP?: Decimal;
    // New fields for trait achievements
    rupturePathChoicesCount: Decimal;
    runsWithFiveDifferentTraitsCount: Decimal; 
    incubatorTypesOwnedThisRun: Set<string>;
    totalRunsTranscended: Decimal;
    firstBossDefeatedThisRun: boolean;
    uniqueEnemiesDefeatedThisRunByEmbryo: Set<string>;
    embryoLevel10ReachedCount: Decimal;
    dailyLoginTracker: { morning: boolean; afternoon: boolean; night: boolean };
}


export interface GameState {
    incubationPower: Decimal;
    temporaryEggs: Decimal;
    clicksPerClick: Decimal;
    ipps: Decimal;
    effectiveClicksPerClick: Decimal;
    effectiveIpps: Decimal;
    transcendentEssence: Decimal;
    currentStageIndex: number;
    currentStageData: EggStage; 
    nextStageThreshold: Decimal | null; 
    gameFinished: boolean;
    animationFrameId: number | null;
    lastTick: number;
    maxIncubationPowerAchieved: Decimal;
    userNickname: string;
    totalClicksEver: Decimal;
    totalClicksThisRun: Decimal;
    hasPurchasedRegularUpgradeThisRun: boolean;
    transcendenceCount: Decimal;
    transcendencePassiveBonus: Decimal;
    unlockedEggForms: string[];
    activeEggFormIds: string[];
    unlockedAchievements: string[];
    unlockedTraits: string[];
    activeTraits: string[];
    maxActiveTraits: number;
    isSoundEnabled: boolean;
    isMusicEnabled: boolean;
    lastPlayedTimestamp: number;
    offlineIncubationRate: Decimal;
    lastClickTime: number;
    activeIdleTime: Decimal;
    abyssalIdleBonusTime: Decimal;
    transcendenceThreshold: Decimal;
    essencePerPI: Decimal;
    finalEggThreshold: Decimal;
    goldenBlessingMultiplier: Decimal;
    criticalClickChance: Decimal;
    effectiveCriticalClickChance: Decimal;

    softCapThresholdCPC: Decimal;
    softCapThresholdIPPS: Decimal;
    softCapScalingFactor: Decimal;

    currentEventData: GameEvent | null; // Used for post-transcendence events now

    explosaoIncubadoraTimer: Decimal;
    overclockCascaTimer: Decimal;
    impactoCriticoTimer: Decimal;
    furiaIncubadoraTimer: Decimal;
    lastUsedActiveAbilityId: string | null;
    curiosoTimer: Decimal;

    activeTemporaryBuff: ActiveTemporaryBuffState | null;

    transcendenceSpamPenaltyActive: boolean;
    transcendenceSpamPenaltyDuration: Decimal;

    lastLeadKeyClickTimestamp: number;
    lastTitheRitualTimestamp: number;

    upgradesData: RegularUpgrade[];
    transcendentalBonusesData: TranscendentalBonus[];
    etPermanentUpgradesData: EtPermanentUpgrade[];
    specialUpgradesData: SpecialUpgrade[];
    achievementsData: Achievement[];
    activeAbilitiesData: ActiveAbility[];
    legendaryUpgradesData: LegendaryUpgrade[];
    secretRuptureUpgradesData: import('./Upgrades').SecretRuptureUpgrade[]; 
    secretRuptureSystemUnlocked: boolean; 
    
    showNicknameModal: boolean;
    showTraitModal: boolean;
    showEventModal: boolean;
    showAchievementPopup: boolean;
    achievementPopupData: { name: string; icon: string } | null;
    showSettingsModal: boolean;
    showOfflineGainModal: boolean;
    offlineGainData: { time: Decimal; gain: Decimal } | null;
    showTranscendenceInfoModal: boolean;
    transcendenceInfoData: TranscendenceInfoModalData | null;

    totalUpgradesPurchasedEver: Decimal;
    activePlayTime: Decimal;
    globalAbilityCooldownMultiplier: Decimal;
    servoDoOvoActiveMultiplier: Decimal;
    mestreDaEvolucaoBonus: Decimal;

    modularEXP: Decimal;
    enemiesDefeatedTotal: Decimal;
    currentEnemy: Enemy | null;
    combatLog: string[];

    embryoLevel: Decimal;
    embryoCurrentEXP: Decimal;
    embryoEXPToNextLevel: Decimal;
    embryoUpgradesData: EmbryoUpgrade[];
    embryoIcon: string;

    embryoBaseStats: EmbryoStats;
    embryoEffectiveStats: EmbryoStats; 
    embryoInventory: EmbryoItem[];
    equippedEmbryoItems: { [key in EmbryoEquipmentSlotKey]: string | null }; 
    embryoShopItems: EmbryoItem[]; 

    showEmbryoInventoryModal: boolean;
    currentSlotToEquip: EmbryoEquipmentSlotKey | null;

    showCombatModal: boolean;
    showEmbryoModal: boolean;
    
    message: { text: string; id: number } | null;

    // New Trait Tracking Fields
    plasmaPulseClickCounter: Decimal;
    lastInteractionTime: number; 
    rupturePathChoicesCount: Decimal; 
    runsWithFiveDifferentTraitsCount: Decimal; 
    incubatorTypesOwnedThisRun: Set<string>; 
    totalRunsTranscended: Decimal; 
    firstBossDefeatedThisRun: boolean; 
    uniqueEnemiesDefeatedThisRunByEmbryo: Set<string>; 
    embryoLevel10ReachedCount: Decimal; 
    dailyLoginTracker: { morning: boolean, afternoon: boolean, night: boolean }; 
    quantumCoreActiveRandomTraitId: string | null; 
    quantumCoreActiveRandomTraitDuration: Decimal; 
    quantumCoreInternalCooldown: Decimal;

    // New Post-Transcendence Event Effect Flags
    postTranscendenceEventUpgradeCostMultiplier: Decimal;
    postTranscendenceEventGlobalProductionMultiplier: Decimal;
    areEmbryoUpgradesDisabledThisRun: boolean;
    postTranscendenceEventEnemyEXPMultiplier: Decimal;
}

export type SerializableEmbryoStats = { [K in keyof EmbryoStats]: string };
export type SerializableEmbryoItemEffect = Omit<EmbryoItemEffect, 'value'> & { value: string };
export type SerializableEmbryoItem = Omit<EmbryoItem, 'cost' | 'effects'> & {
    cost: { currency: string; amount: string };
    effects: SerializableEmbryoItemEffect[];
};


export type SerializableGameState = Omit<GameState,
  | 'incubationPower' | 'temporaryEggs' | 'clicksPerClick' | 'ipps' | 'effectiveClicksPerClick' | 'effectiveIpps'
  | 'transcendentEssence' | 'maxIncubationPowerAchieved' | 'totalClicksEver' | 'totalClicksThisRun'
  | 'transcendenceCount' | 'transcendencePassiveBonus' | 'offlineIncubationRate' | 'activeIdleTime'
  | 'abyssalIdleBonusTime' | 'transcendenceThreshold' | 'essencePerPI' | 'finalEggThreshold'
  | 'goldenBlessingMultiplier' | 'criticalClickChance' | 'effectiveCriticalClickChance'
  | 'explosaoIncubadoraTimer' | 'overclockCascaTimer' | 'impactoCriticoTimer' | 'furiaIncubadoraTimer' | 'curiosoTimer'
  | 'upgradesData' | 'transcendentalBonusesData' | 'etPermanentUpgradesData' | 'specialUpgradesData' | 'activeAbilitiesData' | 'legendaryUpgradesData'
  | 'offlineGainData' | 'activeTemporaryBuff' | 'transcendenceInfoData'
  | 'totalUpgradesPurchasedEver' | 'activePlayTime' | 'globalAbilityCooldownMultiplier' | 'servoDoOvoActiveMultiplier' | 'mestreDaEvolucaoBonus'
  | 'softCapThresholdCPC' | 'softCapThresholdIPPS' | 'softCapScalingFactor'
  | 'transcendenceSpamPenaltyDuration'
  | 'modularEXP' | 'enemiesDefeatedTotal' | 'currentEnemy' | 'embryoLevel' | 'embryoCurrentEXP' | 'embryoEXPToNextLevel' | 'embryoUpgradesData'
  | 'secretRuptureUpgradesData'
  | 'secretRuptureSystemUnlocked' 
  | 'currentStageData' | 'nextStageThreshold' | 'message' 
  | 'embryoBaseStats' | 'embryoEffectiveStats' | 'embryoInventory' | 'embryoShopItems'
  | 'currentSlotToEquip' 
  // New Trait Fields to Omit (Decimal/Set/Complex ones)
  | 'plasmaPulseClickCounter' | 'rupturePathChoicesCount' | 'runsWithFiveDifferentTraitsCount' 
  | 'incubatorTypesOwnedThisRun' | 'totalRunsTranscended' | 'uniqueEnemiesDefeatedThisRunByEmbryo'
  | 'embryoLevel10ReachedCount' | 'quantumCoreActiveRandomTraitDuration' | 'quantumCoreInternalCooldown'
  // New Post-Transcendence Event Flags to Omit (Decimal ones)
  | 'postTranscendenceEventUpgradeCostMultiplier' | 'postTranscendenceEventGlobalProductionMultiplier' 
  | 'postTranscendenceEventEnemyEXPMultiplier'
> & {
    incubationPower: string;
    temporaryEggs: string;
    clicksPerClick: string;
    ipps: string;
    effectiveClicksPerClick: string;
    effectiveIpps: string;
    transcendentEssence: string;
    maxIncubationPowerAchieved: string;
    totalClicksEver: string;
    totalClicksThisRun: string;
    transcendenceCount: string;
    transcendencePassiveBonus: string;
    offlineIncubationRate: string;
    activeIdleTime: string;
    abyssalIdleBonusTime: string;
    transcendenceThreshold: string;
    essencePerPI: string;
    finalEggThreshold: string;
    goldenBlessingMultiplier: string;
    criticalClickChance: string;
    effectiveCriticalClickChance: string;

    explosaoIncubadoraTimer: string;
    overclockCascaTimer: string;
    impactoCriticoTimer: string;
    furiaIncubadoraTimer: string;
    curiosoTimer: string;

    softCapThresholdCPC: string;
    softCapThresholdIPPS: string;
    softCapScalingFactor: string;

    activeTemporaryBuff: (Omit<ActiveTemporaryBuffState, 'remainingDuration' | 'effect'> & { remainingDuration: string; effect: { [key: string]: string | boolean } }) | null;

    transcendenceSpamPenaltyDuration: string;

    upgradesData: (Omit<RegularUpgrade, 'baseCost' | 'costMultiplier' | 'effect' | 'purchased'> & { baseCost: string; costMultiplier: string; effect: { [key: string]: string | boolean }; purchased: string })[];
    transcendentalBonusesData: (Omit<TranscendentalBonus, 'baseCost' | 'costMultiplier' | 'effect' | 'purchased'> & { baseCost: string; costMultiplier: string; effect: { [key: string]: string | boolean }; purchased: string })[];
    etPermanentUpgradesData: (Omit<EtPermanentUpgrade, 'baseCost' | 'costMultiplier' | 'effect' | 'purchased' | 'maxLevel'> & { baseCost: string; costMultiplier: string; effect: { [key: string]: string | boolean }; purchased: string; maxLevel?: string })[];
    specialUpgradesData: (Omit<SpecialUpgrade, 'effect' | 'purchased'> & { effect: { [key: string]: string | boolean }; purchased: string })[];
    activeAbilitiesData: (Omit<ActiveAbility, 'cost' | 'cooldown' | 'cooldownRemaining' | 'tempEffectDuration' | 'effect'> & { cost: string; cooldown: string; cooldownRemaining: string; tempEffectDuration?: string; effect: { [key: string]: string | boolean } })[];
    legendaryUpgradesData: (Omit<LegendaryUpgrade, 'effect'> & { effect: { [key: string]: string | boolean } })[];
    secretRuptureUpgradesData: SerializableSecretRuptureUpgrade[];
    secretRuptureSystemUnlocked: string; 
    offlineGainData: { time: string; gain: string } | null;
    transcendenceInfoData: (Omit<TranscendenceInfoModalData, 'currentTranscendenceCount'| 'accumulatedPI'| 'requiredPiToTranscendNext' | 'etToGainNext' | 'newGlobalMultiplierPercentage' | 'milestones'> & {
        currentTranscendenceCount: string;
        accumulatedPI: string;
        requiredPiToTranscendNext: string;
        etToGainNext: string;
        newGlobalMultiplierPercentage: string;
        milestones: TranscendenceMilestoneInfo[];
    }) | null;
    totalUpgradesPurchasedEver: string;
    activePlayTime: string;
    globalAbilityCooldownMultiplier: string;
    servoDoOvoActiveMultiplier: string;
    mestreDaEvolucaoBonus: string;

    modularEXP: string;
    enemiesDefeatedTotal: string;
    currentEnemy: (Omit<Enemy, 'currentHP' | 'maxHP'> & { currentHP: string, maxHP: string }) | null;
    embryoLevel: string;
    embryoCurrentEXP: string;
    embryoEXPToNextLevel: string;
    embryoUpgradesData: (Omit<EmbryoUpgrade, 'cost' | 'effect'> & { cost: string; effect: { [key: string]: string | boolean } })[];
    
    embryoBaseStats: SerializableEmbryoStats;
    embryoEffectiveStats: SerializableEmbryoStats;
    embryoInventory: SerializableEmbryoItem[]; 
    equippedEmbryoItems: { [key in EmbryoEquipmentSlotKey]: string | null }; 
    embryoShopItems: SerializableEmbryoItem[]; 
    
    showEmbryoInventoryModal: boolean; 
    currentSlotToEquip: EmbryoEquipmentSlotKey | null; 

    // New Serializable Trait Fields
    plasmaPulseClickCounter: string;
    lastInteractionTime: number; // number is fine
    rupturePathChoicesCount: string;
    runsWithFiveDifferentTraitsCount: string;
    incubatorTypesOwnedThisRun: string[];
    totalRunsTranscended: string;
    firstBossDefeatedThisRun: boolean; // boolean is fine
    uniqueEnemiesDefeatedThisRunByEmbryo: string[];
    embryoLevel10ReachedCount: string;
    dailyLoginTracker: { morning: boolean, afternoon: boolean, night: boolean }; // object with booleans is fine
    quantumCoreActiveRandomTraitId: string | null; // string | null is fine
    quantumCoreActiveRandomTraitDuration: string;
    quantumCoreInternalCooldown: string;

    // New Serializable Post-Transcendence Event Flags
    postTranscendenceEventUpgradeCostMultiplier: string;
    postTranscendenceEventGlobalProductionMultiplier: string;
    areEmbryoUpgradesDisabledThisRun: boolean; // boolean is fine
    postTranscendenceEventEnemyEXPMultiplier: string;
};
