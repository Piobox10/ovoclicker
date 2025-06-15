
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, Enemy } from '../types';
import { ENEMY_PLACEHOLDER_ICONS, BOSS_PLACEHOLDER_ICONS, BOSS_INTERVAL, BASE_ENEMY_HP, ENEMY_HP_SCALING_FACTOR, BOSS_HP_MULTIPLIER, COMBAT_FEEDBACK_MESSAGES, ENEMY_EXP_DIVISOR, BOSS_EXP_MULTIPLIER } from '../constants';
import { formatNumber, getEmbryoNextLevelEXP, getEmbryoVisuals } from '../utils'; 


export const spawnNextEnemy = (prevState: GameState, initialSpawn: boolean = false): GameState => {
    const defeatedCount = initialSpawn ? new Decimal(0) : prevState.enemiesDefeatedTotal;
    const isBoss = defeatedCount.plus(1).modulo(BOSS_INTERVAL).isZero();

    let enemyName: string;
    let enemyIcon: string;
    let enemyBaseHPForCalc = BASE_ENEMY_HP;

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

    const maxHP = enemyBaseHPForCalc.times(ENEMY_HP_SCALING_FACTOR.pow(defeatedCount)).floor();
    const newEnemy: Enemy = {
        id: `enemy_${Date.now()}_${defeatedCount.toString()}`, 
        name: enemyName,
        icon: enemyIcon,
        currentHP: maxHP,
        maxHP: maxHP,
        isBoss: isBoss,
    };

    let newCombatLog = prevState.combatLog;
    if (!initialSpawn) {
       newCombatLog = [`Novo oponente: ${newEnemy.name}!`, ...newCombatLog].slice(0,5);
    } else if (prevState.combatLog.length === 0 && newEnemy) { 
       newCombatLog = [`O primeiro confronto: ${newEnemy.name}!`];
    }
    return {...prevState, currentEnemy: newEnemy, combatLog: newCombatLog };
};

export const useCombatSystem = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void,
    addCombatLogEntry: (log: string) => void
) => {

    const dealDamageToEnemy = useCallback((damage: Decimal, currentGameState: GameState): GameState => {
        let updatedState = { ...currentGameState };
        if (!updatedState.currentEnemy) return updatedState;

        const newEnemyHP = updatedState.currentEnemy.currentHP.minus(damage);
        updatedState.currentEnemy = { ...updatedState.currentEnemy, currentHP: newEnemyHP };
        
        const randomFeedback = COMBAT_FEEDBACK_MESSAGES[Math.floor(Math.random() * COMBAT_FEEDBACK_MESSAGES.length)];
        addCombatLogEntry(randomFeedback);

        if (newEnemyHP.lessThanOrEqualTo(0)) {
            let expGained = updatedState.currentEnemy.maxHP.dividedBy(ENEMY_EXP_DIVISOR).floor();
            if (updatedState.currentEnemy.isBoss) {
                expGained = expGained.times(BOSS_EXP_MULTIPLIER);
            }
            const expGainMultiplierUpgrade = updatedState.embryoUpgradesData.find(upg => upg.id === 'embryoExpBoost' && upg.purchased);
            if (expGainMultiplierUpgrade?.effect.modularEXPGainMultiplier) {
                expGained = expGained.times(expGainMultiplierUpgrade.effect.modularEXPGainMultiplier as Decimal).floor();
            }

            // Apply trait effects to EXP gained
            if (updatedState.activeTraits.includes('hyperEgg')) {
                expGained = expGained.times(1.3);
            }
            if (updatedState.activeTraits.includes('metabolicPulse')) {
                expGained = expGained.times(0.8);
            }
            // Apply post-transcendence event EXP multiplier
            expGained = expGained.times(updatedState.postTranscendenceEventEnemyEXPMultiplier);
            expGained = expGained.floor();


            updatedState.modularEXP = updatedState.modularEXP.plus(expGained);
            updatedState.enemiesDefeatedTotal = updatedState.enemiesDefeatedTotal.plus(1);
            addCombatLogEntry(`${updatedState.currentEnemy.name} derrotado! +${formatNumber(expGained)} EXP Modular!`);
            
            if (updatedState.currentEnemy.isBoss) {
                updatedState.firstBossDefeatedThisRun = true;
            }
            // Add enemy name to set for unique kills. Using enemy name as a proxy for type.
            updatedState.uniqueEnemiesDefeatedThisRunByEmbryo = new Set([...updatedState.uniqueEnemiesDefeatedThisRunByEmbryo, updatedState.currentEnemy.name]);


            let currentEmbryoExp = updatedState.embryoCurrentEXP.plus(expGained);
            let currentEmbryoLevel = updatedState.embryoLevel;
            let currentEmbryoExpToNext = updatedState.embryoEXPToNextLevel;
            let currentEmbryoIcon = updatedState.embryoIcon;
            let originalLevelBeforeLoop = currentEmbryoLevel;

            while (currentEmbryoExp.gte(currentEmbryoExpToNext)) {
                currentEmbryoExp = currentEmbryoExp.minus(currentEmbryoExpToNext);
                currentEmbryoLevel = currentEmbryoLevel.plus(1);
                currentEmbryoExpToNext = getEmbryoNextLevelEXP(currentEmbryoLevel);
                const visuals = getEmbryoVisuals(currentEmbryoLevel);
                currentEmbryoIcon = visuals.icon;
                addCombatLogEntry(`Embrião evoluiu para Nível ${formatNumber(currentEmbryoLevel)} (${visuals.nameSuffix})!`);
            }
            updatedState.embryoLevel = currentEmbryoLevel;
            updatedState.embryoCurrentEXP = currentEmbryoExp;
            updatedState.embryoEXPToNextLevel = currentEmbryoExpToNext;
            updatedState.embryoIcon = currentEmbryoIcon;
            
            // Check if embryo reached level 10 in this level-up sequence
            if (originalLevelBeforeLoop.lt(10) && currentEmbryoLevel.gte(10)) {
                updatedState.embryoLevel10ReachedCount = updatedState.embryoLevel10ReachedCount.plus(1);
            }


            updatedState = spawnNextEnemy(updatedState, false);
        }
        return updatedState;

    }, [setGameState, showMessage, addCombatLogEntry]); // Removed updatedState from dependencies
    
    return { dealDamageToEnemy, spawnNextEnemy };
};
