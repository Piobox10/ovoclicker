import { Decimal } from 'decimal.js';
import { BattleStatType, BattleStatusEffectType } from './StatusEffects'; // Ensure BattleStatType is imported if needed here

export type AbilityTargetType = 
  | 'self' 
  | 'single_enemy' 
  | 'all_enemies' 
  | 'single_ally' 
  | 'all_allies'
  | 'random_enemy'
  | 'lowest_hp_ally'
  | 'custom_logic'; // Added for custom targeting logic

export type AbilityEffectType = 
  | 'damage' 
  | 'heal' 
  | 'apply_status' 
  | 'buff_stat' 
  | 'debuff_stat' 
  | 'shield' 
  | 'self_damage' 
  | 'cleanse_debuffs' 
  | 'resource_drain_flat'
  | 'modify_max_hp' // New: For Fusão Instável
  | 'custom_logic' // New: For complex abilities like Reflexo Instintivo
  | 'dispel_buffs'; // New: For Olhar do Abismo to remove enemy buffs

export type BattleStatTypeForAbility = BattleStatType; 

export interface AbilityEffect {
  type: AbilityEffectType;
  baseValue?: Decimal; 
  durationTurns?: number; 
  statusEffectDefinitionId?: string; 
  statToChange?: BattleStatTypeForAbility; 
  isPercentage?: boolean; 
  chance?: Decimal; 
  cleanseCount?: number; 
  maxHpReductionPercentage?: Decimal; // For modify_max_hp
  customEffectId?: string; // For 'custom_logic' abilities
  reflectionPercentage?: Decimal; // Added for energy mirror ability
  hits?: number; // For multi-hit abilities
}

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetType: AbilityTargetType;
  effects: AbilityEffect[];
  resourceCost: Decimal;
  cooldownTurns: number;
  castTime?: number; 
  animationKey?: string;
}

export interface BattleAbilityInstance {
  definitionId: string; 
  name: string; 
  icon: string; 
  currentCooldownTurns: number;
}

// Old ActiveAbility for main game, keep separate if still used by other parts of the game.
export interface ActiveAbility {
    id: string;
    name: string;
    description: string;
    cost: Decimal;
    cooldown: Decimal;
    icon: string;
    purchased: boolean;
    cooldownRemaining: Decimal;
    tempEffectDuration?: Decimal;
    effect: { [key: string]: Decimal | boolean | undefined };
}
