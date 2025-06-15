
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EggForm, EmbryoStats, EmbryoEquipmentSlotKey } from './types'; 
import { EGG_STAGES, INITIAL_GAME_STATE, GAME_SAVE_KEY, TRAITS, EGG_FORMS_DATA, EMBRYO_BASE_STATS_PER_LEVEL, INITIAL_EMBRYO_SHOP_ITEMS, POST_TRANSCENDENCE_RANDOM_EVENTS } from './constants'; 

import Modal from './components/Modal.tsx'; // MODIFIED: Added .tsx extension

// Hooks
import { 
    useLoadGame, useAutoSave, useGameLoop, useStatCalculations, useAchievementSystem, useGameMessages,
    useCombatSystem, useEmbryoSystem, useAbilitySystem, useUpgradeHandler, useTranscendenceHandler,
    useEggFormHandler, useLegendarySecretHandler
} from './hooks';
import { calculateEmbryoBaseStats, calculateEmbryoEffectiveStats } from './hooks/useEmbryoSystem'; // Import directly for App.tsx use

// Panel Components
import {
    StatusDisplayPanel, EggInteractionPanel, RegularUpgradesPanel, SpecialUpgradesPanel,
    EggFormsPanel, ActiveTraitsDisplayPanel, ActiveAbilitiesPanel, LegendarySecretUpgradesPanel, AchievementsPanel,
    CombatPanel, EmbryoPanel, RunStatsPanel, SettingsModalContent, PurchasedUpgradesListPanel,
    EtBonusesDisplayPanel, EtPermanentUpgradesDisplayPanel, RankingPanel, // Added RankingPanel
    EmbryoInventoryModalContent // Import the new modal content
} from './components/panels';

import { formatNumber, formatTime, getEmbryoVisuals, getEmbryoNextLevelEXP } from './utils';


export const App: React.FC = () => {
    const [gameState, setGameState, isLoading] = useLoadGame();
    const { showMessage } = useGameMessages(setGameState);
    
    useAutoSave(gameState);
    useGameLoop(gameState, setGameState, showMessage);
    const { currentStageData, nextStageThreshold } = useStatCalculations(gameState, setGameState);
    useAchievementSystem(gameState, setGameState, showMessage);

    const addCombatLogEntry = useCallback((log: string) => {
        setGameState(prev => {
            const newLog = [log, ...prev.combatLog].slice(0, 5);
            return { ...prev, combatLog: newLog };
        });
    }, [setGameState]);

    const { dealDamageToEnemy } = useCombatSystem(setGameState, showMessage, addCombatLogEntry);
    const { 
        buyEmbryoUpgradeHandler, 
        buyEmbryoStoreItem, 
        equipEmbryoItem, 
        unequipEmbryoItem 
    } = useEmbryoSystem(setGameState, showMessage);
    const { buyActiveAbilityHandler, activateAbilityHandler } = useAbilitySystem(setGameState, showMessage);
    const { buyGenericUpgradeHandler, buySpecialUpgradeHandler } = useUpgradeHandler(setGameState, showMessage);
    const { calculatedRequiredPiToTranscend, handleTranscendModalOpen, handleNicknameConfirm, handleTraitSelectionConfirm, finalizeTranscendence } = useTranscendenceHandler(gameState, setGameState, showMessage);
    const { handleToggleEggForm, effectiveMaxActiveEggForms } = useEggFormHandler(gameState, setGameState, showMessage);
    const { handleActivateLegendaryUpgrade, handleLeadKeyClick, handleTitheRitualClick, grantRandomExtraTrait } = useLegendarySecretHandler(setGameState, showMessage);
    
    // Embryo Inventory Modal Handlers
    const handleOpenEmbryoInventoryModal = useCallback((slot: EmbryoEquipmentSlotKey) => {
        setGameState(prev => ({ ...prev, showEmbryoInventoryModal: true, currentSlotToEquip: slot }));
    }, [setGameState]);

    const handleCloseEmbryoInventoryModal = useCallback(() => {
        setGameState(prev => ({ ...prev, showEmbryoInventoryModal: false, currentSlotToEquip: null }));
    }, [setGameState]);

    // This handler will be passed to the EmbryoInventoryModalContent
    const handleEquipEmbryoItemFromModal = useCallback((itemId: string, slot: EmbryoEquipmentSlotKey) => {
        equipEmbryoItem(itemId, slot); // Call the hook function
        handleCloseEmbryoInventoryModal(); // Close modal after equipping
    }, [equipEmbryoItem, handleCloseEmbryoInventoryModal]);


     // Effect to recalculate Embryo Base Stats when level changes
    useEffect(() => {
        if (!isLoading) { // Ensure game is loaded
            setGameState(prev => {
                const newBaseStats = calculateEmbryoBaseStats(prev.embryoLevel);
                if (JSON.stringify(newBaseStats) !== JSON.stringify(prev.embryoBaseStats)) { // Basic check for change
                    const newEffectiveStats = calculateEmbryoEffectiveStats(newBaseStats, prev.equippedEmbryoItems, prev.embryoShopItems);
                    return { ...prev, embryoBaseStats: newBaseStats, embryoEffectiveStats: newEffectiveStats };
                }
                return prev;
            });
        }
    }, [gameState.embryoLevel, isLoading, setGameState]);

    // Effect to recalculate Embryo Effective Stats when base stats or equipment changes
    useEffect(() => {
        if (!isLoading) {
             setGameState(prev => {
                const newEffectiveStats = calculateEmbryoEffectiveStats(prev.embryoBaseStats, prev.equippedEmbryoItems, prev.embryoShopItems);
                 if (JSON.stringify(newEffectiveStats) !== JSON.stringify(prev.embryoEffectiveStats)) { 
                    return { ...prev, embryoEffectiveStats: newEffectiveStats };
                }
                return prev;
            });
        }
    }, [gameState.embryoBaseStats, gameState.equippedEmbryoItems, isLoading, setGameState, gameState.embryoShopItems]);


    const processClickEffects = useCallback((isEchoClick: boolean, clickMultiplier: Decimal = new Decimal(1)) => {
       setGameState(currentClickHandlerState => { 
            let stateRef = {...currentClickHandlerState}; 
            let baseClickPowerForPI = stateRef.effectiveClicksPerClick;
            let isCritical = false;
            let fixedPIBonusPerClick = new Decimal(0);
            let newTranscendentEssence = stateRef.transcendentEssence;
            const newTotalClicksThisRun = stateRef.totalClicksThisRun.plus(1);

            if (stateRef.activeTemporaryBuff && stateRef.activeTemporaryBuff.remainingDuration.gt(0) && stateRef.activeTemporaryBuff.effect.bonusFixedPIPerClick) {
                fixedPIBonusPerClick = fixedPIBonusPerClick.plus(stateRef.activeTemporaryBuff.effect.bonusFixedPIPerClick as Decimal);
            }

            if (stateRef.impactoCriticoTimer.greaterThan(0)) {
                isCritical = true;
            } else if (Math.random() < stateRef.effectiveCriticalClickChance.toNumber()) {
                isCritical = true;
            }

            let finalClickPowerForPI = baseClickPowerForPI.times(clickMultiplier);
            let baseDamageToEnemy = stateRef.effectiveClicksPerClick; 
            
            baseDamageToEnemy = baseDamageToEnemy.plus(stateRef.embryoEffectiveStats.attack);

            let additiveDamageToEnemyFromEmbryo = new Decimal(0);
            stateRef.embryoUpgradesData.forEach(eUpg => {
                if (eUpg.purchased && eUpg.effect.baseClickDamageToEnemiesAdditive) {
                    additiveDamageToEnemyFromEmbryo = additiveDamageToEnemyFromEmbryo.plus(eUpg.effect.baseClickDamageToEnemiesAdditive as Decimal);
                }
            });
            baseDamageToEnemy = baseDamageToEnemy.plus(additiveDamageToEnemyFromEmbryo);
            let actualDamageToEnemy = baseDamageToEnemy.times(clickMultiplier);

            if (isCritical) {
                let critMultiplierValue = new Decimal(2); 
                const critAmpUpgrade = stateRef.etPermanentUpgradesData.find(epu => epu.id === 'critEggBoost' && epu.purchased.gt(0));
                if (critAmpUpgrade?.effect.criticalDamageMultiplier) {
                    let effectiveEtPermUpgradeEffectiveness = new Decimal(1);
                    if (stateRef.activeEggFormIds.includes('ancientsEgg')) { 
                        const ancientsEggFormDetails = EGG_FORMS_DATA.find(f => f.id === 'ancientsEgg'); 
                         if (ancientsEggFormDetails?.activeBonus?.etPermanentUpgradeEffectiveness) { 
                            effectiveEtPermUpgradeEffectiveness = ancientsEggFormDetails.activeBonus.etPermanentUpgradeEffectiveness as Decimal;
                        }
                    }
                    critMultiplierValue = critMultiplierValue.times(
                        (critAmpUpgrade.effect.criticalDamageMultiplier as Decimal).pow(critAmpUpgrade.purchased.times(effectiveEtPermUpgradeEffectiveness))
                    );
                }
                critMultiplierValue = critMultiplierValue.times(new Decimal(1).plus(stateRef.embryoEffectiveStats.critChance));


                finalClickPowerForPI = finalClickPowerForPI.times(critMultiplierValue);
                actualDamageToEnemy = actualDamageToEnemy.times(critMultiplierValue);

                if (!isEchoClick) showMessage(`CRÍTICO! +${formatNumber(finalClickPowerForPI)} PI!`, 1000);

                const dedoDeTitanioAch = stateRef.achievementsData.find(a => a.id === 'dedoDeTitanio' && a.unlocked);
                if (dedoDeTitanioAch?.bonus) {
                    const complexBonus = dedoDeTitanioAch.bonus as any; 
                    if (complexBonus.abilityCooldownReductionOnCrit) {
                        const reduction = complexBonus.abilityCooldownReductionOnCrit as Decimal;
                        stateRef.activeAbilitiesData = stateRef.activeAbilitiesData.map(ab => ({
                            ...ab,
                            cooldownRemaining: ab.cooldownRemaining.greaterThan(0) ? Decimal.max(0, ab.cooldownRemaining.minus(reduction)) : new Decimal(0)
                        }));
                    }
                }
                const finalEchoSecret = stateRef.secretRuptureUpgradesData.find(sru => sru.id === 'finalEcho' && sru.obtained && stateRef.secretRuptureSystemUnlocked);
                if (finalEchoSecret && finalEchoSecret.params?.critEchoTriggerChance && Math.random() < finalEchoSecret.params.critEchoTriggerChance.toNumber() && !isEchoClick) {
                    setTimeout(() => processClickEffects(true, new Decimal(1)), 10); 
                    showMessage("Eco Final Crítico!", 800);
                }
            }

            const paradoxCore = stateRef.secretRuptureUpgradesData.find(sru => sru.id === 'paradoxCore' && sru.obtained && stateRef.secretRuptureSystemUnlocked);
            if (paradoxCore) {
                const oldMultiple = stateRef.totalClicksThisRun.dividedToIntegerBy(666);
                const newMultipleAfterThisClick = newTotalClicksThisRun.dividedToIntegerBy(666);
                if (newTotalClicksThisRun.modulo(666).isZero() && newMultipleAfterThisClick.gt(oldMultiple)) {
                    newTranscendentEssence = newTranscendentEssence.plus(1);
                    if (!isEchoClick) showMessage("Núcleo Paradoxal ativado! +1 ET!", 2000);
                }
            }
            
            // Pulso de Plasma Trait
            if (stateRef.activeTraits.includes('plasmaPulse')) {
                stateRef.plasmaPulseClickCounter = stateRef.plasmaPulseClickCounter.plus(1);
                if (stateRef.plasmaPulseClickCounter.gte(100)) {
                    const plasmaBonus = stateRef.effectiveClicksPerClick.times(10); // 10x IPPC
                    stateRef.incubationPower = stateRef.incubationPower.plus(plasmaBonus);
                    if (!isEchoClick) showMessage(`Pulso de Plasma! +${formatNumber(plasmaBonus)} PI!`, 1500);
                    stateRef.plasmaPulseClickCounter = new Decimal(0);
                }
            }
            
            stateRef.incubationPower = stateRef.incubationPower.plus(finalClickPowerForPI).plus(fixedPIBonusPerClick);
            stateRef.totalClicksEver = stateRef.totalClicksEver.plus(1);
            stateRef.totalClicksThisRun = newTotalClicksThisRun;
            stateRef.transcendentEssence = newTranscendentEssence;
            stateRef.lastClickTime = Date.now();
            stateRef.activeIdleTime = new Decimal(0); 
            stateRef.abyssalIdleBonusTime = new Decimal(0);
            stateRef.lastInteractionTime = Date.now(); // Update for Casca Gélida achievement

            if (stateRef.currentEnemy && !isEchoClick) { 
                stateRef = dealDamageToEnemy(actualDamageToEnemy, stateRef);
            }
            return stateRef;
        });
    }, [setGameState, showMessage, dealDamageToEnemy, addCombatLogEntry, formatNumber]); 

    const handleEggClick = useCallback(() => {
        processClickEffects(false, new Decimal(1)); 
        setGameState(currentEchoCheckState => {
            const clickEchoUpgrade = currentEchoCheckState.embryoUpgradesData.find(upg => upg.id === 'embryoClickEcho' && upg.purchased);
            if (clickEchoUpgrade && clickEchoUpgrade.effect.clickEchoChance && Math.random() < (clickEchoUpgrade.effect.clickEchoChance as Decimal).toNumber()) {
                const echoMultiplier = clickEchoUpgrade.effect.clickEchoMultiplier as Decimal || new Decimal(0.5);
                showMessage("Eco da Casca!", 800);
                processClickEffects(true, echoMultiplier); 
            }
            return currentEchoCheckState; 
        });

    }, [processClickEffects, showMessage, setGameState]);

    // Effect for stage evolution
    useEffect(() => {
        if (isLoading) return;
        const nextStageInfo = EGG_STAGES[gameState.currentStageIndex + 1];
        // Check if we can evolve to the NEXT stage
        if (nextStageInfo && gameState.incubationPower.gte(nextStageInfo.threshold)) {
            // If so, update currentStageIndex. This will trigger the other useEffect for form unlocking.
            setGameState(prev => ({
                ...prev,
                currentStageIndex: prev.currentStageIndex + 1,
            }));
            showMessage(`Ovo evoluiu para: ${nextStageInfo.name}!`, 2500);
        }
    }, [gameState.incubationPower, gameState.currentStageIndex, isLoading, setGameState, showMessage]);

    // Effect for unlocking egg forms based on current stage
    useEffect(() => {
        if (isLoading) return;

        const newFormsToUnlock: string[] = [];
        EGG_FORMS_DATA.forEach((form) => {
            if (!form.isLegendary && // Only non-legendary forms
                gameState.currentStageIndex >= form.stageRequired && // Check against current stage index
                !gameState.unlockedEggForms.includes(form.id) // If not already unlocked
            ) {
                newFormsToUnlock.push(form.id);
            }
        });

        if (newFormsToUnlock.length > 0) {
            setGameState(prev => ({
                ...prev,
                unlockedEggForms: [...new Set([...prev.unlockedEggForms, ...newFormsToUnlock])] // Use Set to avoid duplicates if any race condition
            }));
            newFormsToUnlock.forEach(formId => {
                const formDetails = EGG_FORMS_DATA.find(f => f.id === formId);
                if (formDetails) {
                    showMessage(`Nova forma de ovo desbloqueada: ${formDetails.name}!`, 3000);
                }
            });
        }
    }, [gameState.currentStageIndex, isLoading, setGameState, showMessage]); // Removed gameState.unlockedEggForms from deps, newFormsToUnlock handles batching


    const applyEventEffect = useCallback((eventId: string, optionIndex: number) => {
        setGameState(prev => {
            // Use POST_TRANSCENDENCE_RANDOM_EVENTS for post-transcendence event handling
            const event = POST_TRANSCENDENCE_RANDOM_EVENTS.find(e => e.id === eventId);
            if (event && event.options[optionIndex]) {
                // The applyEffect function itself will call setGameState and showMessage
                event.options[optionIndex].applyEffect(prev, setGameState, showMessage);
                 // The event's applyEffect should handle its own state updates.
                 // We only close the modal here after the effect is applied by the event's own logic.
                return { ...prev, currentEventData: null, showEventModal: false };
            }
            // Fallback: Close modal even if event or option not found
            return { ...prev, currentEventData: null, showEventModal: false }; 
        });
    }, [setGameState, showMessage]);


    const addTestPIData = () => { setGameState(prev => ({...prev, incubationPower: prev.incubationPower.plus(1e9), transcendentEssence: prev.transcendentEssence.plus(1000), modularEXP: prev.modularEXP.plus(10000) }))};

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white text-2xl">Carregando Ovo Clicker...</div>;
    }
    
    const activeEggFormsDetails = gameState.activeEggFormIds.map(id => EGG_FORMS_DATA.find(f => f.id === id)).filter(Boolean) as EggForm[];

    return (
        <React.Fragment>
            <div className="game-container-wrapper flex-grow min-w-0 w-full max-w-screen-2xl mx-auto">
                <div className="game-container flex flex-col gap-3 sm:gap-4 lg:gap-6 bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-slate-700 w-full relative">
                    
                    <div className="header-row flex justify-between items-center mb-0 sm:mb-2">
                        <h1 className="text-violet-400 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                            Ovo Clicker: <span className="text-violet-300">React Edition</span>
                        </h1>
                        <button
                            onClick={() => setGameState(prev => ({ ...prev, showSettingsModal: true }))}
                            className="bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            aria-label="Configurações" title="Configurações"
                        >
                            <i className="fas fa-cog text-base sm:text-lg"></i>
                        </button>
                    </div>

                    <div className="main-content-grid grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        <div className="main-col-left flex flex-col gap-3 sm:gap-4">
                            <StatusDisplayPanel gameState={gameState} currentEggStage={currentStageData} />
                            <EggInteractionPanel
                                currentStage={currentStageData}
                                nextStageThreshold={nextStageThreshold}
                                activeEggForms={activeEggFormsDetails}
                                onEggClick={handleEggClick}
                                message={gameState.message}
                                activeTemporaryBuff={gameState.activeTemporaryBuff}
                            />
                            <ActiveAbilitiesPanel gameState={gameState} onBuyAbility={buyActiveAbilityHandler} onActivateAbility={activateAbilityHandler} />
                            <div className="w-full bg-gradient-to-br from-purple-700/50 via-indigo-700/50 to-pink-700/50 rounded-xl p-3 sm:p-4 border border-purple-600 shadow-lg text-center">
                                <p className="text-slate-200 text-xs sm:text-sm mb-2">
                                    Acumule <span className="font-bold text-amber-300">{formatNumber(calculatedRequiredPiToTranscend)}</span> PI para transcender.
                                </p>
                                <button
                                    onClick={handleTranscendModalOpen}
                                    disabled={gameState.incubationPower.lessThan(calculatedRequiredPiToTranscend)}
                                    className="w-full max-w-xs mx-auto bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 sm:py-2.5 px-4 rounded-lg shadow-md hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-purple-700"
                                >
                                    <i className="fas fa-infinity mr-1.5"></i> Transcender ({formatNumber(gameState.transcendenceCount)})
                                </button>
                            </div>
                            <button onClick={addTestPIData} className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-800">
                                <i className="fas fa-plus-circle mr-2"></i> Add Test PI/ET/EXP
                            </button>
                            <RunStatsPanel gameState={gameState} />
                            <ActiveTraitsDisplayPanel gameState={gameState} />
                            <RankingPanel gameState={gameState} />
                        </div>

                        <div className="main-col-center flex flex-col gap-3 sm:gap-4">
                            <CombatPanel gameState={gameState} />
                            <RegularUpgradesPanel gameState={gameState} onBuyUpgrade={(id, qty) => buyGenericUpgradeHandler(id, qty, 'regular')} />
                            <PurchasedUpgradesListPanel gameState={gameState} /> 
                            <EggFormsPanel gameState={gameState} onToggleEggForm={handleToggleEggForm} effectiveMaxActiveEggForms={effectiveMaxActiveEggForms} />
                            <LegendarySecretUpgradesPanel 
                                gameState={gameState} 
                                onActivateLegendaryUpgrade={handleActivateLegendaryUpgrade}
                                onLeadKeyClick={handleLeadKeyClick}
                                onTitheRitualClick={handleTitheRitualClick}
                            />
                             <AchievementsPanel gameState={gameState} />
                        </div>

                        <div className="main-col-right flex flex-col gap-3 sm:gap-4">
                            <EmbryoPanel 
                                gameState={gameState} 
                                onBuyEmbryoUpgrade={buyEmbryoUpgradeHandler}
                                onBuyEmbryoStoreItem={buyEmbryoStoreItem}
                                onOpenInventoryModal={handleOpenEmbryoInventoryModal}
                                onUnequipItem={unequipEmbryoItem}
                            />
                            <EtBonusesDisplayPanel 
                                gameState={gameState} 
                                onBuyTranscendentalBonus={(id, qty) => buyGenericUpgradeHandler(id, qty, 'transcendental')}
                            />
                            <EtPermanentUpgradesDisplayPanel 
                                gameState={gameState}
                                onBuyEtPermanentUpgrade={(id, qty) => buyGenericUpgradeHandler(id, qty, 'et_permanent')}
                            />
                            <SpecialUpgradesPanel gameState={gameState} onBuySpecialUpgrade={buySpecialUpgradeHandler} />
                        </div>
                    </div>
                    
                    {/* Modals */}
                    <Modal isOpen={gameState.showNicknameModal} title="Defina seu Apelido" onClose={() => setGameState(prev => ({...prev, showNicknameModal: false, showTraitModal: false }))}>
                        <form onSubmit={(e) => { e.preventDefault(); handleNicknameConfirm((e.target as any).nickname.value); }}>
                            <input type="text" name="nickname" defaultValue={gameState.userNickname === 'Jogador' ? '' : gameState.userNickname} placeholder="Seu apelido aqui..." className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-shadow" maxLength={30} />
                            <button type="submit" className="mt-4 w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-700">Confirmar</button>
                        </form>
                    </Modal>

                    <Modal isOpen={gameState.showTraitModal} title="Escolha seus Traços" onClose={() => setGameState(prev => ({...prev, showTraitModal: false}))}>
                        <div className="max-h-80 overflow-y-auto p-1 custom-scrollbar">
                            {TRAITS.filter(trait => gameState.unlockedTraits.includes(trait.id)).length > 0 ? (
                                TRAITS.filter(trait => gameState.unlockedTraits.includes(trait.id)).map(trait => (
                                    <label key={trait.id} className="flex items-start p-3 mb-2 bg-slate-800 hover:bg-slate-700/70 rounded-lg border border-slate-600 cursor-pointer transition-colors has-[:checked]:bg-violet-700 has-[:checked]:border-violet-500 has-[:checked]:ring-2 has-[:checked]:ring-violet-400">
                                        <input type="checkbox" value={trait.id} className="mr-3 mt-1 h-5 w-5 text-violet-500 bg-slate-600 border-slate-500 rounded focus:ring-violet-400 focus:ring-offset-slate-800" defaultChecked={gameState.activeTraits.includes(trait.id)}
                                            onChange={(e) => {
                                                const { value, checked } = e.target;
                                                setGameState(prev => {
                                                    let newActiveTraits = [...prev.activeTraits];
                                                    if (checked) {
                                                        if (newActiveTraits.length < prev.maxActiveTraits) newActiveTraits.push(value);
                                                        else { e.target.checked = false; showMessage(`Máximo de ${prev.maxActiveTraits} traços atingido.`, 2000); }
                                                    } else newActiveTraits = newActiveTraits.filter(id => id !== value);
                                                    return { ...prev, activeTraits: newActiveTraits };
                                                });
                                            }}
                                        />
                                        <div><h4 className="text-md font-semibold text-slate-100 flex items-center gap-2"><i className={`${trait.icon} text-violet-300`}></i> {trait.name}</h4><p className="text-xs text-slate-300">{trait.description}</p></div>
                                    </label>
                                ))
                            ) : <p className="text-sm text-slate-400 text-center">Nenhum traço desbloqueado. Verifique as conquistas!</p>}
                        </div>
                        <button onClick={() => handleTraitSelectionConfirm(gameState.activeTraits)} className="mt-6 w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-700">Confirmar Traços e Transcender</button>
                    </Modal>

                    <Modal isOpen={gameState.showEventModal && !!gameState.currentEventData} onClose={() => setGameState(prev => ({...prev, showEventModal: false, currentEventData: null}))} title={gameState.currentEventData?.name || "Evento Misterioso"} contentClassName="max-w-lg">
                        {gameState.currentEventData && (<div> <p className="text-sm text-slate-300 mb-4">{gameState.currentEventData.description}</p> <div className="space-y-3"> {gameState.currentEventData.options.map((option, index) => ( <button key={index} onClick={() => applyEventEffect(gameState.currentEventData!.id, index)} className="w-full bg-slate-600 hover:bg-slate-500 text-slate-100 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-left text-sm hover:scale-103 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-700"> <p className="font-semibold">{option.text}</p><p className="text-xs text-slate-400 mt-1">Efeito: {option.consequence}</p></button>))}</div></div>)}
                    </Modal>

                    <Modal isOpen={gameState.showAchievementPopup && !!gameState.achievementPopupData} onClose={() => setGameState(prev => ({...prev, showAchievementPopup: false, achievementPopupData: null}))} title="Nova Conquista!" contentClassName="max-w-sm !bg-gradient-to-br !from-green-600 !via-emerald-600 !to-teal-700" modalClassName="!p-0">
                        {gameState.achievementPopupData && (<div className="text-center p-6 rounded-xl border-2 border-yellow-400 shadow-yellow-500/50 shadow-lg"><i className={`${gameState.achievementPopupData.icon} text-6xl text-yellow-300 mb-4 block animate-bounce`}></i><h4 className="text-xl font-semibold text-yellow-100">{gameState.achievementPopupData.name}</h4></div>)}
                    </Modal>
                    
                    <Modal isOpen={gameState.showSettingsModal} onClose={() => setGameState(prev => ({...prev, showSettingsModal: false}))} title="Configurações">
                        <SettingsModalContent gameState={gameState} setGameState={setGameState} />
                    </Modal>

                    <Modal isOpen={gameState.showOfflineGainModal && !!gameState.offlineGainData} onClose={() => setGameState(prev => ({...prev, showOfflineGainModal: false, offlineGainData: null}))} title="Ganhos Offline">
                        {gameState.offlineGainData && (<div className="text-center"><i className="fas fa-bed text-5xl text-sky-400 mb-4 block"></i><p className="text-slate-200 text-sm">Offline por <span className="font-semibold text-sky-300">{formatTime(gameState.offlineGainData.time)}</span>.</p><p className="text-slate-200 text-sm mt-1">Acumulou <span className="font-semibold text-amber-300">{formatNumber(gameState.offlineGainData.gain)}</span> PI!</p></div>)}
                    </Modal>

                    <Modal isOpen={gameState.showTranscendenceInfoModal && !!gameState.transcendenceInfoData} modalClassName="max-w-lg" contentClassName="bg-gradient-to-b from-purple-800 to-indigo-900 !p-0" onClose={() => setGameState(prev => ({...prev, showTranscendenceInfoModal: false}))}>
                        {gameState.transcendenceInfoData && (
                        <div className="flex flex-col gap-4 text-white p-6 rounded-xl">
                            <h3 className="text-2xl font-bold text-center text-yellow-300">Transcendência #{formatNumber(gameState.transcendenceInfoData.currentTranscendenceCount.plus(1))}</h3>
                            <p className="text-sm text-center text-slate-300">PI Acumulado: {formatNumber(gameState.transcendenceInfoData.accumulatedPI)}</p>
                            <p className="text-sm text-center text-slate-300">ET a Ganhar (base): <span className="text-pink-400">{formatNumber(gameState.transcendenceInfoData.etToGainNext)}</span></p>
                            <p className="text-sm text-center text-slate-300">Novo Bônus Global (aprox.): +{formatNumber(gameState.transcendenceInfoData.newGlobalMultiplierPercentage)}%</p>
                            
                            <div className="my-2">
                                <h4 className="text-md font-semibold text-center text-violet-300 mb-2">Marcos da Transcendência:</h4>
                                <ul className="text-xs list-disc list-inside pl-4 text-slate-300 space-y-1">
                                    {gameState.transcendenceInfoData.milestones.map(m => (
                                        <li key={m.count} className={m.isAchieved ? 'text-green-400 font-semibold' : 'text-slate-400'}>
                                            {m.count} Transc.: {m.description} {
                                                m.value && typeof m.value !== 'string' && typeof m.value !== 'number' 
                                                ? `(Valor: ${formatNumber(m.value as Decimal)})` 
                                                : m.value 
                                                  ? `(${m.value.toString()})` 
                                                  : ''
                                            } {m.isAchieved && <i className="fas fa-check-circle ml-1"></i>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p className="text-sm text-center font-semibold text-yellow-200 mt-2">Escolha seu caminho para esta transcendência:</p>
                            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                <button 
                                    onClick={() => finalizeTranscendence('essence')} 
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-purple-800"
                                >
                                    <i className="fas fa-leaf mr-2"></i>Caminho da Essência <span className="block text-xs font-normal">(+5 ET Bônus)</span>
                                </button>
                                <button 
                                    onClick={() => finalizeTranscendence('rupture')} 
                                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-red-600 hover:to-rose-700 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-purple-800"
                                >
                                    <i className="fas fa-meteor mr-2"></i>Caminho da Ruptura <span className="block text-xs font-normal">(Produção Global x2 por 5min)</span>
                                </button>
                            </div>
                            <button onClick={() => setGameState(prev => ({...prev, showTranscendenceInfoModal: false}))} className="mt-4 w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">Cancelar</button>
                        </div>
                        )}
                    </Modal>

                     {/* Embryo Inventory Modal */}
                    <Modal
                        isOpen={gameState.showEmbryoInventoryModal}
                        onClose={handleCloseEmbryoInventoryModal}
                        title="Inventário do Embrião"
                        modalClassName="max-w-xl" // Larger modal for inventory
                    >
                        {gameState.currentSlotToEquip && (
                            <EmbryoInventoryModalContent
                                inventory={gameState.embryoInventory}
                                currentSlot={gameState.currentSlotToEquip}
                                allItemsData={gameState.embryoShopItems} // Assuming shop items are all possible items for now
                                onEquipItem={handleEquipEmbryoItemFromModal}
                                onClose={handleCloseEmbryoInventoryModal}
                            />
                        )}
                    </Modal>

                </div>
            </div>
            <footer className="w-full text-center p-4 text-xs text-slate-500">
                Ovo Clicker {GAME_SAVE_KEY.split('_').pop()} - New Traits Implemented. Build: {new Date().getTime()}
            </footer>
        </React.Fragment>
    );
};
