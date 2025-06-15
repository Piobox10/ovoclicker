
import { Decimal } from 'decimal.js';

export interface EggStage {
    name: string;
    threshold: Decimal;
    color: string;
    description: string;
    id?: string;
    effect?: { [key: string]: Decimal | boolean };
    purchased?: Decimal;
    type?: string;
    icon?: string;
    stageRequired?: number;
}

export interface EggForm {
    id: string;
    name: string;
    description: string;
    activePassive: string;
    collectionBonusDescription: string;
    unlockCondition: string;
    stageRequired: number;
    icon: string;
    activeBonus: { [key: string]: Decimal | { rate: Decimal; max: Decimal } | boolean };
    collectionBonus: { [key: string]: Decimal | boolean };
    isLegendary?: boolean;
}
