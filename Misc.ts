
import { Decimal } from 'decimal.js';

export interface TemporaryBuff { // This seems to be a definition for potential buffs, not active ones
    id: string;
    name: string;
    description: string;
    icon: string;
    durationSeconds: Decimal;
    effect: { [key: string]: Decimal | boolean | string };
}
