
import { Decimal } from 'decimal.js';

export interface Enemy {
    id: string;
    name: string;
    icon: string;
    currentHP: Decimal;
    maxHP: Decimal;
    isBoss?: boolean;
}
