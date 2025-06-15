
import { useEffect, useRef } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, Trait } from '../types';
import { useGameMessages } from './useGameMessages'; 
import { TRAITS } from '../constants'; // For Quantum Core

export const useGameLoop = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: ReturnType<typeof useGameMessages>['showMessage']
) => {
    const lastTickTimestampRef = useRef<number>(performance.now());

    useEffect(() => {
        let animationFrameId: number;

        const loop = (timestamp: number) => {
            const deltaTime = new Decimal(timestamp - lastTickTimestampRef.current);
            lastTickTimestampRef.current = timestamp;
            const deltaSeconds = deltaTime.dividedBy(1000);

            setGameState(prev => {
                if (!prev) return prev; 

                let newIncubationPower = prev.incubationPower.plus(prev.effectiveIpps.times(deltaSeconds));
                let newActiveIdleTime = prev.activeIdleTime;
                let newAbyssalIdleBonusTime = prev.abyssalIdleBonusTime;
                let newActivePlayTime = prev.activePlayTime.plus(deltaSeconds);
                let newCuriosoTimer = prev.curiosoTimer;
                let newExplosaoIncubadoraTimer = prev.explosaoIncubadoraTimer;
                let newOverclockCascaTimer = prev.overclockCascaTimer;
                let newImpactoCriticoTimer = prev.impactoCriticoTimer;
                let newFuriaIncubadoraTimer = prev.furiaIncubadoraTimer;
                let newActiveTemporaryBuff = prev.activeTemporaryBuff;
                let newTranscendenceSpamPenaltyActive = prev.transcendenceSpamPenaltyActive;
                let newTranscendenceSpamPenaltyDuration = prev.transcendenceSpamPenaltyDuration;
                
                let newLastInteractionTime = prev.lastInteractionTime;
                if (Date.now() - prev.lastClickTime > 2000) { // Check if no click for 2 seconds
                    newLastInteractionTime = Date.now(); // Update interaction time for frostShell achievement
                }
                
                let newDailyLoginTracker = { ...prev.dailyLoginTracker };
                const currentHour = new Date().getHours();
                if (currentHour >= 6 && currentHour <= 11) newDailyLoginTracker.morning = true;
                if (currentHour >= 12 && currentHour <= 17) newDailyLoginTracker.afternoon = true;
                if ((currentHour >= 18 && currentHour <= 23) || (currentHour >= 0 && currentHour <= 5)) newDailyLoginTracker.night = true;

                let newQuantumCoreActiveRandomTraitId = prev.quantumCoreActiveRandomTraitId;
                let newQuantumCoreActiveRandomTraitDuration = prev.quantumCoreActiveRandomTraitDuration;
                let newQuantumCoreInternalCooldown = prev.quantumCoreInternalCooldown;

                if (prev.activeTraits.includes('quantumCore')) {
                    if (newQuantumCoreActiveRandomTraitDuration.gt(0)) {
                        newQuantumCoreActiveRandomTraitDuration = Decimal.max(0, newQuantumCoreActiveRandomTraitDuration.minus(deltaSeconds));
                        if (newQuantumCoreActiveRandomTraitDuration.isZero()) {
                            newQuantumCoreActiveRandomTraitId = null;
                            // No message needed on expiration, it's a temporary buff
                        }
                    } else { // Random trait is not active, check internal cooldown
                        if (newQuantumCoreInternalCooldown.gt(0)) {
                            newQuantumCoreInternalCooldown = Decimal.max(0, newQuantumCoreInternalCooldown.minus(deltaSeconds));
                        } else { // Cooldown finished, try to activate a new random trait
                            const unownedTraits = TRAITS.filter(t => !prev.activeTraits.includes(t.id) && t.id !== 'quantumCore');
                            if (unownedTraits.length > 0) {
                                const randomTrait = unownedTraits[Math.floor(Math.random() * unownedTraits.length)];
                                newQuantumCoreActiveRandomTraitId = randomTrait.id;
                                newQuantumCoreActiveRandomTraitDuration = new Decimal(15); // 15 seconds duration
                                newQuantumCoreInternalCooldown = new Decimal(60); // 60 seconds cooldown
                                showMessage(`Núcleo Quântico ativou: ${randomTrait.name} por 15s!`, 2000);
                            } else {
                                // No unowned traits to activate, restart cooldown
                                newQuantumCoreInternalCooldown = new Decimal(60); 
                            }
                        }
                    }
                }

                let newEmbryoEffectiveStats = { ...prev.embryoEffectiveStats };
                if (prev.activeTraits.includes('metabolicPulse') && prev.currentEnemy === null) {
                    const regenAmount = prev.embryoEffectiveStats.maxHp.times(0.02).times(deltaSeconds);
                    newEmbryoEffectiveStats.currentHp = Decimal.min(newEmbryoEffectiveStats.maxHp, newEmbryoEffectiveStats.currentHp.plus(regenAmount));
                }


                if (Date.now() - prev.lastClickTime > 1000) newActiveIdleTime = newActiveIdleTime.plus(deltaSeconds);
                if (prev.activeEggFormIds.includes('abyssalEgg') && Date.now() - prev.lastClickTime > 1000) newAbyssalIdleBonusTime = newAbyssalIdleBonusTime.plus(deltaSeconds);

                if (newCuriosoTimer.greaterThan(0)) newCuriosoTimer = Decimal.max(0, newCuriosoTimer.minus(deltaSeconds));
                if (newExplosaoIncubadoraTimer.greaterThan(0)) newExplosaoIncubadoraTimer = Decimal.max(0, newExplosaoIncubadoraTimer.minus(deltaSeconds));
                if (newOverclockCascaTimer.greaterThan(0)) newOverclockCascaTimer = Decimal.max(0, newOverclockCascaTimer.minus(deltaSeconds));
                if (newImpactoCriticoTimer.greaterThan(0)) newImpactoCriticoTimer = Decimal.max(0, newImpactoCriticoTimer.minus(deltaSeconds));
                if (newFuriaIncubadoraTimer.greaterThan(0)) newFuriaIncubadoraTimer = Decimal.max(0, newFuriaIncubadoraTimer.minus(deltaSeconds));

                if (newActiveTemporaryBuff && newActiveTemporaryBuff.remainingDuration.gt(0)) {
                    const updatedDuration = Decimal.max(0, newActiveTemporaryBuff.remainingDuration.minus(deltaSeconds));
                    if (updatedDuration.isZero()) {
                        showMessage(`Bônus "${newActiveTemporaryBuff.name}" expirou!`, 3000);
                        newActiveTemporaryBuff = null;
                    } else {
                        newActiveTemporaryBuff = { ...newActiveTemporaryBuff, remainingDuration: updatedDuration };
                    }
                }

                if (newTranscendenceSpamPenaltyActive && newTranscendenceSpamPenaltyDuration.gt(0)) {
                    newTranscendenceSpamPenaltyDuration = Decimal.max(0, newTranscendenceSpamPenaltyDuration.minus(deltaSeconds));
                    if (newTranscendenceSpamPenaltyDuration.isZero()) {
                        newTranscendenceSpamPenaltyActive = false;
                        showMessage("Custo espiritual da transcendência dissipado.", 2000);
                    }
                }

                const newActiveAbilitiesData = prev.activeAbilitiesData.map(ab => ({
                    ...ab,
                    cooldownRemaining: ab.cooldownRemaining.greaterThan(0) ? Decimal.max(0, ab.cooldownRemaining.minus(deltaSeconds)) : new Decimal(0)
                }));

                return {
                    ...prev,
                    incubationPower: newIncubationPower,
                    activeIdleTime: newActiveIdleTime,
                    abyssalIdleBonusTime: newAbyssalIdleBonusTime,
                    activePlayTime: newActivePlayTime,
                    curiosoTimer: newCuriosoTimer,
                    explosaoIncubadoraTimer: newExplosaoIncubadoraTimer,
                    overclockCascaTimer: newOverclockCascaTimer,
                    impactoCriticoTimer: newImpactoCriticoTimer,
                    furiaIncubadoraTimer: newFuriaIncubadoraTimer,
                    activeAbilitiesData: newActiveAbilitiesData,
                    activeTemporaryBuff: newActiveTemporaryBuff,
                    transcendenceSpamPenaltyActive: newTranscendenceSpamPenaltyActive,
                    transcendenceSpamPenaltyDuration: newTranscendenceSpamPenaltyDuration,
                    lastTick: timestamp, 
                    lastInteractionTime: newLastInteractionTime,
                    dailyLoginTracker: newDailyLoginTracker,
                    quantumCoreActiveRandomTraitId: newQuantumCoreActiveRandomTraitId,
                    quantumCoreActiveRandomTraitDuration: newQuantumCoreActiveRandomTraitDuration,
                    quantumCoreInternalCooldown: newQuantumCoreInternalCooldown,
                    embryoEffectiveStats: newEmbryoEffectiveStats,
                };
            });
            animationFrameId = requestAnimationFrame(loop);
        };

        lastTickTimestampRef.current = gameState.lastTick > 0 ? gameState.lastTick : performance.now();
        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);
        }
    }, [setGameState, showMessage, gameState.lastClickTime, gameState.activeEggFormIds, gameState.lastTick, gameState.activeTraits, gameState.currentEnemy, gameState.embryoEffectiveStats]); // Added dependencies
};
