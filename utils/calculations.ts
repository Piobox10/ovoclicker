
import { Decimal } from 'decimal.js';
import { GameState, TranscendenceMilestoneInfo, LegendaryUpgrade } from '../types'; // GameState might be too broad, consider specific parts, Added LegendaryUpgrade
import { RegularUpgrade, TranscendentalBonus, EtPermanentUpgrade, SpecialUpgrade, Trait, EmbryoUpgrade, MetaUpgrade } from '../types';
import { TRAITS, TRANSCENDENCE_MILESTONES_CONFIG, EGG_FORMS_DATA } from '../constants';


export const calculateOfflineIncubationPower = (
    offlineTimeSec: Decimal,
    currentIpps: Decimal,
    rate: Decimal,
    hasIncansavelBonus: boolean,
    specialUpgrades: SpecialUpgrade[],
    transcendenceCount: Decimal
): Decimal => {
    let effectiveRate = rate;
    if (hasIncansavelBonus) effectiveRate = effectiveRate.plus(0.10);

    const pulsarInterno = specialUpgrades.find(su => su.id === 'stage7Bonus' && su.purchased.equals(1));
    if (pulsarInterno?.effect.offlineIncubationRateMultiplier) {
        effectiveRate = effectiveRate.plus(pulsarInterno.effect.offlineIncubationRateMultiplier as Decimal);
    }

    let gainMultiplier = new Decimal(1); 

    const t15Milestone = TRANSCENDENCE_MILESTONES_CONFIG.find(m => m.count === 15 && m.rewardType === 'OFFLINE_GAIN_MULTIPLIER_INCREASE');
    if (t15Milestone && transcendenceCount.gte(15)) {
        gainMultiplier = gainMultiplier.times(t15Milestone.value as Decimal);
    }
    
    const estabilidadeVazio = specialUpgrades.find(su => su.id === 'stage20Bonus' && su.purchased.equals(1));
    if (estabilidadeVazio?.effect.offlineGainMultiplier) {
        gainMultiplier = gainMultiplier.times(estabilidadeVazio.effect.offlineGainMultiplier as Decimal);
    }

    const potentialGain = currentIpps.times(offlineTimeSec).times(effectiveRate).times(gainMultiplier);
    return potentialGain;
};

export const calculateGenericUpgradeCost = (
    upgrade: RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade | (Omit<MetaUpgrade, 'cost'> & { baseCost: Decimal; type?: string }),
    quantity: Decimal = new Decimal(1),
    currentPurchasedCount?: Decimal,
    activeTraits: string[] = [],
    specialUpgrades: SpecialUpgrade[] = [],
    achievements: import('../types').Achievement[] = [], 
    isTranscendenceSpamPenaltyActive: boolean = false,
    embryoUpgrades: import('../types').EmbryoUpgrade[] = [],
    dualCoreEventCostMultiplier?: Decimal,
    activeEggFormIds?: string[], // Added for formShatterer
    legendaryUpgradesData?: LegendaryUpgrade[] // Added for formShatterer & illuminatedRuin
): Decimal => {
    let totalCost = new Decimal(0);
    const purchased = currentPurchasedCount ?? upgrade.purchased;

    const isETPerm = 'type' in upgrade && (upgrade.type === 'et_permanent_fixed' || upgrade.type === 'et_permanent_percentage');
    const isMeta = 'category' in upgrade;

    let costReductionFromTraits = new Decimal(1);
    if ('type' in upgrade && upgrade.type === 'ipps' && upgrade.id === 'basicIncubator' && activeTraits.includes('porousShell')) {
        const trait = TRAITS.find(t => t.id === 'porousShell');
        if (trait?.effect.basicIncubatorCostReduction) {
            costReductionFromTraits = new Decimal(1).minus(trait.effect.basicIncubatorCostReduction as Decimal);
        }
    }

    let accumulatedPercentageReduction = new Decimal(0);
    if (!isETPerm && !isMeta) { // General reductions do not apply to ET Perm or Meta Upgrades
        const distortionUpgrade = specialUpgrades.find(su => su.id === 'stage12Bonus' && su.purchased.equals(1));
        if (distortionUpgrade?.effect.upgradeCostReduction) {
            accumulatedPercentageReduction = accumulatedPercentageReduction.plus(distortionUpgrade.effect.upgradeCostReduction as Decimal);
        }
        achievements.forEach(ach => {
            if (ach.unlocked && ach.bonus?.upgradeCostReductionAdditive) {
                accumulatedPercentageReduction = accumulatedPercentageReduction.plus(ach.bonus.upgradeCostReductionAdditive as Decimal);
            }
        });
    }
    // Embryo upgrade cost reduction applies to Regular Upgrades
    if ('type' in upgrade && (upgrade.type === 'ipps' || upgrade.type === 'clicks')) {
        embryoUpgrades.forEach(eUpg => {
            if (eUpg.purchased.gt(0) && eUpg.effect.regularUpgradeCostReduction) { 
                accumulatedPercentageReduction = accumulatedPercentageReduction.plus(eUpg.effect.regularUpgradeCostReduction as Decimal);
            }
        });
    }


    let etCostReductionMultiplier = new Decimal(1);
    const isTranscendentalBonusType = 'type' in upgrade && ['multiplier', 'cooldown_reduction', 'passive_buff_stacking', 'transcendence_milestone_bonus', 'exp_gain'].includes(upgrade.type);
    const category = 'category' in upgrade ? upgrade.category : undefined;
    const isRelevantMetaCategoryForETCost = isMeta && (category === 'Transcendência' || category === 'Habilidades');


    if (isTranscendentalBonusType || isRelevantMetaCategoryForETCost) { // Apply to ET bonuses and relevant meta upgrades
        let totalEtReduction = new Decimal(0);
        
        const cycleEterno = specialUpgrades.find(su => su.id === 'stage6Bonus' && su.purchased.equals(1));
        if (cycleEterno?.effect.etCostReduction) {
            totalEtReduction = totalEtReduction.plus(cycleEterno.effect.etCostReduction as Decimal);
        }

        const compreensaoAlienigena = specialUpgrades.find(su => su.id === 'stage22Bonus' && su.purchased.equals(1));
        if (compreensaoAlienigena?.effect.transcendentalBonusCostReduction) {
             totalEtReduction = totalEtReduction.plus(compreensaoAlienigena.effect.transcendentalBonusCostReduction as Decimal);
        }
        
        etCostReductionMultiplier = new Decimal(1).minus(totalEtReduction);
    }

    let traitUpgradeCostMultiplier = new Decimal(1);
    if (!isETPerm && !isMeta) { // Trait cost multipliers do not apply to ET Perm or Meta Upgrades
        activeTraits.forEach(traitId => {
            const trait = TRAITS.find(t => t.id === traitId);
            if (trait?.effect.upgradeCostMultiplier) {
                traitUpgradeCostMultiplier = traitUpgradeCostMultiplier.times(trait.effect.upgradeCostMultiplier as Decimal);
            }
        });
    }
    
    let formShattererCostMultiplier = new Decimal(1);
    if (legendaryUpgradesData && activeEggFormIds && ('type' in upgrade && (upgrade.type === 'ipps' || upgrade.type === 'clicks'))) {
        const formShattererLegendary = legendaryUpgradesData.find(lu => lu.id === 'formShatterer' && lu.activated);
        if (formShattererLegendary) {
            let baseAllowedForms = new Decimal(1);
            const illuminatedRuinLegendary = legendaryUpgradesData.find(lu => lu.id === 'illuminatedRuin' && lu.activated);
            if (illuminatedRuinLegendary && illuminatedRuinLegendary.effect.setMaxActiveEggForms) {
                baseAllowedForms = Decimal.max(baseAllowedForms, illuminatedRuinLegendary.effect.setMaxActiveEggForms as Decimal);
            }
            const additionalForms = new Decimal(activeEggFormIds.length).minus(baseAllowedForms);
            if (additionalForms.gt(0)) {
                formShattererCostMultiplier = formShattererCostMultiplier.plus(additionalForms.times(0.25));
            }
        }
    }


    for (let i = 0; i < quantity.toNumber(); i++) {
        let costForThisLevel = upgrade.baseCost;
        
        if (('type' in upgrade && (upgrade.type === 'ipps' || upgrade.type === 'clicks')) && isTranscendenceSpamPenaltyActive) {
            costForThisLevel = costForThisLevel.times(1.5);
        }

        const effectiveCostMultiplier = (upgrade.costMultiplier && upgrade.costMultiplier instanceof Decimal)
            ? upgrade.costMultiplier
            : new Decimal(1); 
        
        costForThisLevel = costForThisLevel.times(effectiveCostMultiplier.pow(purchased.plus(i)));
        
        costForThisLevel = costForThisLevel.times(costReductionFromTraits);
        costForThisLevel = costForThisLevel.times(new Decimal(1).minus(Decimal.min(accumulatedPercentageReduction, 0.9)));
        costForThisLevel = costForThisLevel.times(traitUpgradeCostMultiplier);
        costForThisLevel = costForThisLevel.times(etCostReductionMultiplier);
        costForThisLevel = costForThisLevel.times(formShattererCostMultiplier); // Apply Form Shatterer multiplier

        if (dualCoreEventCostMultiplier && dualCoreEventCostMultiplier.gt(1) && !isMeta) { // Don't apply dual core to meta upgrades
             costForThisLevel = costForThisLevel.times(dualCoreEventCostMultiplier);
        }
        totalCost = totalCost.plus(Decimal.max(1, costForThisLevel.floor()));
    }
    return totalCost;
};

export const calculateGenericMaxPurchases = (
    currentCurrency: Decimal,
    upgrade: RegularUpgrade | TranscendentalBonus | EtPermanentUpgrade | (Omit<MetaUpgrade, 'cost'> & { baseCost: Decimal; type?: string }),
    activeTraits: string[] = [],
    specialUpgrades: SpecialUpgrade[] = [],
    achievements: import('../types').Achievement[] = [],
    isTranscendenceSpamPenaltyActive: boolean = false,
    embryoUpgrades: import('../types').EmbryoUpgrade[] = [],
    dualCoreEventCostMultiplier?: Decimal,
    activeEggFormIds?: string[], // Added for formShatterer
    legendaryUpgradesData?: LegendaryUpgrade[] // Added for formShatterer
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
            dualCoreEventCostMultiplier,
            activeEggFormIds, // Pass through
            legendaryUpgradesData // Pass through
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

export const calculateEmbryoUpgradeCost = (
    upgrade: EmbryoUpgrade,
    purchaseQuantity: Decimal = new Decimal(1) 
): Decimal => {
    if (upgrade.cost) {
        if (upgrade.purchased.isZero()) { 
            return upgrade.cost;
        }
        return new Decimal(Infinity); 
    }

    if (upgrade.baseCost && upgrade.costMultiplier) {
        if (upgrade.maxLevel && upgrade.purchased.gte(upgrade.maxLevel)) {
            return new Decimal(Infinity); 
        }
        
        let totalCost = new Decimal(0);
        for (let i = 0; i < purchaseQuantity.toNumber(); i++) {
            const levelBeingPurchased = upgrade.purchased.plus(i);
            if (upgrade.maxLevel && levelBeingPurchased.gte(upgrade.maxLevel)) {
                break; 
            }
            const costForThisLevel = upgrade.baseCost.times(upgrade.costMultiplier.pow(levelBeingPurchased));
            totalCost = totalCost.plus(costForThisLevel);
        }
        return totalCost.floor();
    }
    
    return new Decimal(Infinity); 
};
