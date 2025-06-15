
import { Decimal } from 'decimal.js';
import { GameDataForAchievementCheck } from './GameState';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    bonusDescription: string;
    icon: string;
    condition: (game: GameDataForAchievementCheck) => boolean;
    unlocked: boolean;
    bonus?: { [key: string]: Decimal | boolean | { duration: Decimal; multiplier: Decimal } | { abilityCooldownReductionOnCrit?: Decimal; nightProductionMultiplier?: Decimal; finalMultiplierBoost?: Decimal; } };
    unlocksTrait?: string;
    unlocksUpgrade?: string;
    effect?: { [key: string]: Decimal };
}
