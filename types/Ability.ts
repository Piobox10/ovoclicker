
import { Decimal } from 'decimal.js';

export interface ActiveAbility {
    id: string;
    name: string;
    description: string;
    cost: Decimal;
    cooldown: Decimal;
    icon: string;
    purchased: boolean;
    cooldownRemaining: Decimal;
    tempEffectDuration?: Decimal;
    effect: { [key: string]: Decimal | boolean | undefined };
}
