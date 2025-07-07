
import { Decimal } from 'decimal.js';

export type MissionRarity = 'Common' | 'Rare' | 'Epic';
export type MissionStatus = 'incomplete' | 'completed' | 'claimed';
export type MissionRewardType = 'modularEXP' | 'temporaryBuff';

export interface MissionReward {
  type: MissionRewardType;
  value: Decimal; // Amount for modularEXP, or a placeholder for buff (buff details might be hardcoded/mapped by ID)
  buffId?: string; // ID of the temporary buff from a predefined list
  buffDuration?: Decimal; // Duration in seconds if type is temporaryBuff
  description: string; // User-friendly reward description
}

export interface DailyMission {
  id: string; // Unique instance ID for the day, e.g., clicks_common_2023-10-27_0
  definitionId: string; // Links to MissionDefinition, e.g., "click_times"
  description: string;
  rarity: MissionRarity;
  metricToTrack: string; // The specific metric this mission instance is tracking, e.g., "userClicks_session"
  targetValue: Decimal;
  currentProgress: Decimal;
  status: MissionStatus;
  reward: MissionReward;
  icon: string;
  // Optional field for missions needing specific data, e.g. for "buy X of Y rarity"
  meta?: { [key: string]: any }; 
}

// Defines the blueprint for a type of mission before it's instanced for the day
export interface MissionDefinition {
  definitionId: string; // e.g., "click_times", "spend_mod_exp"
  metricToTrack: string; // General metric category, e.g., GameState['totalClicksThisRun'] or a custom event name
  baseIcon: string;
  // Generates the variable parts of a mission based on rarity
  generateDetails: (rarity: MissionRarity) => {
    description: string;
    targetValue: Decimal;
    reward: MissionReward;
  };
  possibleRarities: MissionRarity[]; // Which rarities this mission type can spawn as
}
