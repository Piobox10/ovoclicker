
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EmbryoEquipmentSlotKey, PlayerCollectibleEgg, SacredRelicUpgrade, ExpeditionRewardOption, EggStage, EggTeamBattlePhase, CollectibleEggDisplayRarity } from '../types';
import { 
  useLoadGame, useGameMessages, useCombatSystem, useEmbryoSystem, useAbilitySystem, useUpgradeHandler, useTranscendenceHandler,
  useEggFormHandler, useLegendarySecretHandler, useCosmicBank, useMissions, useSkinSystem,
  useSpecialUpgradeAutoActivator, useFusionSystem, useHiddenDiscoveries, useMetaUpgradeHandler,
  calculateEmbryoBaseStats, calculateEmbryoEffectiveStats, useBattleSystem, useEggFormUnlocker, useAutoSave,
  useGameLoop, useStatCalculations, useAchievementSystem
} from '../hooks';
import { POST_TRANSCENDENCE_RANDOM_EVENTS, COLLECTIBLE_EGG_RARITY_CHANCES, COLLECTIBLE_EGG_DEFINITIONS, EGG_FRAGMENTS_PER_CLICK, FIXED_EGG_SHOP_COSTS, REROLL_COST_ET, MAX_ACQUISITION_HISTORY, EGG_FORMS_DATA, EXPEDITION_STAGES_CONFIG, EXPEDITION_MAX_STAGES } from '../constants';
import { ABILITY_DEFINITIONS } from '../constants/abilities';
import { formatNumber, playSound, rehydrateBattleEggFromJSON } from '../utils';

// This will define the shape of the context value
export interface GameContextType {
  // State
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  isLoading: boolean;

  // Utilities & Derived State
  showMessage: ReturnType<typeof useGameMessages>['showMessage'];
  currentStageData: ReturnType<typeof import('../hooks').useStatCalculations>['currentStageData'];
  nextStageThreshold: ReturnType<typeof import('../hooks').useStatCalculations>['nextStageThreshold'];
  calculatedRequiredPiToTranscend: Decimal;
  effectiveMaxActiveEggForms: Decimal;

  // Handlers & Callbacks
  handleEggClick: () => void;
  dealDamageToEnemy: ReturnType<typeof useCombatSystem>['dealDamageToEnemy'];
  spawnNextGameEnemy: ReturnType<typeof useCombatSystem>['spawnNextEnemy'];
  buyEmbryoUpgradeHandler: ReturnType<typeof useEmbryoSystem>['buyEmbryoUpgradeHandler'];
  buyEmbryoStoreItem: ReturnType<typeof useEmbryoSystem>['buyEmbryoStoreItem'];
  equipEmbryoItem: ReturnType<typeof useEmbryoSystem>['equipEmbryoItem'];
  unequipEmbryoItem: ReturnType<typeof useEmbryoSystem>['unequipEmbryoItem'];
  buyActiveAbilityHandler: ReturnType<typeof useAbilitySystem>['buyActiveAbilityHandler'];
  activateAbilityHandler: ReturnType<typeof useAbilitySystem>['activateAbilityHandler'];
  buyGenericUpgradeHandler: ReturnType<typeof useUpgradeHandler>['buyGenericUpgradeHandler'];
  handleTranscendModalOpen: ReturnType<typeof useTranscendenceHandler>['handleTranscendModalOpen'];
  handleNicknameConfirm: ReturnType<typeof useTranscendenceHandler>['handleNicknameConfirm'];
  handleTraitSelectionConfirm: ReturnType<typeof useTranscendenceHandler>['handleTraitSelectionConfirm'];
  finalizeTranscendence: ReturnType<typeof useTranscendenceHandler>['finalizeTranscendence'];
  handleToggleEggForm: ReturnType<typeof useEggFormHandler>['handleToggleEggForm'];
  handleActivateLegendaryUpgrade: ReturnType<typeof useLegendarySecretHandler>['handleActivateLegendaryUpgrade'];
  handleLeadKeyClick: ReturnType<typeof useLegendarySecretHandler>['handleLeadKeyClick'];
  handleTitheRitualClick: ReturnType<typeof useLegendarySecretHandler>['handleTitheRitualClick'];
  handleBankDeposit: ReturnType<typeof useCosmicBank>['handleDeposit'];
  handleBankWithdraw: ReturnType<typeof useCosmicBank>['handleWithdraw'];
  checkAndGenerateDailyMissions: ReturnType<typeof useMissions>['checkAndGenerateDailyMissions'];
  claimMissionReward: ReturnType<typeof useMissions>['claimMissionReward'];
  setActiveSkin: ReturnType<typeof useSkinSystem>['setActiveSkin'];
  buySkin: ReturnType<typeof useSkinSystem>['buySkin'];
  fuseItems: ReturnType<typeof useFusionSystem>['fuseItems'];
  rerollFusedItemAttributes: ReturnType<typeof useFusionSystem>['rerollFusedItemAttributes'];
  toggleFusionSelection: ReturnType<typeof useFusionSystem>['toggleFusionSelection'];
  buyMetaUpgradeHandler: ReturnType<typeof useMetaUpgradeHandler>['buyMetaUpgradeHandler'];
  handleOpenEmbryoInventoryModal: (slot: EmbryoEquipmentSlotKey) => void;
  handleCloseEmbryoInventoryModal: () => void;
  handleEquipEmbryoItemFromModal: (itemInstanceId: string, slot: EmbryoEquipmentSlotKey) => void;
  handleClaimRandomEggFromFragments: () => void;
  handleRerollLastAcquiredEgg: () => void;
  handleBuyFixedEggFromShop: (definitionId: string) => void;
  addTestPIData: () => void;
  handleOpenCollectibleEggDetail: (eggInstance: PlayerCollectibleEgg) => void;
  handleCloseCollectibleEggDetail: () => void;
  handleSelectSacredRelic: (relicId: string) => void;
  handlePrimordialTrigger: () => void;
  handleConfirmPrimordialTrigger: () => void;
  handleCancelPrimordialTrigger: () => void;
  processClickEffects: (isEchoClick: boolean, clickMultiplier?: Decimal) => void;
  applyEventEffect: (eventId: string, optionIndex: number) => void;
  placeEggInTeamSlot: (slotIndex: number) => void;
  removeEggFromTeamSlot: (slotIndex: number) => void;
  handleStartExpedition: () => void;
  handleStartBattle: () => void;
  handleContinueExpedition: () => void;
  handleEndExpeditionEarly: () => void;
  handleRetryExpedition: () => void; // New
  handlePostBattleChoiceSelection: (choiceId: string) => void; // New
  handleTargetedRewardSelection: (reward: ExpeditionRewardOption) => void; // New
  applyTargetedReward: (targetEggId: string) => void; // New
  toggleEggTeamBattlePause: () => void;
  changeCombatSpeed: () => void;
  selectEggForTeamPlacement: (inventoryEggInstanceId: string) => void;

  // UI State & Handlers
  isCosmicBankPanelOpen: boolean;
  setIsCosmicBankPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAchievementsPanelOpen: boolean;
  setIsAchievementsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSummaryPanelOpen: boolean;
  setIsSummaryPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSkinsPanelOpen: boolean;
  setIsSkinsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isHiddenDiscoveriesPanelOpen: boolean;
  setIsHiddenDiscoveriesPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollectibleEggsPanelOpen: boolean;
  setIsCollectibleEggsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFixedEggShopPanelOpen: boolean;
  setIsFixedEggShopPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleEggTeamBattlePanel: () => void;
  
  // Modal Data
  showCollectibleEggDetailModal: boolean;
  selectedCollectibleEggForDetail: PlayerCollectibleEgg | null;
}

export const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState, isLoading] = useLoadGame();
  const { showMessage } = useGameMessages(setGameState);

  // UI State for Panels/Modals that toggle
  const [isCosmicBankPanelOpen, setIsCosmicBankPanelOpen] = useState(false);
  const [isAchievementsPanelOpen, setIsAchievementsPanelOpen] = useState(false);
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = useState(false);
  const [isSkinsPanelOpen, setIsSkinsPanelOpen] = useState(false);
  const [isHiddenDiscoveriesPanelOpen, setIsHiddenDiscoveriesPanelOpen] = useState(false);
  const [isCollectibleEggsPanelOpen, setIsCollectibleEggsPanelOpen] = useState(false);
  const [isFixedEggShopPanelOpen, setIsFixedEggShopPanelOpen] = useState(false);
  const [showCollectibleEggDetailModal, setShowCollectibleEggDetailModal] = useState(false);
  const [selectedCollectibleEggForDetail, setSelectedCollectibleEggForDetail] = useState<PlayerCollectibleEgg | null>(null);

  const addCombatLogEntry = useCallback((log: string) => {
    setGameState(prev => ({
        ...prev,
        combatLog: [log, ...prev.combatLog].slice(0, 20) 
    }));
  }, [setGameState]);

  // Instantiate all logic hooks
  useAutoSave(gameState);
  useGameLoop(gameState, setGameState, showMessage);
  const { currentStageData, nextStageThreshold } = useStatCalculations(gameState, setGameState);
  
  const { checkAndGenerateDailyMissions, claimMissionReward, updateMissionProgress } = useMissions(setGameState, showMessage);
  useAchievementSystem(gameState, setGameState, showMessage);
  useSpecialUpgradeAutoActivator(gameState, setGameState, showMessage);
  
  const { fuseItems, rerollFusedItemAttributes, toggleFusionSelection } = useFusionSystem(setGameState, showMessage, updateMissionProgress);
  useHiddenDiscoveries(gameState, setGameState, showMessage);

  const { applySkinCss, setActiveSkin, buySkin } = useSkinSystem(setGameState, showMessage);
  const {
    dealDamageToEnemy,
    spawnNextEnemy: spawnNextGameEnemy,
  } = useCombatSystem(setGameState, showMessage, addCombatLogEntry, updateMissionProgress);
  const { buyEmbryoUpgradeHandler, buyEmbryoStoreItem, equipEmbryoItem, unequipEmbryoItem } = useEmbryoSystem(setGameState, showMessage, updateMissionProgress);
  const { buyActiveAbilityHandler, activateAbilityHandler } = useAbilitySystem(setGameState, showMessage, updateMissionProgress);
  const { buyGenericUpgradeHandler } = useUpgradeHandler(setGameState, showMessage, updateMissionProgress);
  const { calculatedRequiredPiToTranscend, handleTranscendModalOpen, handleNicknameConfirm, handleTraitSelectionConfirm, finalizeTranscendence } = useTranscendenceHandler(gameState, setGameState, showMessage, updateMissionProgress);
  const { handleToggleEggForm, effectiveMaxActiveEggForms } = useEggFormHandler(gameState, setGameState, showMessage);
  useEggFormUnlocker(gameState, setGameState, showMessage);
  const { handleActivateLegendaryUpgrade, handleLeadKeyClick, handleTitheRitualClick, grantRandomExtraTrait } = useLegendarySecretHandler(setGameState, showMessage);
  const { handleDeposit: handleBankDeposit, handleWithdraw: handleBankWithdraw } = useCosmicBank(setGameState, showMessage);
  const { buyMetaUpgradeHandler } = useMetaUpgradeHandler(setGameState, showMessage);
  const {
    processTurn,
    toggleEggTeamBattlePanel,
    placeEggInTeamSlot,
    removeEggFromTeamSlot,
    handleStartBattle,
    handleStartExpedition,
    handleContinueExpedition,
    handleEndExpeditionEarly,
    handleRetryExpedition,
    handlePostBattleChoiceSelection,
    handleTargetedRewardSelection,
    applyTargetedReward,
    toggleEggTeamBattlePause,
    changeCombatSpeed,
    selectEggForTeamPlacement,
  } = useBattleSystem(setGameState, showMessage);

  useEffect(() => {
    // Apply skin on initial load
    if (!isLoading) {
      applySkinCss(gameState.activeSkinId);
      checkAndGenerateDailyMissions();
    }
  }, [isLoading, applySkinCss, gameState.activeSkinId, checkAndGenerateDailyMissions]);

  // Main Game Tick for Battle
  useEffect(() => {
      const battleState = gameState.eggTeamBattleState;
      // Defines the phases where the battle logic should actively run.
      const activeCombatPhases: EggTeamBattlePhase[] = ['round_start', 'turn_start', 'player_turn', 'enemy_turn', 'executing_action', 'processing_effects'];
      
      const isTickActive = battleState.isActive && !battleState.isPaused && activeCombatPhases.includes(battleState.battlePhase);

      if (isTickActive) {
          const intervalId = setInterval(() => {
              processTurn();
          }, 2000 / battleState.combatSpeed);
          return () => clearInterval(intervalId);
      }
  }, [gameState.eggTeamBattleState.isActive, gameState.eggTeamBattleState.isPaused, gameState.eggTeamBattleState.battlePhase, gameState.eggTeamBattleState.combatSpeed, processTurn]);


  const processClickEffects = useCallback((isEchoClick: boolean, clickMultiplier = new Decimal(1)) => {
    setGameState(prev => {
        let clickPower = prev.effectiveClicksPerClick.times(clickMultiplier);
        let critApplied = false;

        let newDistorcaoRecorrenteClickCounter = prev.distorcaoRecorrenteClickCounter.plus(1);
        let newDistorcaoRecorrenteStacks = prev.distorcaoRecorrenteStacks;
        let newDistorcaoRecorrenteTimer = prev.distorcaoRecorrenteTimer;
        
        const distorcaoUpgrade = prev.specialUpgradesData.find(su => su.id === 'stage18Bonus' && su.purchased.equals(1));
        if (distorcaoUpgrade) {
            if(newDistorcaoRecorrenteClickCounter.gte(100)) {
                newDistorcaoRecorrenteClickCounter = new Decimal(0);
                if (newDistorcaoRecorrenteStacks.lt(10)) {
                    newDistorcaoRecorrenteStacks = newDistorcaoRecorrenteStacks.plus(1);
                }
                newDistorcaoRecorrenteTimer = new Decimal(30); // Reset or set timer to 30s
                showMessage(`Distorção Recorrente: +1% PI/s por 30s! (Acúmulos: ${newDistorcaoRecorrenteStacks.toString()})`, 2000);
            }
        }

        let newPulsoDaPerfeicaoClickCounter = prev.pulsoDaPerfeicaoClickCounter.plus(1);
        const pulsoUpgrade = prev.specialUpgradesData.find(su => su.id === 'stage21Bonus' && su.purchased.equals(1));
        
        const phoenixGlowRelic = prev.sacredRelicsData.find(r => r.id === 'incandescenciaDaFenixPrimordial' && r.obtained);
        let critClicksRemaining = prev.phoenixGlowCritClicksRemaining;

        if (phoenixGlowRelic && critClicksRemaining.gt(0)) {
            critApplied = true;
            critClicksRemaining = critClicksRemaining.minus(1);
        } else if (pulsoUpgrade && newPulsoDaPerfeicaoClickCounter.gte(10)) {
            critApplied = true;
            newPulsoDaPerfeicaoClickCounter = new Decimal(0);
            showMessage("Pulso da Perfeição: Crítico Garantido!", 1500);
        } else if (Math.random() < prev.effectiveCriticalClickChance.toNumber() || prev.impactoCriticoTimer.gt(0)) {
            critApplied = true;
        }

        let newGameState = {...prev};

        if (critApplied) {
            const visaoFractalUpgrade = newGameState.specialUpgradesData.find(su => su.id === 'stage36Bonus' && su.purchased.equals(1));
            if (visaoFractalUpgrade) {
                newGameState.activeAbilitiesData = newGameState.activeAbilitiesData.map(ab => ({
                    ...ab,
                    cooldownRemaining: Decimal.max(0, ab.cooldownRemaining.minus(5))
                }));
                newGameState.visaoFractalBuffTimer = new Decimal(5);
                showMessage("Visão Fractal ativada!", 1500);
            }
        }

        // --- Damage Calculation ---
        let damageToEnemy = clickPower.times(0.5);

        if (critApplied) {
            let critMultiplier = new Decimal(2); 
            const critUpgrade = prev.etPermanentUpgradesData.find(u => u.id === 'critEggBoost' && u.purchased.gt(0));
            if (critUpgrade) {
                critMultiplier = critMultiplier.times((critUpgrade.effect.criticalDamageMultiplier as Decimal).pow(critUpgrade.purchased));
            }
            // Add Embryo's crit damage bonus
            if (prev.embryoEffectiveStats.critDamageMultiplier && prev.embryoEffectiveStats.critDamageMultiplier.gt(0)) {
                critMultiplier = critMultiplier.plus(prev.embryoEffectiveStats.critDamageMultiplier);
            }
            clickPower = clickPower.times(critMultiplier);
            damageToEnemy = damageToEnemy.times(critMultiplier);
        }
        
        // --- Duplicação Ovoidal ---
        const duplicacaoUpgrade = prev.specialUpgradesData.find(su => su.id === 'stage26Bonus' && su.purchased.equals(1));
        if (duplicacaoUpgrade?.effect.piDuplicationChance) {
            if (Math.random() < (duplicacaoUpgrade.effect.piDuplicationChance as Decimal).toNumber()) {
                clickPower = clickPower.times(2);
                damageToEnemy = damageToEnemy.times(2); // Also duplicate click damage
                showMessage("Duplicação Ovoidal ativada! Ganhos do clique x2!", 1000);
            }
        }
        
        newGameState = {...newGameState, 
            phoenixGlowCritClicksRemaining: critClicksRemaining,
            distorcaoRecorrenteClickCounter: newDistorcaoRecorrenteClickCounter,
            distorcaoRecorrenteStacks: newDistorcaoRecorrenteStacks,
            distorcaoRecorrenteTimer: newDistorcaoRecorrenteTimer,
            pulsoDaPerfeicaoClickCounter: newPulsoDaPerfeicaoClickCounter
        };
        
        const finalEchoUpgrade = newGameState.secretRuptureUpgradesData.find(sru => sru.id === 'finalEcho' && sru.obtained);
        if (critApplied && finalEchoUpgrade && finalEchoUpgrade.params?.critEchoTriggerChance && !isEchoClick) {
            if (Math.random() < (finalEchoUpgrade.params.critEchoTriggerChance as Decimal).toNumber()) {
                showMessage("Eco Final ativado!", 1000);
                playSound('echo.mp3', newGameState.isSoundEnabled, 0.4);
                processClickEffects(true, new Decimal(1)); 
            }
        }
        
        if (newGameState.currentEnemy) {
            newGameState = dealDamageToEnemy(damageToEnemy.floor(), newGameState); 
        }
        
        if (newGameState.fusaoBioquantumNextClickBuff) {
             clickPower = clickPower.times(5);
             newGameState.fusaoBioquantumNextClickBuff = false;
        }

        const coracaoDaFuriaBonus = newGameState.transcendentalBonusesData.find(b => b.id === 'coracaoDaFuria' && b.purchased.gt(0));
        if (coracaoDaFuriaBonus && coracaoDaFuriaBonus.effect.furyPassiveBonusPerClick && coracaoDaFuriaBonus.effect.maxFuryPassiveBonus) {
            const currentBonus = newGameState.furyPassiveBonusAmount || new Decimal(0);
            const newBonus = Decimal.min(coracaoDaFuriaBonus.effect.maxFuryPassiveBonus, currentBonus.plus(coracaoDaFuriaBonus.effect.furyPassiveBonusPerClick));
            newGameState.furyPassiveBonusAmount = newBonus;
            newGameState.furyPassiveBonusTimer = new Decimal(5); // Reset timer on each click
        }
        
        newGameState.totalClicksEver = newGameState.totalClicksEver.plus(1);
        newGameState.totalClicksThisRun = newGameState.totalClicksThisRun.plus(1);
        newGameState.lastClickTime = Date.now();
        newGameState.eggFragments = newGameState.eggFragments.plus(EGG_FRAGMENTS_PER_CLICK);
        newGameState.incubationPower = newGameState.incubationPower.plus(clickPower);
        
        updateMissionProgress('userClicks_thisRun', new Decimal(1));
        
        return newGameState;
    });
  }, [setGameState, showMessage, dealDamageToEnemy, updateMissionProgress]);

  const handleEggClick = useCallback(() => {
    processClickEffects(false);
    playSound('click.mp3', gameState.isSoundEnabled, 0.5);
  }, [processClickEffects, gameState.isSoundEnabled]);

  const addTestPIData = useCallback(() => {
    setGameState(prev => {
        const newTestEggs: PlayerCollectibleEgg[] = COLLECTIBLE_EGG_DEFINITIONS.map(def => ({
            definitionId: def.id,
            instanceId: `collectible_${def.id}_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            collectedTimestamp: Date.now(),
        }));

        return {
            ...prev,
            incubationPower: prev.incubationPower.plus(new Decimal("1e27")),
            transcendentEssence: prev.transcendentEssence.plus(new Decimal("1e3")),
            modularEXP: prev.modularEXP.plus(new Decimal("1e6")),
            eggFragments: prev.eggFragments.plus(new Decimal("1e4")),
            collectibleEggs: [...prev.collectibleEggs, ...newTestEggs],
        };
    });
    showMessage("Dados de teste adicionados! (+1 de cada ovo colecionável)", 1500);
  }, [setGameState, showMessage]);

  const applyEventEffect = useCallback((eventId: string, optionIndex: number) => {
    const event = POST_TRANSCENDENCE_RANDOM_EVENTS.find(e => e.id === eventId);
    if (event) {
        event.options[optionIndex].applyEffect(gameState, setGameState, showMessage);
        setGameState(prev => ({...prev, currentEventData: null, showEventModal: false}));
    }
  }, [gameState, setGameState, showMessage]);

  const handleOpenEmbryoInventoryModal = useCallback((slot: EmbryoEquipmentSlotKey) => {
    setGameState(prev => ({...prev, showEmbryoInventoryModal: true, currentSlotToEquip: slot}));
  }, [setGameState]);

  const handleCloseEmbryoInventoryModal = useCallback(() => {
    setGameState(prev => ({...prev, showEmbryoInventoryModal: false, currentSlotToEquip: null}));
  }, [setGameState]);
  
  const handleEquipEmbryoItemFromModal = useCallback((itemInstanceId: string, slot: EmbryoEquipmentSlotKey) => {
    equipEmbryoItem(itemInstanceId, slot);
    handleCloseEmbryoInventoryModal();
  }, [equipEmbryoItem, handleCloseEmbryoInventoryModal]);

  const handleClaimRandomEggFromFragments = useCallback(() => {
    setGameState(prev => {
        if (prev.eggFragments.lt(prev.eggFragmentCostForRandomRoll)) {
            showMessage("Fragmentos de ovo insuficientes.", 1500);
            return prev;
        }

        const rand = Math.random();
        let cumulativeChance = 0;
        let chosenRarity: CollectibleEggDisplayRarity = 'Comum';
        for (const rarityInfo of COLLECTIBLE_EGG_RARITY_CHANCES) {
            cumulativeChance += rarityInfo.chance;
            if (rand < cumulativeChance) {
                chosenRarity = rarityInfo.rarity;
                break;
            }
        }

        const possibleEggsOfRarity = COLLECTIBLE_EGG_DEFINITIONS.filter(def => def.rarity === chosenRarity);
        if (possibleEggsOfRarity.length === 0) {
            showMessage(`Nenhum ovo de raridade '${chosenRarity}' encontrado para gerar.`, 2000);
            return prev;
        }

        const randomEggDefinition = possibleEggsOfRarity[Math.floor(Math.random() * possibleEggsOfRarity.length)];
        const newEggInstance: PlayerCollectibleEgg = {
            definitionId: randomEggDefinition.id,
            instanceId: `collectible_${randomEggDefinition.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            collectedTimestamp: Date.now(),
        };

        const newHistory = [{
          definitionId: newEggInstance.definitionId,
          instanceId: newEggInstance.instanceId,
          rarity: randomEggDefinition.rarity,
          timestamp: newEggInstance.collectedTimestamp,
          name: randomEggDefinition.name,
          icon: randomEggDefinition.icon,
        }, ...prev.lastAcquiredCollectibleEggs].slice(0, MAX_ACQUISITION_HISTORY);
        
        showMessage(`Você obteve um ovo ${randomEggDefinition.rarity}: ${randomEggDefinition.name}!`, 3000);
        playSound('egg_collect.mp3', prev.isSoundEnabled, 0.7);

        return {
            ...prev,
            eggFragments: prev.eggFragments.minus(prev.eggFragmentCostForRandomRoll),
            collectibleEggs: [...prev.collectibleEggs, newEggInstance],
            lastAcquiredCollectibleEggs: newHistory,
        };
    });
  }, [setGameState, showMessage]);

  const handleRerollLastAcquiredEgg = useCallback(() => {
    setGameState(prev => {
        if(prev.lastAcquiredCollectibleEggs.length === 0) return prev;
        if(prev.transcendentEssence.lt(REROLL_COST_ET)) {
            showMessage(`ET insuficiente para rerolar. Custo: ${REROLL_COST_ET} ET.`, 1500);
            return prev;
        }
        
        const lastEggInstanceId = prev.lastAcquiredCollectibleEggs[0].instanceId;
        const inventoryWithoutLast = prev.collectibleEggs.filter(egg => egg.instanceId !== lastEggInstanceId);

        // Re-roll logic is the same as claiming a new one
        const rand = Math.random();
        let cumulativeChance = 0;
        let chosenRarity: CollectibleEggDisplayRarity = 'Comum';
        for (const rarityInfo of COLLECTIBLE_EGG_RARITY_CHANCES) {
            cumulativeChance += rarityInfo.chance;
            if (rand < cumulativeChance) {
                chosenRarity = rarityInfo.rarity;
                break;
            }
        }
        const possibleEggsOfRarity = COLLECTIBLE_EGG_DEFINITIONS.filter(def => def.rarity === chosenRarity);
        const randomEggDefinition = possibleEggsOfRarity[Math.floor(Math.random() * possibleEggsOfRarity.length)];
        const newEggInstance: PlayerCollectibleEgg = {
            definitionId: randomEggDefinition.id,
            instanceId: `collectible_${randomEggDefinition.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            collectedTimestamp: Date.now(),
        };

        const newHistoryEntry = {
          definitionId: newEggInstance.definitionId,
          instanceId: newEggInstance.instanceId,
          rarity: randomEggDefinition.rarity,
          timestamp: newEggInstance.collectedTimestamp,
          name: randomEggDefinition.name,
          icon: randomEggDefinition.icon,
        };
        const newHistory = [newHistoryEntry, ...prev.lastAcquiredCollectibleEggs.slice(1)];
        
        showMessage(`Ovo rerolado! Novo ovo: ${randomEggDefinition.name} (${randomEggDefinition.rarity})!`, 3000);

        return {
            ...prev,
            transcendentEssence: prev.transcendentEssence.minus(REROLL_COST_ET),
            collectibleEggs: [...inventoryWithoutLast, newEggInstance],
            lastAcquiredCollectibleEggs: newHistory,
        };
    });
  }, [setGameState, showMessage]);

  const handleBuyFixedEggFromShop = useCallback((definitionId: string) => {
    setGameState(prev => {
        const eggDef = COLLECTIBLE_EGG_DEFINITIONS.find(def => def.id === definitionId);
        if (!eggDef) return prev;

        const cost = FIXED_EGG_SHOP_COSTS[eggDef.rarity];
        if (!cost || prev.eggFragments.lt(cost)) {
            showMessage("Fragmentos insuficientes.", 1500);
            return prev;
        }

        const newEggInstance: PlayerCollectibleEgg = {
            definitionId: eggDef.id,
            instanceId: `collectible_${eggDef.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            collectedTimestamp: Date.now(),
        };

        showMessage(`Ovo "${eggDef.name}" comprado!`, 2500);
        playSound('purchase.mp3', prev.isSoundEnabled, 0.6);

        return {
            ...prev,
            eggFragments: prev.eggFragments.minus(cost),
            collectibleEggs: [...prev.collectibleEggs, newEggInstance],
        };
    });
  }, [setGameState, showMessage]);

  const handleOpenCollectibleEggDetail = useCallback((eggInstance: PlayerCollectibleEgg) => {
    setSelectedCollectibleEggForDetail(eggInstance);
    setShowCollectibleEggDetailModal(true);
  }, []);

  const handleCloseCollectibleEggDetail = useCallback(() => {
    setShowCollectibleEggDetailModal(false);
    setSelectedCollectibleEggForDetail(null);
  }, []);

  const handleSelectSacredRelic = useCallback((relicId: string) => {
    setGameState(prev => {
      const newRelics = prev.sacredRelicsData.map(relic => 
        relic.id === relicId ? { ...relic, obtained: true } : relic
      );
      const chosenRelic = newRelics.find(r => r.id === relicId);
      showMessage(`Relíquia Sagrada "${chosenRelic?.name}" escolhida!`, 3000);
      return {
        ...prev,
        sacredRelicsData: newRelics,
        showSacredRelicChoiceModal: false,
        availableSacredRelicChoices: [],
      };
    });
  }, [setGameState, showMessage]);
  
  const handlePrimordialTrigger = useCallback(() => {
    setGameState(prev => ({ ...prev, showPrimordialTriggerModal: true }));
  }, [setGameState]);

  const handleConfirmPrimordialTrigger = useCallback(() => {
      setGameState(prev => {
          if (prev.primordialTriggerUsedThisRun) return prev;

          const resetUpgrades = prev.upgradesData.map(upg => ({...upg, purchased: new Decimal(0) }));

          showMessage("Gatilho Primordial ativado! Melhorias sacrificadas por +1 Ovo Temporário.", 3000);
          playSound('explosion.mp3', prev.isSoundEnabled, 0.7);

          return {
              ...prev,
              upgradesData: resetUpgrades,
              incubationPower: new Decimal(0),
              temporaryEggs: prev.temporaryEggs.plus(1),
              primordialTriggerUsedThisRun: true,
              showPrimordialTriggerModal: false,
          }
      })
  }, [setGameState, showMessage]);

  const handleCancelPrimordialTrigger = useCallback(() => {
    setGameState(prev => ({ ...prev, showPrimordialTriggerModal: false }));
  }, [setGameState]);

  const contextValue: GameContextType = {
    gameState,
    setGameState,
    isLoading,
    showMessage,
    currentStageData,
    nextStageThreshold,
    calculatedRequiredPiToTranscend,
    effectiveMaxActiveEggForms,
    handleEggClick,
    dealDamageToEnemy,
    spawnNextGameEnemy,
    buyEmbryoUpgradeHandler,
    buyEmbryoStoreItem,
    equipEmbryoItem,
    unequipEmbryoItem,
    buyActiveAbilityHandler,
    activateAbilityHandler,
    buyGenericUpgradeHandler,
    handleTranscendModalOpen,
    handleNicknameConfirm,
    handleTraitSelectionConfirm,
    finalizeTranscendence,
    handleToggleEggForm,
    handleActivateLegendaryUpgrade,
    handleLeadKeyClick,
    handleTitheRitualClick,
    handleBankDeposit,
    handleBankWithdraw,
    checkAndGenerateDailyMissions,
    claimMissionReward,
    setActiveSkin,
    buySkin,
    fuseItems,
    rerollFusedItemAttributes,
    toggleFusionSelection,
    buyMetaUpgradeHandler,
    handleOpenEmbryoInventoryModal,
    handleCloseEmbryoInventoryModal,
    handleEquipEmbryoItemFromModal,
    handleClaimRandomEggFromFragments,
    handleRerollLastAcquiredEgg,
    handleBuyFixedEggFromShop,
    addTestPIData,
    handleOpenCollectibleEggDetail,
    handleCloseCollectibleEggDetail,
    handleSelectSacredRelic,
    handlePrimordialTrigger,
    handleConfirmPrimordialTrigger,
    handleCancelPrimordialTrigger,
    processClickEffects,
    applyEventEffect,
    placeEggInTeamSlot,
    removeEggFromTeamSlot,
    handleStartExpedition,
    handleStartBattle,
    handleContinueExpedition,
    handleEndExpeditionEarly,
    handleRetryExpedition,
    handlePostBattleChoiceSelection,
    handleTargetedRewardSelection,
    applyTargetedReward,
    toggleEggTeamBattlePause,
    changeCombatSpeed,
    selectEggForTeamPlacement,
    isCosmicBankPanelOpen,
    setIsCosmicBankPanelOpen,
    isAchievementsPanelOpen,
    setIsAchievementsPanelOpen,
    isSummaryPanelOpen,
    setIsSummaryPanelOpen,
    isSkinsPanelOpen,
    setIsSkinsPanelOpen,
    isHiddenDiscoveriesPanelOpen,
    setIsHiddenDiscoveriesPanelOpen,
    isCollectibleEggsPanelOpen,
    setIsCollectibleEggsPanelOpen,
    isFixedEggShopPanelOpen,
    setIsFixedEggShopPanelOpen,
    toggleEggTeamBattlePanel,
    showCollectibleEggDetailModal,
    selectedCollectibleEggForDetail,
  };

  return (
      <GameContext.Provider value={contextValue}>
          {children}
      </GameContext.Provider>
  );
};
