
import { Decimal } from 'decimal.js';
import { GameState, TranscendenceMilestoneInfo } from '../types'; // GameState might be too broad, consider specific parts
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, Trait } from '../types';
import { TRAITS, TRANSCENDENCE_MILESTONES_CONFIG } from '../constants';


export const calculateOfflineIncubationPower = (
    offlineTimeSec: Decimal,
    currentIpps: Decimal,
    rate: Decimal,
    hasIncansavelBonus: boolean,
    specialUpgrades: SpecialUpgrade[],
    transcendenceCount: Decimal
    // eventOfflineDebuff: Decimal // Removed
): Decimal => {
    let effectiveRate = rate;
    if (hasIncansavelBonus) effectiveRate = effectiveRate.plus(0.10);

    const pulsarInterno = specialUpgrades.find(su => su.id === 'stage7Bonus' && su.purchased.equals(1));
    if (pulsarInterno?.effect.offlineIncubationRateMultiplier) {
        effectiveRate = effectiveRate.plus(pulsarInterno.effect.offlineIncubationRateMultiplier as Decimal);
    }

    let gainMultiplier = new Decimal(1); // .times(eventOfflineDebuff) removed

    const t15Milestone = TRANSCENDENCE_MILESTONES_CONFIG.find(m => m.count === 15 && m.rewardType === 'OFFLINE_GAIN_MULTIPLIER_INCREASE');
    if (t15Milestone && transcendenceCount.gte(15)) {
        gainMultiplier = gainMultiplier.times(t15Milestone.value as Decimal);
    }

    const potentialGain = currentIpps.times(offlineTimeSec).times(effectiveRate).times(gainMultiplier);
    return potentialGain;
};

export const calculateGenericUpgradeCost = (
    upgrade: RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade,
    quantity: Decimal = new Decimal(1),
    currentPurchasedCount?: Decimal,
    activeTraits: string[] = [],
    specialUpgrades: SpecialUpgrade[] = [],
    achievements: import('../types').Achievement[] = [], // Corrected import
    isTranscendenceSpamPenaltyActive: boolean = false,
    embryoUpgrades: import('../types').EmbryoUpgrade[] = [],
    postTranscendenceEventUpgradeCostMultiplier: Decimal = new Decimal(1) // Added
): Decimal => {
    let totalCost = new Decimal(0);
    const purchased = currentPurchasedCount ?? upgrade.purchased;

    let costReductionFromTraits = new Decimal(1);
    if ('type' in upgrade && upgrade.type === 'ipps' && upgrade.id === 'basicIncubator' && activeTraits.includes('porousShell')) {
        const trait = TRAITS.find(t => t.id === 'porousShell');
        if (trait?.effect.basicIncubatorCostReduction) {
            costReductionFromTraits = new Decimal(1).minus(trait.effect.basicIncubatorCostReduction as Decimal);
        }
    }

    let accumulatedPercentageReduction = new Decimal(0);
    if (!('type' in upgrade && (upgrade.type === 'et_permanent_fixed' || upgrade.type === 'et_permanent_percentage'))) {
        const distortionUpgrade = specialUpgrades.find(su => su.id === 'stage12Bonus' && su.purchased.equals(1));
        if (distortionUpgrade?.effect.upgradeCostReduction) {
            accumulatedPercentageReduction = accumulatedPercentageReduction.plus(distortionUpgrade.effect.upgradeCostReduction as Decimal);
        }
    }
    if (!('type' in upgrade && (upgrade.type === 'et_permanent_fixed' || upgrade.type === 'et_permanent_percentage'))) {
        achievements.forEach(ach => {
            if (ach.unlocked && ach.bonus?.upgradeCostReductionAdditive) {
                accumulatedPercentageReduction = accumulatedPercentageReduction.plus(ach.bonus.upgradeCostReductionAdditive as Decimal);
            }
        });
    }
     if ('type' in upgrade && (upgrade.type === 'ipps' || upgrade.type === 'clicks')) {
        embryoUpgrades.forEach(eUpg => {
            if (eUpg.purchased && eUpg.effect.regularUpgradeCostReduction) {
                accumulatedPercentageReduction = accumulatedPercentageReduction.plus(eUpg.effect.regularUpgradeCostReduction as Decimal);
            }
        });
    }


    let etCostReductionMultiplier = new Decimal(1);
    if ('type' in upgrade && upgrade.type === 'multiplier' && (upgrade as TranscendentalBonus)) {
        const cycleEterno = specialUpgrades.find(su => su.id === 'stage6Bonus' && su.purchased.equals(1));
        if (cycleEterno?.effect.etCostReduction) {
            etCostReductionMultiplier = new Decimal(1).minus(cycleEterno.effect.etCostReduction as Decimal);
        }
    }

    let traitUpgradeCostMultiplier = new Decimal(1);
     if (!('type' in upgrade && (upgrade.type === 'et_permanent_fixed' || upgrade.type === 'et_permanent_percentage'))) {
        activeTraits.forEach(traitId => {
            const trait = TRAITS.find(t => t.id === traitId);
            if (trait?.effect.upgradeCostMultiplier) {
                traitUpgradeCostMultiplier = traitUpgradeCostMultiplier.times(trait.effect.upgradeCostMultiplier as Decimal);
            }
        });
    }

    for (let i = 0; i < quantity.toNumber(); i++) {
        let singleCost = upgrade.baseCost;
         if ((upgrade.type === 'ipps' || upgrade.type === 'clicks') && isTranscendenceSpamPenaltyActive) {
            singleCost = singleCost.times(1.5);
        }
        singleCost = singleCost.times(upgrade.costMultiplier.pow(purchased.plus(i)));
        singleCost = singleCost.times(costReductionFromTraits);
        singleCost = singleCost.times(new Decimal(1).minus(Decimal.min(accumulatedPercentageReduction, 0.9)));
        singleCost = singleCost.times(traitUpgradeCostMultiplier);
        singleCost = singleCost.times(etCostReductionMultiplier);
        singleCost = singleCost.times(postTranscendenceEventUpgradeCostMultiplier); // Apply new multiplier
        totalCost = totalCost.plus(Decimal.max(1, singleCost.floor()));
    }
    return totalCost;
};

export const calculateGenericMaxPurchases = (
    currentCurrency: Decimal,
    upgrade: RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade,
    activeTraits: string[] = [],
    specialUpgrades: SpecialUpgrade[] = [],
    achievements: import('../types').Achievement[] = [],
    isTranscendenceSpamPenaltyActive: boolean = false,
    embryoUpgrades: import('../types').EmbryoUpgrade[] = [],
    postTranscendenceEventUpgradeCostMultiplier: Decimal = new Decimal(1) // Added
): Decimal => {
    let count = new Decimal(0);
    let tempCurrency = new Decimal(currentCurrency);
    let tempPurchased = new Decimal(upgrade.purchased);

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if ('maxLevel' in upgrade && upgrade.maxLevel && tempPurchased.plus(count).gte(upgrade.maxLevel)) break;

        const costOfNext = calculateGenericUpgradeCost(
            upgrade,
            new Decimal(1),
            tempPurchased.plus(count),
            activeTraits,
            specialUpgrades,
            achievements,
            isTranscendenceSpamPenaltyActive,
            embryoUpgrades,
            postTranscendenceEventUpgradeCostMultiplier // Pass new multiplier
        );
        if (tempCurrency.greaterThanOrEqualTo(costOfNext)) {
            tempCurrency = tempCurrency.minus(costOfNext);
            count = count.plus(1);
            if (count.greaterThanOrEqualTo(1000)) break; // Safety break for performance
        } else {
            break;
        }
    }
    return count;
};
