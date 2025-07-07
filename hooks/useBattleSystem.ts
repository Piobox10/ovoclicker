
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, BattleEgg, BattleStatusEffectInstance, FloatingText, AbilityDefinition, BattleReward, EggTeamBattlePhase, ExpeditionRewardOption, PlayerCollectibleEgg, CollectibleEggDefinition } from '../types';
import { formatNumber } from '../utils';
import { EXPEDITION_MAX_STAGES, EXPEDITION_STAGES_CONFIG, MAX_TEAM_SIZE, COLLECTIBLE_EGG_DEFINITIONS, COMBAT_SPEED_OPTIONS } from '../constants';
import { ABILITY_DEFINITIONS } from '../constants/abilities';
import { STATUS_EFFECT_DEFINITIONS } from '../constants/statusEffects';
import { EXPEDITION_REWARD_POOL } from '../constants/expeditionRewards';

type SetGameStateFunction = React.Dispatch<React.SetStateAction<GameState>>;
type ShowMessageFunction = (text: string, duration?: number) => void;

// Helper to convert PlayerCollectibleEgg to a BattleEgg
const convertToBattleEgg = (inventoryEgg: PlayerCollectibleEgg): BattleEgg => {
    const definition = COLLECTIBLE_EGG_DEFINITIONS.find(def => def.id === inventoryEgg.definitionId);
    if (!definition) throw new Error(`Definition not found for egg ${inventoryEgg.definitionId}`);
    
    const stats = inventoryEgg.actualBaseStats || definition.baseStats;

    return {
        instanceId: inventoryEgg.instanceId,
        definitionId: inventoryEgg.definitionId,
        name: definition.name,
        icon: definition.icon,
        level: 1, // Or could be derived later
        rarity: 'Player',
        maxHp: new Decimal(stats.hpMax),
        currentHp: new Decimal(stats.hpMax),
        baseAttack: new Decimal(stats.attack),
        currentAttack: new Decimal(stats.attack),
        baseDefense: new Decimal(stats.defense),
        currentDefense: new Decimal(stats.defense),
        baseSpeed: new Decimal(stats.speed),
        currentSpeed: new Decimal(stats.speed),
        maxResource: stats.resourceMax ? new Decimal(stats.resourceMax) : undefined,
        currentResource: stats.resourceMax ? new Decimal(stats.resourceMax) : undefined,
        resourceName: definition.baseStats.resourceName,
        abilities: definition.abilityDefinitionIds.map(id => {
            const abDef = ABILITY_DEFINITIONS.find(def => def.id === id);
            return {
                definitionId: id,
                name: abDef?.name || 'Unknown',
                icon: abDef?.icon || 'fas fa-question',
                currentCooldownTurns: 0,
            };
        }),
        statusEffects: [],
        isUsingAbility: false,
        avatarAnimationState: 'idle',
    };
};


const calculateDamage = (baseDamage: Decimal, attacker: BattleEgg, defender: BattleEgg): Decimal => {
    const damageMultiplier = attacker.currentAttack.div(10);
    const finalBaseDamage = baseDamage.plus(damageMultiplier);
    const damageReduction = defender.currentDefense.times(0.5);
    const finalDamage = Decimal.max(1, finalBaseDamage.minus(damageReduction));
    return finalDamage.floor();
};

const handleEggDefeat = (
    defeatedEgg: BattleEgg,
    playerTeam: BattleEgg[],
    enemyTeam: BattleEgg[],
    log: { battleLog: string[], floatingTexts: FloatingText[] }
) => {
    log.battleLog.unshift(`${defeatedEgg.name} foi derrotado!`);
    const isPlayerDefeated = playerTeam.some(e => e.instanceId === defeatedEgg.instanceId);
    const opponents = isPlayerDefeated ? enemyTeam : playerTeam;

    const onDeathEffects = defeatedEgg.statusEffects.filter(se => se.effectType === 'custom_logic' && se.definitionId.includes('on_death'));

    onDeathEffects.forEach(effect => {
        if (effect.definitionId === 'se_custom_on_death_explode' && effect.currentPotency.gt(0)) {
            const explosionDmg = effect.currentPotency;
            log.battleLog.unshift(`${defeatedEgg.name} explode, causando dano a todos!`);
            opponents.forEach(opp => {
                if (opp.currentHp.gt(0)) {
                    opp.currentHp = Decimal.max(0, opp.currentHp.minus(explosionDmg));
                    log.floatingTexts.push({ id: `ft-explode-${opp.instanceId}-${Math.random()}`, text: `-${formatNumber(explosionDmg)}`, color: 'text-orange-500', timestamp: Date.now(), duration: 1500, targetId: opp.instanceId, isCritical: true, x: 0, y: 0 });
                }
            });
        } else if (effect.definitionId === 'se_custom_on_death_poison') {
            const poisonDef = STATUS_EFFECT_DEFINITIONS.find(def => def.id === 'se_infested_dot'); // Using a real poison effect
            if (poisonDef) {
                log.battleLog.unshift(`${defeatedEgg.name} libera esporos venenosos!`);
                opponents.forEach(opp => {
                    if (opp.currentHp.gt(0)) {
                        opp.statusEffects.push({
                            instanceId: `se-${poisonDef.id}-${Date.now()}-${Math.random()}`,
                            definitionId: poisonDef.id,
                            name: poisonDef.name, icon: poisonDef.icon, description: poisonDef.description,
                            type: poisonDef.type, effectType: poisonDef.effectType,
                            remainingDurationTurns: poisonDef.baseDurationTurns,
                            currentPotency: poisonDef.baseTickValue || new Decimal(0),
                            appliedByInstanceId: defeatedEgg.instanceId,
                        });
                    }
                });
            }
        }
    });
};

const selectPostBattleChoices = (): ExpeditionRewardOption[] => {
    const allRewards = EXPEDITION_REWARD_POOL;
    const choices: ExpeditionRewardOption[] = [];
    const usedIds = new Set<string>();

    const rarityWeights = { comum: 5, incomum: 4, raro: 3, épico: 2, lendário: 1 };
    
    while (choices.length < 3 && usedIds.size < allRewards.length) {
        const weightedPool: ExpeditionRewardOption[] = [];
        allRewards.forEach(reward => {
            if (!usedIds.has(reward.id)) {
                const weight = rarityWeights[reward.rarity] || 1;
                for (let i = 0; i < weight; i++) {
                    weightedPool.push(reward);
                }
            }
        });

        if (weightedPool.length === 0) break;

        const randomReward = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        usedIds.add(randomReward.id);
        choices.push(randomReward);
    }
    return choices;
};


export const useBattleSystem = (setGameState: SetGameStateFunction, showMessage: ShowMessageFunction) => {
    
    const applyAbilityEffects = (
        actingEgg: BattleEgg,
        targets: BattleEgg[],
        ability: AbilityDefinition,
        teams: { playerTeam: BattleEgg[], enemyTeam: BattleEgg[] },
        log: { battleLog: string[], floatingTexts: FloatingText[] },
        stats: { damageStats: { [key: string]: string }, healingStats: { [key: string]: string } }
    ) => {
        ability.effects.forEach(effect => {
            if (effect.type === 'custom_logic' && effect.customEffectId === 'chrono_wyrm_heal_per_target' && effect.baseValue) {
                const healAmount = effect.baseValue.times(targets.length);
                actingEgg.currentHp = Decimal.min(actingEgg.maxHp, actingEgg.currentHp.plus(healAmount));
                log.floatingTexts.push({ id: `ft-heal-${Date.now()}-${Math.random()}`, text: `+${formatNumber(healAmount)}`, color: 'text-green-400', timestamp: Date.now(), duration: 1500, targetId: actingEgg.instanceId, isCritical: false, x: 0, y: 0 });
                const existingHealing = new Decimal(stats.healingStats[actingEgg.instanceId] || '0');
                stats.healingStats[actingEgg.instanceId] = existingHealing.plus(healAmount).toString();
                return; // Custom logic handled, continue to next effect if any
            }
            
            targets.forEach(target => {
                if (target.currentHp.lte(0)) return; 

                switch (effect.type) {
                    case 'damage': {
                        if (effect.baseValue) {
                            const damage = calculateDamage(effect.baseValue, actingEgg, target);
                            target.currentHp = Decimal.max(0, target.currentHp.minus(damage));
                            log.floatingTexts.push({ id: `ft-dmg-${Date.now()}-${Math.random()}`, text: `-${formatNumber(damage)}`, color: 'text-red-400', timestamp: Date.now(), duration: 1500, targetId: target.instanceId, isCritical: false, x: 0, y: 0 });
                            const existingDamage = new Decimal(stats.damageStats[actingEgg.instanceId] || '0');
                            stats.damageStats[actingEgg.instanceId] = existingDamage.plus(damage).toString();
                            if (target.currentHp.lte(0)) {
                                handleEggDefeat(target, teams.playerTeam, teams.enemyTeam, log);
                            }
                        }
                        break;
                    }
                    case 'heal': {
                         if (effect.baseValue) {
                            const healAmount = effect.baseValue;
                            target.currentHp = Decimal.min(target.maxHp, target.currentHp.plus(healAmount));
                            log.floatingTexts.push({ id: `ft-heal-${Date.now()}-${Math.random()}`, text: `+${formatNumber(healAmount)}`, color: 'text-green-400', timestamp: Date.now(), duration: 1500, targetId: target.instanceId, isCritical: false, x: 0, y: 0 });
                            const existingHealing = new Decimal(stats.healingStats[actingEgg.instanceId] || '0');
                            stats.healingStats[actingEgg.instanceId] = existingHealing.plus(healAmount).toString();
                        }
                        break;
                    }
                    case 'apply_status': {
                        if (effect.statusEffectDefinitionId) {
                            const statusDef = STATUS_EFFECT_DEFINITIONS.find(def => def.id === effect.statusEffectDefinitionId);
                            if (statusDef) {
                                target.statusEffects.push({
                                    instanceId: `se-${statusDef.id}-${Date.now()}-${Math.random()}`,
                                    definitionId: statusDef.id,
                                    name: statusDef.name,
                                    icon: statusDef.icon,
                                    description: statusDef.description,
                                    type: statusDef.type,
                                    effectType: statusDef.effectType,
                                    remainingDurationTurns: statusDef.baseDurationTurns,
                                    currentPotency: statusDef.baseTickValue || statusDef.changeValue || new Decimal(0),
                                    appliedByInstanceId: actingEgg.instanceId,
                                });
                                log.battleLog.unshift(`${target.name} é afetado por ${statusDef.name}.`);
                            }
                        }
                        break;
                    }
                }
            });
        });
    };

    const processTurn = useCallback(() => {
        setGameState(prev => {
            const battleState = prev.eggTeamBattleState;
            if (!battleState.isActive || battleState.isPaused || battleState.isBattleOver) {
                return prev;
            }

            let newBattleLog = [...battleState.battleLog];
            let newFloatingTexts = [...battleState.floatingTexts];
            let newDamageStats = { ...battleState.battleStats.damageDealtByEgg };
            let newHealingStats = { ...battleState.battleStats.healingDoneByEgg };
            let playerTeam = battleState.playerTeam.map(e => ({ ...e, abilities: e.abilities.map(a => ({...a})), statusEffects: e.statusEffects.map(s => ({ ...s })) }));
            let enemyTeam = battleState.enemyTeam.map(e => ({ ...e, abilities: e.abilities.map(a => ({...a})), statusEffects: e.statusEffects.map(s => ({ ...s })) }));
            
            let currentTurnIndex = battleState.currentTurnIndex;
            let currentRound = battleState.currentRound;

            if (currentTurnIndex === 0) {
                currentRound++;
                newBattleLog.unshift(`--- Round ${currentRound} ---`);
                const allEggsForRoundStart = [...playerTeam, ...enemyTeam];
                allEggsForRoundStart.forEach(egg => {
                    if (egg.currentHp.gt(0)) {
                        egg.abilities.forEach(ab => { if (ab.currentCooldownTurns > 0) ab.currentCooldownTurns--; });
                        egg.statusEffects.forEach(se => se.remainingDurationTurns--);
                        egg.statusEffects = egg.statusEffects.filter(se => se.remainingDurationTurns >= 0);
                        if (egg.currentResource !== undefined && egg.maxResource?.gt(0)) {
                            egg.currentResource = Decimal.min(egg.maxResource, egg.currentResource.plus(5));
                        }
                    }
                });
            }

            const allEggs = [...playerTeam, ...enemyTeam];
            const actingEggId = battleState.turnOrder[currentTurnIndex];
            let actingEgg = allEggs.find(e => e.instanceId === actingEggId);

            if (!actingEgg || actingEgg.currentHp.lte(0)) {
                currentTurnIndex = (currentTurnIndex + 1) % battleState.turnOrder.length;
                return { ...prev, eggTeamBattleState: { ...prev.eggTeamBattleState, playerTeam, enemyTeam, currentTurnIndex, currentActingEggId: battleState.turnOrder[currentTurnIndex], currentRound } };
            }

            let defeatedByDot = false;
            actingEgg.statusEffects.forEach(se => {
                if (se.remainingDurationTurns < 0) return;

                if (se.effectType === 'heal_over_time' && se.currentPotency.gt(0)) {
                    const healAmount = se.currentPotency;
                    actingEgg!.currentHp = Decimal.min(actingEgg!.maxHp, actingEgg!.currentHp.plus(healAmount));
                    newFloatingTexts.push({ id: `ft-heal-${Date.now()}-${Math.random()}`, text: `+${formatNumber(healAmount)}`, color: 'text-green-400', timestamp: Date.now(), duration: 1500, targetId: actingEgg!.instanceId, isCritical: false, x: 0, y: 0 });
                } else if (se.effectType === 'damage_over_time' && se.currentPotency.gt(0)) {
                    const dotDamage = se.currentPotency;
                    actingEgg!.currentHp = Decimal.max(0, actingEgg!.currentHp.minus(dotDamage));
                    newFloatingTexts.push({ id: `ft-dot-${Date.now()}-${Math.random()}`, text: `-${formatNumber(dotDamage)}`, color: 'text-purple-400', timestamp: Date.now(), duration: 1500, targetId: actingEgg!.instanceId, x: 0, y: 0 });
                    if (actingEgg!.currentHp.lte(0)) {
                        defeatedByDot = true;
                    }
                }
            });

            if (defeatedByDot) {
                handleEggDefeat(actingEgg, playerTeam, enemyTeam, { battleLog: newBattleLog, floatingTexts: newFloatingTexts });
            } else {
                let abilityToUse: AbilityDefinition | null = null;
                const isPlayer = playerTeam.some(e => e.instanceId === actingEggId);
                const opponents = (isPlayer ? enemyTeam : playerTeam).filter(e => e.currentHp.gt(0));
                
                if (opponents.length > 0) {
                    const sortedAbilities = [...actingEgg.abilities].sort((a, b) => {
                        const defA = ABILITY_DEFINITIONS.find(def => def.id === a.definitionId);
                        const defB = ABILITY_DEFINITIONS.find(def => def.id === b.definitionId);
                        return (defB?.resourceCost || new Decimal(0)).comparedTo(defA?.resourceCost || new Decimal(0));
                    });

                    for (const abilityInst of sortedAbilities) {
                        const definition = ABILITY_DEFINITIONS.find(def => def.id === abilityInst.definitionId);
                        if (definition && definition.id !== 'ab_basic_attack' && abilityInst.currentCooldownTurns <= 0 && (actingEgg!.currentResource || new Decimal(0)).gte(definition.resourceCost)) {
                            abilityToUse = definition;
                            abilityInst.currentCooldownTurns = definition.cooldownTurns;
                            break;
                        }
                    }
                    if (!abilityToUse) abilityToUse = ABILITY_DEFINITIONS.find(def => def.id === 'ab_basic_attack')!;

                    if(abilityToUse) {
                        newBattleLog.unshift(`${actingEgg.name} usou ${abilityToUse.name}!`);
                        if (actingEgg.currentResource !== undefined) actingEgg.currentResource = actingEgg.currentResource.minus(abilityToUse.resourceCost);
                        const target = opponents[Math.floor(Math.random() * opponents.length)];
                        applyAbilityEffects(
                            actingEgg, [target], abilityToUse, 
                            { playerTeam, enemyTeam },
                            { battleLog: newBattleLog, floatingTexts: newFloatingTexts },
                            { damageStats: newDamageStats, healingStats: newHealingStats }
                        );
                    }
                }
            }
            
            currentTurnIndex = (currentTurnIndex + 1) % battleState.turnOrder.length;
            const playerTeamDefeated = playerTeam.every(e => e.currentHp.lte(0));
            const enemyTeamDefeated = enemyTeam.every(e => e.currentHp.lte(0));
            let isBattleOver = playerTeamDefeated || enemyTeamDefeated || currentRound >= battleState.maxRounds;
            let winner: 'player' | 'enemy' | null = null;
            let finalBattlePhase: EggTeamBattlePhase = battleState.battlePhase;
            let expeditionOutcome: 'victory' | 'defeat' | null = battleState.expeditionOutcome;
            let showPostBattleChoiceModal = battleState.showPostBattleChoiceModal;
            let availablePostBattleChoices = battleState.availablePostBattleChoices;
            
            if (isBattleOver) {
                winner = enemyTeamDefeated ? 'player' : (playerTeamDefeated ? 'enemy' : null);
                if (battleState.isExpeditionMode) {
                    if (winner === 'player') {
                        if (battleState.currentExpeditionStage < EXPEDITION_MAX_STAGES) {
                            finalBattlePhase = 'expedition_post_stage_choice';
                            showPostBattleChoiceModal = true;
                            availablePostBattleChoices = selectPostBattleChoices();
                        } else {
                            finalBattlePhase = 'battle_over';
                            expeditionOutcome = 'victory';
                        }
                    } else {
                        finalBattlePhase = 'battle_over';
                        expeditionOutcome = 'defeat';
                    }
                } else {
                    finalBattlePhase = 'battle_over';
                }
            }

            return {
                ...prev,
                eggTeamBattleState: {
                    ...battleState,
                    playerTeam, enemyTeam, currentTurnIndex, currentRound,
                    currentActingEggId: battleState.turnOrder[currentTurnIndex],
                    battleLog: newBattleLog.slice(0, 20),
                    floatingTexts: newFloatingTexts,
                    isBattleOver, winner, battlePhase: finalBattlePhase, expeditionOutcome,
                    battleStats: { damageDealtByEgg: newDamageStats, healingDoneByEgg: newHealingStats },
                    showPostBattleChoiceModal, availablePostBattleChoices
                }
            };
        });
    }, [setGameState]);
    
    const toggleEggTeamBattlePanel = useCallback(() => {
        setGameState(prev => {
            const isPanelOpen = prev.eggTeamBattleState.isTeamSetupActive || prev.eggTeamBattleState.isActive;
            if (isPanelOpen) {
                return {
                    ...prev,
                    eggTeamBattleState: {
                        ...prev.eggTeamBattleState,
                        isTeamSetupActive: false,
                        isActive: false,
                        playerTeamLineup: Array(MAX_TEAM_SIZE).fill(null),
                        selectedInventoryEggInstanceIdForPlacement: null,
                    }
                };
            } else {
                return {
                    ...prev,
                    eggTeamBattleState: {
                        ...prev.eggTeamBattleState,
                        battleName: "Batalha Amistosa",
                        isTeamSetupActive: true,
                        isActive: false,
                        isBattleOver: false,
                        winner: null,
                        battleRewards: [],
                    }
                };
            }
        });
    }, [setGameState]);

    const selectEggForTeamPlacement = useCallback((inventoryEggInstanceId: string) => {
        setGameState(prev => ({
            ...prev,
            eggTeamBattleState: {
                ...prev.eggTeamBattleState,
                selectedInventoryEggInstanceIdForPlacement: inventoryEggInstanceId,
            }
        }));
    }, [setGameState]);

    const placeEggInTeamSlot = useCallback((slotIndex: number) => {
        setGameState(prev => {
            const { selectedInventoryEggInstanceIdForPlacement, playerTeamLineup } = prev.eggTeamBattleState;
            if (!selectedInventoryEggInstanceIdForPlacement) return prev;
            const inventoryEgg = prev.collectibleEggs.find(e => e.instanceId === selectedInventoryEggInstanceIdForPlacement);
            if (!inventoryEgg) return prev;
            
            const newTeamLineup = [...playerTeamLineup];
            if (newTeamLineup[slotIndex]) {
                showMessage("Slot já ocupado. Remova o ovo primeiro.", 1500);
                return prev;
            }
            newTeamLineup[slotIndex] = convertToBattleEgg(inventoryEgg);

            return {
                ...prev,
                eggTeamBattleState: {
                    ...prev.eggTeamBattleState,
                    playerTeamLineup: newTeamLineup,
                    selectedInventoryEggInstanceIdForPlacement: null,
                }
            };
        });
    }, [setGameState, showMessage]);

    const removeEggFromTeamSlot = useCallback((slotIndex: number) => {
        setGameState(prev => {
            const newTeamLineup = [...prev.eggTeamBattleState.playerTeamLineup];
            newTeamLineup[slotIndex] = null;
            return { ...prev, eggTeamBattleState: { ...prev.eggTeamBattleState, playerTeamLineup: newTeamLineup } };
        });
    }, [setGameState]);

    const handleStartBattle = useCallback((isExpedition: boolean) => {
        setGameState(prev => {
            const lineup = prev.eggTeamBattleState.playerTeamLineup.filter((egg): egg is BattleEgg => egg !== null);
            if (lineup.length === 0) {
                showMessage("Seu time está vazio!", 1500);
                return prev;
            }
            
            let enemyTeam;
            let battleName;
            let currentStage = 0;

            if (isExpedition) {
                currentStage = 1;
                const stageConfig = EXPEDITION_STAGES_CONFIG.find(s => s.stage === currentStage);
                if (!stageConfig) return prev; // Should not happen
                enemyTeam = stageConfig.enemies.map(e => ({...e, currentHp: e.maxHp, statusEffects: [] }));
                battleName = stageConfig.name;
            } else {
                enemyTeam = EXPEDITION_STAGES_CONFIG[0].enemies.map(e => ({...e, currentHp: e.maxHp, statusEffects: [] }));
                battleName = "Batalha Amistosa";
            }

            const allEggs = [...lineup, ...enemyTeam];
            const turnOrder = allEggs.sort((a, b) => b.currentSpeed.comparedTo(a.currentSpeed)).map(e => e.instanceId);

            return {
                ...prev,
                eggTeamBattleState: {
                    ...prev.eggTeamBattleState,
                    isActive: true,
                    isTeamSetupActive: false,
                    isExpeditionMode: isExpedition,
                    currentExpeditionStage: currentStage,
                    expeditionPlayerTeamSnapshot: isExpedition ? lineup.map(e => ({...e})) : null,
                    expeditionDamageDealt: new Decimal(0),
                    expeditionEggsDefeated: 0,
                    playerTeam: lineup,
                    enemyTeam: enemyTeam,
                    turnOrder: turnOrder,
                    currentTurnIndex: 0,
                    currentRound: 0,
                    battlePhase: 'round_start',
                    isBattleOver: false,
                    winner: null,
                    battleStats: { damageDealtByEgg: {}, healingDoneByEgg: {} },
                }
            };
        });
    }, [setGameState, showMessage]);
    
    const handleContinueExpedition = useCallback(() => {
      setGameState(prev => {
        const nextStage = prev.eggTeamBattleState.currentExpeditionStage + 1;
        const stageConfig = EXPEDITION_STAGES_CONFIG.find(s => s.stage === nextStage);
        if (!stageConfig) return prev;
    
        const playerTeamWithBuffs = prev.eggTeamBattleState.playerTeam.map(egg => {
            let newEgg = {...egg};
            // Apply passive buffs from acquired expedition upgrades
            prev.eggTeamBattleState.acquiredExpeditionUpgrades.forEach(upgrade => {
                if (upgrade.id === 'resonant_shell') newEgg.maxHp = newEgg.maxHp.times(1.05);
            });

            // Reset HP and Resources for the next battle
            newEgg.currentHp = newEgg.maxHp;
            if (newEgg.maxResource) {
                newEgg.currentResource = newEgg.maxResource;
            }

            // Apply start-of-combat buffs like 'Energia Condensada'
            if (prev.eggTeamBattleState.expeditionTeamBuffs.some(b => b.id === 'condensed_energy_passive')) {
                if (newEgg.currentResource && newEgg.maxResource) {
                    newEgg.currentResource = Decimal.min(newEgg.maxResource, newEgg.currentResource.plus(10));
                }
            }
            return newEgg;
        });
    
        const enemyTeam = stageConfig.enemies.map(e => ({...e, currentHp: e.maxHp, statusEffects: [] }));
        const turnOrder = [...playerTeamWithBuffs, ...enemyTeam].sort((a,b) => b.currentSpeed.comparedTo(a.currentSpeed)).map(e => e.instanceId);
    
        return {
          ...prev,
          eggTeamBattleState: {
            ...prev.eggTeamBattleState,
            battlePhase: 'round_start',
            isActive: true,
            currentExpeditionStage: nextStage,
            enemyTeam: enemyTeam,
            playerTeam: playerTeamWithBuffs,
            turnOrder,
            currentRound: 0,
            currentTurnIndex: 0,
            isBattleOver: false,
            winner: null,
            battleStats: { damageDealtByEgg: {}, healingDoneByEgg: {} },
            showPostBattleChoiceModal: false,
            availablePostBattleChoices: [],
          }
        };
      });
    }, [setGameState]);
    
    const handleEndExpeditionEarly = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            eggTeamBattleState: {
                ...prev.eggTeamBattleState,
                isActive: false,
                isTeamSetupActive: false,
                expeditionOutcome: 'victory', // Considered a win for rewards up to this point
                battlePhase: 'battle_over',
            }
        }));
    }, [setGameState]);

    const handleRetryExpedition = useCallback(() => {
        setGameState(prev => {
            if (!prev.eggTeamBattleState.isExpeditionMode) return prev;
            
            return {
                ...prev,
                eggTeamBattleState: {
                    ...prev.eggTeamBattleState,
                    isTeamSetupActive: true,
                    isActive: false,
                    battlePhase: 'setup',
                    expeditionOutcome: null,
                    isBattleOver: false,
                    winner: null,
                    playerTeamLineup: Array(MAX_TEAM_SIZE).fill(null),
                    playerTeam: [],
                    enemyTeam: [],
                    battleLog: [],
                    turnOrder: [],
                    currentRound: 0,
                    acquiredExpeditionUpgrades: [],
                    expeditionTeamBuffs: [],
                    expeditionDamageDealt: new Decimal(0),
                    expeditionEggsDefeated: 0,
                    currentExpeditionStage: 0,
                }
            };
        });
    }, [setGameState]);
    
    const handlePostBattleChoiceSelection = useCallback((choiceId: string) => {
        setGameState(prev => {
            const choice = EXPEDITION_REWARD_POOL.find(c => c.id === choiceId);
            if (!choice) return prev;
            
            let newState = choice.apply(prev);
            
            newState.eggTeamBattleState.acquiredExpeditionUpgrades.push(choice);
            newState.eggTeamBattleState.showPostBattleChoiceModal = false;
            
            // Move to inter-stage screen after applying non-targeted choice
            newState.eggTeamBattleState.battlePhase = 'battle_over_expedition_stage_victory';
            
            return newState;
        });
    }, [setGameState]);

    const handleTargetedRewardSelection = useCallback((reward: ExpeditionRewardOption) => {
        setGameState(prev => ({
            ...prev,
            eggTeamBattleState: {
                ...prev.eggTeamBattleState,
                showPostBattleChoiceModal: false,
                isAwaitingChoiceTarget: true,
                rewardToApplyOnTarget: reward,
            }
        }));
    }, [setGameState]);
    
    const applyTargetedReward = useCallback((targetEggId: string) => {
        setGameState(prev => {
            const { rewardToApplyOnTarget } = prev.eggTeamBattleState;
            if (!rewardToApplyOnTarget) return prev;
            
            let newState = rewardToApplyOnTarget.apply(prev, targetEggId);
            newState.eggTeamBattleState.acquiredExpeditionUpgrades.push(rewardToApplyOnTarget);
            newState.eggTeamBattleState.isAwaitingChoiceTarget = false;
            newState.eggTeamBattleState.rewardToApplyOnTarget = null;
            newState.eggTeamBattleState.battlePhase = 'battle_over_expedition_stage_victory';
            
            return newState;
        });
    }, [setGameState]);

    const toggleEggTeamBattlePause = useCallback(() => {
        setGameState(prev => ({ ...prev, eggTeamBattleState: { ...prev.eggTeamBattleState, isPaused: !prev.eggTeamBattleState.isPaused } }));
    }, [setGameState]);
    
    const changeCombatSpeed = useCallback(() => {
        setGameState(prev => {
            const currentSpeed = prev.eggTeamBattleState.combatSpeed;
            const currentIndex = COMBAT_SPEED_OPTIONS.indexOf(currentSpeed);
            const nextIndex = (currentIndex + 1) % COMBAT_SPEED_OPTIONS.length;
            return { ...prev, eggTeamBattleState: { ...prev.eggTeamBattleState, combatSpeed: COMBAT_SPEED_OPTIONS[nextIndex] } };
        });
    }, [setGameState]);

    return {
        processTurn,
        toggleEggTeamBattlePanel,
        selectEggForTeamPlacement,
        placeEggInTeamSlot,
        removeEggFromTeamSlot,
        handleStartBattle: () => handleStartBattle(false),
        handleStartExpedition: () => handleStartBattle(true),
        handleContinueExpedition,
        handleEndExpeditionEarly,
        handleRetryExpedition,
        handlePostBattleChoiceSelection,
        handleTargetedRewardSelection,
        applyTargetedReward,
        toggleEggTeamBattlePause,
        changeCombatSpeed,
    };
};
