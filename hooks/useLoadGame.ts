
import { useState, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import {
    GameState, SerializableGameState, SerializableEmbryoStats, EmbryoStats, EmbryoItem,
    EmbryoEquipmentSlotKey, BankedResourceInfo, SerializableBankedResourceInfo, SerializableEnemy, EmbryoItemRarity,
    DailyMission, SerializableDailyMission, MissionRarity, MissionRewardType, MissionStatus,
    HiddenDiscoveryState, SerializableHiddenDiscoveryState, FusedAttribute, SerializableEmbryoItem, SerializableEmbryoItemEffect,
    SerializableOldEnemyStatusEffect, PlayerCollectibleEgg, SerializablePlayerCollectibleEgg, SerializableEffectObject,
    EggTeamBattleState, SerializableEggTeamBattleState, BattleEgg, SerializableBattleEgg,
    BattleStatusEffectInstance, SerializableBattleStatusEffect, SerializableActiveTemporaryBuffState,
    FloatingText, SerializableFloatingText, EmbryoEquipmentType, BattleAbilityInstance,
    EmbryoStoreItemCategory, EggTeamBattlePhase, EnemyStatusEffect, BattleStats, BattleReward, LastStatusApplicationInfo, ExpeditionRewardOption, ActiveTemporaryBuffState
} from '../types';
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, LegendaryUpgrade, SecretRuptureUpgrade, SecretRuptureUpgradeParams, SerializableSecretRuptureUpgradeParams, SerializableSecretRuptureUpgrade, MetaUpgrade, SerializableMetaUpgrade } from '../types';
import { Achievement } from '../types'; // Renamed to avoid conflict with constant
import { ActiveAbility as GameActiveAbilityType } from '../types/Ability';
import { Enemy } from '../types';
import { EmbryoUpgrade } from '../types';
import {
    EGG_STAGES,
    ACHIEVEMENTS, 
    INITIAL_REGULAR_UPGRADES,
    INITIAL_TRANSCENDENTAL_BONUSES,
    INITIAL_ET_PERMANENT_UPGRADES,
    INITIAL_SPECIAL_UPGRADES,
    EGG_FORMS_DATA,
    INITIAL_ACTIVE_ABILITIES,
    INITIAL_GAME_STATE, 
    GAME_SAVE_KEY,
    TRANSCENDENCE_MILESTONES_CONFIG,
    INITIAL_LEGENDARY_UPGRADES,
    INITIAL_SECRET_RUPTURE_UPGRADES,
    INITIAL_EMBRYO_UPGRADES,
    EMBRYO_INITIAL_ICON,
    ENEMY_PLACEHOLDER_ICONS, BOSS_PLACEHOLDER_ICONS, BOSS_INTERVAL, BASE_ENEMY_HP, ENEMY_HP_SCALING_FACTOR, BOSS_HP_MULTIPLIER,
    INITIAL_EMBRYO_SHOP_ITEMS,
    BASE_ENEMY_ATTACK, ENEMY_ATTACK_SCALING_FACTOR, BASE_ENEMY_DEFENSE, ENEMY_DEFENSE_SCALING_FACTOR, BASE_ENEMY_SPEED, ENEMY_SPEED_SCALING_FACTOR, BASE_ENEMY_CRIT_CHANCE, BASE_ENEMY_CRIT_DAMAGE_MULTIPLIER, BASE_ENEMY_DODGE_CHANCE, BOSS_STAT_MULTIPLIER,
    ENEMY_BASE_ATTACK_INTERVAL_SECONDS, MAX_TEAM_SIZE, MAX_BATTLE_ROUNDS, MAX_OFFLINE_SECONDS
} from '../constants'; 
import { MISSION_REWARD_BUFFS } from '../constants/missions';
import { INITIAL_HIDDEN_DISCOVERY_DEFINITIONS } from '../constants/hiddenDiscoveries';
import { INITIAL_META_UPGRADES } from '../constants/skins';
import { SKIN_DEFINITIONS } from '../constants/skins';
import { ABILITY_DEFINITIONS } from '../constants/abilities';
import { STATUS_EFFECT_DEFINITIONS } from '../constants/statusEffects';
import { COLLECTIBLE_EGG_DEFINITIONS } from '../constants/collectibles';
import { EXPEDITION_REWARD_POOL } from '../constants/expeditionRewards';
import { calculateOfflineIncubationPower, getEmbryoNextLevelEXP, getEmbryoVisuals, safeDecimal, safeEffectDecimal, deserializeFusedAttributes } from '../utils';

export function spawnNextEnemyOnLoad(prevState: GameState, initialSpawn: boolean = false): GameState {
    const defeatedCount = initialSpawn ? new Decimal(0) : prevState.enemiesDefeatedTotal;
    const isBoss = defeatedCount.plus(1).modulo(BOSS_INTERVAL).isZero();

    let enemyName: string;
    let enemyIcon: string;
    let enemyBaseHPForCalc = BASE_ENEMY_HP;
    let statMultiplier = isBoss ? BOSS_STAT_MULTIPLIER : new Decimal(1);

    if (isBoss) {
        enemyName = `Chefe Guardião ${defeatedCount.dividedToIntegerBy(BOSS_INTERVAL).plus(1).toString()}`;
        enemyIcon = BOSS_PLACEHOLDER_ICONS[defeatedCount.dividedToIntegerBy(BOSS_INTERVAL).modulo(BOSS_PLACEHOLDER_ICONS.length).toNumber()];
        enemyBaseHPForCalc = enemyBaseHPForCalc.times(BOSS_HP_MULTIPLIER);
    } else {
        const nameSuffix = defeatedCount.modulo(5).plus(1);
        const nameBase = ["Casulo Fraturado", "Lodo Temporal", "Reflexo do Medo", "Eco Distorcido", "Cisco Cósmico"];
        enemyName = `${nameBase[defeatedCount.modulo(nameBase.length).toNumber()]} ${nameSuffix.toString()}`;
        enemyIcon = ENEMY_PLACEHOLDER_ICONS[defeatedCount.modulo(ENEMY_PLACEHOLDER_ICONS.length).toNumber()];
    }

    let maxHPValue = enemyBaseHPForCalc.times(ENEMY_HP_SCALING_FACTOR.pow(defeatedCount)).floor();
    
    // Apply Devourer's Eye effect if active during load
    const devourerEyeLegendary = prevState.legendaryUpgradesData.find(lu => lu.id === 'devourerEye' && lu.activated);
    if (devourerEyeLegendary) {
        maxHPValue = maxHPValue.times(2);
    }

    const newEnemy: Enemy = {
        id: `enemy_${Date.now()}_${defeatedCount.toString()}`,
        name: enemyName,
        icon: enemyIcon,
        currentHp: maxHPValue,
        maxHp: maxHPValue,
        attack: BASE_ENEMY_ATTACK.times(ENEMY_ATTACK_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(),
        defense: BASE_ENEMY_DEFENSE.times(ENEMY_DEFENSE_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(),
        speed: BASE_ENEMY_SPEED.times(ENEMY_SPEED_SCALING_FACTOR.pow(defeatedCount)).times(isBoss ? 1.1 : 1).floor(),
        critChance: BASE_ENEMY_CRIT_CHANCE.plus(defeatedCount.times(0.001)).clamp(0.05, 0.5),
        critDamageMultiplier: BASE_ENEMY_CRIT_DAMAGE_MULTIPLIER.plus(isBoss ? 0.5 : 0),
        dodgeChance: BASE_ENEMY_DODGE_CHANCE.plus(defeatedCount.times(0.0005)).clamp(0.05, 0.3),
        isBoss: isBoss,
        baseAttack: BASE_ENEMY_ATTACK.times(ENEMY_ATTACK_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(),
        baseDefense: BASE_ENEMY_DEFENSE.times(ENEMY_DEFENSE_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(),
        baseSpeed: BASE_ENEMY_SPEED.times(ENEMY_SPEED_SCALING_FACTOR.pow(defeatedCount)).times(isBoss ? 1.1 : 1).floor(),
        baseCritChance: BASE_ENEMY_CRIT_CHANCE.plus(defeatedCount.times(0.001)).clamp(0.05, 0.5),
        baseCritDamageMultiplier: BASE_ENEMY_CRIT_DAMAGE_MULTIPLIER.plus(isBoss ? 0.5 : 0),
        baseDodgeChance: BASE_ENEMY_DODGE_CHANCE.plus(defeatedCount.times(0.0005)).clamp(0.05, 0.3),
        attackIntervalSeconds: ENEMY_BASE_ATTACK_INTERVAL_SECONDS,
        attackTimerSeconds: new Decimal(0),
        activeStatusEffects: [],
    };

    let newCombatLog = prevState.combatLog;
    if (!initialSpawn) {
       newCombatLog = [`Novo oponente aparece: ${newEnemy.name}!`, ...newCombatLog].slice(0,5);
    } else if (prevState.combatLog.length === 0 && newEnemy) {
       newCombatLog = [`O primeiro confronto aguarda: ${newEnemy.name}!`];
    }
    return {...prevState, currentEnemy: newEnemy, combatLog: newCombatLog };
}

const deserializeEmbryoStats = (serializable?: SerializableEmbryoStats, initial?: EmbryoStats): EmbryoStats => {
    const defaultStats = initial || INITIAL_GAME_STATE.embryoBaseStats;
    if (!serializable) return { ...defaultStats };
    return {
        currentHp: safeDecimal(serializable.currentHp, defaultStats.currentHp.toString()),
        maxHp: safeDecimal(serializable.maxHp, defaultStats.maxHp.toString()),
        attack: safeDecimal(serializable.attack, defaultStats.attack.toString()),
        defense: safeDecimal(serializable.defense, defaultStats.defense.toString()),
        speed: safeDecimal(serializable.speed, defaultStats.speed.toString()),
        critChance: safeDecimal(serializable.critChance, defaultStats.critChance.toString()),
        poisonChance: safeDecimal(serializable.poisonChance, defaultStats.poisonChance.toString()),
        poisonDurationSeconds: safeDecimal(serializable.poisonDurationSeconds, defaultStats.poisonDurationSeconds.toString()),
        bossDamageBonus: safeDecimal(serializable.bossDamageBonus, defaultStats.bossDamageBonus.toString()),
        doubleHitChance: safeDecimal(serializable.doubleHitChance, defaultStats.doubleHitChance.toString()),
        lifestealRate: safeDecimal(serializable.lifestealRate, defaultStats.lifestealRate.toString()),
        chaosEffectChance: safeDecimal(serializable.chaosEffectChance, defaultStats.chaosEffectChance.toString()),
        enemyDelayChance: safeDecimal(serializable.enemyDelayChance, defaultStats.enemyDelayChance.toString()),
        damageReflection: safeDecimal(serializable.damageReflection, defaultStats.damageReflection.toString()),
        critResistance: safeDecimal(serializable.critResistance, defaultStats.critResistance.toString()),
        periodicShieldValue: safeDecimal(serializable.periodicShieldValue, defaultStats.periodicShieldValue.toString()),
        dodgeChance: safeDecimal(serializable.dodgeChance, defaultStats.dodgeChance.toString()),
        overallDamageReduction: safeDecimal(serializable.overallDamageReduction, defaultStats.overallDamageReduction.toString()),
        hpRegenPerInterval: safeDecimal(serializable.hpRegenPerInterval, defaultStats.hpRegenPerInterval.toString()),
        hpRegenPerMinute: safeDecimal(serializable.hpRegenPerMinute, defaultStats.hpRegenPerMinute.toString()),
        modularExpGainMultiplier: safeDecimal(serializable.modularExpGainMultiplier, defaultStats.modularExpGainMultiplier.toString()),
        shieldOnXpFull: safeDecimal(serializable.shieldOnXpFull, defaultStats.shieldOnXpFull.toString()),
        outgoingDamageMultiplier: safeDecimal(serializable.outgoingDamageMultiplier, defaultStats.outgoingDamageMultiplier.toString()),
        embryoIpps: safeDecimal(serializable.embryoIpps, defaultStats.embryoIpps.toString()),
        embryoClicksPerClick: safeDecimal(serializable.embryoClicksPerClick, defaultStats.embryoClicksPerClick.toString()),
        currentShield: safeDecimal(serializable.currentShield, defaultStats.currentShield.toString()),
        maxShield: safeDecimal(serializable.maxShield, defaultStats.maxShield.toString()),
        critDamageMultiplier: safeDecimal(serializable.critDamageMultiplier, defaultStats.critDamageMultiplier.toString()),
        positiveChaosEffectDuplicationChance: safeDecimal(serializable.positiveChaosEffectDuplicationChance, defaultStats.positiveChaosEffectDuplicationChance.toString()),
    };
};

const deserializeEmbryoItem = (serializable: SerializableEmbryoItem, initialItemData: EmbryoItem[]): EmbryoItem => {
    const baseItem = initialItemData.find(i => i.id === serializable.id);

    const deserialized: EmbryoItem = {
        id: serializable.id,
        instanceId: serializable.instanceId || (serializable.isFused ? serializable.id : undefined) || `fallback_${serializable.id}_${Date.now()}`,
        name: serializable.name || baseItem?.name || 'Item Desconhecido',
        description: serializable.description || baseItem?.description || 'Descrição desconhecida',
        icon: serializable.icon || baseItem?.icon || 'fas fa-question',
        rarity: serializable.rarity,
        equipmentType: serializable.equipmentType || baseItem?.equipmentType || 'PassiveChip',
        storeCategory: serializable.storeCategory || baseItem?.storeCategory || 'Especial',
        cost: Array.isArray(serializable.cost) ? serializable.cost.map(c => ({
            currency: c.currency as 'modularEXP' | 'incubationPower' | 'transcendentEssence',
            amount: safeDecimal(c.amount)
        })) : [],
        effects: serializable.effects.map(eff => ({
            stat: eff.stat as any,
            type: eff.type as 'flat' | 'percent_base',
            value: safeDecimal(eff.value),
        })),
        isEquipped: serializable.isEquipped ?? baseItem?.isEquipped ?? false,
        isFused: serializable.isFused ?? false,
        fusedName: serializable.fusedName,
        fusedAttributes: deserializeFusedAttributes(serializable.fusedAttributes as any[]),
        rerollCostET: serializable.rerollCostET ? safeDecimal(serializable.rerollCostET) : undefined,
    };
    return deserialized;
};


const deserializeBankedResourceInfo = (
    serializable: SerializableBankedResourceInfo | undefined,
    initial: BankedResourceInfo
): BankedResourceInfo => {
    if (!serializable) return { ...initial, depositedAmount: new Decimal(initial.depositedAmount) };
    return {
        depositedAmount: safeDecimal(serializable.depositedAmount, initial.depositedAmount.toString()),
        depositTimestamp: serializable.depositTimestamp ?? initial.depositTimestamp,
    };
};

const deserializeDailyMission = (sMission: SerializableDailyMission): DailyMission => {
    return {
      ...sMission,
      rarity: sMission.rarity as MissionRarity,
      status: sMission.status as MissionStatus,
      targetValue: safeDecimal(sMission.targetValue),
      currentProgress: safeDecimal(sMission.currentProgress),
      reward: {
        ...sMission.reward,
        type: sMission.reward.type as MissionRewardType,
        value: safeDecimal(sMission.reward.value),
        buffDuration: sMission.reward.buffDuration ? safeDecimal(sMission.reward.buffDuration) : undefined,
      },
      meta: sMission.meta || {},
    };
};

const deserializeCollectibleEggs = (serializedEggs?: SerializablePlayerCollectibleEgg[]): PlayerCollectibleEgg[] => {
    if (!Array.isArray(serializedEggs)) return [];
    return serializedEggs.map(sEgg => ({
        definitionId: sEgg.definitionId,
        collectedTimestamp: sEgg.collectedTimestamp,
        instanceId: sEgg.instanceId,
    }));
};

const deserializeFloatingText = (sText: SerializableFloatingText): FloatingText => {
    return sText;
};

const deserializeBattleStats = (sStats?: BattleStats, initialStats?: BattleStats): BattleStats => {
    const defaultStats = initialStats || INITIAL_GAME_STATE.eggTeamBattleState.battleStats;
    if (!sStats) return defaultStats;

    const damageDealtByEgg: { [key: string]: string } = {};
    for (const key in sStats.damageDealtByEgg) {
        damageDealtByEgg[key] = safeDecimal(sStats.damageDealtByEgg[key]).toString();
    }
    const healingDoneByEgg: { [key: string]: string } = {};
    for (const key in sStats.healingDoneByEgg) {
        healingDoneByEgg[key] = safeDecimal(sStats.healingDoneByEgg[key]).toString();
    }
    return { damageDealtByEgg, healingDoneByEgg };
};

const deserializeBattleRewards = (sRewards?: BattleReward[], initialRewards?: BattleReward[]): BattleReward[] => {
    const defaultRewards = initialRewards || INITIAL_GAME_STATE.eggTeamBattleState.battleRewards;
    if (!sRewards || !Array.isArray(sRewards)) return defaultRewards;
    return sRewards.map(r => ({
        ...r,
        amount: r.amount ? safeDecimal(r.amount).toString() : undefined,
    }));
};

const deserializeBattleStatusEffectInstance = (sEffect: SerializableBattleStatusEffect): BattleStatusEffectInstance => {
  const definition = STATUS_EFFECT_DEFINITIONS.find(def => def.id === sEffect.definitionId) || STATUS_EFFECT_DEFINITIONS.find(def => def.id === 'placeholder_undefined_status')!;
  return {
    instanceId: sEffect.instanceId,
    definitionId: sEffect.definitionId,
    name: sEffect.name || definition.name,
    icon: sEffect.icon || definition.icon,
    description: sEffect.description || definition.description,
    type: sEffect.type || definition.type,
    effectType: sEffect.effectType || definition.effectType,
    remainingDurationTurns: sEffect.remainingDurationTurns,
    currentPotency: safeDecimal(sEffect.currentPotency, definition.baseTickValue?.toString() || definition.changeValue?.toString() || definition.shieldValue?.toString() || '0'),
    statToChange: sEffect.statToChange || definition.statToChange,
    originalValueBeforeEffect: sEffect.originalValueBeforeEffect ? safeDecimal(sEffect.originalValueBeforeEffect) : undefined,
    ticksApplied: sEffect.ticksApplied,
    stacks: sEffect.stacks,
    appliedByInstanceId: sEffect.appliedByInstanceId,
    reflectionPercentage: sEffect.reflectionPercentage ? safeDecimal(sEffect.reflectionPercentage) : undefined,
    appliedMaxHpReduction: sEffect.appliedMaxHpReduction ? safeDecimal(sEffect.appliedMaxHpReduction) : undefined,
  };
};

const deserializeBattleAbilityInstance = (sAbility: BattleAbilityInstance): BattleAbilityInstance => {
  const definition = ABILITY_DEFINITIONS.find(def => def.id === sAbility.definitionId) || ABILITY_DEFINITIONS.find(def => def.id === 'placeholder_undefined_ability')!;
  return {
    ...sAbility,
    name: sAbility.name || definition.name,
    icon: sAbility.icon || definition.icon,
  };
};


const deserializeBattleEgg = (sEgg: SerializableBattleEgg): BattleEgg => {
    const defaultIcon = 'fas fa-egg';
    const initialEggState = INITIAL_GAME_STATE.eggTeamBattleState.enemyTeam[0] || {} as BattleEgg; // Fallback

    return {
        instanceId: sEgg.instanceId,
        definitionId: sEgg.definitionId,
        name: sEgg.name || 'Ovo Desconhecido',
        icon: sEgg.icon || defaultIcon,
        currentHp: safeDecimal(sEgg.currentHp, initialEggState.currentHp?.toString() || '100'),
        maxHp: safeDecimal(sEgg.maxHp, initialEggState.maxHp?.toString() || '100'),
        level: sEgg.level || 1,
        rarity: sEgg.rarity || 'Common',
        baseAttack: safeDecimal(sEgg.baseAttack, initialEggState.baseAttack?.toString() || '10'),
        baseDefense: safeDecimal(sEgg.baseDefense, initialEggState.baseDefense?.toString() || '5'),
        baseSpeed: safeDecimal(sEgg.baseSpeed, initialEggState.baseSpeed?.toString() || '5'),
        currentAttack: safeDecimal(sEgg.currentAttack, initialEggState.currentAttack?.toString() || '10'),
        currentDefense: safeDecimal(sEgg.currentDefense, initialEggState.currentDefense?.toString() || '5'),
        currentSpeed: safeDecimal(sEgg.currentSpeed, initialEggState.currentSpeed?.toString() || '5'),
        statusEffects: Array.isArray(sEgg.statusEffects) ? sEgg.statusEffects.map(deserializeBattleStatusEffectInstance) : [],
        isUsingAbility: sEgg.isUsingAbility || false,
        avatarAnimationState: sEgg.avatarAnimationState || 'idle',
        currentResource: sEgg.currentResource ? safeDecimal(sEgg.currentResource, initialEggState.currentResource?.toString() || '0') : undefined,
        maxResource: sEgg.maxResource ? safeDecimal(sEgg.maxResource, initialEggState.maxResource?.toString() || '0') : undefined,
        resourceName: sEgg.resourceName || initialEggState.resourceName,
        abilities: Array.isArray(sEgg.abilities) ? sEgg.abilities.map(deserializeBattleAbilityInstance) : [],
    };
};

const deserializeEggTeamBattleState = (sBattleState?: SerializableEggTeamBattleState): EggTeamBattleState => {
    const initialBattleState = INITIAL_GAME_STATE.eggTeamBattleState;
    if (!sBattleState) return initialBattleState;

    const deserializeBuff = (sBuff: SerializableActiveTemporaryBuffState): ActiveTemporaryBuffState => ({
      ...sBuff,
      remainingDuration: safeDecimal(sBuff.remainingDuration),
      effect: safeEffectDecimal(sBuff.effect, {}),
    });

    return {
        isActive: sBattleState.isActive,
        battleName: sBattleState.battleName || initialBattleState.battleName,
        currentRound: sBattleState.currentRound !== undefined ? sBattleState.currentRound : initialBattleState.currentRound,
        totalRounds: sBattleState.totalRounds || initialBattleState.totalRounds,
        maxRounds: sBattleState.maxRounds !== undefined ? sBattleState.maxRounds : MAX_BATTLE_ROUNDS,
        combatSpeed: sBattleState.combatSpeed || initialBattleState.combatSpeed,
        isPaused: sBattleState.isPaused,
        roundTimer: sBattleState.roundTimer || initialBattleState.roundTimer,
        roundDuration: sBattleState.roundDuration || initialBattleState.roundDuration,
        enemyTeam: Array.isArray(sBattleState.enemyTeam) ? sBattleState.enemyTeam.map(deserializeBattleEgg) : initialBattleState.enemyTeam,
        playerTeam: Array.isArray(sBattleState.playerTeam) ? sBattleState.playerTeam.map(deserializeBattleEgg) : initialBattleState.playerTeam,
        battleLog: Array.isArray(sBattleState.battleLog) ? sBattleState.battleLog : initialBattleState.battleLog,
        floatingTexts: Array.isArray(sBattleState.floatingTexts) ? sBattleState.floatingTexts.map(deserializeFloatingText) : initialBattleState.floatingTexts,
        isTeamSetupActive: sBattleState.isTeamSetupActive !== undefined ? sBattleState.isTeamSetupActive : initialBattleState.isTeamSetupActive,
        playerTeamLineup: Array.isArray(sBattleState.playerTeamLineup) ? sBattleState.playerTeamLineup.map(eggOrNull => eggOrNull ? deserializeBattleEgg(eggOrNull) : null) : initialBattleState.playerTeamLineup,
        selectedInventoryEggInstanceIdForPlacement: sBattleState.selectedInventoryEggInstanceIdForPlacement !== undefined ? sBattleState.selectedInventoryEggInstanceIdForPlacement : initialBattleState.selectedInventoryEggInstanceIdForPlacement,
        turnOrder: Array.isArray(sBattleState.turnOrder) ? sBattleState.turnOrder : initialBattleState.turnOrder,
        currentTurnIndex: sBattleState.currentTurnIndex !== undefined ? sBattleState.currentTurnIndex : initialBattleState.currentTurnIndex,
        currentActingEggId: sBattleState.currentActingEggId !== undefined ? sBattleState.currentActingEggId : initialBattleState.currentActingEggId,
        battlePhase: (sBattleState.battlePhase || initialBattleState.battlePhase) as EggTeamBattlePhase,
        isBattleOver: sBattleState.isBattleOver !== undefined ? sBattleState.isBattleOver : initialBattleState.isBattleOver,
        winner: sBattleState.winner !== undefined ? sBattleState.winner : initialBattleState.winner,
        battleStats: deserializeBattleStats(sBattleState.battleStats as BattleStats, initialBattleState.battleStats),
        battleRewards: deserializeBattleRewards(sBattleState.battleRewards as BattleReward[], initialBattleState.battleRewards),
        lastPlayerStatusApplication: sBattleState.lastPlayerStatusApplication || null,
        lastOpponentStatusApplication: sBattleState.lastOpponentStatusApplication || null,
        isExpeditionMode: sBattleState.isExpeditionMode !== undefined ? sBattleState.isExpeditionMode : initialBattleState.isExpeditionMode,
        currentExpeditionStage: sBattleState.currentExpeditionStage !== undefined ? sBattleState.currentExpeditionStage : initialBattleState.currentExpeditionStage,
        expeditionOutcome: sBattleState.expeditionOutcome !== undefined ? sBattleState.expeditionOutcome : initialBattleState.expeditionOutcome,
        expeditionPlayerTeamSnapshot: Array.isArray(sBattleState.expeditionPlayerTeamSnapshot) ? sBattleState.expeditionPlayerTeamSnapshot.map(deserializeBattleEgg) : initialBattleState.expeditionPlayerTeamSnapshot,
        expeditionDamageDealt: safeDecimal(sBattleState.expeditionDamageDealt, initialBattleState.expeditionDamageDealt.toString()),
        expeditionEggsDefeated: sBattleState.expeditionEggsDefeated ?? initialBattleState.expeditionEggsDefeated,
        showPostBattleChoiceModal: initialBattleState.showPostBattleChoiceModal,
        availablePostBattleChoices: initialBattleState.availablePostBattleChoices,
        acquiredExpeditionUpgrades: Array.isArray(sBattleState.acquiredExpeditionUpgradeIds)
            ? sBattleState.acquiredExpeditionUpgradeIds
                .map(id => EXPEDITION_REWARD_POOL.find(reward => reward.id === id))
                .filter((r): r is ExpeditionRewardOption => !!r)
            : initialBattleState.acquiredExpeditionUpgrades,
        expeditionTeamBuffs: Array.isArray(sBattleState.expeditionTeamBuffs) ? sBattleState.expeditionTeamBuffs.map(deserializeBuff) : initialBattleState.expeditionTeamBuffs,
        isAwaitingChoiceTarget: initialBattleState.isAwaitingChoiceTarget,
        rewardToApplyOnTarget: initialBattleState.rewardToApplyOnTarget,
    };
};

export const useLoadGame = (): [GameState, React.Dispatch<React.SetStateAction<GameState>>, boolean] => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedGameJSON = localStorage.getItem(GAME_SAVE_KEY);
      if (savedGameJSON) {
        const parsedState: SerializableGameState = JSON.parse(savedGameJSON);

        if (parsedState.incubationPower !== undefined) {
          const deserializeBuff = (sBuff: SerializableActiveTemporaryBuffState): ActiveTemporaryBuffState => ({
              ...sBuff,
              remainingDuration: safeDecimal(sBuff.remainingDuration),
              effect: safeEffectDecimal(sBuff.effect, {}),
          });

          const loadedState: GameState = {
              ...INITIAL_GAME_STATE, // Start with defaults
              // Primitives and simple types
              userNickname: parsedState.userNickname || INITIAL_GAME_STATE.userNickname,
              currentStageIndex: parsedState.currentStageIndex,
              gameFinished: parsedState.gameFinished,
              maxActiveTraits: parsedState.maxActiveTraits,
              isSoundEnabled: parsedState.isSoundEnabled,
              isMusicEnabled: parsedState.isMusicEnabled,
              lastPlayedTimestamp: parsedState.lastPlayedTimestamp,
              hasPurchasedRegularUpgradeThisRun: parsedState.hasPurchasedRegularUpgradeThisRun,
              unlockedEggForms: Array.isArray(parsedState.unlockedEggForms) ? parsedState.unlockedEggForms : [],
              activeEggFormIds: Array.isArray(parsedState.activeEggFormIds) ? parsedState.activeEggFormIds : [],
              unlockedAchievements: Array.isArray(parsedState.unlockedAchievements) ? parsedState.unlockedAchievements : [],
              unlockedTraits: Array.isArray(parsedState.unlockedTraits) ? parsedState.unlockedTraits : [],
              activeTraits: Array.isArray(parsedState.activeTraits) ? parsedState.activeTraits : [],
              secretRuptureSystemUnlocked: parsedState.secretRuptureSystemUnlocked,
              lastLeadKeyClickTimestamp: parsedState.lastLeadKeyClickTimestamp,
              lastTitheRitualTimestamp: parsedState.lastTitheRitualTimestamp,
              totalRunsTranscended: safeDecimal(parsedState.totalRunsTranscended),
              rupturePathChoicesCount: safeDecimal(parsedState.rupturePathChoicesCount),
              runsWithFiveDifferentTraitsCount: safeDecimal(parsedState.runsWithFiveDifferentTraitsCount),
              embryoLevel10ReachedCount: safeDecimal(parsedState.embryoLevel10ReachedCount),
              firstBossDefeatedThisRun: parsedState.firstBossDefeatedThisRun,
              dailyLoginTracker: parsedState.dailyLoginTracker || INITIAL_GAME_STATE.dailyLoginTracker,
              incubatorTypesOwnedThisRun: new Set(parsedState.incubatorTypesOwnedThisRun),
              uniqueEnemiesDefeatedThisRunByEmbryo: new Set(parsedState.uniqueEnemiesDefeatedThisRunByEmbryo),
              // Decimals
              incubationPower: safeDecimal(parsedState.incubationPower),
              temporaryEggs: safeDecimal(parsedState.temporaryEggs),
              clicksPerClick: safeDecimal(parsedState.clicksPerClick),
              ipps: safeDecimal(parsedState.ipps),
              transcendentEssence: safeDecimal(parsedState.transcendentEssence),
              transcendenceCount: safeDecimal(parsedState.transcendenceCount),
              transcendencePassiveBonus: safeDecimal(parsedState.transcendencePassiveBonus),
              totalClicksEver: safeDecimal(parsedState.totalClicksEver),
              totalClicksThisRun: safeDecimal(parsedState.totalClicksThisRun),
              maxIncubationPowerAchieved: safeDecimal(parsedState.maxIncubationPowerAchieved),
              offlineIncubationRate: safeDecimal(parsedState.offlineIncubationRate),
              criticalClickChance: safeDecimal(parsedState.criticalClickChance),
              modularEXP: safeDecimal(parsedState.modularEXP),
              embryoLevel: safeDecimal(parsedState.embryoLevel),
              embryoCurrentEXP: safeDecimal(parsedState.embryoCurrentEXP),
              enemiesDefeatedTotal: safeDecimal(parsedState.enemiesDefeatedTotal),
              activePlayTime: safeDecimal(parsedState.activePlayTime),
              // Complex Arrays/Objects that need mapping
              upgradesData: INITIAL_REGULAR_UPGRADES.map(initUpg => {
                  const savedUpg = parsedState.upgradesData?.find(s => s.id === initUpg.id);
                  return savedUpg ? { ...initUpg, purchased: safeDecimal(savedUpg.purchased) } : initUpg;
              }),
              transcendentalBonusesData: INITIAL_TRANSCENDENTAL_BONUSES.map(initBonus => {
                  const savedBonus = parsedState.transcendentalBonusesData?.find(s => s.id === initBonus.id);
                  return savedBonus ? { ...initBonus, purchased: safeDecimal(savedBonus.purchased) } : initBonus;
              }),
              etPermanentUpgradesData: INITIAL_ET_PERMANENT_UPGRADES.map(initEpu => {
                  const savedEpu = parsedState.etPermanentUpgradesData?.find(s => s.id === initEpu.id);
                  return savedEpu ? { ...initEpu, purchased: safeDecimal(savedEpu.purchased) } : initEpu;
              }),
              specialUpgradesData: INITIAL_SPECIAL_UPGRADES.map(initSu => {
                  const savedSu = parsedState.specialUpgradesData?.find(s => s.id === initSu.id);
                  return savedSu ? { ...initSu, purchased: safeDecimal(savedSu.purchased) } : initSu;
              }),
              activeAbilitiesData: INITIAL_ACTIVE_ABILITIES.map(initAa => {
                  const savedAa = parsedState.activeAbilitiesData?.find(s => s.id === initAa.id);
                  return savedAa ? { ...initAa, purchased: savedAa.purchased, cooldownRemaining: safeDecimal(savedAa.cooldownRemaining) } : initAa;
              }),
              legendaryUpgradesData: INITIAL_LEGENDARY_UPGRADES.map(initLu => {
                  const savedLu = parsedState.legendaryUpgradesData?.find(s => s.id === initLu.id);
                  return savedLu ? { ...initLu, activated: savedLu.activated } : initLu;
              }),
              sacredRelicsData: INITIAL_GAME_STATE.sacredRelicsData.map(initSr => {
                  const savedSr = parsedState.sacredRelicsData?.find(s => s.id === initSr.id);
                  return savedSr ? { ...initSr, obtained: savedSr.obtained } : initSr;
              }),
              secretRuptureUpgradesData: INITIAL_SECRET_RUPTURE_UPGRADES.map(initSru => {
                  const savedSru = parsedState.secretRuptureUpgradesData?.find(s => s.id === initSru.id);
                  return savedSru ? { ...initSru, obtained: savedSru.obtained } : initSru;
              }),
              embryoUpgradesData: INITIAL_EMBRYO_UPGRADES.map(initEu => {
                const savedEu = parsedState.embryoUpgradesData?.find(s => s.id === initEu.id);
                return savedEu ? { ...initEu, purchased: safeDecimal(savedEu.purchased) } : initEu;
              }),
              embryoBaseStats: deserializeEmbryoStats(parsedState.embryoBaseStats),
              embryoEffectiveStats: deserializeEmbryoStats(parsedState.embryoEffectiveStats),
              embryoInventory: Array.isArray(parsedState.embryoInventory) ? parsedState.embryoInventory.map(item => deserializeEmbryoItem(item, INITIAL_EMBRYO_SHOP_ITEMS)) : [],
              equippedEmbryoItems: parsedState.equippedEmbryoItems || INITIAL_GAME_STATE.equippedEmbryoItems,
              achievementsData: ACHIEVEMENTS.map(initAch => {
                  const savedAch = parsedState.unlockedAchievements?.includes(initAch.id);
                  return { ...initAch, unlocked: !!savedAch };
              }),
              unlockedSkinIds: Array.isArray(parsedState.unlockedSkinIds) ? parsedState.unlockedSkinIds : ['default'],
              activeSkinId: parsedState.activeSkinId || 'default',
              hiddenDiscoveriesData: INITIAL_HIDDEN_DISCOVERY_DEFINITIONS.map(initDef => {
                  const savedDef = parsedState.hiddenDiscoveriesData?.find(s => s.id === initDef.id);
                  if (savedDef?.isDiscovered) {
                      return { id: initDef.id, isDiscovered: true, nameToDisplay: initDef.revealedName, descriptionToDisplay: initDef.revealedDescription, iconToDisplay: initDef.revealedIcon };
                  }
                  return { id: initDef.id, isDiscovered: false, nameToDisplay: initDef.defaultName, descriptionToDisplay: initDef.defaultDescription, iconToDisplay: initDef.defaultIcon };
              }),
              metaUpgradesUnlocked: parsedState.metaUpgradesUnlocked,
              metaUpgradesData: INITIAL_META_UPGRADES.map(initMu => {
                const savedMu = parsedState.metaUpgradesData?.find(s => s.id === initMu.id);
                return savedMu ? { ...initMu, purchased: safeDecimal(savedMu.purchased) } : initMu;
              }),
              cosmicBank: {
                pi: deserializeBankedResourceInfo(parsedState.cosmicBank?.pi, INITIAL_GAME_STATE.cosmicBank.pi),
                et: deserializeBankedResourceInfo(parsedState.cosmicBank?.et, INITIAL_GAME_STATE.cosmicBank.et),
                modularExp: deserializeBankedResourceInfo(parsedState.cosmicBank?.modularExp, INITIAL_GAME_STATE.cosmicBank.modularExp),
              },
              lastMissionGenerationDate: parsedState.lastMissionGenerationDate || null,
              dailyMissions: Array.isArray(parsedState.dailyMissions) ? parsedState.dailyMissions.map(deserializeDailyMission) : [],
              fusionSelectedInventoryItemIds: Array.isArray(parsedState.fusionSelectedInventoryItemIds) ? parsedState.fusionSelectedInventoryItemIds : [],
              lastFusedItem: parsedState.lastFusedItem ? deserializeEmbryoItem(parsedState.lastFusedItem, INITIAL_EMBRYO_SHOP_ITEMS) : null,
              collectibleEggs: deserializeCollectibleEggs(parsedState.collectibleEggs),
              eggFragments: safeDecimal(parsedState.eggFragments),
              lastAcquiredCollectibleEggs: Array.isArray(parsedState.lastAcquiredCollectibleEggs) ? parsedState.lastAcquiredCollectibleEggs : [],
              eggTeamBattleState: deserializeEggTeamBattleState(parsedState.eggTeamBattleState),
              primordialTriggerUsedThisRun: parsedState.primordialTriggerUsedThisRun ?? false,
              activeTemporaryBuffs: Array.isArray(parsedState.activeTemporaryBuffs)
                ? parsedState.activeTemporaryBuffs.map(deserializeBuff)
                : (parsedState.activeTemporaryBuff ? [deserializeBuff(parsedState.activeTemporaryBuff)] : []),
              // Properties with complex logic during load
              ...({} as any) // To avoid TS errors for properties computed below
          };

          // Post-load computations
          const timeSinceLastPlay = Date.now() - loadedState.lastPlayedTimestamp;
          const offlineSeconds = Decimal.min(new Decimal(timeSinceLastPlay / 1000), MAX_OFFLINE_SECONDS);
          if (offlineSeconds.gt(10)) {
            const hasIncansavelBonus = loadedState.activeTraits.includes('incansavel');
            const offlineGain = calculateOfflineIncubationPower(offlineSeconds, loadedState.ipps, loadedState.offlineIncubationRate, hasIncansavelBonus, loadedState.specialUpgradesData, loadedState.transcendenceCount);
            if (offlineGain.gt(0)) {
                loadedState.incubationPower = loadedState.incubationPower.plus(offlineGain);
                loadedState.offlineGainData = { time: offlineSeconds, gain: offlineGain };
                loadedState.showOfflineGainModal = true;
            }
          }
          loadedState.lastPlayedTimestamp = Date.now();
          loadedState.embryoEXPToNextLevel = getEmbryoNextLevelEXP(loadedState.embryoLevel);
          const visuals = getEmbryoVisuals(loadedState.embryoLevel);
          loadedState.embryoIcon = visuals.icon;
          const finalState = spawnNextEnemyOnLoad(loadedState, !loadedState.currentEnemy);

          setGameState(finalState);
        }
      } else {
        // Handle a fresh game start
        const freshState = spawnNextEnemyOnLoad(INITIAL_GAME_STATE, true);
        setGameState(freshState);
      }
    } catch (e) {
      console.error("Failed to load or parse saved game:", e);
      // Fallback to initial state if loading fails, and also spawn an enemy
      const fallbackState = spawnNextEnemyOnLoad(INITIAL_GAME_STATE, true);
      setGameState(fallbackState);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty array ensures this runs only once on mount

  return [gameState, setGameState, isLoading];
};
