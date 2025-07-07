import { Decimal } from 'decimal.js';
import { GameState } from './GameState';
import { EggForm, Trait, SkinDefinition, Achievement } from './'; // For reward types

export interface HiddenDiscoveryDefinition {
  id: string;
  defaultName: string; // e.g., "???"
  defaultDescription: string; // e.g., "Desconhecido"
  defaultIcon: string; // e.g., "fas fa-question-circle"
  
  revealedName: string;
  revealedDescription: string; // Lore or detailed description
  revealedIcon: string;

  triggerCondition: (gameState: GameState, // Pass full GameState for complex checks
                     // Potentially pass specific action data if check is tied to an action
                     // e.g., actionData?: { clickValue?: Decimal, enemyDefeated?: Enemy }
                    ) => boolean;
  
  // Defines the effect of the reward. The actual application might be in useHiddenDiscoveries.ts
  // or directly called if simpler.
  rewardEffect: (
    gameState: GameState, 
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
    // Potentially add other utility functions if needed by rewards
  ) => void; // Function that delivers the benefit
  
  // Optional: Hint for players if they get stuck, could be unlocked later
  hint?: string; 
}

export interface HiddenDiscoveryState {
  id: string; // Matches definition id
  isDiscovered: boolean;
  // Store revealed details here if they differ from definition or for dynamic content
  nameToDisplay: string; 
  descriptionToDisplay: string;
  iconToDisplay: string;
}

// Example concrete reward types that might be part of the rewardEffect logic
export interface RewardUnlockEggForm {
    type: 'UNLOCK_EGG_FORM';
    form: EggForm; // The actual EggForm object
}
export interface RewardUnlockTrait {
    type: 'UNLOCK_TRAIT';
    trait: Trait; // The actual Trait object
}
export interface RewardPassiveBuff {
    type: 'PASSIVE_BUFF';
    buffId: string; // To identify the buff logic in useStatCalculations or similar
    buffDescription: string; // "Aumenta ganho de XP Modular em +5%"
}
export interface RewardUnlockSlot {
    type: 'UNLOCK_SLOT';
    slotType: 'TRAIT' | 'EGG_FORM'; // etc.
    amount: number;
}
export interface RewardUnlockAchievement {
    type: 'UNLOCK_ACHIEVEMENT';
    achievement: Achievement;
}
export interface RewardUnlockSkin {
    type: 'UNLOCK_SKIN';
    skin: SkinDefinition;
}
export interface RewardGrantCurrency {
    type: 'GRANT_CURRENCY';
    currencyType: 'ET' | 'ModularEXP' | 'PI';
    amount: Decimal;
}

export type PossibleReward = 
    | RewardUnlockEggForm 
    | RewardUnlockTrait 
    | RewardPassiveBuff 
    | RewardUnlockSlot
    | RewardUnlockAchievement
    | RewardUnlockSkin
    | RewardGrantCurrency;
