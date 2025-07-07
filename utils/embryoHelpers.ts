
import { Decimal } from 'decimal.js';
import { EMBRYO_LEVEL_MILESTONES, INITIAL_EMBRYO_EXP_TO_NEXT_LEVEL, EMBRYO_EXP_SCALING_FACTOR } from '../constants';

export const getEmbryoNextLevelEXP = (level: Decimal): Decimal => {
    return INITIAL_EMBRYO_EXP_TO_NEXT_LEVEL.times(EMBRYO_EXP_SCALING_FACTOR.pow(level.minus(1)));
};

export const getEmbryoVisuals = (level: Decimal): { icon: string; nameSuffix: string } => {
    let currentMilestone = EMBRYO_LEVEL_MILESTONES[0];
    for (let i = EMBRYO_LEVEL_MILESTONES.length - 1; i >= 0; i--) {
        if (level.gte(EMBRYO_LEVEL_MILESTONES[i].level)) {
            currentMilestone = EMBRYO_LEVEL_MILESTONES[i];
            break;
        }
    }
    return { icon: currentMilestone.icon, nameSuffix: currentMilestone.nameSuffix };
};
