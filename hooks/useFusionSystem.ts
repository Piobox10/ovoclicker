
import { useCallback, useState } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EmbryoItem, FusedAttribute, EmbryoStatKey, EmbryoItemRarity, FusedAttributeEffectType, UpdateMissionProgressFn, LegendaryUpgrade } from '../types';
import { 
    INITIAL_EMBRYO_SHOP_ITEMS, 
    RARITY_COLORS_EMBRYO, 
    EMBRYO_BASE_STATS_PER_LEVEL 
} from '../constants';
import { 
    FUSION_NAME_PARTS, 
    FUSABLE_STAT_POOL, 
    SPECIAL_EFFECT_POOL, 
    ATTRIBUTE_COUNT_WEIGHTS,
    SPECIAL_EFFECT_CHANCE,
    RARITY_AVG_MODIFIERS,
    getRarityScore,
    BASE_STAT_RANGES,
    calculateFusedItemRerollCost,
    NEGATIVE_ATTRIBUTE_CHANCE,
    NEGATIVE_ATTRIBUTE_MAGNITUDE_MULTIPLIER,
    MAX_FUSION_ITEMS,
    MIN_FUSION_ITEMS,
    OUTPUT_RARITY_STAT_SCALERS
} from '../constants/fusion';
import { formatNumber, playSound } from '../utils';

export const useFusionSystem = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  showMessage: (text: string, duration?: number) => void,
  updateMissionProgress: UpdateMissionProgressFn
) => {

  const generateProceduralName = (): string => {
    const prefix = FUSION_NAME_PARTS.prefixes[Math.floor(Math.random() * FUSION_NAME_PARTS.prefixes.length)];
    const core = FUSION_NAME_PARTS.cores[Math.floor(Math.random() * FUSION_NAME_PARTS.cores.length)];
    const suffix = FUSION_NAME_PARTS.suffixes[Math.floor(Math.random() * FUSION_NAME_PARTS.suffixes.length)];
    return `${prefix} ${core} ${suffix}`;
  };

  const determineOutputRarity = (
    averageInputRarityScore: number,
    rarityModifierBonus: number,
    minimumInputRarityScoreIfUniform: number 
  ): EmbryoItemRarity => {
    const baseProbabilitiesFull: { [key in EmbryoItemRarity]?: number } = {
        'Common': 0.40, 'Uncommon': 0.30, 'Rare': 0.15, 'Epic': 0.08,
        'Legendary': 0.04, 'Mythic': 0.02, 'Ultra-Mythic': 0.01,
    };
    const raritiesOrder: EmbryoItemRarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Ultra-Mythic'];
    
    let finalProbabilities: { [key: string]: number } = {};
    let finalRandomRoll = Math.random();

    if (minimumInputRarityScoreIfUniform === getRarityScore('Mythic')) {
        const applicableForMythicCase = raritiesOrder.filter(r => getRarityScore(r) >= getRarityScore('Mythic'));
        if (applicableForMythicCase.length === 2 && applicableForMythicCase.includes('Mythic') && applicableForMythicCase.includes('Ultra-Mythic')) {
            finalProbabilities['Mythic'] = 0.95;
            finalProbabilities['Ultra-Mythic'] = 0.05;
            let cumulativeProbDirect = 0;
            for (const rarity of applicableForMythicCase) { 
                if (finalProbabilities[rarity] !== undefined) {
                    cumulativeProbDirect += finalProbabilities[rarity];
                    if (finalRandomRoll < cumulativeProbDirect) {
                        return rarity;
                    }
                }
            }
            return 'Ultra-Mythic'; 
        }
    }
    
    let applicableProbabilities: { [key: string]: number } = {};
    let totalApplicableProbability = 0;
    for (const rarity of raritiesOrder) {
        if (getRarityScore(rarity) >= minimumInputRarityScoreIfUniform && baseProbabilitiesFull[rarity] !== undefined) {
            applicableProbabilities[rarity] = baseProbabilitiesFull[rarity]!;
            totalApplicableProbability += baseProbabilitiesFull[rarity]!;
        }
    }

    if (totalApplicableProbability > 0) {
        for (const rarityKey in applicableProbabilities) {
            applicableProbabilities[rarityKey] /= totalApplicableProbability;
        }
        finalProbabilities = applicableProbabilities;
    } else if (minimumInputRarityScoreIfUniform > 0) {
        const minRarityName = raritiesOrder.find(r => getRarityScore(r) === minimumInputRarityScoreIfUniform);
        return minRarityName || 'Ultra-Mythic'; 
    } else {
        finalProbabilities = { ...baseProbabilitiesFull } as { [key: string]: number };
    }

    let adjustedScore = averageInputRarityScore + (rarityModifierBonus * 10); 
                                                                          
    if (adjustedScore > 6.5) finalRandomRoll -= 0.40; 
    else if (adjustedScore > 5.5) finalRandomRoll -= 0.30;
    else if (adjustedScore > 4.5) finalRandomRoll -= 0.20;
    else if (adjustedScore > 3.5) finalRandomRoll -= 0.10;
    else if (adjustedScore > 2.5) finalRandomRoll -= 0.05;
    
    finalRandomRoll = Math.max(0, finalRandomRoll);
    finalRandomRoll = Math.min(finalRandomRoll, 0.999999); 

    let cumulativeProbability = 0;
    const orderedApplicableRarities = raritiesOrder.filter(r => finalProbabilities[r] !== undefined);

    for (const rarity of orderedApplicableRarities) {
        cumulativeProbability += finalProbabilities[rarity];
        if (finalRandomRoll < cumulativeProbability) {
            return rarity;
        }
    }
    
    if (orderedApplicableRarities.length > 0) return orderedApplicableRarities[orderedApplicableRarities.length - 1];
    const minRarityNameDefault = raritiesOrder.find(r => getRarityScore(r) === minimumInputRarityScoreIfUniform);
    return minRarityNameDefault || 'Common'; 
};


  const generateFusedAttributes = (inputItems: EmbryoItem[], outputRarity: EmbryoItemRarity, legendaryUpgradesData?: LegendaryUpgrade[]): FusedAttribute[] => {
    const numInputs = inputItems.length;
    if (numInputs < MIN_FUSION_ITEMS || numInputs > MAX_FUSION_ITEMS) return [];

    const avgRarityScore = inputItems.reduce((sum, item) => sum + getRarityScore(item.rarity), 0) / numInputs;
    const rarityModifier = RARITY_AVG_MODIFIERS[Math.round(avgRarityScore)] || RARITY_AVG_MODIFIERS[1];
    
    const outputRarityScore = getRarityScore(outputRarity);
    const outputScaler = OUTPUT_RARITY_STAT_SCALERS[outputRarity] || OUTPUT_RARITY_STAT_SCALERS['Common'];

    let bonusAttrChanceFromOutput = 0;
    if(outputRarityScore >= 6) bonusAttrChanceFromOutput = 0.15; 
    else if (outputRarityScore >= 4) bonusAttrChanceFromOutput = 0.05; 


    const attributeCountPool = ATTRIBUTE_COUNT_WEIGHTS[numInputs] || ATTRIBUTE_COUNT_WEIGHTS[MIN_FUSION_ITEMS];
    let numAttributes = 0;
    const randAttrCount = Math.random();
    let cumulativeChance = 0;
    for (const count in attributeCountPool) {
      cumulativeChance += attributeCountPool[count];
      if (randAttrCount <= cumulativeChance) {
        numAttributes = parseInt(count);
        break;
      }
    }
    
    if (Math.random() < (rarityModifier.extraAttributeChanceBonus + bonusAttrChanceFromOutput) && numAttributes < (numInputs === MIN_FUSION_ITEMS ? 2 : 4) ) {
        numAttributes++;
    }

    const attributes: FusedAttribute[] = [];
    const usedStatKeys: Set<string> = new Set(); 
    let actualSpecialEffectChance = SPECIAL_EFFECT_CHANCE;
    
    const unstableFlaskActive = legendaryUpgradesData?.find(lu => lu.id === 'unstableFlask' && lu.activated);
    if (unstableFlaskActive) {
        actualSpecialEffectChance = 0.5; // Significantly increase chance for a special effect
    }


    for (let i = 0; i < numAttributes; i++) {
      let attribute: FusedAttribute | null = null;

      if (Math.random() < actualSpecialEffectChance && SPECIAL_EFFECT_POOL.length > 0) {
        const specialEffectDef = SPECIAL_EFFECT_POOL[Math.floor(Math.random() * SPECIAL_EFFECT_POOL.length)];
        let potency = Math.floor(Math.random() * 3) + 1 + Math.floor(rarityModifier.valueMultiplier) + Math.floor(outputRarityScore / 2); 
        potency = Math.round(potency * outputScaler.specialEffectPotencyMultiplier);
        potency = Math.max(1, Math.min(10, potency));
        
        attribute = {
          id: `special_${specialEffectDef.id}_${i}`,
          description: specialEffectDef.generateDescription(potency),
          isSpecialEffect: true,
          potency: potency, 
          type: specialEffectDef.effectType,
        };
      } else {
        let selectedStatKey: EmbryoStatKey | undefined = undefined;
        let attempts = 0;
        while(attempts < FUSABLE_STAT_POOL.length * 2) { 
            selectedStatKey = FUSABLE_STAT_POOL[Math.floor(Math.random() * FUSABLE_STAT_POOL.length)];
            if(!usedStatKeys.has(selectedStatKey)) break;
            attempts++;
        }
        if (!selectedStatKey) continue; 

        usedStatKeys.add(selectedStatKey);
        const statRange = BASE_STAT_RANGES[selectedStatKey];
        if (!statRange) continue;

        let value = new Decimal(Math.random() * (statRange.max - statRange.min) + statRange.min);
        value = value.times(rarityModifier.valueMultiplier);
        value = value.times(outputScaler.valueMultiplier);


        let isNegative = false;
        if (Math.random() < NEGATIVE_ATTRIBUTE_CHANCE) {
            value = value.times(NEGATIVE_ATTRIBUTE_MAGNITUDE_MULTIPLIER).negated();
            isNegative = true;
        }
        
        const decimals = statRange.isPercentage ? 3 : (selectedStatKey.toLowerCase().includes('speed') ? 1:0);
        value = value.toDecimalPlaces(decimals);


        let descriptionPrefix = value.isPositive() ? '+' : '';
        if (isNegative) descriptionPrefix = ''; 


        attribute = {
          id: `${selectedStatKey}_${statRange.type}_${i}`,
          statKey: selectedStatKey,
          value: value,
          type: statRange.type,
          description: `${descriptionPrefix}${statRange.isPercentage ? value.times(100).toDecimalPlaces(1) + '%' : formatNumber(value)} ${selectedStatKey.replace('embryo', 'Embrião ')}`,
          isSpecialEffect: false,
        };
      }
      if (attribute) attributes.push(attribute);
    }

    // Ensure at least one special effect if Unstable Flask is active and attributes were generated
    if (unstableFlaskActive && attributes.length > 0 && !attributes.some(attr => attr.isSpecialEffect) && SPECIAL_EFFECT_POOL.length > 0) {
        const specialEffectDef = SPECIAL_EFFECT_POOL[Math.floor(Math.random() * SPECIAL_EFFECT_POOL.length)];
        let potency = Math.floor(Math.random() * 3) + 1 + Math.floor(rarityModifier.valueMultiplier) + Math.floor(outputRarityScore / 2);
        potency = Math.round(potency * outputScaler.specialEffectPotencyMultiplier);
        potency = Math.max(1, Math.min(10, potency));

        const forcedSpecialAttribute: FusedAttribute = {
            id: `special_forced_${specialEffectDef.id}_${attributes.length}`,
            description: specialEffectDef.generateDescription(potency),
            isSpecialEffect: true,
            potency: potency,
            type: specialEffectDef.effectType,
        };
        // Replace the last attribute if possible, or add if space (though numAttributes is fixed here)
        if (attributes.length >= numAttributes && numAttributes > 0) {
            attributes[attributes.length -1] = forcedSpecialAttribute; // Replace last
        } else {
            attributes.push(forcedSpecialAttribute); // Should not happen if numAttributes is respected
        }
    }


    return attributes;
  };


  const fuseItems = useCallback(() => {
    setGameState(prev => {
      if (prev.fusionSelectedInventoryItemIds.length < MIN_FUSION_ITEMS || prev.fusionSelectedInventoryItemIds.length > MAX_FUSION_ITEMS) {
        showMessage(`Selecione ${MIN_FUSION_ITEMS} ou ${MAX_FUSION_ITEMS} itens para fusão.`, 2000);
        return prev;
      }

      const inputItems: EmbryoItem[] = prev.fusionSelectedInventoryItemIds
        .map(instanceId => prev.embryoInventory.find(item => item.instanceId === instanceId)) 
        .filter(Boolean) as EmbryoItem[];

      if (inputItems.length !== prev.fusionSelectedInventoryItemIds.length) {
        showMessage("Um ou mais itens selecionados não foram encontrados no inventário.", 2000);
        return { ...prev, fusionSelectedInventoryItemIds: [] }; 
      }
      
      const tempInventory = prev.embryoInventory.filter(
        item => !prev.fusionSelectedInventoryItemIds.includes(item.instanceId || '') 
      );

      const avgRarityScore = inputItems.reduce((sum, item) => sum + getRarityScore(item.rarity), 0) / inputItems.length;
      const rarityModifier = RARITY_AVG_MODIFIERS[Math.round(avgRarityScore)] || RARITY_AVG_MODIFIERS[1];
      
      const inputItemRarities = inputItems.map(item => item.rarity);
      let minimumInputRarityScoreIfUniform = 1; 
      if (inputItemRarities.length > 0) {
          const firstRarity = inputItemRarities[0];
          if (inputItemRarities.every(r => r === firstRarity)) {
              minimumInputRarityScoreIfUniform = getRarityScore(firstRarity);
          }
      }
      
      const outputRarity = determineOutputRarity(avgRarityScore, rarityModifier.extraAttributeChanceBonus, minimumInputRarityScoreIfUniform);


      const fusedAttributes = generateFusedAttributes(inputItems, outputRarity, prev.legendaryUpgradesData); // Pass legendaryUpgradesData
      if (fusedAttributes.length === 0) {
          showMessage("Falha na fusão. Nenhum atributo gerado.", 2000);
          return { ...prev, fusionSelectedInventoryItemIds: [], embryoInventory: prev.embryoInventory, lastFusedItem: null }; 
      }
      
      const fusedName = generateProceduralName();
      const newItemId = `fused_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`; 
      
      const newFusedItem: EmbryoItem = {
        id: newItemId, 
        instanceId: newItemId, 
        name: "Item Fundido", 
        fusedName: fusedName,
        description: `Um item ${outputRarity} único criado pela fusão de ${inputItems.map(item => item.name).join(', ')}.`,
        icon: 'fas fa-atom-alt', 
        rarity: outputRarity, 
        equipmentType: inputItems[0].equipmentType, 
        storeCategory: 'Especial', 
        cost: [], 
        effects: [], 
        isFused: true,
        fusedAttributes: fusedAttributes,
        rerollCostET: calculateFusedItemRerollCost(fusedAttributes, outputRarity),
      };

      tempInventory.push(newFusedItem);
      
      showMessage(`Fusão Concluída! "${newFusedItem.fusedName}" (${newFusedItem.rarity}) criado.`, 3000);
      playSound('craft_success.mp3', prev.isSoundEnabled, 0.8);
      updateMissionProgress('itemsCrafted_thisRun', new Decimal(1));

      return {
        ...prev,
        embryoInventory: tempInventory,
        fusionSelectedInventoryItemIds: [],
        lastFusedItem: newFusedItem,
      };
    });
  }, [setGameState, showMessage, updateMissionProgress]);

  const rerollFusedItemAttributes = useCallback(() => {
    setGameState(prev => {
      if (!prev.lastFusedItem || !prev.lastFusedItem.isFused || !prev.lastFusedItem.rerollCostET || !prev.lastFusedItem.instanceId) {
        showMessage("Nenhum item fundido recente para rerolar ou item inválido.", 2000);
        return prev;
      }
      if (prev.transcendentEssence.lt(prev.lastFusedItem.rerollCostET)) {
        showMessage(`ET insuficiente para rerolar. Custo: ${formatNumber(prev.lastFusedItem.rerollCostET)} ET.`, 2000);
        return prev;
      }
      
      const currentNumAttributes = prev.lastFusedItem.fusedAttributes?.length || 2;
      const itemRarityForReroll = prev.lastFusedItem.rarity;
      
      const mockInputItemsForReroll: EmbryoItem[] = Array(currentNumAttributes > 2 ? 3 : 2).fill(null).map((_, index) => ({
          id: `mock_reroll_${index}`,
          instanceId: `mock_reroll_instance_${index}_${Date.now()}`,
          name: 'Mock Item for Reroll', 
          description: 'Mock item for reroll logic', 
          icon: 'fas fa-question-circle', 
          rarity: itemRarityForReroll, 
          equipmentType: prev.lastFusedItem!.equipmentType, 
          cost: [], 
          effects: [], 
          storeCategory: 'Especial' // Default or derived
      }));

      const minimumRarityScoreForReroll = getRarityScore(itemRarityForReroll);
      const newRarityForRerolledAttributes = determineOutputRarity(
          minimumRarityScoreForReroll, 
          0, 
          minimumRarityScoreForReroll 
      );

      const newAttributes = generateFusedAttributes(mockInputItemsForReroll, newRarityForRerolledAttributes, prev.legendaryUpgradesData).slice(0, currentNumAttributes); 

      if (newAttributes.length === 0) {
        showMessage("Falha ao rerolar atributos.", 2000);
        return prev;
      }

      const updatedItemInPlace = {
        ...prev.lastFusedItem,
        rarity: newRarityForRerolledAttributes, 
        fusedAttributes: newAttributes,
        rerollCostET: calculateFusedItemRerollCost(newAttributes, newRarityForRerolledAttributes), 
      };

      const newInventory = prev.embryoInventory.map(item => 
        item.instanceId === prev.lastFusedItem!.instanceId ? updatedItemInPlace : item
      );
      
      showMessage(`Atributos de "${updatedItemInPlace.fusedName}" rerolados! Nova raridade: ${updatedItemInPlace.rarity}.`, 2500);
      playSound('purchase_special.mp3', prev.isSoundEnabled, 0.7);

      return {
        ...prev,
        transcendentEssence: prev.transcendentEssence.minus(prev.lastFusedItem.rerollCostET),
        embryoInventory: newInventory,
        lastFusedItem: updatedItemInPlace,
      };
    });
  }, [setGameState, showMessage]);


  const toggleFusionSelection = useCallback((itemInstanceId: string) => { 
    setGameState(prev => {
        const currentSelections = prev.fusionSelectedInventoryItemIds;
        if (currentSelections.includes(itemInstanceId)) {
            return { ...prev, fusionSelectedInventoryItemIds: currentSelections.filter(id => id !== itemInstanceId) };
        } else {
            if (currentSelections.length < MAX_FUSION_ITEMS) {
                return { ...prev, fusionSelectedInventoryItemIds: [...currentSelections, itemInstanceId] };
            } else {
                showMessage(`Máximo de ${MAX_FUSION_ITEMS} itens para fusão já selecionados.`, 2000);
                return prev;
            }
        }
    });
  }, [setGameState, showMessage]);

  return { fuseItems, rerollFusedItemAttributes, toggleFusionSelection };
};
