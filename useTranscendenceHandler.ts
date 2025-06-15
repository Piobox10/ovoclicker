
import { useCallback, useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, TranscendenceMilestoneInfo, EggForm, Trait } from '../types'; // Added Trait
import { INITIAL_GAME_STATE, EGG_STAGES, INITIAL_REGULAR_UPGRADES, INITIAL_TRANSCENDENTAL_BONUSES, TRANSCENDENCE_MILESTONES_CONFIG, ESSENCE_PATH_BONUS_ET, RUPTURE_PATH_BUFF_DURATION_SECONDS, RUPTURE_PATH_BUFF_GLOBAL_MULTIPLIER, TRANSCENDENCE_SPAM_PENALTY_DURATION_SECONDS, EGG_FORMS_DATA, INITIAL_ACTIVE_ABILITIES, INITIAL_SPECIAL_UPGRADES, INITIAL_ET_PERMANENT_UPGRADES, TRAITS, POST_TRANSCENDENCE_RANDOM_EVENTS } from '../constants'; // Added TRAITS and POST_TRANSCENDENCE_RANDOM_EVENTS
import { formatNumber, formatTime } from '../../utils';
import { spawnNextEnemy } from './useCombatSystem';

export const useTranscendenceHandler = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const calculatedRequiredPiToTranscend = useMemo(() => {
        let baseThreshold = gameState.transcendenceThreshold;
        const completeCycleAch = gameState.achievementsData.find(a => a.id === 'completeCycle' && a.unlocked);
        if (completeCycleAch?.effect?.transcendenceCostReduction) {
            baseThreshold = baseThreshold.times(new Decimal(1).minus(completeCycleAch.effect.transcendenceCostReduction));
        }
        return baseThreshold.times(new Decimal(1.5).pow(gameState.transcendenceCount));
    }, [gameState.transcendenceThreshold, gameState.transcendenceCount, gameState.achievementsData]);

    const handleTranscendModalOpen = useCallback(() => {
        if (gameState.incubationPower.lessThan(calculatedRequiredPiToTranscend)) {
            showMessage('Poder de Incubação insuficiente para transcender!', 1500);
            return;
        }
        // Always show nickname modal at the start of transcendence process
        setGameState(prev => ({ ...prev, showNicknameModal: true }));
    }, [gameState.incubationPower, calculatedRequiredPiToTranscend, setGameState, showMessage]);

    const handleNicknameConfirm = useCallback((nickname: string) => {
        const finalNickname = nickname.trim() === '' ? 'Jogador Anônimo' : nickname.trim();
        setGameState(prev => {
            // Determine if this is the very first nickname setup after loading the game.
            // Conditions: transcendenceCount is zero, the userNickname was the default "Jogador",
            // no active traits (usually picked during first transcendence flow), and no transcendenceInfoData prepared.
            const isFirstTimeSetupAfterLoad = prev.transcendenceCount.isZero() && 
                                             prev.userNickname === 'Jogador' && 
                                             prev.activeTraits.length === 0 && 
                                             !prev.transcendenceInfoData;
    
            return {
                ...prev,
                userNickname: finalNickname,
                showNicknameModal: false,
                // Only show trait modal if NOT the very first setup (i.e., it's part of a subsequent transcendence flow).
                showTraitModal: !isFirstTimeSetupAfterLoad 
            };
        });
    }, [setGameState]);

    const handleTraitSelectionConfirm = useCallback((selectedTraits: string[]) => {
        setGameState(prev => {
            let etToGain = prev.incubationPower.dividedBy(prev.essencePerPI);
            
            const essenceEfficiencyUpgrade = prev.etPermanentUpgradesData.find(upg => upg.id === 'essenceEfficiency' && upg.purchased.gt(0));
            if (essenceEfficiencyUpgrade?.effect.etGainMultiplier) {
                 let permUpgradeEffectiveness = new Decimal(1);
                 if (prev.activeEggFormIds.includes('ancientsEgg')) {
                    const ancientsEggFormDetails = EGG_FORMS_DATA.find(f => f.id === 'ancientsEgg');
                    if(ancientsEggFormDetails?.activeBonus?.etPermanentUpgradeEffectiveness) { 
                       permUpgradeEffectiveness = ancientsEggFormDetails.activeBonus.etPermanentUpgradeEffectiveness as Decimal;
                    }
                 }
                etToGain = etToGain.times((essenceEfficiencyUpgrade.effect.etGainMultiplier as Decimal).pow(essenceEfficiencyUpgrade.purchased.times(permUpgradeEffectiveness)));
            }

            const noUpgradeAch = prev.achievementsData.find(ach => ach.id === 'noUpgradeChallenge' && ach.unlocked);
            if (noUpgradeAch?.bonus?.etGainMultiplier) {
                etToGain = etToGain.times(noUpgradeAch.bonus.etGainMultiplier as Decimal);
            }

            const stage4Bonus = prev.specialUpgradesData.find(su => su.id === 'stage4Bonus' && su.purchased.equals(1));
            if (stage4Bonus?.effect.bonusET) {
                etToGain = etToGain.plus(stage4Bonus.effect.bonusET as Decimal);
            }
            
            if (prev.activeEggFormIds.includes('cosmicEggForm')) {
                 const cosmicEggFormDetails = EGG_FORMS_DATA.find(f => f.id === 'cosmicEggForm');
                 if(cosmicEggFormDetails?.activeBonus?.bonusETMultiplier) {
                    etToGain = etToGain.times(cosmicEggFormDetails.activeBonus.bonusETMultiplier as Decimal);
                 }
            }
            
            etToGain = etToGain.floor();
            
            const newTranscendenceCount = prev.transcendenceCount.plus(1);
            const newGlobalMultiplier = prev.transcendencePassiveBonus.times(1.1);

            const milestones = TRANSCENDENCE_MILESTONES_CONFIG.map(m => ({
                ...m,
                isAchieved: newTranscendenceCount.gte(m.count)
            }));

            return {
                ...prev,
                activeTraits: selectedTraits,
                showTraitModal: false,
                showTranscendenceInfoModal: true,
                transcendenceInfoData: {
                    currentTranscendenceCount: prev.transcendenceCount,
                    accumulatedPI: prev.incubationPower,
                    requiredPiToTranscendNext: calculatedRequiredPiToTranscend,
                    etToGainNext: etToGain,
                    newGlobalMultiplierPercentage: newGlobalMultiplier.minus(1).times(100),
                    milestones: milestones,
                }
            };
        });
    }, [setGameState, calculatedRequiredPiToTranscend, gameState.incubationPower, gameState.essencePerPI, gameState.etPermanentUpgradesData, gameState.activeEggFormIds, gameState.achievementsData, gameState.specialUpgradesData]);

    const finalizeTranscendence = useCallback((chosenPath: 'essence' | 'rupture') => {
        setGameState(prev => {
            if (!prev.transcendenceInfoData) return prev; 

            // Simulate sending score to backend BEFORE resetting prev state used for score
            const scoreForRanking = prev.incubationPower; // PI at the moment of transcendence
            console.log(`[Ranking System Simulation] User: ${prev.userNickname}, Score: ${formatNumber(scoreForRanking)} PI`);
            showMessage(`[Simulação] Pontuação de ${formatNumber(scoreForRanking)} PI enviada para o ranking global para ${prev.userNickname}.`, 2500);


            let etGainedFinal = prev.transcendenceInfoData.etToGainNext;
            let temporaryBuffToApply = null;
            let transcendenceSpamPenaltyNext = false;
            let secretRuptureUnlockedNext = prev.secretRuptureSystemUnlocked;
            let ruptureMessages: string[] = [];

             let startingIncubators = new Decimal(0);
            if (prev.activeTraits.includes('galinheiro')) { 
                const galinheiroTraitUnlocked = prev.unlockedTraits.includes('galinheiro'); 
                 if(galinheiroTraitUnlocked) startingIncubators = new Decimal(10); 
            }
            const initialUpgradesWithStarting = INITIAL_REGULAR_UPGRADES.map(u => {
                if (u.id === 'basicIncubator' && startingIncubators.gt(0)) {
                    return {...u, purchased: startingIncubators};
                }
                return {...u, purchased: new Decimal(0)}; 
            });

            let newTotalRunsTranscended = prev.totalRunsTranscended.plus(1);
            let newRunsWithFiveDifferentTraitsCount = prev.runsWithFiveDifferentTraitsCount;
            if (prev.activeTraits.length >= 5) { // Or count unique if necessary
                newRunsWithFiveDifferentTraitsCount = newRunsWithFiveDifferentTraitsCount.plus(1);
            }


            let newState: GameState = {
                ...INITIAL_GAME_STATE, // This resets all flags including new event flags to their defaults
                userNickname: prev.userNickname, // Keep current nickname
                transcendentEssence: prev.transcendentEssence.plus(etGainedFinal), 
                transcendenceCount: prev.transcendenceCount.plus(1),
                transcendencePassiveBonus: prev.transcendencePassiveBonus.times(1.1), // Base increase
                maxActiveTraits: prev.maxActiveTraits,
                unlockedEggForms: [...prev.unlockedEggForms],
                legendaryUpgradesData: prev.legendaryUpgradesData.map(lu => ({ ...lu })),
                etPermanentUpgradesData: prev.etPermanentUpgradesData.map(epu => ({ ...epu })),
                achievementsData: prev.achievementsData.map(a => ({ ...a })),
                unlockedAchievements: prev.unlockedAchievements,
                unlockedTraits: prev.unlockedTraits,
                activeTraits: prev.activeTraits, // Keep active traits for the new run
                secretRuptureUpgradesData: prev.secretRuptureUpgradesData.map(sru => ({ ...sru })),
                secretRuptureSystemUnlocked: secretRuptureUnlockedNext, 
                upgradesData: initialUpgradesWithStarting,
                transcendentalBonusesData: INITIAL_TRANSCENDENTAL_BONUSES.map(b => ({ ...b, purchased: new Decimal(0) })),
                activeAbilitiesData: INITIAL_ACTIVE_ABILITIES.map(aa => ({ ...aa, purchased: false, cooldownRemaining: new Decimal(0) })),
                specialUpgradesData: INITIAL_SPECIAL_UPGRADES.map(su => ({ ...su, purchased: new Decimal(0) })),
                lastPlayedTimestamp: Date.now(),
                activePlayTime: prev.activePlayTime,
                totalClicksEver: prev.totalClicksEver,
                totalUpgradesPurchasedEver: prev.totalUpgradesPurchasedEver,
                activeTemporaryBuff: temporaryBuffToApply, 
                transcendenceSpamPenaltyActive: transcendenceSpamPenaltyNext, 
                transcendenceSpamPenaltyDuration: transcendenceSpamPenaltyNext ? TRANSCENDENCE_SPAM_PENALTY_DURATION_SECONDS : new Decimal(0),
                temporaryEggs: new Decimal(1), // Start with 1 temp egg after transcendence
                lastLeadKeyClickTimestamp: prev.lastLeadKeyClickTimestamp,
                lastTitheRitualTimestamp: prev.lastTitheRitualTimestamp,
                isSoundEnabled: prev.isSoundEnabled,
                isMusicEnabled: prev.isMusicEnabled,
                modularEXP: new Decimal(0), // Reset modular EXP
                // Keep total enemies defeated, or reset depending on design. For scaling, keeping it is common.
                // Reset embryo level and upgrades, or design for persistence. For now, let's reset to initial.
                enemiesDefeatedTotal: new Decimal(0), // Resetting for the new run
                embryoLevel: INITIAL_GAME_STATE.embryoLevel,
                embryoCurrentEXP: INITIAL_GAME_STATE.embryoCurrentEXP, 
                embryoEXPToNextLevel: INITIAL_GAME_STATE.embryoEXPToNextLevel, 
                embryoUpgradesData: INITIAL_GAME_STATE.embryoUpgradesData.map(eu => ({ ...eu, purchased: false })), // Reset embryo upgrades
                embryoIcon: INITIAL_GAME_STATE.embryoIcon, 
                embryoInventory: [], // Reset embryo inventory
                equippedEmbryoItems: { weapon: null, armor: null, passiveChip: null }, // Reset equipped items

                currentStageData: EGG_STAGES[0],
                nextStageThreshold: EGG_STAGES[1]?.threshold || null,
                message: null,
                currentEventData: null, // Reset before potentially setting a new one
                showEventModal: false, // Ensure it's closed before potentially opening
                showNicknameModal: false, // Ensure nickname modal is closed after transcendence finalization
                // Reset run-specific trait trackers
                plasmaPulseClickCounter: new Decimal(0),
                firstBossDefeatedThisRun: false,
                uniqueEnemiesDefeatedThisRunByEmbryo: new Set(),
                incubatorTypesOwnedThisRun: new Set(),
                // Update global trait trackers
                rupturePathChoicesCount: chosenPath === 'rupture' ? prev.rupturePathChoicesCount.plus(1) : prev.rupturePathChoicesCount,
                totalRunsTranscended: newTotalRunsTranscended,
                runsWithFiveDifferentTraitsCount: newRunsWithFiveDifferentTraitsCount,
                // Keep other global trackers like dailyLoginTracker, embryoLevel10ReachedCount
                dailyLoginTracker: prev.dailyLoginTracker,
                embryoLevel10ReachedCount: prev.embryoLevel10ReachedCount,
                quantumCoreActiveRandomTraitId: null, // Reset quantum core effect
                quantumCoreActiveRandomTraitDuration: new Decimal(0),
                quantumCoreInternalCooldown: new Decimal(0), // Reset quantum core cooldown

                // Ensure new post-transcendence flags are reset by INITIAL_GAME_STATE spread
                postTranscendenceEventUpgradeCostMultiplier: INITIAL_GAME_STATE.postTranscendenceEventUpgradeCostMultiplier,
                postTranscendenceEventGlobalProductionMultiplier: INITIAL_GAME_STATE.postTranscendenceEventGlobalProductionMultiplier,
                areEmbryoUpgradesDisabledThisRun: INITIAL_GAME_STATE.areEmbryoUpgradesDisabledThisRun,
                postTranscendenceEventEnemyEXPMultiplier: INITIAL_GAME_STATE.postTranscendenceEventEnemyEXPMultiplier,
            };
            
            // Sopro Ancestral - Apply AFTER base passive bonus is calculated
            if (newState.activeTraits.includes('ancestralBreath')) {
                const ancestralBreathBonusPerRun = new Decimal(0.2);
                const baseBonusRatePerTranscend = new Decimal(0.1); 
                const enhancedBonusRatePerTranscend = baseBonusRatePerTranscend.times(new Decimal(1).plus(ancestralBreathBonusPerRun.times(newState.totalRunsTranscended)));
                newState.transcendencePassiveBonus = new Decimal(1).plus(enhancedBonusRatePerTranscend.times(newState.transcendenceCount));
            }


            // Path-specific logic
            if (chosenPath === 'essence') {
                newState.transcendentEssence = newState.transcendentEssence.plus(ESSENCE_PATH_BONUS_ET);
                ruptureMessages.push(`Caminho da Essência escolhido! +${formatNumber(ESSENCE_PATH_BONUS_ET)} ET!`);
            } else if (chosenPath === 'rupture') {
                newState.activeTemporaryBuff = {
                    id: 'rupturePathBuff',
                    name: 'Bênção da Ruptura',
                    description: `Produção Global x${RUPTURE_PATH_BUFF_GLOBAL_MULTIPLIER.toString()} por ${formatTime(RUPTURE_PATH_BUFF_DURATION_SECONDS)}!`,
                    icon: 'fas fa-meteor',
                    remainingDuration: RUPTURE_PATH_BUFF_DURATION_SECONDS,
                    effect: { globalProductionMultiplier: RUPTURE_PATH_BUFF_GLOBAL_MULTIPLIER }
                };
                newState.secretRuptureSystemUnlocked = true;
                ruptureMessages.push(`Caminho da Ruptura! Bônus de produção ativado.`);
                if (!prev.secretRuptureSystemUnlocked) { 
                    ruptureMessages.push(`Sistema de Segredos da Ruptura Ativo!`);
                }

                const unobtainedSecrets = newState.secretRuptureUpgradesData.filter(sru => !sru.obtained);
                if (unobtainedSecrets.length > 0) {
                    const randomIndex = Math.floor(Math.random() * unobtainedSecrets.length);
                    const secretToUnlock = unobtainedSecrets[randomIndex];
                    newState.secretRuptureUpgradesData = newState.secretRuptureUpgradesData.map(sru =>
                        sru.id === secretToUnlock.id ? { ...sru, obtained: true } : sru
                    );
                    ruptureMessages.push(`Segredo da Ruptura Descoberto: ${secretToUnlock.name}!`);

                    if (secretToUnlock.id === 'theLastTrait') {
                        const availableRandomTraits = TRAITS.filter(t => 
                            !newState.unlockedTraits.includes(t.id) && 
                            !newState.activeTraits.includes(t.id)
                        );
                        if (availableRandomTraits.length > 0) {
                            const randomNewTrait = availableRandomTraits[Math.floor(Math.random() * availableRandomTraits.length)];
                            newState.unlockedTraits = [...new Set([...newState.unlockedTraits, randomNewTrait.id])];
                            newState.activeTraits = [...new Set([...newState.activeTraits, randomNewTrait.id])]; 
                            ruptureMessages.push(`"O Último Traço" concedeu: ${randomNewTrait.name}! Ele está ativo.`);
                        } else {
                            ruptureMessages.push(`"O Último Traço" não encontrou novos traços para conceder no momento.`);
                        }
                    }
                }
                
                // Partícula do Vazio effect: additional chance for another secret
                if (newState.activeTraits.includes('voidParticle')) {
                    const unobtainedSecretsAfterFirst = newState.secretRuptureUpgradesData.filter(sru => !sru.obtained);
                    if (unobtainedSecretsAfterFirst.length > 0 && Math.random() < 0.03) { // 3% chance
                        const randomIndex2 = Math.floor(Math.random() * unobtainedSecretsAfterFirst.length);
                        const additionalSecretToUnlock = unobtainedSecretsAfterFirst[randomIndex2];
                        newState.secretRuptureUpgradesData = newState.secretRuptureUpgradesData.map(sru =>
                            sru.id === additionalSecretToUnlock.id ? { ...sru, obtained: true } : sru
                        );
                        ruptureMessages.push(`Partícula do Vazio concedeu um segredo adicional: ${additionalSecretToUnlock.name}!`);
                         // Handle "The Last Trait" again if it was the additional one
                        if (additionalSecretToUnlock.id === 'theLastTrait') {
                            const availableRandomTraits = TRAITS.filter(t => !newState.unlockedTraits.includes(t.id) && !newState.activeTraits.includes(t.id));
                            if (availableRandomTraits.length > 0) { /* ... grant trait ... */ }
                        }
                    }
                }
            }
            
            if (prev.incubationPower.lt(calculatedRequiredPiToTranscend.times(1.1))) { 
                newState.transcendenceSpamPenaltyActive = true;
                newState.transcendenceSpamPenaltyDuration = TRANSCENDENCE_SPAM_PENALTY_DURATION_SECONDS;
            }

            TRANSCENDENCE_MILESTONES_CONFIG.forEach(milestone => {
                if (newState.transcendenceCount.gte(milestone.count)) {
                    const alreadyAchievedThisMilestone = prev.transcendenceCount.gte(milestone.count); 
                    if (!alreadyAchievedThisMilestone) { 
                        if (milestone.rewardType === 'MAX_TRAITS_INCREASE') newState.maxActiveTraits += 1;
                        // if (milestone.rewardType === 'UNLOCK_EGG_FORM' && milestone.value && !newState.unlockedEggForms.includes(milestone.value as string)) {
                        //     newState.unlockedEggForms.push(milestone.value as string);
                        //     const formDetails = EGG_FORMS_DATA.find(f => f.id === milestone.value);
                        //     if (formDetails) showMessage(`Marco de Transcendência: Forma '${formDetails.name}' desbloqueada!`, 3000);
                        // }
                        if (milestone.rewardType === 'UNLOCK_LEGENDARY_UPGRADE' && milestone.value) {
                             newState.legendaryUpgradesData = newState.legendaryUpgradesData.map(lu => lu.id === milestone.value ? {...lu, unlockedSystem: true} : lu);
                             const legUpg = newState.legendaryUpgradesData.find(lu => lu.id === milestone.value);
                             if(legUpg) showMessage(`Marco de Transcendência: Melhoria Lendária '${legUpg.name}' disponível!`, 3000);
                        }
                    }
                }
            });
            
            newState = spawnNextEnemy(newState, true); 

            // Select and set up the post-transcendence random event
            if (POST_TRANSCENDENCE_RANDOM_EVENTS.length > 0) {
                const randomEventIndex = Math.floor(Math.random() * POST_TRANSCENDENCE_RANDOM_EVENTS.length);
                newState.currentEventData = POST_TRANSCENDENCE_RANDOM_EVENTS[randomEventIndex];
                newState.showEventModal = true;
            }


            const mainTranscendenceMessage = `Você transcendeu pela ${formatNumber(newState.transcendenceCount)}ª vez! Ganhou ${formatNumber(newState.transcendentEssence.minus(prev.transcendentEssence))} ET.`;
            showMessage(mainTranscendenceMessage, 4000);
            ruptureMessages.forEach((msg, index) => {
                setTimeout(() => showMessage(msg, 3000 + index * 500), 500 + index * 500); 
            });

            if (newState.transcendenceSpamPenaltyActive) {
                setTimeout(() => showMessage("Cuidado! Transcender muito rapidamente pode ter consequências...", 3000), 1000 + ruptureMessages.length * 500);
            }
            return { ...newState, showTranscendenceInfoModal: false, transcendenceInfoData: null };
        });
    }, [setGameState, showMessage, calculatedRequiredPiToTranscend]);

    return {
        calculatedRequiredPiToTranscend,
        handleTranscendModalOpen,
        handleNicknameConfirm,
        handleTraitSelectionConfirm,
        finalizeTranscendence,
    };
};
