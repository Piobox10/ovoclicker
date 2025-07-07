
import { Decimal } from 'decimal.js';

export type CollectibleEggType = 'Dano' | 'Suporte' | 'Tanque' | string;
export type CollectibleEggDisplayRarity = 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico';

export interface CollectibleEggDefinition {
  id: string;
  name: string;
  type: CollectibleEggType;
  abilityDefinitionIds: string[]; // Array of AbilityDefinition IDs from constants/abilities.ts
  personality: string;
  icon: string;
  description: string;
  rarity: CollectibleEggDisplayRarity;
  baseStats: {
    hpMax: number; // Base HP
    attack: number; // Base Attack
    defense: number; // Base Defense
    speed: number; // Base Speed
    resourceMax?: number; // Optional: max resource like mana/energy
    resourceName?: string; // Optional: name of the resource
  };
}

export interface PlayerCollectibleEgg {
  definitionId: string;
  collectedTimestamp: number;
  instanceId: string;
  actualBaseStats?: { // Stats after random variation
    hpMax: number;
    attack: number;
    defense: number;
    speed: number;
    resourceMax?: number;
    // resourceName is not needed here as it's from definition
  };
}