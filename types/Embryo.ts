
import { Decimal } from 'decimal.js';
// GameState import removed to break cycle for this specific type definition
// import { GameState } from './GameState'; 

export type EmbryoStatKey = 
    | 'maxHp' 
    | 'attack' 
    | 'defense' 
    | 'speed' 
    | 'critChance'
    | 'poisonChance'
    | 'poisonDurationSeconds' 
    | 'bossDamageBonus'
    | 'doubleHitChance'
    | 'lifestealRate'
    | 'chaosEffectChance'
    // New Defensive Stats
    | 'enemyDelayChance'
    | 'damageReflection'
    | 'critResistance'
    | 'periodicShieldValue'
    | 'dodgeChance'
    | 'overallDamageReduction'
    | 'hpRegenPerInterval'
    // Stats for new Passive Chips
    | 'hpRegenPerMinute'
    | 'modularExpGainMultiplier'
    | 'shieldOnXpFull'
    | 'outgoingDamageMultiplier'
    // New stats that can appear on fused items, affecting Embryo directly
    | 'embryoIpps' // Additive IPPS for the Embryo itself
    | 'embryoClicksPerClick'
    // New shield stats
    | 'maxShield'
    | 'currentShield' // Added currentShield
    | 'critDamageMultiplier'
    | 'positiveChaosEffectDuplicationChance';

export interface EmbryoStats {
    currentHp: Decimal;
    maxHp: Decimal;
    attack: Decimal;
    defense: Decimal;
    speed: Decimal;
    critChance: Decimal; // Represented as a decimal, e.g., 0.05 for 5%
    poisonChance: Decimal;
    poisonDurationSeconds: Decimal; 
    bossDamageBonus: Decimal;
    doubleHitChance: Decimal;
    lifestealRate: Decimal;
    chaosEffectChance: Decimal;
    // New Defensive Stats
    enemyDelayChance: Decimal;
    damageReflection: Decimal;
    critResistance: Decimal;
    periodicShieldValue: Decimal;
    dodgeChance: Decimal;
    overallDamageReduction: Decimal;
    hpRegenPerInterval: Decimal;
    // Stats for new Passive Chips
    hpRegenPerMinute: Decimal;
    modularExpGainMultiplier: Decimal;
    shieldOnXpFull: Decimal;
    outgoingDamageMultiplier: Decimal;
    // New stats for Embryo from fused items
    embryoIpps: Decimal;
    embryoClicksPerClick: Decimal;
    // Shield Stats
    currentShield: Decimal;
    maxShield: Decimal;
    critDamageMultiplier: Decimal;
    positiveChaosEffectDuplicationChance: Decimal;
}

export interface EmbryoUpgrade {
    id: string;
    name: string;
    description: string;
    icon: string;
    effect: {
        criticalChanceAdditive?: Decimal;
        clickEchoChance?: Decimal;
        clickEchoMultiplier?: Decimal;
        ipps?: Decimal;
        modularEXPGainMultiplier?: Decimal;
        bonusPIPerEmbryoLevel?: Decimal;
        regularUpgradeCostReduction?: Decimal;
        baseClickDamageToEnemiesAdditive?: Decimal;
        // For new stackable upgrades
        maxHp?: Decimal; // Flat HP per level
        attack?: Decimal; // Flat Attack per level
        defense?: Decimal; // Flat Defense per level
        maxShield?: Decimal; // Flat Max Shield per level
        [key: string]: Decimal | boolean | undefined;
    };
    
    baseCost?: Decimal;
    costMultiplier?: Decimal;
    cost?: Decimal; 
    purchased: Decimal; 
    maxLevel?: Decimal; 
}

export interface EmbryoLevelMilestone {
    level: number;
    expRequired: Decimal;
    icon: string;
    nameSuffix: string;
}

export type EmbryoItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Ultra-Mythic'; 
export type EmbryoEquipmentType = 'Weapon' | 'Armor' | 'PassiveChip' | 'SpecialAccessory';
export type EmbryoEquipmentSlotKey = 'weapon' | 'armor' | 'passiveChip' | 'especial';
export type EmbryoStoreItemCategory = 'Ofensivo' | 'Defensivo' | 'Passivo' | 'Especial';


export interface EmbryoItemEffect { // This is the type used for original item effects
    stat: EmbryoStatKey; // Ensure this refers to EmbryoStatKey for clarity
    value: Decimal;
    type: 'flat' | 'percent_base'; 
}

export type FusedAttributeEffectType = 'flat' | 'percent_base_stat' | 'percent_global' | 'special_passive';

export interface FusedAttribute {
    id: string; // e.g., "maxHp_flat", "critChance_percent", "special_echo"
    description: string; // e.g., "+15 HP Máx", "+3% Chance Crítica", "Eco Menor: 5% chance..."
    statKey?: EmbryoStatKey; // The EmbryoStatKey this attribute modifies directly
    value?: Decimal; // The numeric value of the attribute
    type?: FusedAttributeEffectType; // How the value is applied
    isSpecialEffect?: boolean; // True if it's a unique effect not directly mapping to EmbryoStats
    potency?: number; // Optional potency for special effects, 1-5
}

export interface EmbryoItem {
    id: string; // Base item ID for definitions, unique ID for fused items.
    instanceId: string; // Always present for inventory items to ensure uniqueness.
    name: string;
    description: string;
    icon: string;
    rarity: EmbryoItemRarity;
    equipmentType: EmbryoEquipmentType;
    storeCategory: EmbryoStoreItemCategory; // Only relevant for base items in the shop.
    cost: { // Relevant for base items in the shop.
        currency: 'modularEXP' | 'incubationPower' | 'transcendentEssence';
        amount: Decimal;
    }[];
    effects: EmbryoItemEffect[]; // Base effects for non-fused items.
    isEquipped?: boolean;
    // Fusion related
    isFused?: boolean;
    fusedName?: string; // Name generated for fused items.
    fusedAttributes?: FusedAttribute[]; // Attributes specific to fused items.
    rerollCostET?: Decimal; // Cost to reroll attributes of a fused item.
}


// Manually define EmbryoPanelPropsGameState to avoid Pick<GameState, ...> which can cause circular dependency issues.
export interface EmbryoPanelPropsGameState {
  embryoLevel: Decimal;
  embryoCurrentEXP: Decimal;
  embryoEXPToNextLevel: Decimal;
  embryoUpgradesData: EmbryoUpgrade[]; // Using EmbryoUpgrade defined in this file
  modularEXP: Decimal;
  embryoIcon: string;
  embryoEffectiveStats: EmbryoStats; // Using EmbryoStats defined in this file
  embryoBaseStats: EmbryoStats; // Using EmbryoStats defined in this file
  embryoShopItems: EmbryoItem[]; // Using EmbryoItem defined in this file
  embryoInventory: EmbryoItem[]; // Using EmbryoItem defined in this file
  equippedEmbryoItems: { [key in EmbryoEquipmentSlotKey]: string | null }; // Using EmbryoEquipmentSlotKey defined in this file
  incubationPower: Decimal;
  transcendentEssence: Decimal;
  periodicShieldCycleTimerSeconds: Decimal;
  periodicShieldClickCounter: Decimal;
  // metaUpgradesData: MetaUpgrade[]; // If EmbryoPanel uses metaUpgradesData, add it here. Assuming not for now.
}


export interface EmbryoPanelProps {
  gameState: EmbryoPanelPropsGameState;
  onBuyEmbryoUpgrade: (upgradeId: string) => void; 
  onBuyEmbryoStoreItem: (itemId: string) => void;
  onOpenInventoryModal: (slot: EmbryoEquipmentSlotKey) => void;
  onUnequipItem: (slot: EmbryoEquipmentSlotKey) => void;
}

export interface PlayerResourcesForShop { // Keeping this separate as it's simpler than full GameState
    modularEXP: Decimal;
    incubationPower: Decimal;
    transcendentEssence: Decimal;
}

export interface EmbryoShopPanelProps {
    shopItems: EmbryoItem[];
    playerResources: PlayerResourcesForShop;
    onBuyItem: (itemId: string) => void;
    embryoInventory: EmbryoItem[]; 
}

export interface EmbryoEquipmentPanelProps {
    equippedItems?: { [key in EmbryoEquipmentSlotKey]: string | null }; 
    allItemsData: EmbryoItem[]; 
    onOpenInventoryModal: (slot: EmbryoEquipmentSlotKey) => void;
    onUnequipItem: (slot: EmbryoEquipmentSlotKey) => void;
}

export interface EmbryoInventoryModalContentProps {
    inventory: EmbryoItem[]; 
    currentSlot: EmbryoEquipmentSlotKey | null;
    allItemsData: EmbryoItem[]; 
    onEquipItem: (itemInstanceId: string, slot: EmbryoEquipmentSlotKey) => void; 
    onClose: () => void;
}
