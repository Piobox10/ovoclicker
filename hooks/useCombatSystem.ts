
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, Enemy, TranscendentalBonus, EnemyStatusEffect, LegendaryUpgrade, SpecialUpgrade } from '../types'; // Added SpecialUpgrade
import { ENEMY_PLACEHOLDER_ICONS, BOSS_PLACEHOLDER_ICONS, BOSS_INTERVAL, BASE_ENEMY_HP, ENEMY_HP_SCALING_FACTOR, BOSS_HP_MULTIPLIER, COMBAT_FEEDBACK_MESSAGES, ENEMY_EXP_DIVISOR, BOSS_EXP_MULTIPLIER, BASE_ENEMY_ATTACK, ENEMY_ATTACK_SCALING_FACTOR, BASE_ENEMY_DEFENSE, ENEMY_DEFENSE_SCALING_FACTOR, BASE_ENEMY_SPEED, ENEMY_SPEED_SCALING_FACTOR, BASE_ENEMY_CRIT_CHANCE, BASE_ENEMY_CRIT_DAMAGE_MULTIPLIER, BASE_ENEMY_DODGE_CHANCE, BOSS_STAT_MULTIPLIER, ENEMY_BASE_ATTACK_INTERVAL_SECONDS } from '../constants';
import { formatNumber, getEmbryoNextLevelEXP, getEmbryoVisuals } from '../utils'; 

// Type for updateMissionProgress function
type UpdateMissionProgressFn = (metric: string, incrementValue: Decimal, associatedData?: any) => void;


export const spawnNextEnemy = (prevState: GameState, initialSpawn: boolean = false): GameState => {
    const defeatedCount = initialSpawn ? new Decimal(0) : prevState.enemiesDefeatedTotal;
    const isBoss = defeatedCount.plus(1).modulo(BOSS_INTERVAL).isZero();

    let enemyName: string;
    let enemyIcon: string;
    let enemyBaseHPForCalc = BASE_ENEMY_HP;
    let statMultiplier = isBoss ? BOSS_STAT_MULTIPLIER : new Decimal(1);

    if (isBoss) {
        enemyName = `Chefe Guardião ${defeatedCount.dividedToIntegerBy(BOSS_INTERVAL).plus(1).toString()}`;
        enemyIcon = BOSS_PLACEHOLDER_ICONS[defeatedCount.dividedToIntegerBy(BOSS_INTERVAL).modulo(BOSS_PLACEHOLDER_ICONS.length).toNumber()];
        enemyBaseHPForCalc = enemyBaseHPForCalc.times(BOSS_HP_MULTIPLIER);
    } else {
        const nameSuffix = defeatedCount.modulo(5).plus(1);
        const nameBase = ["Casulo Fraturado", "Lodo Temporal", "Reflexo do Medo", "Eco Distorcido", "Cisco Cósmico"];
        enemyName = `${nameBase[defeatedCount.modulo(nameBase.length).toNumber()]} ${nameSuffix.toString()}`;
        enemyIcon = ENEMY_PLACEHOLDER_ICONS[defeatedCount.modulo(ENEMY_PLACEHOLDER_ICONS.length).toNumber()];
    }

    let maxHPValue = enemyBaseHPForCalc.times(ENEMY_HP_SCALING_FACTOR.pow(defeatedCount)).floor();
    
    // Apply Devourer's Eye effect if active
    const devourerEyeLegendary = prevState.legendaryUpgradesData.find(lu => lu.id === 'devourerEye' && lu.activated);
    if (devourerEyeLegendary) {
        maxHPValue = maxHPValue.times(2);
    }


    const newEnemy: Enemy = {
        id: `enemy_${Date.now()}_${defeatedCount.toString()}`, 
        name: enemyName,
        icon: enemyIcon,
        currentHp: maxHPValue,
        maxHp: maxHPValue,
        attack: BASE_ENEMY_ATTACK.times(ENEMY_ATTACK_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(),
        defense: BASE_ENEMY_DEFENSE.times(ENEMY_DEFENSE_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(), 
        speed: BASE_ENEMY_SPEED.times(ENEMY_SPEED_SCALING_FACTOR.pow(defeatedCount)).times(isBoss ? 1.1 : 1).floor(),
        critChance: BASE_ENEMY_CRIT_CHANCE.plus(defeatedCount.times(0.001)).clamp(0.05, 0.5),
        critDamageMultiplier: BASE_ENEMY_CRIT_DAMAGE_MULTIPLIER.plus(isBoss ? 0.5 : 0),
        dodgeChance: BASE_ENEMY_DODGE_CHANCE.plus(defeatedCount.times(0.0005)).clamp(0.05, 0.3),
        isBoss: isBoss,
        baseAttack: BASE_ENEMY_ATTACK.times(ENEMY_ATTACK_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(),
        baseDefense: BASE_ENEMY_DEFENSE.times(ENEMY_DEFENSE_SCALING_FACTOR.pow(defeatedCount)).times(statMultiplier).floor(),
        baseSpeed: BASE_ENEMY_SPEED.times(ENEMY_SPEED_SCALING_FACTOR.pow(defeatedCount)).times(isBoss ? 1.1 : 1).floor(),
        baseCritChance: BASE_ENEMY_CRIT_CHANCE.plus(defeatedCount.times(0.001)).clamp(0.05, 0.5),
        baseCritDamageMultiplier: BASE_ENEMY_CRIT_DAMAGE_MULTIPLIER.plus(isBoss ? 0.5 : 0),
        baseDodgeChance: BASE_ENEMY_DODGE_CHANCE.plus(defeatedCount.times(0.0005)).clamp(0.05, 0.3),
        attackIntervalSeconds: ENEMY_BASE_ATTACK_INTERVAL_SECONDS, 
        attackTimerSeconds: new Decimal(0), 
        activeStatusEffects: [], 
    };

    let newCombatLog = prevState.combatLog;
    if (!initialSpawn) {
       newCombatLog = [`Novo oponente aparece: ${newEnemy.name}!`, ...newCombatLog].slice(0,5);
    } else if (prevState.combatLog.length === 0 && newEnemy) {
       newCombatLog = [`O primeiro confronto aguarda: ${newEnemy.name}!`];
    }
    return {...prevState, currentEnemy: newEnemy, combatLog: newCombatLog };
};


export const useCombatSystem = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void,
    addCombatLogEntry: (log: string) => void,
    updateMissionProgress: UpdateMissionProgressFn 
) => {
    const dealDamageToEnemy = useCallback((damage: Decimal, currentState: GameState): GameState => {
        const { currentEnemy } = currentState;
        if (!currentEnemy) return currentState;

        const newEnemyHp = currentEnemy.currentHp.minus(damage);
        addCombatLogEntry(`${COMBAT_FEEDBACK_MESSAGES[Math.floor(Math.random() * COMBAT_FEEDBACK_MESSAGES.length)]} Inimigo sofreu ${formatNumber(damage)} de dano.`);

        if (newEnemyHp.lessThanOrEqualTo(0)) {
            // Enemy defeated
            showMessage(`${currentEnemy.name} derrotado!`, 2000);
            addCombatLogEntry(`${currentEnemy.name} derrotado!`);
            updateMissionProgress('enemiesDefeatedWithEmbryo_thisRun', new Decimal(1));

            // --- Calculate Rewards ---
            let expGained = currentEnemy.maxHp.dividedBy(ENEMY_EXP_DIVISOR);
            let piGained = currentEnemy.maxHp.dividedBy(50);
            if (currentEnemy.isBoss) {
                expGained = expGained.times(BOSS_EXP_MULTIPLIER);
                piGained = piGained.times(BOSS_EXP_MULTIPLIER);
            }

            const anulacaoParcialUpgrade = currentState.specialUpgradesData.find(su => su.id === 'stage27Bonus' && su.purchased.equals(1));
            if (anulacaoParcialUpgrade?.effect.enemyRewardMultiplier) {
                const multiplier = anulacaoParcialUpgrade.effect.enemyRewardMultiplier as Decimal;
                expGained = expGained.times(multiplier);
                piGained = piGained.times(multiplier);
            }
            
            const devourerEyeLegendary = currentState.legendaryUpgradesData.find(lu => lu.id === 'devourerEye' && lu.activated);
            if (devourerEyeLegendary) {
                expGained = expGained.times(2);
            }

            const hipermemoriaUpgrade = currentState.specialUpgradesData.find(su => su.id === 'stage24Bonus' && su.purchased.equals(1));
            if (hipermemoriaUpgrade?.effect.embryoExpGainMultiplier) {
                expGained = expGained.times(hipermemoriaUpgrade.effect.embryoExpGainMultiplier as Decimal);
            }

            expGained = expGained.times(currentState.dualCoreEXPGainDebuff);
            expGained = expGained.times(currentState.entropySeedModularEXPGainMultiplier);
            expGained = expGained.times(currentState.orbInverseModularEXPGainMultiplier);
            
            const toqueTrinoUpgrade = currentState.upgradesData.find(u => u.id === 'toqueTrino' && u.purchased.gt(0));
            if (toqueTrinoUpgrade && currentState.toqueTrinoBuffTimer && currentState.toqueTrinoBuffTimer.gt(0)) {
                expGained = expGained.times(1.2);
            }
            
            const ressonanciaOvoFractalBonus = currentState.transcendentalBonusesData.find(b => b.id === 'ressonanciaOvoFractal' && b.purchased.gt(0));
            if (ressonanciaOvoFractalBonus && ressonanciaOvoFractalBonus.effect.modularEXPGainMultiplierBonus) {
                expGained = expGained.times(ressonanciaOvoFractalBonus.effect.modularEXPGainMultiplierBonus as Decimal);
            }

            expGained = expGained.floor();
            piGained = piGained.floor();

            if (piGained.gt(0)) {
                addCombatLogEntry(`Ganhou ${formatNumber(piGained)} PI da vitória!`);
            }
            
            // --- Calculate Embryo Level Up ---
            let currentEmbryoLevel = currentState.embryoLevel;
            let currentEmbryoEXP = currentState.embryoCurrentEXP.plus(expGained);
            let embryoEXPToNextLevel = currentState.embryoEXPToNextLevel;
            let embryoIcon = currentState.embryoIcon;
            let newEloGeneticoBonusMultiplier = currentState.eloGeneticoBonusMultiplier;

            while (currentEmbryoEXP.gte(embryoEXPToNextLevel)) {
                currentEmbryoEXP = currentEmbryoEXP.minus(embryoEXPToNextLevel);
                currentEmbryoLevel = currentEmbryoLevel.plus(1);
                
                const eloGeneticoRelic = currentState.sacredRelicsData.find(r => r.id === 'eloGeneticoRecorrente' && r.obtained);
                if (eloGeneticoRelic) {
                    newEloGeneticoBonusMultiplier = newEloGeneticoBonusMultiplier.times(1.005);
                    showMessage(`Elo Genético Recorrente: +0.5% PI/s!`, 2000);
                }

                embryoEXPToNextLevel = getEmbryoNextLevelEXP(currentEmbryoLevel);
                const visuals = getEmbryoVisuals(currentEmbryoLevel);
                embryoIcon = visuals.icon;
                showMessage(`Embrião Nível ${formatNumber(currentEmbryoLevel)} (${visuals.nameSuffix})!`, 2500);
                addCombatLogEntry(`Embrião Nível ${formatNumber(currentEmbryoLevel)} (${visuals.nameSuffix})!`);
            }
            
            // --- Build new state object ---
            const imortalidadePIBonusIncrease = currentState.specialUpgradesData.find(su => su.id === 'stage38Bonus' && su.purchased.equals(1))
                ? currentState.specialUpgradesData.find(su => su.id === 'stage38Bonus')!.effect.ippsBonusPerEnemyDefeated as Decimal
                : new Decimal(0);

            let stateWithRewards = {
                ...currentState,
                modularEXP: currentState.modularEXP.plus(expGained),
                incubationPower: currentState.incubationPower.plus(piGained),
                enemiesDefeatedTotal: currentState.enemiesDefeatedTotal.plus(1),
                imortalidadePIBonus: (currentState.imortalidadePIBonus || new Decimal(0)).plus(imortalidadePIBonusIncrease),
                uniqueEnemiesDefeatedThisRunByEmbryo: new Set(currentState.uniqueEnemiesDefeatedThisRunByEmbryo).add(currentEnemy.name),
                firstBossDefeatedThisRun: currentState.firstBossDefeatedThisRun || currentEnemy.isBoss,
                toqueTrinoBuffTimer: currentEnemy.isBoss && toqueTrinoUpgrade ? new Decimal(10) : currentState.toqueTrinoBuffTimer,
                embryoLevel: currentEmbryoLevel,
                embryoCurrentEXP: currentEmbryoEXP,
                embryoEXPToNextLevel: embryoEXPToNextLevel,
                embryoIcon: embryoIcon,
                eloGeneticoBonusMultiplier: newEloGeneticoBonusMultiplier,
                embryoLevel10ReachedCount: currentEmbryoLevel.gte(10) && currentState.embryoLevel.lt(10) ? currentState.embryoLevel10ReachedCount.plus(1) : currentState.embryoLevel10ReachedCount,
                currentEnemy: null // Temporarily null before spawning next
            };
            
            if (currentEnemy.isBoss && toqueTrinoUpgrade) {
                showMessage("Toque Trino ativado! +20% EXP Modular por 10s.", 2000);
            }
            
            // Finally, spawn the next enemy using the fully updated state
            return spawnNextEnemy(stateWithRewards);

        } else {
            // Enemy not defeated, just update HP
            return {
                ...currentState,
                currentEnemy: { ...currentEnemy, currentHp: newEnemyHp }
            };
        }
    }, [setGameState, showMessage, addCombatLogEntry, updateMissionProgress]);

    return { dealDamageToEnemy, spawnNextEnemy };
};
