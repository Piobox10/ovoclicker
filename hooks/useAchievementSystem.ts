
import { useEffect } from 'react';
import { GameState, GameDataForAchievementCheck } from '../types';
import { TRAITS, INITIAL_REGULAR_UPGRADES } from '../constants'; // For displaying trait unlock messages
import { playSound } from '../utils'; // Added playSound

export const useAchievementSystem = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    useEffect(() => {
        if (
            !gameState.achievementsData ||
            gameState.incubationPower === undefined ||
            gameState.effectiveClicksPerClick === undefined ||
            gameState.effectiveIpps === undefined ||
            gameState.currentStageIndex === undefined
        ) {
            return;
        }

        const gameDataForCheck: GameDataForAchievementCheck = {
            incubationPower: gameState.incubationPower,
            clicksPerClick: gameState.effectiveClicksPerClick,
            ipps: gameState.effectiveIpps,
            transcendentEssence: gameState.transcendentEssence,
            currentStageIndex: gameState.currentStageIndex,
            totalClicksEver: gameState.totalClicksEver,
            totalClicksThisRun: gameState.totalClicksThisRun,
            hasPurchasedRegularUpgradeThisRun: gameState.hasPurchasedRegularUpgradeThisRun,
            transcendenceCount: gameState.transcendenceCount,
            unlockedEggForms: gameState.unlockedEggForms,
            unlockedTraits: gameState.unlockedTraits, // Added missing property
            upgradesData: gameState.upgradesData, // Changed from upgrades to upgradesData
            activeIdleTime: gameState.activeIdleTime,
            activePlayTime: gameState.activePlayTime,
            totalUpgradesPurchasedEver: gameState.totalUpgradesPurchasedEver,
            enemiesDefeatedTotal: gameState.enemiesDefeatedTotal,
            embryoLevel: gameState.embryoLevel,
            modularEXP: gameState.modularEXP,
            // New fields for trait achievements
            rupturePathChoicesCount: gameState.rupturePathChoicesCount,
            runsWithFiveDifferentTraitsCount: gameState.runsWithFiveDifferentTraitsCount,
            incubatorTypesOwnedThisRun: gameState.incubatorTypesOwnedThisRun,
            totalRunsTranscended: gameState.totalRunsTranscended,
            firstBossDefeatedThisRun: gameState.firstBossDefeatedThisRun,
            uniqueEnemiesDefeatedThisRunByEmbryo: gameState.uniqueEnemiesDefeatedThisRunByEmbryo,
            embryoLevel10ReachedCount: gameState.embryoLevel10ReachedCount,
            dailyLoginTracker: gameState.dailyLoginTracker,
        };

        const newAchievementsUnlocked: string[] = [];
        const newTraitsToUnlock: string[] = [];
        let newUpgradeToUnlock: string | null = null;
        let achievementPopupToShow: { name: string; icon: string } | null = null;
        let playAchievementSound = false;


        // Update achievement conditions with actual logic
        const updatedAchievementDefinitions = gameState.achievementsData.map(ach => {
            switch(ach.id) {
                case 'ach_plasmaClicks': return {...ach, condition: (game: GameDataForAchievementCheck) => game.totalClicksThisRun.gte(10000) };
                case 'ach_frozenTime': return {...ach, condition: (game: GameDataForAchievementCheck) => game.activeIdleTime.gte(600) }; // 10 minutes
                case 'ach_rupturePathChosen5': return {...ach, condition: (game: GameDataForAchievementCheck) => game.rupturePathChoicesCount.gte(5) };
                case 'ach_quantumTranscender': return {...ach, condition: (game: GameDataForAchievementCheck) => game.runsWithFiveDifferentTraitsCount.gte(10) };
                case 'ach_allIncubatorTypes': 
                    const totalIncubatorTypes = INITIAL_REGULAR_UPGRADES.filter(upg => upg.type === 'ipps' && !upg.hidden).length;
                    return {...ach, condition: (game: GameDataForAchievementCheck) => game.incubatorTypesOwnedThisRun.size >= totalIncubatorTypes };
                case 'ach_20RunsCompleted': return {...ach, condition: (game: GameDataForAchievementCheck) => game.totalRunsTranscended.gte(20) };
                case 'ach_firstBossDefeated': return {...ach, condition: (game: GameDataForAchievementCheck) => game.firstBossDefeatedThisRun };
                case 'ach_embryoUniqueKills': return {...ach, condition: (game: GameDataForAchievementCheck) => game.uniqueEnemiesDefeatedThisRunByEmbryo.size >= 3 };
                case 'ach_embryoLevel10ThreeTimes': return {...ach, condition: (game: GameDataForAchievementCheck) => game.embryoLevel10ReachedCount.gte(3) };
                case 'ach_playedDifferentTimesOfDay': return {...ach, condition: (game: GameDataForAchievementCheck) => game.dailyLoginTracker.morning && game.dailyLoginTracker.afternoon && game.dailyLoginTracker.night };
                default: return ach;
            }
        });


        updatedAchievementDefinitions.forEach(ach => {
            if (!ach.unlocked && ach.condition(gameDataForCheck)) {
                newAchievementsUnlocked.push(ach.id);
                if (ach.unlocksTrait) newTraitsToUnlock.push(ach.unlocksTrait);
                if (ach.unlocksUpgrade) newUpgradeToUnlock = ach.unlocksUpgrade;

                if (!achievementPopupToShow) { 
                    achievementPopupToShow = { name: ach.name, icon: ach.icon };
                    playAchievementSound = true;
                }
            }
        });

        if (newAchievementsUnlocked.length > 0 || newTraitsToUnlock.length > 0 || newUpgradeToUnlock) {
            setGameState(prev => {
                const updatedAchievements = prev.achievementsData.map(ach => {
                    const updatedDef = updatedAchievementDefinitions.find(d => d.id === ach.id) || ach;
                    return newAchievementsUnlocked.includes(ach.id) ? { ...updatedDef, unlocked: true } : updatedDef;
                });

                const updatedTraits = [...new Set([...prev.unlockedTraits, ...newTraitsToUnlock])];
                let updatedUpgrades = prev.upgradesData;

                if (newUpgradeToUnlock) {
                    updatedUpgrades = prev.upgradesData.map(upg =>
                        upg.id === newUpgradeToUnlock ? { ...upg, hidden: false } : upg
                    );
                    const unlockedUpgradeDetails = updatedUpgrades.find(u => u.id === newUpgradeToUnlock);
                    if (unlockedUpgradeDetails) showMessage(`Nova Melhoria Desbloqueada: ${unlockedUpgradeDetails.name}!`, 4500);
                }
                newTraitsToUnlock.forEach(traitId => {
                     const trait = TRAITS.find(t => t.id === traitId);
                     if(trait) showMessage(`Novo Traço Desbloqueado: ${trait.name}!`, 4500);
                });

                if (playAchievementSound) {
                    playSound('achievement.mp3', prev.isSoundEnabled, 0.7);
                }


                return {
                    ...prev,
                    unlockedAchievements: [...new Set([...prev.unlockedAchievements, ...newAchievementsUnlocked])],
                    achievementsData: updatedAchievements,
                    unlockedTraits: updatedTraits,
                    upgradesData: updatedUpgrades,
                    showAchievementPopup: !!achievementPopupToShow, 
                    achievementPopupData: achievementPopupToShow,
                };
            });
             if (achievementPopupToShow) {
                setTimeout(() => setGameState(prev => ({ ...prev, showAchievementPopup: false, achievementPopupData: null })), 4000);
            }
        }
    }, [
        gameState.incubationPower, gameState.effectiveClicksPerClick, gameState.effectiveIpps,
        gameState.transcendentEssence, gameState.currentStageIndex,
        gameState.totalClicksEver, gameState.totalClicksThisRun,
        gameState.hasPurchasedRegularUpgradeThisRun, gameState.transcendenceCount,
        gameState.unlockedEggForms, gameState.upgradesData, gameState.activeIdleTime,
        gameState.activePlayTime, gameState.totalUpgradesPurchasedEver,
        gameState.enemiesDefeatedTotal, gameState.embryoLevel, gameState.modularEXP,
        gameState.achievementsData, // Keep this to re-evaluate if achievement definitions change
        gameState.isSoundEnabled, // Added for playSound
        // New state dependencies for achievement checks
        gameState.rupturePathChoicesCount, gameState.runsWithFiveDifferentTraitsCount,
        gameState.incubatorTypesOwnedThisRun, gameState.totalRunsTranscended,
        gameState.firstBossDefeatedThisRun, gameState.uniqueEnemiesDefeatedThisRunByEmbryo,
        gameState.embryoLevel10ReachedCount, gameState.dailyLoginTracker,
        gameState.unlockedTraits, // Added for GameDataForCheck
        setGameState, showMessage
    ]);
};
