
import { useCallback, useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, TranscendenceMilestoneInfo, EggForm, Trait, DailyMission, UpdateMissionProgressFn, EtPermanentUpgrade, SecretRuptureUpgrade, SacredRelicUpgrade, ActiveTemporaryBuffState } from '../types'; 
import { 
    INITIAL_GAME_STATE, 
    EGG_STAGES, 
    INITIAL_REGULAR_UPGRADES, 
    BASE_TRANSCENDENCE_THRESHOLD, 
    ESSENCE_PER_PI, 
    TRAITS, 
    TRANSCENDENCE_MILESTONES_CONFIG,
    RUPTURE_PATH_BUFF_DURATION_SECONDS,
    RUPTure_PATH_BUFF_GLOBAL_MULTIPLIER,
    ESSENCE_PATH_BONUS_ET,
    EGG_FORMS_DATA,
    TRANSCENDENCE_SPAM_PENALTY_DURATION_SECONDS,
    POST_TRANSCENDENCE_RANDOM_EVENTS
} from '../constants';
import { formatNumber, playSound } from '../utils';
import { spawnNextEnemy } from './useCombatSystem';

export const useTranscendenceHandler = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void,
    updateMissionProgress: UpdateMissionProgressFn
) => {

    const calculatedRequiredPiToTranscend = useMemo(() => {
        let cost = BASE_TRANSCENDENCE_THRESHOLD.times(new Decimal(1.6).pow(gameState.transcendenceCount));
        let reduction = new Decimal(0);
        const completeCycleAch = gameState.achievementsData.find(a => a.id === 'completeCycle' && a.unlocked);
        if (completeCycleAch?.bonus?.transcendenceCostReduction) {
            reduction = reduction.plus(completeCycleAch.bonus.transcendenceCostReduction as Decimal);
        }
        return cost.times(new Decimal(1).minus(reduction)).floor();
    }, [gameState.transcendenceCount, gameState.achievementsData]);

    const handleTranscendModalOpen = useCallback(() => {
        if (gameState.incubationPower.lessThan(calculatedRequiredPiToTranscend)) {
            showMessage('PI insuficiente para transcender.', 2000);
            return;
        }

        const etToGain = gameState.incubationPower.dividedBy(ESSENCE_PER_PI).floor();
        const newTotalTranscendences = gameState.transcendenceCount.plus(1);
        const newGlobalMultiplier = new Decimal(1).plus(newTotalTranscendences.times(0.01));

        const milestones = TRANSCENDENCE_MILESTONES_CONFIG.map(milestone => ({
            ...milestone,
            isAchieved: newTotalTranscendences.gte(milestone.count)
        }));

        setGameState(prev => ({
            ...prev,
            showTranscendenceInfoModal: true,
            transcendenceInfoData: {
                currentTranscendenceCount: prev.transcendenceCount,
                accumulatedPI: prev.incubationPower,
                requiredPiToTranscendNext: calculatedRequiredPiToTranscend,
                etToGainNext: etToGain,
                newGlobalMultiplierPercentage: newGlobalMultiplier.minus(1).times(100),
                milestones: milestones,
            }
        }));
    }, [gameState.incubationPower, gameState.transcendenceCount, calculatedRequiredPiToTranscend, setGameState, showMessage]);

    const handleNicknameConfirm = useCallback((nickname: string) => {
        setGameState(prev => ({
            ...prev,
            userNickname: nickname || 'Jogador',
            showNicknameModal: false,
            showTraitModal: true,
        }));
    }, [setGameState]);

    const handleTraitSelectionConfirm = useCallback((selectedTraits: string[]) => {
        setGameState(prev => ({
            ...prev,
            activeTraits: selectedTraits,
            showTraitModal: false,
            showTranscendenceInfoModal: true,
        }));
    }, [setGameState]);

    const finalizeTranscendence = useCallback((path: 'essence' | 'rupture') => {
        if (gameState.incubationPower.lessThan(calculatedRequiredPiToTranscend)) {
            showMessage('PI insuficiente para transcender.', 2000);
            setGameState(prev => ({...prev, showTranscendenceInfoModal: false}));
            return;
        }

        let etGained = gameState.incubationPower.dividedBy(ESSENCE_PER_PI);
        let bonusETMultiplier = new Decimal(1);

        gameState.activeEggFormIds.forEach(formId => {
            const form = EGG_FORMS_DATA.find(f => f.id === formId);
            if(form?.activeBonus.bonusETMultiplier) {
                bonusETMultiplier = bonusETMultiplier.plus((form.activeBonus.bonusETMultiplier as Decimal).minus(1));
            }
        });
        
        gameState.achievementsData.forEach(ach => {
            if(ach.unlocked && ach.bonus?.etGainMultiplier) {
                bonusETMultiplier = bonusETMultiplier.times(ach.bonus.etGainMultiplier as Decimal);
            }
        });

        const logicReversaUpgrade = gameState.specialUpgradesData.find(su => su.id === 'stage30Bonus' && su.purchased.equals(1));
        if (logicReversaUpgrade?.effect.etGainMultiplier) {
            etGained = etGained.times(logicReversaUpgrade.effect.etGainMultiplier as Decimal);
        }

        etGained = etGained.times(bonusETMultiplier);

        let newActiveBuffs = [...gameState.activeTemporaryBuffs];
        
        if (path === 'essence') {
            etGained = etGained.plus(ESSENCE_PATH_BONUS_ET);
            showMessage(`Caminho da Essência escolhido! +${formatNumber(ESSENCE_PATH_BONUS_ET)} ET Bônus!`, 2500);
        } else if (path === 'rupture') {
            const ruptureBuff: ActiveTemporaryBuffState = {
                id: `ruptureBuff_${Date.now()}`,
                name: "Buff da Ruptura",
                description: `Produção global x${RUPTure_PATH_BUFF_GLOBAL_MULTIPLIER.toString()} por ${RUPTURE_PATH_BUFF_DURATION_SECONDS.toString()}s.`,
                icon: "fas fa-meteor",
                remainingDuration: RUPTURE_PATH_BUFF_DURATION_SECONDS,
                effect: { globalProductionMultiplier: RUPTure_PATH_BUFF_GLOBAL_MULTIPLIER },
                source: 'event',
            };
            newActiveBuffs.push(ruptureBuff);
            showMessage(`Caminho da Ruptura escolhido! Buff de produção ativado!`, 2500);
        }

        const newTranscendenceCount = gameState.transcendenceCount.plus(1);
        const newTranscendenceBonus = new Decimal(1).plus(newTranscendenceCount.times(0.01));

        const postTranscendenceEvent = POST_TRANSCENDENCE_RANDOM_EVENTS[Math.floor(Math.random() * POST_TRANSCENDENCE_RANDOM_EVENTS.length)];

        setGameState(prev => {
            const timeSinceLastTranscendence = Date.now() - (prev.lastPlayedTimestamp); // a proxy, could be better
            const isSpamming = timeSinceLastTranscendence < 60000 && prev.transcendenceCount.gt(2);
            
            const preservedState = {
                transcendentEssence: prev.transcendentEssence.plus(etGained.floor()),
                transcendenceCount: newTranscendenceCount,
                transcendencePassiveBonus: newTranscendenceBonus,
                unlockedAchievements: prev.unlockedAchievements,
                achievementsData: prev.achievementsData,
                unlockedTraits: prev.unlockedTraits,
                unlockedEggForms: prev.unlockedEggForms,
                activeTraits: prev.activeTraits,
                maxActiveTraits: prev.maxActiveTraits,
                lastPlayedTimestamp: Date.now(),
                userNickname: prev.userNickname,
                isSoundEnabled: prev.isSoundEnabled,
                isMusicEnabled: prev.isMusicEnabled,
                etPermanentUpgradesData: prev.etPermanentUpgradesData,
                legendaryUpgradesData: prev.legendaryUpgradesData,
                secretRuptureSystemUnlocked: prev.secretRuptureSystemUnlocked || path === 'rupture',
                secretRuptureUpgradesData: prev.secretRuptureUpgradesData,
                totalClicksEver: prev.totalClicksEver,
                totalRunsTranscended: newTranscendenceCount,
                rupturePathChoicesCount: prev.rupturePathChoicesCount.plus(path === 'rupture' ? 1 : 0),
                runsWithFiveDifferentTraitsCount: prev.activeTraits.length >= 5 ? prev.runsWithFiveDifferentTraitsCount.plus(1) : prev.runsWithFiveDifferentTraitsCount,
                embryoLevel10ReachedCount: prev.embryoLevel10ReachedCount,
                dailyLoginTracker: prev.dailyLoginTracker,
                cosmicBank: prev.cosmicBank,
                lastMissionGenerationDate: prev.lastMissionGenerationDate,
                dailyMissions: prev.dailyMissions,
                unlockedSkinIds: prev.unlockedSkinIds,
                activeSkinId: prev.activeSkinId,
                hiddenDiscoveriesData: prev.hiddenDiscoveriesData,
                metaUpgradesData: prev.metaUpgradesData,
                metaUpgradesUnlocked: newTranscendenceCount.gte(1) ? true : prev.metaUpgradesUnlocked,
                collectibleEggs: prev.collectibleEggs,
                lastAcquiredCollectibleEggs: prev.lastAcquiredCollectibleEggs,
                sacredRelicsData: prev.sacredRelicsData,
                eggTeamBattleState: { ...prev.eggTeamBattleState, isActive: false, isTeamSetupActive: false },
            };

            const resetState = {
                incubationPower: new Decimal(0),
                temporaryEggs: new Decimal(1),
                clicksPerClick: INITIAL_GAME_STATE.clicksPerClick,
                ipps: INITIAL_GAME_STATE.ipps,
                upgradesData: INITIAL_REGULAR_UPGRADES.map(u => ({...u, purchased: new Decimal(0)})),
                specialUpgradesData: INITIAL_GAME_STATE.specialUpgradesData.map(su => ({...su, purchased: new Decimal(0)})),
                currentStageIndex: 0,
                maxIncubationPowerAchieved: new Decimal(0),
                totalClicksThisRun: new Decimal(0),
                hasPurchasedRegularUpgradeThisRun: false,
                activeEggFormIds: [],
                activeIdleTime: new Decimal(0),
                abyssalIdleBonusTime: new Decimal(0),
                activePlayTime: new Decimal(0),
                explosaoIncubadoraTimer: new Decimal(0),
                overclockCascaTimer: new Decimal(0),
                impactoCriticoTimer: new Decimal(0),
                furiaIncubadoraTimer: new Decimal(0),
                curiosoTimer: new Decimal(0),
                activeTemporaryBuffs: newActiveBuffs,
                transcendenceSpamPenaltyActive: isSpamming,
                transcendenceSpamPenaltyDuration: isSpamming ? TRANSCENDENCE_SPAM_PENALTY_DURATION_SECONDS : new Decimal(0),
                currentEventData: postTranscendenceEvent,
                showEventModal: true,
                incubatorTypesOwnedThisRun: new Set<string>(),
                firstBossDefeatedThisRun: false,
                uniqueEnemiesDefeatedThisRunByEmbryo: new Set<string>(),
                fusaoBioquantumNextClickBuff: false,
                abilitiesUsedThisRun: [],
                enemiesDefeatedThisRun: new Decimal(0),
                forjaRessonanteBuffTimer: new Decimal(0),
                toqueTrinoBuffTimer: new Decimal(0),
                esporoIncandescenteIntervalTimer: new Decimal(10),
                esporoIncandescenteBuffTimer: new Decimal(0),
                furyPassiveBonusTimer: new Decimal(0),
                furyPassiveBonusAmount: new Decimal(0),
                spentModularEXPThisRun: false,
                embryoTookDamageThisRun: false,
                justTranscended: true, // Flag for hidden discoveries
                perfectCycleBuffTimer: prev.sacredRelicsData.some(r => r.id === 'coracaoDoCicloPerfeito' && r.obtained) ? new Decimal(60) : new Decimal(0),
                phoenixGlowCritClicksRemaining: new Decimal(0),
                distorcaoRecorrenteClickCounter: new Decimal(0),
                distorcaoRecorrenteStacks: new Decimal(0),
                distorcaoRecorrenteTimer: new Decimal(0),
                pulsoDaPerfeicaoClickCounter: new Decimal(0),
                espiralInternaIntervalTimer: new Decimal(300),
                eggFormsActivatedThisRun: new Set<string>(),
                primordialTriggerUsedThisRun: false,
                imortalidadePIBonus: new Decimal(0),
                visaoFractalBuffTimer: new Decimal(0),
            };

            const finalState = {
                ...INITIAL_GAME_STATE, // Start with a clean slate to avoid carrying over unwanted properties
                ...preservedState,
                ...resetState,
                currentEnemy: null, // Ensure enemy is null before spawning a new one
            };
            
            updateMissionProgress('transcendenceCompleted_thisRun', new Decimal(1));

            // Spawn a new enemy for the new run
            const stateWithNewEnemy = spawnNextEnemy(finalState, true);

            return stateWithNewEnemy;
        });
        
        playSound('transcendence.mp3', gameState.isSoundEnabled, 0.8);
    }, [gameState, calculatedRequiredPiToTranscend, setGameState, showMessage, updateMissionProgress]);

    return { calculatedRequiredPiToTranscend, handleTranscendModalOpen, handleNicknameConfirm, handleTraitSelectionConfirm, finalizeTranscendence };
};
