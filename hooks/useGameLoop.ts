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

                let newIncubationPower = prev.incubationPower;

                // Sacred Relic: Núcleo de Juros Infinitos
                const nucleoJurosRelic = prev.sacredRelicsData.find(r => r.id === 'nucleoDeJurosInfinitos' && r.obtained);
                if (nucleoJurosRelic && prev.cosmicBank.pi.depositedAmount.gt(0)) {
                    const interestPI = prev.cosmicBank.pi.depositedAmount.times(0.0005).times(deltaSeconds);
                    newIncubationPower = newIncubationPower.plus(interestPI);
                }

                newIncubationPower = newIncubationPower.plus(prev.effectiveIpps.times(deltaSeconds));
                
                let newActiveIdleTime = prev.activeIdleTime;
                let newAbyssalIdleBonusTime = prev.abyssalIdleBonusTime;
                let newActivePlayTime = prev.activePlayTime.plus(deltaSeconds);
                let newCuriosoTimer = prev.curiosoTimer;
                let newExplosaoIncubadoraTimer = prev.explosaoIncubadoraTimer;
                let newOverclockCascaTimer = prev.overclockCascaTimer;
                let newImpactoCriticoTimer = prev.impactoCriticoTimer;
                let newFuriaIncubadoraTimer = prev.furiaIncubadoraTimer;
                let newTranscendenceSpamPenaltyActive = prev.transcendenceSpamPenaltyActive;
                let newTranscendenceSpamPenaltyDuration = prev.transcendenceSpamPenaltyDuration;
                
                // New upgrade timers
                let newForjaRessonanteBuffTimer = prev.forjaRessonanteBuffTimer || new Decimal(0);
                let newToqueTrinoBuffTimer = prev.toqueTrinoBuffTimer || new Decimal(0);
                let newEsporoIncandescenteIntervalTimer = prev.esporoIncandescenteIntervalTimer || new Decimal(0);
                let newEsporoIncandescenteBuffTimer = prev.esporoIncandescenteBuffTimer || new Decimal(0);

                // Coração da Fúria timers
                let newFuryPassiveBonusAmount = prev.furyPassiveBonusAmount || new Decimal(0);
                let newFuryPassiveBonusTimer = prev.furyPassiveBonusTimer || new Decimal(0);

                // Sacred Relic Timers
                let newPerfectCycleBuffTimer = prev.perfectCycleBuffTimer || new Decimal(0);
                let newStagnantTimeBuffTimer = prev.stagnantTimeBuffTimer || new Decimal(0);

                // New Timers
                let newVisaoFractalBuffTimer = prev.visaoFractalBuffTimer || new Decimal(0);

                if(newPerfectCycleBuffTimer.gt(0)) {
                    newPerfectCycleBuffTimer = Decimal.max(0, newPerfectCycleBuffTimer.minus(deltaSeconds));
                }
                if(newStagnantTimeBuffTimer.gt(0)) {
                    newStagnantTimeBuffTimer = Decimal.max(0, newStagnantTimeBuffTimer.minus(deltaSeconds));
                }
                if (newVisaoFractalBuffTimer.gt(0)) {
                    newVisaoFractalBuffTimer = Decimal.max(0, newVisaoFractalBuffTimer.minus(deltaSeconds));
                }

                let newLastInteractionTime = prev.lastInteractionTime;
                const isIdle = Date.now() - prev.lastClickTime > 2000;
                if (isIdle) {
                    newLastInteractionTime = Date.now();
                    newActiveIdleTime = newActiveIdleTime.plus(deltaSeconds);
                    if (prev.activeEggFormIds.includes('abyssalEgg')) newAbyssalIdleBonusTime = newAbyssalIdleBonusTime.plus(deltaSeconds);

                    // Núcleo do Tempo Estagnado Logic
                    const stagnantCoreRelic = prev.sacredRelicsData.find(r => r.id === 'nucleoDoTempoEstagnado' && r.obtained);
                    if (stagnantCoreRelic && newStagnantTimeBuffTimer.isZero()) { // Only check if buff is not already active
                        if (newActiveIdleTime.gte(300)) { // 5 minutes = 300 seconds
                            newStagnantTimeBuffTimer = new Decimal(60); // Activate 60s buff
                            newActiveIdleTime = new Decimal(0); // Reset idle timer to prevent immediate re-trigger
                            showMessage("Núcleo do Tempo Estagnado ativado! +300% IPPS por 60s.", 3000);
                        }
                    }

                } else {
                    newActiveIdleTime = new Decimal(0); // Reset idle time on interaction
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
                        }
                    } else {
                        if (newQuantumCoreInternalCooldown.gt(0)) {
                            newQuantumCoreInternalCooldown = Decimal.max(0, newQuantumCoreInternalCooldown.minus(deltaSeconds));
                        } else {
                            const unownedTraits = TRAITS.filter(t => !prev.activeTraits.includes(t.id) && t.id !== 'quantumCore');
                            if (unownedTraits.length > 0) {
                                const randomTrait = unownedTraits[Math.floor(Math.random() * unownedTraits.length)];
                                newQuantumCoreActiveRandomTraitId = randomTrait.id;
                                newQuantumCoreActiveRandomTraitDuration = new Decimal(15);
                                newQuantumCoreInternalCooldown = new Decimal(60);
                                showMessage(`Núcleo Quântico ativou: ${randomTrait.name} por 15s!`, 2000);
                            } else {
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

                if (newCuriosoTimer.greaterThan(0)) newCuriosoTimer = Decimal.max(0, newCuriosoTimer.minus(deltaSeconds));
                if (newExplosaoIncubadoraTimer.greaterThan(0)) newExplosaoIncubadoraTimer = Decimal.max(0, newExplosaoIncubadoraTimer.minus(deltaSeconds));
                if (newOverclockCascaTimer.greaterThan(0)) newOverclockCascaTimer = Decimal.max(0, newOverclockCascaTimer.minus(deltaSeconds));
                if (newImpactoCriticoTimer.greaterThan(0)) newImpactoCriticoTimer = Decimal.max(0, newImpactoCriticoTimer.minus(deltaSeconds));
                if (newFuriaIncubadoraTimer.greaterThan(0)) newFuriaIncubadoraTimer = Decimal.max(0, newFuriaIncubadoraTimer.minus(deltaSeconds));

                if (newForjaRessonanteBuffTimer.gt(0)) {
                    newForjaRessonanteBuffTimer = Decimal.max(0, newForjaRessonanteBuffTimer.minus(deltaSeconds));
                }
                if (newToqueTrinoBuffTimer.gt(0)) {
                    newToqueTrinoBuffTimer = Decimal.max(0, newToqueTrinoBuffTimer.minus(deltaSeconds));
                }

                const esporoUpgrade = prev.upgradesData.find(u => u.id === 'esporoIncandescente' && u.purchased.gt(0));
                if (esporoUpgrade) {
                    if (newEsporoIncandescenteBuffTimer.gt(0)) {
                        newEsporoIncandescenteBuffTimer = Decimal.max(0, newEsporoIncandescenteBuffTimer.minus(deltaSeconds));
                        if (newEsporoIncandescenteBuffTimer.isZero()) {
                            showMessage("Buff do Esporo Incandescente terminou.", 1500);
                        }
                    }
                    newEsporoIncandescenteIntervalTimer = newEsporoIncandescenteIntervalTimer.minus(deltaSeconds);
                    if (newEsporoIncandescenteIntervalTimer.lte(0)) {
                        newEsporoIncandescenteIntervalTimer = new Decimal(10);
                        newEsporoIncandescenteBuffTimer = new Decimal(5);
                        showMessage("Esporo Incandescente ativou! Produção +10% por 5s.", 2000);
                    }
                }
                
                if (newFuryPassiveBonusTimer.gt(0)) {
                    newFuryPassiveBonusTimer = Decimal.max(0, newFuryPassiveBonusTimer.minus(deltaSeconds));
                    if (newFuryPassiveBonusTimer.isZero() && newFuryPassiveBonusAmount.gt(0)) {
                        newFuryPassiveBonusAmount = new Decimal(0);
                        showMessage("Bônus da Fúria do Coração expirou.", 1500);
                    }
                }

                let newDistorcaoRecorrenteTimer = prev.distorcaoRecorrenteTimer || new Decimal(0);
                let newDistorcaoRecorrenteStacks = prev.distorcaoRecorrenteStacks || new Decimal(0);

                if (newDistorcaoRecorrenteTimer.gt(0)) {
                    newDistorcaoRecorrenteTimer = Decimal.max(0, newDistorcaoRecorrenteTimer.minus(deltaSeconds));
                    if (newDistorcaoRecorrenteTimer.isZero()) {
                        newDistorcaoRecorrenteStacks = new Decimal(0);
                        showMessage("Bônus de Distorção Recorrente expirou.", 1500);
                    }
                }

                let newEspiralInternaIntervalTimer = prev.espiralInternaIntervalTimer || new Decimal(300);
                let newEspiralInternaStacks = prev.espiralInternaStacks || new Decimal(0);
                const espiralInternaUpgrade = prev.specialUpgradesData.find(su => su.id === 'stage31Bonus' && su.purchased.equals(1));
                if (espiralInternaUpgrade) {
                    newEspiralInternaIntervalTimer = newEspiralInternaIntervalTimer.minus(deltaSeconds);
                    if (newEspiralInternaIntervalTimer.lte(0)) {
                        newEspiralInternaIntervalTimer = new Decimal(300); // Reset 5-minute timer
                        if (newEspiralInternaStacks.lt(10)) {
                            newEspiralInternaStacks = newEspiralInternaStacks.plus(1);
                            showMessage(`Espiral Interna: Produção +${newEspiralInternaStacks.times(5)}%`, 2000);
                        }
                    }
                }

                const updatedBuffs = prev.activeTemporaryBuffs
                    .map(buff => ({
                        ...buff,
                        remainingDuration: Decimal.max(0, buff.remainingDuration.minus(deltaSeconds))
                    }))
                    .filter(buff => {
                        if (buff.remainingDuration.isZero()) {
                            showMessage(`Bônus "${buff.name}" expirou!`, 3000);
                            return false;
                        }
                        return true;
                    });


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
                    lastInteractionTime: newLastInteractionTime,
                    curiosoTimer: newCuriosoTimer,
                    explosaoIncubadoraTimer: newExplosaoIncubadoraTimer,
                    overclockCascaTimer: newOverclockCascaTimer,
                    impactoCriticoTimer: newImpactoCriticoTimer,
                    furiaIncubadoraTimer: newFuriaIncubadoraTimer,
                    forjaRessonanteBuffTimer: newForjaRessonanteBuffTimer,
                    toqueTrinoBuffTimer: newToqueTrinoBuffTimer,
                    esporoIncandescenteIntervalTimer: newEsporoIncandescenteIntervalTimer,
                    esporoIncandescenteBuffTimer: newEsporoIncandescenteBuffTimer,
                    furyPassiveBonusTimer: newFuryPassiveBonusTimer,
                    furyPassiveBonusAmount: newFuryPassiveBonusAmount,
                    distorcaoRecorrenteTimer: newDistorcaoRecorrenteTimer,
                    distorcaoRecorrenteStacks: newDistorcaoRecorrenteStacks,
                    espiralInternaIntervalTimer: newEspiralInternaIntervalTimer,
                    espiralInternaStacks: newEspiralInternaStacks,
                    activeTemporaryBuffs: updatedBuffs,
                    transcendenceSpamPenaltyActive: newTranscendenceSpamPenaltyActive,
                    transcendenceSpamPenaltyDuration: newTranscendenceSpamPenaltyDuration,
                    activeAbilitiesData: newActiveAbilitiesData,
                    dailyLoginTracker: newDailyLoginTracker,
                    quantumCoreActiveRandomTraitId: newQuantumCoreActiveRandomTraitId,
                    quantumCoreActiveRandomTraitDuration: newQuantumCoreActiveRandomTraitDuration,
                    quantumCoreInternalCooldown: newQuantumCoreInternalCooldown,
                    embryoEffectiveStats: newEmbryoEffectiveStats,
                    perfectCycleBuffTimer: newPerfectCycleBuffTimer,
                    stagnantTimeBuffTimer: newStagnantTimeBuffTimer,
                    visaoFractalBuffTimer: newVisaoFractalBuffTimer,
                };
            });

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [setGameState, showMessage]); 
};
