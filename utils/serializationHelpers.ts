
import { Decimal } from 'decimal.js';
import { FusedAttribute, SerializableEffectObject, EmbryoItemRarity, BattleEgg, BattleAbilityInstance, BattleStatusEffectInstance } from '../types'; 

export const safeDecimal = (value: string | undefined | Decimal, defaultValue: string = '0'): Decimal => {
    if (value instanceof Decimal) return value;
    try {
        return new Decimal(value || defaultValue);
    } catch (e) {
        // console.warn(`Failed to parse Decimal from value: '${value}', using defaultValue: '${defaultValue}'`);
        return new Decimal(defaultValue);
    }
};

export const safeEffectDecimal = (
    effectObj: SerializableEffectObject | undefined,
    initialEffect: { [key: string]: any } // Keep initialEffect flexible to match runtime structures
): { [key: string]: any } => { // Return type should also be flexible
    const newEffect: { [key: string]: any } = {};

    if (!effectObj) { // If no saved effect, return deep copy of initial
        for (const key in initialEffect) {
            if (Object.prototype.hasOwnProperty.call(initialEffect, key)) {
                const val = initialEffect[key];
                if (typeof val === 'object' && val !== null && !(val instanceof Decimal)) {
                    const newSubObject: { [subKey: string]: any } = {};
                    for (const subKey in val) {
                        if (Object.prototype.hasOwnProperty.call(val, subKey)) {
                            newSubObject[subKey] = val[subKey] instanceof Decimal ? new Decimal(val[subKey]) : val[subKey];
                        }
                    }
                    newEffect[key] = newSubObject;
                } else if (val instanceof Decimal) {
                    newEffect[key] = new Decimal(val);
                } else {
                    newEffect[key] = val;
                }
            }
        }
        return newEffect;
    }

    // Process keys based on initialEffect structure first
    for (const key in initialEffect) {
        if (Object.prototype.hasOwnProperty.call(initialEffect, key)) {
            const initialVal = initialEffect[key];
            const savedVal = effectObj[key];

            if (typeof initialVal === 'object' && initialVal !== null && !(initialVal instanceof Decimal)) {
                if (typeof savedVal === 'object' && savedVal !== null) {
                    if ('rate' in initialVal && 'max' in initialVal && 'rate' in savedVal && 'max' in savedVal && typeof (savedVal as any).rate === 'string' && typeof (savedVal as any).max === 'string') {
                        newEffect[key] = { rate: safeDecimal((savedVal as any).rate), max: safeDecimal((savedVal as any).max) };
                    } else if ('rarity' in initialVal && 'multiplier' in initialVal && 'rarity' in savedVal && 'multiplier' in savedVal && typeof (savedVal as any).multiplier === 'string') {
                        newEffect[key] = { rarity: (savedVal as any).rarity as EmbryoItemRarity, multiplier: safeDecimal((savedVal as any).multiplier) };
                    } else if ('conditionMinTraits' in initialVal && 'multiplier' in initialVal && 'conditionMinTraits' in savedVal && 'multiplier' in savedVal && typeof (savedVal as any).multiplier === 'string') {
                         newEffect[key] = { conditionMinTraits: (savedVal as any).conditionMinTraits as number, multiplier: safeDecimal((savedVal as any).multiplier) };
                    } else if ('duration' in initialVal && 'multiplier' in initialVal && 'duration' in savedVal && 'multiplier' in savedVal && typeof (savedVal as any).duration === 'string' && typeof (savedVal as any).multiplier === 'string') {
                        newEffect[key] = { duration: safeDecimal((savedVal as any).duration), multiplier: safeDecimal((savedVal as any).multiplier) };
                    }
                    else { // Fallback for other object structures not explicitly handled
                        const newInitialSubObject: { [subKey: string]: any } = {};
                        for (const subKey in initialVal) {
                           if (Object.prototype.hasOwnProperty.call(initialVal, subKey)) {
                               const subInitial = initialVal[subKey];
                               const subSaved = (savedVal as any)?.[subKey];
                               if (subInitial instanceof Decimal) {
                                   newInitialSubObject[subKey] = safeDecimal(subSaved as string | undefined, subInitial.toString());
                               } else if (typeof subInitial === 'boolean') {
                                   newInitialSubObject[subKey] = typeof subSaved === 'boolean' ? subSaved : subInitial;
                               } else {
                                   newInitialSubObject[subKey] = subSaved !== undefined ? subSaved : subInitial;
                               }
                           }
                        }
                        newEffect[key] = newInitialSubObject;
                    }
                } else { // Saved value is not an object, but initial is. Revert to initial.
                    const newInitialSubObject: { [subKey: string]: any } = {};
                    for (const subKey in initialVal) {
                        if (Object.prototype.hasOwnProperty.call(initialVal, subKey)) {
                             newInitialSubObject[subKey] = initialVal[subKey] instanceof Decimal ? new Decimal(initialVal[subKey]) : initialVal[subKey];
                        }
                    }
                    newEffect[key] = newInitialSubObject;
                }
            } else if (initialVal instanceof Decimal) {
                newEffect[key] = safeDecimal(savedVal as string | undefined, initialVal.toString());
            } else if (typeof initialVal === 'boolean') {
                newEffect[key] = typeof savedVal === 'boolean' ? savedVal : initialVal;
            } else { // initialVal is undefined or some other simple type
                newEffect[key] = typeof savedVal === 'string' ? safeDecimal(savedVal) : savedVal;
            }
        }
    }

    // Process any extra keys from saved data that were not in initialEffect
    for (const key in effectObj) {
        if (Object.prototype.hasOwnProperty.call(effectObj, key) && !Object.prototype.hasOwnProperty.call(newEffect, key)) {
            const savedVal = effectObj[key];
            if (typeof savedVal === 'string') {
                newEffect[key] = safeDecimal(savedVal);
            } else if (typeof savedVal === 'object' && savedVal !== null) {
                 if ('rate' in savedVal && 'max' in savedVal && typeof savedVal.rate === 'string' && typeof savedVal.max === 'string') {
                    newEffect[key] = { rate: safeDecimal(savedVal.rate), max: safeDecimal(savedVal.max) };
                } else if ('rarity' in savedVal && 'multiplier' in savedVal && typeof savedVal.multiplier === 'string') {
                     newEffect[key] = { rarity: savedVal.rarity as EmbryoItemRarity, multiplier: safeDecimal(savedVal.multiplier) };
                } else if ('conditionMinTraits' in savedVal && 'multiplier' in savedVal && typeof savedVal.multiplier === 'string') {
                    newEffect[key] = { conditionMinTraits: savedVal.conditionMinTraits as number, multiplier: safeDecimal(savedVal.multiplier) };
                } else if ('duration' in savedVal && 'multiplier' in savedVal && typeof savedVal.duration === 'string' && typeof savedVal.multiplier === 'string') {
                    newEffect[key] = { duration: safeDecimal(savedVal.duration), multiplier: safeDecimal(savedVal.multiplier) };
                }
                else {
                    newEffect[key] = savedVal; // Copy as-is if structure is unknown
                }
            }
            else {
                newEffect[key] = savedVal; // Handles boolean, undefined
            }
        }
    }
    return newEffect;
};


export const serializeFusedAttributes = (attributes?: FusedAttribute[]): any[] | undefined => {
    if (!attributes) return undefined;
    return attributes.map(attr => ({
        ...attr,
        value: attr.value?.toString(),
    }));
};

export const deserializeFusedAttributes = (serializedAttributes?: any[]): FusedAttribute[] | undefined => {
    if (!serializedAttributes) return undefined;
    return serializedAttributes.map(sAttr => ({
        ...sAttr,
        value: sAttr.value !== undefined ? safeDecimal(sAttr.value) : undefined,
    }));
};

export const rehydrateBattleEggFromJSON = (parsedEgg: any): BattleEgg => {
  // Ensure all Decimal fields are converted. Add defaults if necessary.
  const currentHp = parsedEgg.currentHp !== undefined ? new Decimal(parsedEgg.currentHp) : new Decimal(0);
  const maxHp = parsedEgg.maxHp !== undefined ? new Decimal(parsedEgg.maxHp) : new Decimal(0);
  
  return {
    ...parsedEgg,
    currentHp: currentHp,
    maxHp: maxHp,
    baseAttack: new Decimal(parsedEgg.baseAttack || '0'),
    baseDefense: new Decimal(parsedEgg.baseDefense || '0'),
    baseSpeed: new Decimal(parsedEgg.baseSpeed || '0'),
    currentAttack: new Decimal(parsedEgg.currentAttack || '0'),
    currentDefense: new Decimal(parsedEgg.currentDefense || '0'),
    currentSpeed: new Decimal(parsedEgg.currentSpeed || '0'),
    currentResource: parsedEgg.currentResource !== undefined && parsedEgg.currentResource !== null ? new Decimal(parsedEgg.currentResource) : undefined,
    maxResource: parsedEgg.maxResource !== undefined && parsedEgg.maxResource !== null ? new Decimal(parsedEgg.maxResource) : undefined,
    abilities: Array.isArray(parsedEgg.abilities) 
      ? parsedEgg.abilities.map((ab: any) => ({
          ...ab,
          currentCooldownTurns: Number(ab.currentCooldownTurns || 0),
        })) 
      : [],
    statusEffects: Array.isArray(parsedEgg.statusEffects) 
      ? parsedEgg.statusEffects.map((se: any) => ({
          ...se,
          currentPotency: new Decimal(se.currentPotency || '0'),
          remainingDurationTurns: Number(se.remainingDurationTurns || 0),
          originalValueBeforeEffect: se.originalValueBeforeEffect ? new Decimal(se.originalValueBeforeEffect) : undefined,
          appliedMaxHpReduction: se.appliedMaxHpReduction ? new Decimal(se.appliedMaxHpReduction) : undefined,
          reflectionPercentage: se.reflectionPercentage ? new Decimal(se.reflectionPercentage) : undefined,
        })) 
      : [],
  };
};
