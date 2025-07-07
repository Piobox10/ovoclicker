
import { Decimal } from 'decimal.js';
import {
    EggStage, RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, EggForm, Achievement, Trait, ActiveAbility, GameState, GameEvent, LegendaryUpgrade, SecretRuptureUpgrade, SecretRuptureUpgradeParams, MetaUpgrade, MetaUpgradeEffect, EmbryoItemRarity,
    DailyMission, MissionReward, MissionStatus, MissionRewardType,
    HiddenDiscoveryState as OriginalHiddenDiscoveryState, 
    PlayerCollectibleEgg, 
    TranscendenceMilestoneInfo,
    TranscendenceInfoModalData,
    EggTeamBattleState, BattleEgg, BattleStatusEffectInstance, BattleEggRarity, FloatingText, BattleAbilityInstance, 
    BattleStats as OriginalBattleStats, BattleReward as OriginalBattleReward,
    LastAcquiredEggInfo, CollectibleEggDisplayRarity, ExpeditionRewardOption,
    Enemy, EnemyStatusEffect as OldEnemyStatusEffect, EmbryoUpgrade, EmbryoLevelMilestone, EmbryoStats, EmbryoItem, EmbryoItemEffect, FusedAttribute, EmbryoEquipmentSlotKey, GameEventOption, CosmicBankResourceType, ActiveTemporaryBuffState, BankedResourceInfo, SkinDefinition,
    SacredRelicUpgrade
} from './index'; 

// --- Helper Serializable Types ---
export type SerializableDecimal<T> = {
    [P in keyof T]: T[P] extends Decimal ? string :
                    T[P] extends Decimal | null ? string | null :
                    T[P] extends Decimal | undefined ? string | undefined :
                    T[P];
};

// --- Individual Serializable Types ---

export type SerializableEmbryoStats = SerializableDecimal<EmbryoStats>;
export type SerializableEmbryoItemEffect = SerializableDecimal<EmbryoItemEffect>;
export type SerializableFusedAttribute = SerializableDecimal<FusedAttribute>;

export interface SerializableEmbryoItem extends Omit<EmbryoItem, 'cost' | 'effects' | 'fusedAttributes' | 'rerollCostET'> {
    cost: {
        currency: 'modularEXP' | 'incubationPower' | 'transcendentEssence';
        amount: string;
    }[];
    effects: SerializableEmbryoItemEffect[];
    fusedAttributes?: SerializableFusedAttribute[];
    rerollCostET?: string;
}

export type SerializableBankedResourceInfo = SerializableDecimal<BankedResourceInfo>;
export type SerializableOldEnemyStatusEffect = SerializableDecimal<OldEnemyStatusEffect>; // For old combat system

export interface SerializableEnemy extends Omit<Enemy, 'currentHp' | 'maxHp' | 'attack' | 'defense' | 'speed' | 'critChance' | 'critDamageMultiplier' | 'dodgeChance' | 'baseAttack' | 'baseDefense' | 'baseSpeed' | 'baseCritChance' | 'baseCritDamageMultiplier' | 'baseDodgeChance' | 'attackIntervalSeconds' | 'attackTimerSeconds' | 'activeStatusEffects'> {
    currentHp: string; maxHp: string; attack: string; defense: string; speed: string; critChance: string; critDamageMultiplier: string; dodgeChance: string;
    baseAttack: string; baseDefense: string; baseSpeed: string; baseCritChance: string; baseCritDamageMultiplier: string; baseDodgeChance: string;
    attackIntervalSeconds: string; attackTimerSeconds: string; activeStatusEffects: SerializableOldEnemyStatusEffect[];
}

export interface SerializableMissionReward extends Omit<MissionReward, 'value' | 'buffDuration'> {
    value: string;
    buffDuration?: string;
}
export interface SerializableDailyMission extends Omit<DailyMission, 'targetValue' | 'currentProgress' | 'reward'> {
    targetValue: string;
    currentProgress: string;
    reward: SerializableMissionReward;
}

export interface SerializableHiddenDiscoveryState { 
  id: string;
  isDiscovered: boolean;
}


// Upgrades
export type SerializableEffectObject = { [key: string]: string | boolean | undefined | {rate: string; max: string} | { rarity?: EmbryoItemRarity, multiplier?: string } | { conditionMinTraits?: number, multiplier?: string } | { duration?: string, multiplier?: string } };


export interface SerializableRegularUpgrade extends Omit<RegularUpgrade, 'baseCost' | 'costMultiplier' | 'effect' | 'purchased' | 'maxLevel'> {
    baseCost: string; costMultiplier: string; effect: SerializableEffectObject; purchased: string; maxLevel?: string;
}
export interface SerializableTranscendentalBonus extends Omit<TranscendentalBonus, 'baseCost' | 'costMultiplier' | 'effect' | 'purchased' | 'maxLevel'> {
    baseCost: string; costMultiplier: string; effect: SerializableEffectObject; purchased: string; maxLevel?: string;
}
export interface SerializableEtPermanentUpgrade extends Omit<EtPermanentUpgrade, 'baseCost' | 'costMultiplier' | 'effect' | 'purchased' | 'maxLevel'> {
    baseCost: string; costMultiplier: string; effect: SerializableEffectObject; purchased: string; maxLevel?: string;
}
export interface SerializableSpecialUpgrade extends Omit<SpecialUpgrade, 'effect' | 'purchased'> {
    effect: SerializableEffectObject; purchased: string;
}
export interface SerializableActiveAbility extends Omit<ActiveAbility, 'cost' | 'cooldown' | 'cooldownRemaining' | 'tempEffectDuration' | 'effect'> {
    cost: string; cooldown: string; cooldownRemaining: string; tempEffectDuration?: string; effect: SerializableEffectObject;
}
export interface SerializableLegendaryUpgrade extends Omit<LegendaryUpgrade, 'effect'> {
    effect: SerializableEffectObject;
}
export interface SerializableSacredRelicUpgrade extends SacredRelicUpgrade {} // It's already serializable

export type SerializableSecretRuptureUpgradeParams = SerializableDecimal<SecretRuptureUpgradeParams>;
export interface SerializableSecretRuptureUpgrade extends Omit<SecretRuptureUpgrade, 'params'> {
    params?: SerializableSecretRuptureUpgradeParams;
}
export interface SerializableAchievement extends Omit<Achievement, 'condition' | 'bonus' | 'effect'> {
    bonus?: SerializableEffectObject; 
    effect?: SerializableEffectObject; 
}
export interface SerializableEmbryoUpgrade extends Omit<EmbryoUpgrade, 'effect' | 'purchased' | 'cost' | 'baseCost' | 'costMultiplier' | 'maxLevel'> {
    effect: SerializableEffectObject; purchased: string; cost?: string; baseCost?: string; costMultiplier?: string; maxLevel?: string;
}
export interface SerializableMetaUpgradeEffect extends Omit<MetaUpgradeEffect, 'activeAbilityStrengthBonusPerLevel' | 'etPerActiveFormOnTranscend' | 'chipEffectivenessMultiplier' | 'activeAbilityCooldownReductionPercent' | 'traitEffectivenessMultiplier' | 'globalIppsMultiplierPerLevel' > {
    activeAbilityStrengthBonusPerLevel?: string;
    etPerActiveFormOnTranscend?: string;
    chipEffectivenessMultiplier?: { rarity: EmbryoItemRarity, multiplier: string };
    activeAbilityCooldownReductionPercent?: string;
    traitEffectivenessMultiplier?: { conditionMinTraits: number, multiplier: string };
    globalIppsMultiplierPerLevel?: string;
    [key: string]: any;
}
export interface SerializableMetaUpgrade extends Omit<MetaUpgrade, 'cost' | 'maxLevel' | 'purchased' | 'costMultiplier' | 'effect' | 'unlockCondition'> {
    cost: string; maxLevel?: string; purchased: string; costMultiplier?: string; effect: SerializableMetaUpgradeEffect;
}


// Buffs and Modals
export interface SerializableActiveTemporaryBuffState extends Omit<ActiveTemporaryBuffState, 'remainingDuration' | 'effect'> {
    remainingDuration: string;
    effect: SerializableEffectObject;
}
export interface SerializableTranscendenceMilestoneInfo extends Omit<TranscendenceMilestoneInfo, 'value'> {
    value?: string | number; 
}
export interface SerializableTranscendenceInfoModalData extends Omit<TranscendenceInfoModalData, 'currentTranscendenceCount' | 'accumulatedPI' | 'requiredPiToTranscendNext' | 'etToGainNext' | 'newGlobalMultiplierPercentage' | 'milestones'> {
    currentTranscendenceCount: string; accumulatedPI: string; requiredPiToTranscendNext: string; etToGainNext: string; newGlobalMultiplierPercentage: string;
    milestones: SerializableTranscendenceMilestoneInfo[];
}

// Collectible Eggs Serializable Type
export interface SerializablePlayerCollectibleEgg {
  definitionId: string;
  collectedTimestamp: number;
  instanceId: string;
}

export interface SerializableLastAcquiredEggInfo {
  definitionId: string;
  instanceId: string;
  rarity: CollectibleEggDisplayRarity;
  timestamp: number;
  name: string;
  icon: string;
}

// --- Egg Team Battle Serializable Types ---
export interface SerializableFloatingText { 
  id: string;
  text: string;
  color: string;
  timestamp: number;
  duration: number;
  x: number;
  y: number;
  isCritical?: boolean;
}

export interface SerializableBattleStatusEffect extends Omit<BattleStatusEffectInstance, 'currentPotency' | 'originalValueBeforeEffect' | 'reflectionPercentage' | 'appliedMaxHpReduction'> {
  currentPotency: string; 
  originalValueBeforeEffect?: string;
  reflectionPercentage?: string;
  appliedMaxHpReduction?: string;
}
export interface SerializableBattleAbilityInstance extends BattleAbilityInstance {}

// Note: ExpeditionRewardOption is not serializable as it's runtime data.
// acquiredExpeditionUpgrades will be serialized as an array of IDs.
export interface SerializableExpeditionRewardOption extends Omit<ExpeditionRewardOption, 'apply'> {
  // apply function is not serializable
}

export interface SerializableBattleEgg extends Omit<BattleEgg, 'currentHp' | 'maxHp' | 'baseAttack' | 'baseDefense' | 'baseSpeed' | 'currentAttack' | 'currentDefense' | 'currentSpeed' | 'statusEffects' | 'currentResource' | 'maxResource' | 'abilities'> {
  currentHp: string; 
  maxHp: string;  
  baseAttack: string;
  baseDefense: string;
  baseSpeed: string;
  currentAttack: string;
  currentDefense: string;
  currentSpeed: string;
  statusEffects: SerializableBattleStatusEffect[];
  currentResource?: string;
  maxResource?: string;
  resourceName?: string; 
  abilities: SerializableBattleAbilityInstance[];
}

export interface SerializableBattleStats extends Omit<OriginalBattleStats, 'damageDealtByEgg' | 'healingDoneByEgg'> {
    damageDealtByEgg: { [eggInstanceId: string]: string };
    healingDoneByEgg: { [eggInstanceId: string]: string };
}

export interface SerializableBattleReward extends Omit<OriginalBattleReward, 'amount'> {
    amount?: string;
}

export interface SerializableEggTeamBattleState extends Omit<EggTeamBattleState, 
    'enemyTeam' | 
    'playerTeam' | 
    'floatingTexts' | 
    'playerTeamLineup' | 
    'selectedInventoryEggInstanceIdForPlacement' | 
    'turnOrder' | 
    'currentActingEggId' | 
    'battlePhase' | 
    'battleStats' | 
    'battleRewards' | 
    'lastPlayerStatusApplication' | 
    'lastOpponentStatusApplication' |
    'isExpeditionMode' |
    'currentExpeditionStage' |
    'expeditionOutcome' |
    'expeditionPlayerTeamSnapshot' |
    'expeditionDamageDealt' |
    'expeditionEggsDefeated' |
    // New fields to omit
    'showPostBattleChoiceModal' |
    'availablePostBattleChoices' |
    'acquiredExpeditionUpgrades' |
    'expeditionTeamBuffs' |
    'isAwaitingChoiceTarget' |
    'rewardToApplyOnTarget'
> {
    enemyTeam: SerializableBattleEgg[];
    playerTeam: SerializableBattleEgg[];
    floatingTexts: SerializableFloatingText[];
    isTeamSetupActive: boolean; 
    playerTeamLineup: (SerializableBattleEgg | null)[]; 
    selectedInventoryEggInstanceIdForPlacement: string | null; 
    turnOrder: string[]; 
    currentTurnIndex: number; 
    currentActingEggId: string | null; 
    battlePhase: GameState['eggTeamBattleState']['battlePhase']; 
    battleStats: SerializableBattleStats;
    battleRewards: SerializableBattleReward[];
    lastPlayerStatusApplication: GameState['eggTeamBattleState']['lastPlayerStatusApplication'];
    lastOpponentStatusApplication: GameState['eggTeamBattleState']['lastOpponentStatusApplication'];
    isExpeditionMode?: boolean;
    currentExpeditionStage?: number;
    expeditionOutcome?: 'victory' | 'defeat' | null;
    expeditionPlayerTeamSnapshot?: SerializableBattleEgg[] | null;
    expeditionDamageDealt?: string;
    expeditionEggsDefeated?: number;
    // New serializable fields
    acquiredExpeditionUpgradeIds?: string[];
    expeditionTeamBuffs?: SerializableActiveTemporaryBuffState[];
}
// --- End of Egg Team Battle Serializable Types ---


// --- Main Serializable GameState ---
export interface SerializableGameState extends Omit<GameState,
    // Decimal properties
    | 'incubationPower' | 'temporaryEggs' | 'clicksPerClick' | 'ipps' | 'effectiveClicksPerClick' | 'effectiveIpps'
    | 'transcendentEssence' | 'maxIncubationPowerAchieved' | 'totalClicksEver' | 'totalClicksThisRun'
    | 'transcendenceCount' | 'transcendencePassiveBonus' | 'offlineIncubationRate' | 'activeIdleTime'
    | 'abyssalIdleBonusTime' | 'transcendenceThreshold' | 'essencePerPI' | 'finalEggThreshold'
    | 'goldenBlessingMultiplier' | 'criticalClickChance' | 'effectiveCriticalClickChance' | 'softCapThresholdCPC'
    | 'softCapThresholdIPPS' | 'softCapScalingFactor' | 'explosaoIncubadoraTimer' | 'overclockCascaTimer'
    | 'impactoCriticoTimer' | 'furiaIncubadoraTimer' | 'curiosoTimer' | 'transcendenceSpamPenaltyDuration'
    | 'totalUpgradesPurchasedEver' | 'activePlayTime' | 'globalAbilityCooldownMultiplier' | 'servoDoOvoActiveMultiplier'
    | 'mestreDaEvolucaoBonus' | 'modularEXP' | 'enemiesDefeatedTotal' | 'embryoLevel' | 'embryoCurrentEXP'
    | 'embryoEXPToNextLevel' | 'plasmaPulseClickCounter' | 'rupturePathChoicesCount'
    | 'runsWithFiveDifferentTraitsCount' | 'totalRunsTranscended' | 'embryoLevel10ReachedCount'
    | 'quantumCoreActiveRandomTraitDuration' | 'quantumCoreInternalCooldown'
    | 'orbInverseGlobalPIProductionMultiplier' | 'orbInverseModularEXPGainMultiplier'
    | 'dualCoreUpgradeCostMultiplier' | 'dualCoreEXPGainDebuff' | 'dualCoreETGainDebuff'
    | 'forjaRessonanteBuffTimer' | 'toqueTrinoBuffTimer' | 'esporoIncandescenteIntervalTimer' | 'esporoIncandescenteBuffTimer'
    | 'furyPassiveBonusAmount' | 'furyPassiveBonusTimer'
    | 'entropySeedModularEXPGainMultiplier' | 'entropySeedGlobalPIProductionDebuff' | 'entropySeedPassiveProductionBuff'
    | 'periodicShieldCycleTimerSeconds' | 'periodicShieldClickCounter' 
    | 'eggFragments' | 'eggFragmentCostForRandomRoll'
    | 'perfectCycleBuffTimer' | 'stagnantTimeBuffTimer' | 'phoenixGlowCritClicksRemaining'
    | 'eloGeneticoBonusMultiplier' | 'enemiesDefeatedThisRun'
    | 'distorcaoRecorrenteClickCounter' | 'distorcaoRecorrenteStacks' | 'distorcaoRecorrenteTimer' | 'pulsoDaPerfeicaoClickCounter'
    | 'espiralInternaTimer' | 'espiralInternaStacks' | 'espiralInternaIntervalTimer' | 'eggFormsActivatedThisRun'
    | 'imortalidadePIBonus' | 'visaoFractalBuffTimer'
    // Complex object properties
    | 'upgradesData' | 'transcendentalBonusesData' | 'etPermanentUpgradesData' | 'specialUpgradesData'
    | 'activeAbilitiesData' | 'legendaryUpgradesData' | 'secretRuptureUpgradesData' | 'achievementsData'
    | 'embryoUpgradesData' | 'metaUpgradesData' | 'embryoBaseStats' | 'embryoEffectiveStats' | 'embryoInventory'
    | 'embryoShopItems' | 'currentEnemy' | 'cosmicBank' | 'dailyMissions' | 'hiddenDiscoveriesData' 
    | 'activeTemporaryBuffs' | 'transcendenceInfoData' | 'offlineGainData' | 'incubatorTypesOwnedThisRun'
    | 'uniqueEnemiesDefeatedThisRunByEmbryo' | 'lastFusedItem' | 'collectibleEggs' 
    | 'lastAcquiredCollectibleEggs' 
    | 'eggTeamBattleState'
    | 'sacredRelicsData' | 'availableSacredRelicChoices' | 'primordialTriggerUsedThisRun'
    // Properties not to be serialized (transient or derived or already serializable primitives)
    | 'currentStageData' | 'nextStageThreshold' | 'animationFrameId' | 'lastTick' | 'message' | 'activeTemporaryBuff' | 'showPrimordialTriggerModal'
    // Obsolete properties to ensure they are fully removed
    | 'clicksTowardsNextCollectibleEgg' 
> {
    // Decimal properties converted to string
    incubationPower: string; temporaryEggs: string; clicksPerClick: string; ipps: string; effectiveClicksPerClick: string; effectiveIpps: string;
    transcendentEssence: string; maxIncubationPowerAchieved: string; totalClicksEver: string; totalClicksThisRun: string;
    transcendenceCount: string; transcendencePassiveBonus: string; offlineIncubationRate: string; activeIdleTime: string;
    abyssalIdleBonusTime: string; transcendenceThreshold: string; essencePerPI: string; finalEggThreshold: string;
    goldenBlessingMultiplier: string; criticalClickChance: string; effectiveCriticalClickChance: string; softCapThresholdCPC: string;
    softCapThresholdIPPS: string; softCapScalingFactor: string; explosaoIncubadoraTimer: string; overclockCascaTimer: string;
    impactoCriticoTimer: string; furiaIncubadoraTimer: string; curiosoTimer: string; transcendenceSpamPenaltyDuration: string;
    totalUpgradesPurchasedEver: string; activePlayTime: string; globalAbilityCooldownMultiplier: string; servoDoOvoActiveMultiplier: string;
    mestreDaEvolucaoBonus: string; modularEXP: string; enemiesDefeatedTotal: string; embryoLevel: string; embryoCurrentEXP: string;
    embryoEXPToNextLevel: string; plasmaPulseClickCounter: string; rupturePathChoicesCount: string;
    runsWithFiveDifferentTraitsCount: string; totalRunsTranscended: string; embryoLevel10ReachedCount: string;
    quantumCoreActiveRandomTraitDuration: string; quantumCoreInternalCooldown: string;
    orbInverseGlobalPIProductionMultiplier: string; orbInverseModularEXPGainMultiplier: string;
    dualCoreUpgradeCostMultiplier: string; dualCoreEXPGainDebuff: string; dualCoreETGainDebuff: string;
    forjaRessonanteBuffTimer: string; toqueTrinoBuffTimer: string; esporoIncandescenteIntervalTimer: string; esporoIncandescenteBuffTimer: string;
    furyPassiveBonusAmount: string; furyPassiveBonusTimer: string;
    entropySeedModularEXPGainMultiplier: string; entropySeedGlobalPIProductionDebuff: string; entropySeedPassiveProductionBuff: string;
    periodicShieldCycleTimerSeconds: string; periodicShieldClickCounter: string;
    eggFragments: string;
    eggFragmentCostForRandomRoll: string;
    perfectCycleBuffTimer: string;
    stagnantTimeBuffTimer: string;
    phoenixGlowCritClicksRemaining: string;
    eloGeneticoBonusMultiplier: string;
    enemiesDefeatedThisRun: string;
    distorcaoRecorrenteClickCounter: string;
    distorcaoRecorrenteStacks: string;
    distorcaoRecorrenteTimer: string;
    pulsoDaPerfeicaoClickCounter: string;
    espiralInternaTimer: string;
    espiralInternaStacks: string;
    espiralInternaIntervalTimer: string;
    eggFormsActivatedThisRun: string[];
    imortalidadePIBonus: string;
    visaoFractalBuffTimer: string;

    // Specifically typed arrays/objects for serialization
    upgradesData: SerializableRegularUpgrade[];
    transcendentalBonusesData: SerializableTranscendentalBonus[];
    etPermanentUpgradesData: SerializableEtPermanentUpgrade[];
    specialUpgradesData: SerializableSpecialUpgrade[];
    activeAbilitiesData: SerializableActiveAbility[];
    legendaryUpgradesData: SerializableLegendaryUpgrade[];
    secretRuptureUpgradesData: SerializableSecretRuptureUpgrade[];
    sacredRelicsData: SerializableSacredRelicUpgrade[];
    achievementsData: SerializableAchievement[];
    embryoUpgradesData: SerializableEmbryoUpgrade[];
    metaUpgradesData: SerializableMetaUpgrade[];
    embryoBaseStats: SerializableEmbryoStats;
    embryoEffectiveStats: SerializableEmbryoStats;
    embryoInventory: SerializableEmbryoItem[];
    embryoShopItems: SerializableEmbryoItem[];
    currentEnemy: SerializableEnemy | null;
    cosmicBank: {
        pi: SerializableBankedResourceInfo;
        et: SerializableBankedResourceInfo;
        modularExp: SerializableBankedResourceInfo;
    };
    dailyMissions: SerializableDailyMission[];
    hiddenDiscoveriesData: SerializableHiddenDiscoveryState[];
    activeTemporaryBuffs: SerializableActiveTemporaryBuffState[];
    activeTemporaryBuff?: SerializableActiveTemporaryBuffState | null; // For backward compatibility
    transcendenceInfoData: SerializableTranscendenceInfoModalData | null;
    offlineGainData: { time: string; gain: string } | null;
    incubatorTypesOwnedThisRun: string[];
    uniqueEnemiesDefeatedThisRunByEmbryo: string[];
    lastFusedItem: SerializableEmbryoItem | null;
    collectibleEggs: SerializablePlayerCollectibleEgg[];
    abilitiesUsedThisRun: string[];
    lastAcquiredCollectibleEggs: SerializableLastAcquiredEggInfo[];
    eggTeamBattleState: SerializableEggTeamBattleState;
    availableSacredRelicChoices: SerializableSacredRelicUpgrade[];
    primordialTriggerUsedThisRun: boolean;
}
