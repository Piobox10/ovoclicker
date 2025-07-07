import { Decimal } from 'decimal.js';

export type BattleStatType = 
  | 'attack' 
  | 'defense' 
  | 'speed' 
  | 'maxHp' 
  | 'critChance' 
  | 'critDamageMultiplier' 
  | 'dodgeChance'
  | 'incomingDamageMultiplier' 
  | 'resourceGenerationMultiplier'
  | 'accuracyMultiplier'; // New: e.g., 0.8 for 20% accuracy reduction

export type BattleStatusEffectType = 
  | 'damage_over_time' 
  | 'heal_over_time' 
  | 'stat_change_add' 
  | 'stat_change_multiply' 
  | 'stun' 
  | 'shield' 
  | 'taunt' 
  | 'cleanse' 
  | 'dispel'
  | 'ability_lock' 
  | 'custom_summon_attack'
  | 'damage_reflection_percentage' // New: Reflects a % of damage
  | 'guaranteed_evasion' // New: Next attack will miss
  | 'custom_logic' // Added custom_logic for effects handled in ability execution
  | 'action_inversion_random_target' // Added for se_action_confusion_40_1t
  | 'effectiveness_reduction' // Added for se_enemy_effectiveness_reduced_50_1t
  | 'delayed_aoe_damage'; // Added for se_delayed_explosion_marker_30dmg_2t

export interface BattleStatusEffectDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'buff' | 'debuff';
  effectType: BattleStatusEffectType;
  
  baseDurationTurns: number;
  
  baseTickValue?: Decimal; 
  tickIntervalTurns?: number; 
  
  statToChange?: BattleStatType;
  changeValue?: Decimal; 
  
  shieldValue?: Decimal; 
  reflectionPercentage?: Decimal; // For damage_reflection_percentage
  maxHpReductionPercentage?: Decimal; // For reducing max HP

  isStackable?: boolean;
  maxStacks?: number;
  
  animationKey?: string;
  soundEffectKey?: string;
}

export interface BattleStatusEffectInstance {
  instanceId: string;
  definitionId: string;
  name: string;
  icon: string;
  description: string; 
  type: 'buff' | 'debuff';
  effectType: BattleStatusEffectType; 
  
  remainingDurationTurns: number;
  
  currentPotency: Decimal; 
  
  statToChange?: BattleStatType; 
  originalValueBeforeEffect?: Decimal; 
  appliedMaxHpReduction?: Decimal; // To store the amount of max HP reduced for this instance

  ticksApplied?: number; 
  stacks?: number;
  
  appliedByInstanceId?: string; 
  reflectionPercentage?: Decimal; // Added for damage reflection instances
}