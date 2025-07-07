import { Decimal } from 'decimal.js';

// Statistics tracked during a battle
export interface BattleStats {
  damageDealtByEgg: { [eggInstanceId: string]: string }; // string for serialized Decimal
  healingDoneByEgg: { [eggInstanceId: string]: string }; // string for serialized Decimal
  // Future: damageTakenByEgg, abilitiesUsedCount, etc.
}

// Defines a single reward item obtained from a battle
export interface BattleReward {
  type: 'modularExp' | 'collectibleEgg' | 'embryoItem'; // Add more types as needed
  amount?: string; // For modularExp (as string for Decimal), or quantity for items
  eggDefinitionId?: string; // For collectibleEgg reward
  embryoItemId?: string; // For embryoItem reward
  description: string; // User-friendly description, e.g., "+100 EXP Modular", "Ovo Dracônico"
  icon?: string; // Optional icon for the reward
}
