
import { useCallback, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EmbryoStats, EmbryoItem, EmbryoEquipmentSlotKey, EmbryoStatKey, EmbryoUpgrade, MetaUpgrade, EmbryoItemRarity, FusedAttribute, EmbryoItemEffect } from '../types'; // Added EmbryoItemEffect
import { formatNumber, calculateEmbryoUpgradeCost, playSound } from '../utils'; 
import { EMBRYO_BASE_STATS_PER_LEVEL, INITIAL_EMBRYO_SHOP_ITEMS } from '../constants';

type UpdateMissionProgressFn = (metric: string, incrementValue: Decimal, associatedData?: any) => void;


export const calculateEmbryoBaseStats = (level: Decimal): EmbryoStats => {
    const baseMaxHp = (EMBRYO_BASE_STATS_PER_LEVEL.maxHp || new Decimal(0)).times(level);
    return {
        currentHp: baseMaxHp, 
        maxHp: baseMaxHp,
        attack: (EMBRYO_BASE_STATS_PER_LEVEL.attack || new Decimal(0)).times(level),
        defense: (EMBRYO_BASE_STATS_PER_LEVEL.defense || new Decimal(0)).times(level),
        speed: (EMBRYO_BASE_STATS_PER_LEVEL.speed || new Decimal(0)).times(level),
        critChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.critChance || new Decimal(0)).times(level)),
        poisonChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.poisonChance || new Decimal(0)).times(level)),
        poisonDurationSeconds: (EMBRYO_BASE_STATS_PER_LEVEL.poisonDurationSeconds || new Decimal(0)).times(level), 
        bossDamageBonus: (EMBRYO_BASE_STATS_PER_LEVEL.bossDamageBonus || new Decimal(0)).times(level),
        doubleHitChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.doubleHitChance || new Decimal(0)).times(level)),
        lifestealRate: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.lifestealRate || new Decimal(0)).times(level)),
        chaosEffectChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.chaosEffectChance || new Decimal(0)).times(level)),
        enemyDelayChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.enemyDelayChance || new Decimal(0)).times(level)),
        damageReflection: (EMBRYO_BASE_STATS_PER_LEVEL.damageReflection || new Decimal(0)).times(level),
        critResistance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.critResistance || new Decimal(0)).times(level)),
        periodicShieldValue: (EMBRYO_BASE_STATS_PER_LEVEL.periodicShieldValue || new Decimal(0)).times(level),
        dodgeChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.dodgeChance || new Decimal(0)).times(level)),
        overallDamageReduction: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.overallDamageReduction || new Decimal(0)).times(level)),
        hpRegenPerInterval: (EMBRYO_BASE_STATS_PER_LEVEL.hpRegenPerInterval || new Decimal(0)).times(level),
        hpRegenPerMinute: (EMBRYO_BASE_STATS_PER_LEVEL.hpRegenPerMinute || new Decimal(0)).times(level),
        modularExpGainMultiplier: (EMBRYO_BASE_STATS_PER_LEVEL.modularExpGainMultiplier || new Decimal(0)).times(level),
        shieldOnXpFull: (EMBRYO_BASE_STATS_PER_LEVEL.shieldOnXpFull || new Decimal(0)).times(level),
        outgoingDamageMultiplier: (EMBRYO_BASE_STATS_PER_LEVEL.outgoingDamageMultiplier || new Decimal(0)).times(level),
        embryoIpps: (EMBRYO_BASE_STATS_PER_LEVEL.embryoIpps || new Decimal(0)).times(level),
        embryoClicksPerClick: (EMBRYO_BASE_STATS_PER_LEVEL.embryoClicksPerClick || new Decimal(0)).times(level),
        currentShield: new Decimal(0), // Initialize currentShield
        maxShield: (EMBRYO_BASE_STATS_PER_LEVEL.maxShield || new Decimal(0)).times(level), // Initialize maxShield
        critDamageMultiplier: (EMBRYO_BASE_STATS_PER_LEVEL.critDamageMultiplier || new Decimal(0)).times(level),
        positiveChaosEffectDuplicationChance: (EMBRYO_BASE_STATS_PER_LEVEL.positiveChaosEffectDuplicationChance || new Decimal(0)).times(level),
    };
};

export const calculateEmbryoEffectiveStats = (
    baseStats: EmbryoStats,
    equippedItemInstanceIds: { [key in EmbryoEquipmentSlotKey]: string | null }, // Now stores instanceIds
    inventory: EmbryoItem[], // Pass the full inventory which includes all instances
    embryoUpgrades: EmbryoUpgrade[],
    metaUpgradesData: MetaUpgrade[] 
): EmbryoStats => {
    let effectiveStats = { ...baseStats, currentHp: baseStats.currentHp.gt(baseStats.maxHp) ? baseStats.maxHp : baseStats.currentHp }; 

    embryoUpgrades.forEach(upgrade => {
        if (upgrade.purchased.gt(0)) {
            Object.keys(upgrade.effect).forEach(effectKey => {
                const statKeyStr = effectKey;
                if (Object.prototype.hasOwnProperty.call(baseStats, statKeyStr)) {
                    const key = statKeyStr as EmbryoStatKey;
                    const effectValue = upgrade.effect[key] as Decimal | undefined;

                    if (effectValue instanceof Decimal) {
                        if (!(effectiveStats[key] instanceof Decimal)) {
                            (effectiveStats[key] as Decimal) = new Decimal(effectiveStats[key] || 0);
                        }
                        (effectiveStats[key] as Decimal) = (effectiveStats[key] as Decimal).plus(effectValue.times(upgrade.purchased));
                    }
                }
            });
        }
    });
    
    const getItemByInstanceId = (instanceId: string | null): EmbryoItem | null => {
        if (!instanceId) return null;
        return inventory.find(item => item.instanceId === instanceId) || null;
    };

    const itemsToConsider: (EmbryoItem | null)[] = [
        getItemByInstanceId(equippedItemInstanceIds.weapon),
        getItemByInstanceId(equippedItemInstanceIds.armor),
        getItemByInstanceId(equippedItemInstanceIds.passiveChip),
        getItemByInstanceId(equippedItemInstanceIds.especial) 
    ];

    itemsToConsider.forEach(item => {
        if (item) {
            const attributesToApply = item.isFused && item.fusedAttributes ? item.fusedAttributes : item.effects;
            
            attributesToApply.forEach(attribute => {
                const statKeyStr = item.isFused ? (attribute as FusedAttribute).statKey : (attribute as EmbryoItemEffect).stat;
                const value = item.isFused ? (attribute as FusedAttribute).value : (attribute as EmbryoItemEffect).value;
                const type = item.isFused ? (attribute as FusedAttribute).type : (attribute as EmbryoItemEffect).type;

                if (statKeyStr && value instanceof Decimal && type) {
                    const key = statKeyStr as EmbryoStatKey;
                     if (Object.prototype.hasOwnProperty.call(baseStats, key)) {
                        if (!(effectiveStats[key] instanceof Decimal)) {
                            (effectiveStats[key] as Decimal) = new Decimal(effectiveStats[key] || 0);
                        }
                        const baseStatValueForCalc = (baseStats[key] instanceof Decimal) ? (baseStats[key] as Decimal) : new Decimal(baseStats[key] || 0);

                        let actualEffectValue = new Decimal(value);

                        if (item.equipmentType === 'PassiveChip' && !item.isFused && metaUpgradesData) { // Original chip meta upgrade logic
                            metaUpgradesData.forEach(meta => {
                                if (meta.purchased.gt(0) && meta.effect.chipEffectivenessMultiplier) {
                                    const chipMultData = meta.effect.chipEffectivenessMultiplier as { rarity: EmbryoItemRarity, multiplier: Decimal };
                                    if (item.rarity === chipMultData.rarity) {
                                        actualEffectValue = actualEffectValue.times(chipMultData.multiplier);
                                    }
                                }
                            });
                        }
                        
                        if (type === 'flat') {
                            (effectiveStats[key] as Decimal) = (effectiveStats[key] as Decimal).plus(actualEffectValue);
                        } else if (type === 'percent_base_stat' || type === 'percent_base') { // percent_base for compatibility
                             (effectiveStats[key] as Decimal) = (effectiveStats[key] as Decimal).plus(baseStatValueForCalc.times(actualEffectValue));
                        }
                    }
                }
            });
        }
    });
    
    if (effectiveStats.currentHp.gt(effectiveStats.maxHp)) {
        effectiveStats.currentHp = effectiveStats.maxHp;
    }
    if (effectiveStats.currentShield && effectiveStats.maxShield && effectiveStats.currentShield.gt(effectiveStats.maxShield)) {
        effectiveStats.currentShield = effectiveStats.maxShield;
    }
    effectiveStats.critChance = Decimal.min(1, effectiveStats.critChance); 
    effectiveStats.poisonChance = Decimal.min(1, effectiveStats.poisonChance);
    effectiveStats.doubleHitChance = Decimal.min(1, effectiveStats.doubleHitChance);
    effectiveStats.lifestealRate = Decimal.min(1, effectiveStats.lifestealRate);
    effectiveStats.chaosEffectChance = Decimal.min(1, effectiveStats.chaosEffectChance);
    effectiveStats.enemyDelayChance = Decimal.min(1, effectiveStats.enemyDelayChance);
    effectiveStats.critResistance = Decimal.min(1, effectiveStats.critResistance);
    effectiveStats.dodgeChance = Decimal.min(1, effectiveStats.dodgeChance);
    effectiveStats.overallDamageReduction = Decimal.min(1, effectiveStats.overallDamageReduction);

    return effectiveStats;
};


export const useEmbryoSystem = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void,
    updateMissionProgress: UpdateMissionProgressFn
) => {
    const buyEmbryoUpgradeHandler = useCallback((upgradeId: string) => {
        setGameState(prev => {
            const upgrade = prev.embryoUpgradesData.find(u => u.id === upgradeId);
            if (!upgrade) return prev;

            if (upgrade.maxLevel && upgrade.purchased.gte(upgrade.maxLevel)) {
                showMessage("Nível máximo da melhoria do embrião já atingido.", 1500);
                return prev;
            }

            const cost = calculateEmbryoUpgradeCost(upgrade);

            if (prev.modularEXP.lessThan(cost)) {
                showMessage("EXP Modular insuficiente.", 1500);
                return prev;
            }
            
            updateMissionProgress('modularEXPSpent_thisRun', cost);


            const updatedEmbryoUpgrades = prev.embryoUpgradesData.map(u =>
                u.id === upgradeId ? { ...u, purchased: u.purchased.plus(1) } : u
            );
            
            const newEffectiveStats = calculateEmbryoEffectiveStats(prev.embryoBaseStats, prev.equippedEmbryoItems, prev.embryoInventory, updatedEmbryoUpgrades, prev.metaUpgradesData);

            const purchasedLevel = upgrade.purchased.plus(1);
            if(upgrade.baseCost) { 
                showMessage(`Melhoria "${upgrade.name}" Nível ${purchasedLevel.toString()} adquirida!`, 2000);
            } else { 
                showMessage(`Melhoria "${upgrade.name}" adquirida!`, 2000);
            }
            playSound('purchase.mp3', prev.isSoundEnabled, 0.5);


            return {
                ...prev,
                modularEXP: prev.modularEXP.minus(cost),
                embryoUpgradesData: updatedEmbryoUpgrades,
                embryoEffectiveStats: newEffectiveStats, 
            };
        });
    }, [setGameState, showMessage, updateMissionProgress]);

    const buyEmbryoStoreItem = useCallback((itemId: string) => {
        setGameState(prev => {
            const itemDefinition = prev.embryoShopItems.find(item => item.id === itemId);
            if (!itemDefinition) {
                showMessage("Definição do item não encontrada na loja.", 1500);
                return prev;
            }
    
            let canAfford = true;
            let costs: { [key: string]: Decimal } = {};
    
            for (const cost of itemDefinition.cost) {
                costs[cost.currency] = cost.amount;
                if (cost.currency === 'modularEXP' && prev.modularEXP.lt(cost.amount)) canAfford = false;
                if (cost.currency === 'incubationPower' && prev.incubationPower.lt(cost.amount)) canAfford = false;
                if (cost.currency === 'transcendentEssence' && prev.transcendentEssence.lt(cost.amount)) canAfford = false;
            }
    
            if (!canAfford) {
                showMessage("Recursos insuficientes.", 1500);
                return prev;
            }
    
            let newModularEXP = prev.modularEXP;
            let newIncubationPower = prev.incubationPower;
            let newTranscendentEssence = prev.transcendentEssence;
    
            if (costs['modularEXP']) {
                newModularEXP = newModularEXP.minus(costs['modularEXP']);
                updateMissionProgress('modularEXPSpent_thisRun', costs['modularEXP']);
            }
            if (costs['incubationPower']) newIncubationPower = newIncubationPower.minus(costs['incubationPower']);
            if (costs['transcendentEssence']) newTranscendentEssence = newTranscendentEssence.minus(costs['transcendentEssence']);
    
            const newItemInstance: EmbryoItem = {
                ...itemDefinition,
                instanceId: `${itemDefinition.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                isEquipped: false,
            };
    
            const newInventory = [...prev.embryoInventory, newItemInstance];
            
            showMessage(`"${newItemInstance.name}" comprado e adicionado ao inventário!`, 2000);
            playSound('purchase.mp3', prev.isSoundEnabled, 0.6);
    
            return {
                ...prev,
                modularEXP: newModularEXP,
                incubationPower: newIncubationPower,
                transcendentEssence: newTranscendentEssence,
                embryoInventory: newInventory,
            };
        });
    }, [setGameState, showMessage, updateMissionProgress]);

    const equipEmbryoItem = useCallback((itemInstanceId: string, slot: EmbryoEquipmentSlotKey) => {
        setGameState(prev => {
            const itemToEquip = prev.embryoInventory.find(item => item.instanceId === itemInstanceId);
            
            if (!itemToEquip || !itemToEquip.equipmentType) {
                showMessage("Item não equipável ou não encontrado no inventário.", 1500);
                return prev;
            }
            
             const expectedTypeForSlot: Record<EmbryoEquipmentSlotKey, string> = {
                weapon: 'Weapon',
                armor: 'Armor',
                passiveChip: 'PassiveChip',
                especial: 'SpecialAccessory'
            };

            if (itemToEquip.equipmentType !== expectedTypeForSlot[slot]) {
                 showMessage(`Item "${itemToEquip.fusedName || itemToEquip.name}" (${itemToEquip.equipmentType}) não pode ser equipado no slot de ${slot} (esperado: ${expectedTypeForSlot[slot]}).`, 3000);
                return prev;
            }

            const newEquippedItems = { ...prev.equippedEmbryoItems, [slot]: itemInstanceId }; // Store instanceId
            const newEffectiveStats = calculateEmbryoEffectiveStats(prev.embryoBaseStats, newEquippedItems, prev.embryoInventory, prev.embryoUpgradesData, prev.metaUpgradesData); 

            showMessage(`"${itemToEquip.fusedName || itemToEquip.name}" equipado no slot de ${slot}!`, 2000);
            playSound('equip_item.mp3', prev.isSoundEnabled, 0.6);
            return {
                ...prev,
                equippedEmbryoItems: newEquippedItems,
                embryoEffectiveStats: newEffectiveStats,
            };
        });
    }, [setGameState, showMessage]);

    const unequipEmbryoItem = useCallback((slot: EmbryoEquipmentSlotKey) => {
        setGameState(prev => {
            const currentItemInstanceId = prev.equippedEmbryoItems[slot];
            if (!currentItemInstanceId) return prev;

            const itemUnequipped = prev.embryoInventory.find(item => item.instanceId === currentItemInstanceId);

            const newEquippedItems = { ...prev.equippedEmbryoItems, [slot]: null };
            const newEffectiveStats = calculateEmbryoEffectiveStats(prev.embryoBaseStats, newEquippedItems, prev.embryoInventory, prev.embryoUpgradesData, prev.metaUpgradesData);

            showMessage(`Item "${itemUnequipped?.fusedName || itemUnequipped?.name || 'Desconhecido'}" desequipado do slot de ${slot}.`, 2000);
            playSound('unequip_item.mp3', prev.isSoundEnabled, 0.5);
            return {
                ...prev,
                equippedEmbryoItems: newEquippedItems,
                embryoEffectiveStats: newEffectiveStats,
            };
        });
    }, [setGameState, showMessage]);


    return {
        buyEmbryoUpgradeHandler,
        buyEmbryoStoreItem,
        equipEmbryoItem,
        unequipEmbryoItem,
    };
};
