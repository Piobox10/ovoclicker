
import { Decimal } from 'decimal.js';

export interface UpgradeBase {
    id: string;
    name: string;
    description: string;
    baseCost: Decimal;
    costMultiplier: Decimal;
    effect: { [key: string]: Decimal | boolean };
    purchased: Decimal;
    type: string;
    icon: string;
    hidden?: boolean;
}

export interface RegularUpgrade extends UpgradeBase {}
export interface TranscendentalBonus extends UpgradeBase {}

export interface EtPermanentUpgrade {
    id: string;
    name: string;
    description: string;
    baseCost: Decimal; // Cost in Transcendent Essence
    costMultiplier: Decimal;
    effect: { [key: string]: Decimal | boolean };
    purchased: Decimal;
    type: 'et_permanent_fixed' | 'et_permanent_percentage';
    icon: string;
    maxLevel?: Decimal; // Optional max purchase level
}

export interface SpecialUpgrade {
    id:string;
    name: string;
    description: string;
    stageRequired: number;
    effect: { [key: string]: Decimal | boolean };
    purchased: Decimal;
    type: string;
    icon: string;
}

export interface LegendaryUpgrade {
    id: string;
    name: string;
    description: string;
    icon: string;
    effect: { [key: string]: Decimal | boolean };
    unlockedSystem: boolean; // True if player has >= 20 transcendences
    activated: boolean;      // True if the player has chosen to activate this specific upgrade
}

export interface SecretRuptureUpgradeParams {
    basePIForBonus?: Decimal;
    piChunkForBonus?: Decimal;
    percentPerChunk?: Decimal;
    idleThresholdSeconds?: Decimal;
    bonusMultiplier?: Decimal;
    critEchoTriggerChance?: Decimal;
}

export interface SecretRuptureUpgrade {
    id: string;
    name: string;
    description: string;
    icon: string;
    effectType:
        | 'etOnSpecificClicks'
        | 'inversePIProductionBonus'
        | 'unlocksDailyTempEggButton'
        | 'unlocksSacrificeRitualButton'
        | 'critEchoChance'
        | 'globalMultiplierPerTranscendence'
        | 'longIdlePassiveBoost'
        | 'extraRandomTrait';
    obtained: boolean;
    params?: SecretRuptureUpgradeParams;
}

export type SerializableSecretRuptureUpgradeParams = {
    [K in keyof SecretRuptureUpgradeParams]: SecretRuptureUpgradeParams[K] extends Decimal | undefined
        ? string | undefined
        : SecretRuptureUpgradeParams[K];
};

export type SerializableSecretRuptureUpgrade = Omit<SecretRuptureUpgrade, 'params'> & {
    params?: SerializableSecretRuptureUpgradeParams;
};
