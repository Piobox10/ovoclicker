
import { Decimal } from 'decimal.js';
import { EmbryoItemRarity, GameState } from './'; // Adjusted for cyclical dependency potential

export interface UpgradeBase {
    id: string;
    name: string;
    description: string;
    baseCost: Decimal;
    costMultiplier: Decimal;
    effect: { 
        ipps?: Decimal;
        clicksPerClick?: Decimal;
        clicksPerClickMultiplier?: Decimal; // Example: for transcendental bonuses
        ippsMultiplier?: Decimal; // Example: for transcendental bonuses
        incubationPowerMultiplier?: Decimal; // Global multiplier
        bonusPassiveProductionMultiplier?: Decimal; // For Plasma Vitálico
        bonusPassivePerActiveForm?: Decimal; // For Matriz de Incubação Fractal
        bonusClickPerTrait?: Decimal; // For Toque Estelar
        nextClickMultiplierValue?: Decimal; // For Fusão Bioquantum (the multiplier value)
        esporoProductionBuffMultiplier?: Decimal; // For Esporo Incandescente (the buff multiplier)
        
        // New Transcendental Bonus Effects
        modularEXPGainMultiplierBonus?: Decimal;
        furyPassiveBonusPerClick?: Decimal;
        maxFuryPassiveBonus?: Decimal;
        abilityCooldownReductionPerLevel?: Decimal;
        passiveProductionBonusPerXTranscendences?: Decimal;
        transcendencesPerBonusCycle?: Decimal; // e.g., 5 for Domínio Cíclico

        [key: string]: Decimal | boolean | undefined | { rate: Decimal; max: Decimal } // Added for Abyssal Egg activeBonus
    };
    purchased: Decimal;
    type: string;
    icon: string;
    hidden?: boolean;
    maxLevel?: Decimal; // Added for Despertar Psíquico
}

export interface RegularUpgrade extends UpgradeBase {}
export interface TranscendentalBonus extends UpgradeBase {}

export interface EtPermanentUpgrade {
    id: string;
    name: string;
    description: string;
    baseCost: Decimal; // Cost in Transcendent Essence
    costMultiplier: Decimal;
    effect: { 
        clicksPerClick?: Decimal; // For Núcleo Divino
        ipps?: Decimal; // For Fluxo Estável
        criticalDamageMultiplier?: Decimal; // For Amplificador Crítico (multiplicative per level)
        etGainMultiplier?: Decimal; // For Eficiência Essencial (multiplicative per level)
        bonusCritChancePerLevel?: Decimal; // For Gatilho Emocional (additive per level)
        bankInterestBonusPerLevel?: Decimal; // For Banco Cósmico (additive to rate multiplier per level)
        startingModularExpPerLevel?: Decimal; // For Lembrança Dimensional (flat per level)
        abilityNoCooldownChancePerLevel?: Decimal; // For Pulso Paralelo (additive chance per level)
        [key: string]: Decimal | boolean | undefined 
    };
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
    effect: { [key: string]: Decimal | boolean | undefined };
    purchased: Decimal;
    type: string;
    icon: string;
}

export interface LegendaryUpgrade {
    id: string;
    name: string;
    description: string;
    icon: string;
    effect: { [key: string]: Decimal | boolean | undefined };
    unlockedSystem: boolean; // True if player has >= 20 transcendences
    activated: boolean;      // True if the player has chosen to activate this specific upgrade
}

export interface SacredRelicUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  obtained: boolean;
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


export interface MetaUpgradeEffect {
    activeAbilityStrengthBonusPerLevel?: Decimal;
    etPerActiveFormOnTranscend?: Decimal;
    chipEffectivenessMultiplier?: { rarity: EmbryoItemRarity, multiplier: Decimal };
    activeAbilityCooldownReductionPercent?: Decimal;
    traitEffectivenessMultiplier?: { conditionMinTraits: number, multiplier: Decimal };
    globalIppsMultiplierPerLevel?: Decimal; // Added for Amplificador Passivo Global
    [key: string]: any; // For flexibility
}

export interface MetaUpgrade {
    id: string;
    name: string;
    description: string;
    cost: Decimal;
    maxLevel?: Decimal;
    purchased: Decimal;
    costMultiplier?: Decimal;
    icon: string;
    category: 'Habilidades' | 'Formas' | 'Chips' | 'Traços' | 'Transcendência' | 'Produção' | 'Geral';
    effect: MetaUpgradeEffect;
    unlockCondition?: (gameState: GameState) // gameState might be too broad, adjust if specific parts are enough
        => boolean;
}
