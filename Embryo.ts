
import { Decimal } from 'decimal.js';
import { GameState } from './GameState'; // For EmbryoPanelProps

export interface EmbryoUpgrade {
    id: string;
    name: string;
    description: string;
    cost: Decimal;
    effect: {
        criticalChanceAdditive?: Decimal;
        clickEchoChance?: Decimal;
        clickEchoMultiplier?: Decimal;
        ipps?: Decimal;
        modularEXPGainMultiplier?: Decimal;
        bonusPIPerEmbryoLevel?: Decimal;
        regularUpgradeCostReduction?: Decimal;
        baseClickDamageToEnemiesAdditive?: Decimal;
        [key: string]: Decimal | boolean | undefined;
    };
    purchased: boolean;
    icon: string;
}

export interface EmbryoLevelMilestone {
    level: number;
    expRequired: Decimal;
    icon: string;
    nameSuffix: string;
}

// New Types for Embryo Attributes, Shop, and Equipment
export type EmbryoStatKey = 
    | 'maxHp' 
    | 'attack' 
    | 'defense' 
    | 'speed' 
    | 'critChance'
    | 'poisonChance'
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
    | 'hpRegenPerInterval';

export interface EmbryoStats {
    currentHp: Decimal;
    maxHp: Decimal;
    attack: Decimal;
    defense: Decimal;
    speed: Decimal;
    critChance: Decimal; // Represented as a decimal, e.g., 0.05 for 5%
    poisonChance: Decimal;
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
}

export type EmbryoItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'; // Added Mythic
export type EmbryoEquipmentType = 'Weapon' | 'Armor' | 'PassiveChip';
export type EmbryoStoreItemCategory = 'Ofensivo' | 'Defensivo' | 'Passivo' | 'Especial';
export type EmbryoEquipmentSlotKey = 'weapon' | 'armor' | 'passiveChip';


export interface EmbryoItemEffect {
    stat: string; // Changed from EmbryoStatKey to string
    value: Decimal;
    type: 'flat' | 'percent_base'; 
}

export interface EmbryoItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: EmbryoItemRarity;
    equipmentType?: EmbryoEquipmentType; // Optional: some items might not be equipable (e.g. consumables)
    storeCategory: EmbryoStoreItemCategory;
    cost: {
        currency: 'modularEXP' | 'incubationPower' | 'transcendentEssence';
        amount: Decimal;
    };
    effects: EmbryoItemEffect[];
    isEquipped?: boolean; // Convenience flag, main truth is in GameState.equippedEmbryoItems
}

// Props for EmbryoPanel (expanded)
export interface EmbryoPanelProps {
  gameState: Pick<GameState, 
    | 'embryoLevel' | 'embryoCurrentEXP' | 'embryoEXPToNextLevel' 
    | 'embryoUpgradesData' | 'modularEXP' | 'embryoIcon' 
    | 'embryoEffectiveStats' | 'embryoBaseStats'
    | 'embryoShopItems' | 'embryoInventory' | 'equippedEmbryoItems'
    | 'incubationPower' | 'transcendentEssence' // For shop currency
    | 'areEmbryoUpgradesDisabledThisRun' // Added for checking if upgrades are disabled
  >;
  onBuyEmbryoUpgrade: (upgradeId: string) => void; 
  onBuyEmbryoStoreItem: (itemId: string) => void;
  onOpenInventoryModal: (slot: EmbryoEquipmentSlotKey) => void;
  onUnequipItem: (slot: EmbryoEquipmentSlotKey) => void;
}

// Props for EmbryoShopPanel
export type PlayerResourcesForShop = Pick<GameState, 'modularEXP' | 'incubationPower' | 'transcendentEssence'>;
export interface EmbryoShopPanelProps {
    shopItems: EmbryoItem[];
    playerResources: PlayerResourcesForShop;
    onBuyItem: (itemId: string) => void;
    embryoInventory: GameState['embryoInventory']; // Added for checking owned items
}

// Props for EmbryoEquipmentPanel
export interface EmbryoEquipmentPanelProps {
    equippedItems: { [key in EmbryoEquipmentSlotKey]: string | null };
    allItemsData: EmbryoItem[]; // To look up item details from ID
    onOpenInventoryModal: (slot: EmbryoEquipmentSlotKey) => void;
    onUnequipItem: (slot: EmbryoEquipmentSlotKey) => void;
}

// Props for EmbryoInventoryModalContent
export interface EmbryoInventoryModalContentProps {
    inventory: EmbryoItem[];
    currentSlot: EmbryoEquipmentSlotKey | null;
    allItemsData: EmbryoItem[]; // To look up item details from ID for display
    onEquipItem: (itemId: string, slot: EmbryoEquipmentSlotKey) => void;
    onClose: () => void;
}
