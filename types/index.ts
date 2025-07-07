export * from './GameState';
export * from './Upgrades';
export * from './Egg';
export * from './Achievement';
export * from './Trait';
export * from './Abilities'; // exports BattleAbilityInstance, AbilityDefinition, ActiveAbility
export * from './Event';
export * from './Combat'; // exports Enemy, EnemyStatusEffect (old one)
export * from './Embryo';
export * from './Misc';
export * from './Missions';
export * from './Skins';
export * from './HiddenDiscovery';
export type { RankingEntry } from '../constants';
// MetaUpgrade related types are now directly in Upgrades.ts and re-exported via '*'
export type { FusedAttribute, FusedAttributeEffectType, EmbryoItemEffect, EmbryoEquipmentSlotKey } from './Embryo';
// SerializableEnemyStatusEffect is in Combat.ts and re-exported via '*'

// Adding this type for cross-hook usage
import { Decimal } from 'decimal.js';
export type UpdateMissionProgressFn = (metric: string, incrementValue: Decimal, associatedData?: any) => void;

// Embryo Conflict types are primarily defined and exported from types/EmbryoConflict.ts
// export * from './EmbryoConflict'; // Removed re-export
export * from './Collectibles';
export * from './SerializableState'; // This will re-export the serializable types defined within.
export * from './StatusEffects'; // exports BattleStatusEffectDefinition, BattleStatusEffectInstance
export * from './Battle'; // Added export for BattleStats and BattleReward
export type { SerializableBattleAbilityInstance } from './SerializableState'; // Added export
export type { ExpeditionRewardOption } from './GameState'; // Added export for ExpeditionRewardOption

// --- End of Embryo Conflict System Types ---
export type { SacredRelicUpgrade } from './Upgrades'; // Added export for SacredRelicUpgrade