import { Decimal } from 'decimal.js';
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, MetaUpgrade, SacredRelicUpgrade } from './Upgrades';
import { Achievement } from './Achievement';
import { BattleAbilityInstance, AbilityDefinition } from './Abilities'; // Added AbilityDefinition
import { BattleStatusEffectInstance, BattleStatusEffectType } from './StatusEffects'; // Added BattleStatusEffectType
import { EggStage }from './Egg';
import { LegendaryUpgrade } from './Upgrades';
import { GameEvent } from './Event';
import { Enemy, EnemyStatusEffect as OldEnemyStatusEffect } from './Combat';
import { EmbryoUpgrade, EmbryoStats, EmbryoItem, EmbryoEquipmentSlotKey, EmbryoItemEffect, FusedAttribute, EmbryoItemRarity } from './Embryo';
import { DailyMission } from './Missions';
import { HiddenDiscoveryState } from './HiddenDiscovery';
import { PlayerCollectibleEgg, CollectibleEggDefinition, CollectibleEggDisplayRarity } from './Collectibles'; // Added CollectibleEggDisplayRarity
import { BattleStats, BattleReward } from './Battle'; 

export interface ActiveTemporaryBuffState {
    id: string;
    remainingDuration: Decimal;
    name: string;
    icon: string;
    description: string;
    effect: { [key: string]: Decimal | boolean | undefined | { rate: Decimal; max: Decimal } };
    source?: 'ability' | 'mission' | 'event' | 'expedition_relic' | 'expedition_choice'; // Added expedition_relic
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
    unlockedTraits: string[];
    upgradesData: RegularUpgrade[]; // Changed from 'upgrades' to 'upgradesData'
    activeIdleTime: Decimal;
    activePlayTime: Decimal;
    totalUpgradesPurchasedEver: Decimal;
    enemiesDefeatedTotal?: Decimal;
    embryoLevel?: Decimal;
    modularEXP?: Decimal;
    rupturePathChoicesCount: Decimal;
    runsWithFiveDifferentTraitsCount: Decimal;
    incubatorTypesOwnedThisRun: Set<string>;
    totalRunsTranscended: Decimal;
    firstBossDefeatedThisRun: boolean;
    uniqueEnemiesDefeatedThisRunByEmbryo: Set<string>;
    embryoLevel10ReachedCount: Decimal;
    dailyLoginTracker: { morning: boolean, afternoon: boolean, night: boolean };
}

export interface BankedResourceInfo {
    depositedAmount: Decimal;
    depositTimestamp: number | null;
}

export type CosmicBankResourceType = 'pi' | 'et' | 'modularExp';

export type BattleEggRarity = 'Common' | 'Uncommon' | 'Rare' | 'Elite' | 'Boss' | 'Player' | EmbryoItemRarity;


export interface BattleEgg {
  instanceId: string;
  definitionId: string;
  name: string;
  icon: string;
  currentHp: Decimal;
  maxHp: Decimal;
  level: number;
  rarity: BattleEggRarity;

  baseAttack: Decimal;
  baseDefense: Decimal;
  baseSpeed: Decimal;

  currentAttack: Decimal;
  currentDefense: Decimal;
  currentSpeed: Decimal;

  statusEffects: BattleStatusEffectInstance[];
  isUsingAbility: boolean;
  avatarAnimationState: 'idle' | 'attacking' | 'hit' | 'casting' | 'defeated';
  currentResource?: Decimal;
  maxResource?: Decimal;
  resourceName?: string;
  abilities: BattleAbilityInstance[];
}

export interface FloatingText {
  id: string;
  text: string;
  color: string;
  timestamp: number;
  duration: number;
  x: number; // Position relative to target or screen center
  y: number; // Position relative to target or screen center
  icon?: string; // Optional icon for the floating text (e.g., sword, heart)
  sourceIsEnemy?: boolean; // True if the text originates from an enemy action
  targetId?: string; // Still useful for associating, even if not for direct CSS positioning
  isCritical?: boolean;
}

export type EggTeamBattlePhase =
  | 'setup'
  | 'initialization'
  | 'player_action_selection' 
  | 'enemy_action_selection'  
  | 'executing_action'
  | 'processing_effects'
  | 'round_start' 
  | 'turn_start' 
  | 'player_turn'
  | 'enemy_turn'
  | 'battle_over'
  | 'expedition_inter_stage_reward'
  | 'battle_over_expedition_stage_victory' // New phase for intermediate expedition stage victory
  | 'expedition_post_stage_choice'; // New phase for the post-battle choice system.

export interface LastStatusApplicationInfo {
    casterId: string;
    targetId: string;
    statusDefinitionId: string;
    isBuff: boolean;
    effectType: BattleStatusEffectType; 
}

export interface ExpeditionRewardOption {
    id: string;
    name: string;
    description: string;
    type: string; 
    rarity: 'comum' | 'incomum' | 'raro' | 'épico' | 'lendário';
    icon: string;
    apply: (gameState: GameState, targetEggId?: string) => GameState;
}


export interface EggTeamBattleState {
    isActive: boolean;
    battleName: string;
    currentRound: number; 
    totalRounds: number; 
    maxRounds: number; 
    combatSpeed: number;
    isPaused: boolean;
    roundTimer: number; 
    roundDuration: number; 
    enemyTeam: BattleEgg[];
    playerTeam: BattleEgg[];
    battleLog: string[];
    floatingTexts: FloatingText[];
    isTeamSetupActive: boolean;
    playerTeamLineup: (BattleEgg | null)[];
    selectedInventoryEggInstanceIdForPlacement: string | null;
    turnOrder: string[];
    currentTurnIndex: number;
    currentActingEggId: string | null;
    battlePhase: EggTeamBattlePhase;
    isBattleOver: boolean;
    winner: 'player' | 'enemy' | null;
    battleStats: BattleStats;
    battleRewards: BattleReward[];
    lastPlayerStatusApplication: LastStatusApplicationInfo | null; 
    lastOpponentStatusApplication: LastStatusApplicationInfo | null; 

    // Expedition Specific State
    isExpeditionMode: boolean;
    currentExpeditionStage: number; // 1-11
    expeditionOutcome: 'victory' | 'defeat' | null;
    expeditionPlayerTeamSnapshot: BattleEgg[] | null; // For retries
    expeditionDamageDealt: Decimal; // Total damage in expedition
    expeditionEggsDefeated: number; // Total player eggs lost in expedition

    // New Post-Battle Choice State
    showPostBattleChoiceModal: boolean;
    availablePostBattleChoices: ExpeditionRewardOption[];
    acquiredExpeditionUpgrades: ExpeditionRewardOption[];
    expeditionTeamBuffs: ActiveTemporaryBuffState[];
    isAwaitingChoiceTarget: boolean; // Flag for dramatic choices
    rewardToApplyOnTarget: ExpeditionRewardOption | null; // Store the reward awaiting a target
}

export interface LastAcquiredEggInfo {
  definitionId: string;
  instanceId: string;
  rarity: CollectibleEggDisplayRarity;
  timestamp: number;
  name: string; 
  icon: string; 
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
    achievementsData: Achievement[];
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

    currentEventData: GameEvent | null;

    explosaoIncubadoraTimer: Decimal;
    overclockCascaTimer: Decimal;
    impactoCriticoTimer: Decimal;
    furiaIncubadoraTimer: Decimal;
    lastUsedActiveAbilityId: string | null;
    curiosoTimer: Decimal;

    activeTemporaryBuffs: ActiveTemporaryBuffState[];

    transcendenceSpamPenaltyActive: boolean;
    transcendenceSpamPenaltyDuration: Decimal;

    lastLeadKeyClickTimestamp: number;
    lastTitheRitualTimestamp: number;

    upgradesData: RegularUpgrade[];
    transcendentalBonusesData: TranscendentalBonus[];
    etPermanentUpgradesData: EtPermanentUpgrade[];
    specialUpgradesData: SpecialUpgrade[];
    activeAbilitiesData: import('../types/Ability').ActiveAbility[];
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
    embryoIcon: string;
    embryoUpgradesData: EmbryoUpgrade[];

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

    orbInverseGlobalPIProductionMultiplier: Decimal;
    orbInverseModularEXPGainMultiplier: Decimal;
    orbInverseAbilitiesDisabled: boolean;

    entropySeedModularEXPGainMultiplier: Decimal;
    entropySeedGlobalPIProductionDebuff: Decimal;
    entropySeedPassiveProductionBuff: Decimal;
    entropySeedSpecialUpgradesDisabled: boolean;

    dualCoreMaxEggFormsActive: boolean;
    dualCoreUpgradeCostMultiplier: Decimal;
    dualCoreEXPGainDebuff: Decimal;
    dualCoreETGainDebuff: Decimal;

    fusaoBioquantumNextClickBuff: boolean;
    abilitiesUsedThisRun: string[];
    enemiesDefeatedThisRun: Decimal;

    furyPassiveBonusAmount: Decimal;
    furyPassiveBonusTimer: Decimal;

    forjaRessonanteBuffTimer: Decimal;
    toqueTrinoBuffTimer: Decimal;
    esporoIncandescenteIntervalTimer: Decimal;
    esporoIncandescenteBuffTimer: Decimal;

    hiddenDiscoveriesData: HiddenDiscoveryState[];
    metaUpgradesData: MetaUpgrade[];
    metaUpgradesUnlocked: boolean;

    cosmicBank: {
        pi: BankedResourceInfo;
        et: BankedResourceInfo;
        modularExp: BankedResourceInfo;
    };
    dailyMissions: DailyMission[];
    lastMissionGenerationDate: string | null;
    unlockedSkinIds: string[];
    activeSkinId: string;

    spentModularEXPThisRun: boolean;
    embryoTookDamageThisRun: boolean;
    reservatorioPsiquicoActive: boolean;
    justTranscended: boolean;

    fusionSelectedInventoryItemIds: string[];
    lastFusedItem: EmbryoItem | null;

    periodicShieldCycleTimerSeconds: Decimal;
    periodicShieldClickCounter: Decimal;

    collectibleEggs: PlayerCollectibleEgg[];
    eggFragments: Decimal; 
    eggFragmentCostForRandomRoll: Decimal; 
    lastAcquiredCollectibleEggs: LastAcquiredEggInfo[]; 

    eggTeamBattleState: EggTeamBattleState;

    // Sacred Relics
    sacredRelicsData: SacredRelicUpgrade[];
    perfectCycleBuffTimer: Decimal;
    stagnantTimeBuffTimer: Decimal;
    phoenixGlowCritClicksRemaining: Decimal;
    eloGeneticoBonusMultiplier: Decimal;
    showSacredRelicChoiceModal: boolean;
    availableSacredRelicChoices: SacredRelicUpgrade[];

    // New state for Stage 18 Bonus
    distorcaoRecorrenteClickCounter: Decimal;
    distorcaoRecorrenteStacks: Decimal;
    distorcaoRecorrenteTimer: Decimal;

    // New state for Stage 21 Bonus
    pulsoDaPerfeicaoClickCounter: Decimal;

    // New state for Stage 31 Bonus
    espiralInternaTimer: Decimal;
    espiralInternaStacks: Decimal;
    espiralInternaIntervalTimer: Decimal;

    // New state for Stage 28 Bonus
    eggFormsActivatedThisRun: Set<string>;
    
    // New state for Stage 35 Bonus
    primordialTriggerUsedThisRun: boolean;
    showPrimordialTriggerModal: boolean;

    // New states for Stages 36-39
    imortalidadePIBonus: Decimal;
    visaoFractalBuffTimer: Decimal;
}
