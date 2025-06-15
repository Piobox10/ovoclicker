
import { useCallback, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EmbryoStats, EmbryoItem, EmbryoEquipmentSlotKey, EmbryoStatKey } from '../types';
import { formatNumber } from '../utils'; 
import { EMBRYO_BASE_STATS_PER_LEVEL, INITIAL_EMBRYO_SHOP_ITEMS } from '../constants';


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
        bossDamageBonus: (EMBRYO_BASE_STATS_PER_LEVEL.bossDamageBonus || new Decimal(0)).times(level),
        doubleHitChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.doubleHitChance || new Decimal(0)).times(level)),
        lifestealRate: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.lifestealRate || new Decimal(0)).times(level)),
        chaosEffectChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.chaosEffectChance || new Decimal(0)).times(level)),
        // New Defensive Stats
        enemyDelayChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.enemyDelayChance || new Decimal(0)).times(level)),
        damageReflection: (EMBRYO_BASE_STATS_PER_LEVEL.damageReflection || new Decimal(0)).times(level),
        critResistance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.critResistance || new Decimal(0)).times(level)),
        periodicShieldValue: (EMBRYO_BASE_STATS_PER_LEVEL.periodicShieldValue || new Decimal(0)).times(level),
        dodgeChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.dodgeChance || new Decimal(0)).times(level)),
        overallDamageReduction: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.overallDamageReduction || new Decimal(0)).times(level)),
        hpRegenPerInterval: (EMBRYO_BASE_STATS_PER_LEVEL.hpRegenPerInterval || new Decimal(0)).times(level),
    };
};

export const calculateEmbryoEffectiveStats = (
    baseStats: EmbryoStats,
    equippedItems: { [key in EmbryoEquipmentSlotKey]: string | null },
    allItemsData: EmbryoItem[] 
): EmbryoStats => {
    let effectiveStats = { ...baseStats, currentHp: baseStats.currentHp.gt(baseStats.maxHp) ? baseStats.maxHp : baseStats.currentHp }; 

    const getItemById = (id: string | null) => allItemsData.find(item => item.id === id) || null;

    const itemsToConsider: (EmbryoItem | null)[] = [
        getItemById(equippedItems.weapon),
        getItemById(equippedItems.armor),
        getItemById(equippedItems.passiveChip)
    ];

    itemsToConsider.forEach(item => {
        if (item) {
            item.effects.forEach(effect => {
                const statKeyStr = effect.stat;
                // Check if effect.stat is a valid EmbryoStatKey before trying to modify effectiveStats
                // by checking if the key exists in baseStats (which has the EmbryoStatKey structure)
                if (Object.prototype.hasOwnProperty.call(baseStats, statKeyStr)) {
                    const key = statKeyStr as EmbryoStatKey; // Now we can safely cast

                    // Ensure the property exists and is a Decimal, type system should mostly enforce this
                    // but values from JS might not always be Decimal instances initially.
                    if (!(effectiveStats[key] instanceof Decimal)) {
                        (effectiveStats[key] as Decimal) = new Decimal(effectiveStats[key] || 0);
                    }
                    // Base stats should also be decimals
                    const baseStatValueForCalc = (baseStats[key] instanceof Decimal) ? (baseStats[key] as Decimal) : new Decimal(baseStats[key] || 0);

                    if (effect.type === 'flat') {
                        (effectiveStats[key] as Decimal) = (effectiveStats[key] as Decimal).plus(effect.value);
                    } else if (effect.type === 'percent_base') {
                        (effectiveStats[key] as Decimal) = (effectiveStats[key] as Decimal).plus(baseStatValueForCalc.times(effect.value));
                    }
                }
            });
        }
    });
    
    if (effectiveStats.currentHp.gt(effectiveStats.maxHp)) {
        effectiveStats.currentHp = effectiveStats.maxHp;
    }
    // Cap relevant stats
    effectiveStats.critChance = Decimal.min(1, effectiveStats.critChance); 
    effectiveStats.poisonChance = Decimal.min(1, effectiveStats.poisonChance);
    effectiveStats.doubleHitChance = Decimal.min(1, effectiveStats.doubleHitChance);
    effectiveStats.lifestealRate = Decimal.min(1, effectiveStats.lifestealRate);
    effectiveStats.chaosEffectChance = Decimal.min(1, effectiveStats.chaosEffectChance);
    effectiveStats.enemyDelayChance = Decimal.min(1, effectiveStats.enemyDelayChance);
    effectiveStats.critResistance = Decimal.min(1, effectiveStats.critResistance);
    effectiveStats.dodgeChance = Decimal.min(1, effectiveStats.dodgeChance);
    effectiveStats.overallDamageReduction = Decimal.min(1, effectiveStats.overallDamageReduction);
    // damageReflection and hpRegenPerInterval don't typically have a 100% cap in the same way.
    // periodicShieldValue is a value, not a chance.

    return effectiveStats;
};


export const useEmbryoSystem = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const buyEmbryoUpgradeHandler = useCallback((upgradeId: string) => {
        setGameState(prev => {
            const upgrade = prev.embryoUpgradesData.find(u => u.id === upgradeId);
            if (!upgrade || upgrade.purchased) {
                if(upgrade?.purchased) showMessage("Melhoria do embrião já adquirida.", 1500);
                return prev;
            }

            if (prev.modularEXP.lessThan(upgrade.cost)) {
                showMessage("EXP Modular insuficiente.", 1500);
                return prev;
            }

            const updatedEmbryoUpgrades = prev.embryoUpgradesData.map(u =>
                u.id === upgradeId ? { ...u, purchased: true } : u
            );

            showMessage(`Melhoria do embrião "${upgrade.name}" adquirida!`, 2000);
            return {
                ...prev,
                modularEXP: prev.modularEXP.minus(upgrade.cost),
                embryoUpgradesData: updatedEmbryoUpgrades,
            };
        });
    }, [setGameState, showMessage]);

    const buyEmbryoStoreItem = useCallback((itemId: string) => {
        setGameState(prev => {
            const itemToBuy = prev.embryoShopItems.find(item => item.id === itemId);
            if (!itemToBuy) {
                showMessage("Item não encontrado na loja.", 1500);
                return prev;
            }

            // Check if item is already in inventory
            if (prev.embryoInventory.some(invItem => invItem.id === itemId)) {
                showMessage("Este item já foi adquirido e está no seu inventário.", 1500);
                return prev;
            }

            let newModularEXP = prev.modularEXP;
            let newIncubationPower = prev.incubationPower;
            let newTranscendentEssence = prev.transcendentEssence;

            if (itemToBuy.cost.currency === 'modularEXP') {
                if (prev.modularEXP.lt(itemToBuy.cost.amount)) {
                    showMessage("EXP Modular insuficiente.", 1500);
                    return prev;
                }
                newModularEXP = prev.modularEXP.minus(itemToBuy.cost.amount);
            } else if (itemToBuy.cost.currency === 'incubationPower') {
                 if (prev.incubationPower.lt(itemToBuy.cost.amount)) {
                    showMessage("PI insuficiente.", 1500);
                    return prev;
                }
                newIncubationPower = prev.incubationPower.minus(itemToBuy.cost.amount);
            } else if (itemToBuy.cost.currency === 'transcendentEssence') {
                if (prev.transcendentEssence.lt(itemToBuy.cost.amount)) {
                    showMessage("ET insuficiente.", 1500);
                    return prev;
                }
                newTranscendentEssence = prev.transcendentEssence.minus(itemToBuy.cost.amount);
            }


            const newInventory = [...prev.embryoInventory, { ...itemToBuy }];
            
            showMessage(`"${itemToBuy.name}" comprado e adicionado ao inventário!`, 2000);
            return {
                ...prev,
                modularEXP: newModularEXP,
                incubationPower: newIncubationPower,
                transcendentEssence: newTranscendentEssence,
                embryoInventory: newInventory,
            };
        });
    }, [setGameState, showMessage]);

    const equipEmbryoItem = useCallback((itemId: string, slot: EmbryoEquipmentSlotKey) => {
        setGameState(prev => {
            const itemToEquip = prev.embryoInventory.find(item => item.id === itemId);
            
            if (!itemToEquip || !itemToEquip.equipmentType) {
                showMessage("Item não equipável ou não encontrado no inventário.", 1500);
                return prev;
            }
            
            // This comparison should work correctly given equipmentType is 'PassiveChip' and slot is 'passiveChip'
            if (itemToEquip.equipmentType.toLowerCase() !== slot.toLowerCase()) {
                showMessage(`Item "${itemToEquip.name}" não pode ser equipado no slot de ${slot}. Tipo esperado: ${slot}, tipo do item: ${itemToEquip.equipmentType}.`, 2500);
                return prev;
            }

            const newEquippedItems = { ...prev.equippedEmbryoItems, [slot]: itemId };
            // Use allPossibleEmbryoItems (which is currently embryoShopItems as per GameState setup)
            const newEffectiveStats = calculateEmbryoEffectiveStats(prev.embryoBaseStats, newEquippedItems, prev.embryoShopItems); 

            showMessage(`"${itemToEquip.name}" equipado no slot de ${slot}!`, 2000);
            return {
                ...prev,
                equippedEmbryoItems: newEquippedItems,
                embryoEffectiveStats: newEffectiveStats,
            };
        });
    }, [setGameState, showMessage]);

    const unequipEmbryoItem = useCallback((slot: EmbryoEquipmentSlotKey) => {
        setGameState(prev => {
            const currentItemId = prev.equippedEmbryoItems[slot];
            if (!currentItemId) return prev;

            const itemUnequipped = prev.embryoInventory.find(item => item.id === currentItemId) || prev.embryoShopItems.find(item => item.id === currentItemId);

            const newEquippedItems = { ...prev.equippedEmbryoItems, [slot]: null };
            const newEffectiveStats = calculateEmbryoEffectiveStats(prev.embryoBaseStats, newEquippedItems, prev.embryoShopItems);

            showMessage(`Item "${itemUnequipped?.name || 'Desconhecido'}" desequipado do slot de ${slot}.`, 2000);
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
