
import { Decimal } from 'decimal.js';

export const safeDecimal = (value: string | undefined | Decimal, defaultValue: string = '0'): Decimal => {
    if (value instanceof Decimal) return value;
    return new Decimal(value || defaultValue);
};

export const safeEffectDecimal = (
    effectObj: { [key: string]: string | boolean | undefined } | undefined,
    initialEffect: { [key: string]: Decimal | boolean | string }
): { [key: string]: Decimal | boolean | string } => {
    if (!effectObj) return initialEffect; // Return a copy of initialEffect if no loaded data
    const newEffect: { [key: string]: Decimal | boolean | string } = {};

    for (const key in initialEffect) {
        if (Object.prototype.hasOwnProperty.call(initialEffect, key)) { // Ensure key is on the object itself
            const initialValue = initialEffect[key];
            const parsedValue = effectObj[key]; // Value from loaded data

            if (typeof initialValue === 'boolean') {
                newEffect[key] = typeof parsedValue === 'boolean' ? parsedValue : initialValue;
            } else if (initialValue instanceof Decimal) {
                 // Use safeDecimal to handle undefined or incorrect string from loaded data
                newEffect[key] = safeDecimal(parsedValue as string | undefined, initialValue.toString());
            } else if (typeof initialValue === 'string') {
                newEffect[key] = typeof parsedValue === 'string' ? parsedValue : initialValue;
            } else {
                 // Fallback for unexpected types in initialEffect (should not happen with good typings)
                newEffect[key] = initialValue;
            }
        }
    }
     // Add any keys from effectObj that weren't in initialEffect (might be new effects from updates)
    for (const key in effectObj) {
        if (Object.prototype.hasOwnProperty.call(effectObj, key) && !Object.prototype.hasOwnProperty.call(newEffect, key)) {
            const parsedValue = effectObj[key];
            if (typeof parsedValue === 'boolean' || typeof parsedValue === 'string') {
                newEffect[key] = parsedValue;
            } else if (parsedValue !== undefined) { // Attempt to parse as Decimal if not boolean/string
                newEffect[key] = safeDecimal(parsedValue as string);
            }
        }
    }
    return newEffect;
};
