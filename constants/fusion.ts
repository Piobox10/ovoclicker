
import { Decimal } from 'decimal.js';
import { EmbryoStatKey, EmbryoItemRarity, FusedAttributeEffectType, FusedAttribute } from '../types';

export const FUSION_NAME_PARTS = {
  prefixes: ["Antigo", "Rachado", "Vivo", "Fractal", "Ressoante", "Cego", "Caótico", "Luminoso", "Sombrio", "Arcano"],
  cores: ["Núcleo", "Ovo", "Fragmento", "Casca", "Gema", "Runa", "Esporo", "Olho", "Coração", "Pedra"],
  suffixes: ["da Ruptura", "do Vazio", "do Despertar", "do Enraizamento", "da Eternidade", "do Pesadelo", "da Tormenta", "da Harmonia"],
};

export const FUSABLE_STAT_POOL: EmbryoStatKey[] = [
  'maxHp', 'attack', 'defense', 'speed', 'critChance', 
  'modularExpGainMultiplier', 'embryoIpps', 'embryoClicksPerClick',
  'poisonChance', 'bossDamageBonus', 'doubleHitChance', 'lifestealRate',
  'dodgeChance', 'overallDamageReduction', 'hpRegenPerInterval',
];

export interface SpecialEffectDefinition {
  id: string;
  name: string; // Short name for the effect
  descriptionTemplate: string; // e.g., "Chance de {X}% de causar {Y}% de dano adicional como Gelo."
  generateDescription: (potency: number) => string; // Function to create full description
  effectType: FusedAttributeEffectType;
}

export const SPECIAL_EFFECT_POOL: SpecialEffectDefinition[] = [
  { 
    id: 'minor_echo', 
    name: "Eco Menor",
    descriptionTemplate: "Eco Menor: {X}% chance de causar {Y}% do dano do Embrião novamente.",
    generateDescription: (potency) => `Eco Menor: ${potency * 2}% chance de causar ${potency * 5}% do dano do Embrião novamente.`,
    effectType: 'special_passive',
  },
  { 
    id: 'growth_aura', 
    name: "Aura de Crescimento",
    descriptionTemplate: "Aura de Crescimento: Ganha +{X}% EXP Modular adicional de inimigos.",
    generateDescription: (potency) => `Aura de Crescimento: Ganha +${potency * 2}% EXP Modular adicional de inimigos.`,
    effectType: 'special_passive',
  },
  { 
    id: 'thorn_mantle', 
    name: "Manto de Espinhos",
    descriptionTemplate: "Manto de Espinhos: Reflete {X}% do dano recebido de volta aos atacantes.",
    generateDescription: (potency) => `Manto de Espinhos: Reflete ${potency * 1.5}% do dano recebido de volta aos atacantes.`,
    effectType: 'special_passive',
  }
];

export const ATTRIBUTE_COUNT_WEIGHTS: { [inputCount: number]: { [numAttributes: number]: number } } = {
  2: { 1: 0.6, 2: 0.4 }, 
  3: { 2: 0.5, 3: 0.35, 4: 0.15 }, 
};

export const SPECIAL_EFFECT_CHANCE = 0.20; 

export const RARITY_AVG_MODIFIERS: { [avgRarityScore: number]: { valueMultiplier: number, extraAttributeChanceBonus: number } } = {
  1: { valueMultiplier: 0.8, extraAttributeChanceBonus: -0.1 }, 
  2: { valueMultiplier: 1.0, extraAttributeChanceBonus: 0.0 },  
  3: { valueMultiplier: 1.2, extraAttributeChanceBonus: 0.05 }, 
  4: { valueMultiplier: 1.5, extraAttributeChanceBonus: 0.1 },  
  5: { valueMultiplier: 1.9, extraAttributeChanceBonus: 0.15 }, 
  6: { valueMultiplier: 2.5, extraAttributeChanceBonus: 0.25 }, 
  7: { valueMultiplier: 3.2, extraAttributeChanceBonus: 0.35 }, 
};

export const getRarityScore = (rarity: EmbryoItemRarity): number => {
  switch (rarity) {
    case 'Common': return 1;
    case 'Uncommon': return 2;
    case 'Rare': return 3;
    case 'Epic': return 4;
    case 'Legendary': return 5;
    case 'Mythic': return 6;
    case 'Ultra-Mythic': return 7;
    default: return 1;
  }
};

export const BASE_STAT_RANGES: { [key in EmbryoStatKey]?: { min: number, max: number, type: FusedAttributeEffectType, isPercentage?: boolean } } = {
  maxHp: { min: 10, max: 50, type: 'flat' },
  attack: { min: 2, max: 10, type: 'flat' },
  defense: { min: 1, max: 8, type: 'flat' },
  speed: { min: 1, max: 5, type: 'flat' },
  critChance: { min: 0.01, max: 0.05, type: 'flat', isPercentage: true }, 
  modularExpGainMultiplier: { min: 0.02, max: 0.10, type: 'flat', isPercentage: true }, 
  embryoIpps: { min: 0.1, max: 1.0, type: 'flat' },
  embryoClicksPerClick: { min: 0.1, max: 1.0, type: 'flat' },
};

export const OUTPUT_RARITY_STAT_SCALERS: Record<EmbryoItemRarity, { valueMultiplier: number; specialEffectPotencyMultiplier: number }> = {
  'Common': { valueMultiplier: 0.8, specialEffectPotencyMultiplier: 0.8 },
  'Uncommon': { valueMultiplier: 1.0, specialEffectPotencyMultiplier: 1.0 },
  'Rare': { valueMultiplier: 1.3, specialEffectPotencyMultiplier: 1.25 },
  'Epic': { valueMultiplier: 1.7, specialEffectPotencyMultiplier: 1.6 },
  'Legendary': { valueMultiplier: 2.2, specialEffectPotencyMultiplier: 2.1 },
  'Mythic': { valueMultiplier: 2.8, specialEffectPotencyMultiplier: 2.7 },
  'Ultra-Mythic': { valueMultiplier: 3.6, specialEffectPotencyMultiplier: 3.2 },
};


export const calculateFusedItemRerollCost = (attributes: FusedAttribute[], itemRarity: EmbryoItemRarity): Decimal => {
  let baseCost = new Decimal(25); 
  let multiplier = new Decimal(1);
  
  const outputScaler = OUTPUT_RARITY_STAT_SCALERS[itemRarity] || OUTPUT_RARITY_STAT_SCALERS['Common'];

  attributes.forEach(attr => {
    if (attr.isSpecialEffect) {
      multiplier = multiplier.plus(0.5 * (attr.potency || 1) * outputScaler.specialEffectPotencyMultiplier * 0.2); 
    }
    if (attr.value && attr.value.abs().gt(10 * outputScaler.valueMultiplier * 0.1) && !attr.statKey?.includes("Hp")) { 
      multiplier = multiplier.plus(0.1 * outputScaler.valueMultiplier);
    }
     if (attr.value && attr.value.abs().gt(0.05 * outputScaler.valueMultiplier * 0.1) && attr.statKey?.toLowerCase().includes("chance")) {
      multiplier = multiplier.plus(0.15 * outputScaler.valueMultiplier);
    }
  });

  switch (itemRarity) {
    case 'Epic': multiplier = multiplier.times(1.2); break;
    case 'Legendary': multiplier = multiplier.times(1.5); break;
    case 'Mythic': multiplier = multiplier.times(2.0); break;
    case 'Ultra-Mythic': multiplier = multiplier.times(3.0); break;
    default: break;
  }
  
  return baseCost.times(multiplier).times(Math.max(1, attributes.length * 0.75)).floor();
};

export const NEGATIVE_ATTRIBUTE_CHANCE = 0.05; 
export const NEGATIVE_ATTRIBUTE_MAGNITUDE_MULTIPLIER = 0.5; 

export const MAX_FUSION_ITEMS = 3;
export const MIN_FUSION_ITEMS = 2;
