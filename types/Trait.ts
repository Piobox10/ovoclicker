
import { Decimal } from 'decimal.js';

export interface Trait {
    id: string;
    name: string;
    description: string;
    effect: { [key: string]: Decimal | boolean }; // boolean for 'startingBasicIncubators' type if needed
    icon: string;
}
