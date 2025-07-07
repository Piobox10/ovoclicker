
import React from 'react';
import Modal from '../Modal';
import { useGameContext } from '../../contexts/GameContext';
import {
    SettingsModalContent, TranscendencePanel, EmbryoInventoryModalContent,
    SkinsPanel, DailyMissionsPanel, CollectibleEggsPanel, CollectibleEggDetailModal,
    FixedEggShopPanel, EggTeamBattlePanel, PostBattleChoiceModal,
    SacredRelicChoiceModal, CosmicBankPanel, AchievementsPanel,
    PurchasedUpgradesListPanel, HiddenDiscoveriesPanel
} from '../panels';
import { formatNumber, formatTime } from '../../utils';
import { TRAITS, COLLECTIBLE_EGG_DEFINITIONS } from '../../constants';

export const AppModals: React.FC = () => {
    const {
        gameState, setGameState,
        isSkinsPanelOpen, setIsSkinsPanelOpen,
        isCollectibleEggsPanelOpen, setIsCollectibleEggsPanelOpen,
        isFixedEggShopPanelOpen, setIsFixedEggShopPanelOpen,
        isCosmicBankPanelOpen, setIsCosmicBankPanelOpen,
        isAchievementsPanelOpen, setIsAchievementsPanelOpen,
        isSummaryPanelOpen, setIsSummaryPanelOpen,
        isHiddenDiscoveriesPanelOpen, setIsHiddenDiscoveriesPanelOpen,
        toggleEggTeamBattlePanel,
        handleNicknameConfirm, handleTraitSelectionConfirm, applyEventEffect,
        handleCloseEmbryoInventoryModal, handleEquipEmbryoItemFromModal,
        buySkin, setActiveSkin, claimMissionReward,
        handleOpenCollectibleEggDetail, showCollectibleEggDetailModal,
        selectedCollectibleEggForDetail, handleCloseCollectibleEggDetail,
        handleBuyFixedEggFromShop,
        handleSelectSacredRelic,
        handleBankDeposit, handleBankWithdraw,
        buyGenericUpgradeHandler,
        finalizeTranscendence,
        showMessage,
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
        handleConfirmPrimordialTrigger,
        handleCancelPrimordialTrigger,
    } = useGameContext() as any; 

    return (
        <>
            {(gameState.eggTeamBattleState.isActive || gameState.eggTeamBattleState.isTeamSetupActive) && (
                <EggTeamBattlePanel
                    eggTeamBattleState={gameState.eggTeamBattleState}
                    collectibleEggs={gameState.collectibleEggs}
                    onTogglePause={toggleEggTeamBattlePause}
                    onMinimize={toggleEggTeamBattlePanel}
                    onChangeCombatSpeed={changeCombatSpeed}
                    onSelectEggForPlacement={selectEggForTeamPlacement}
                    onPlaceEggInSlot={placeEggInTeamSlot}
                    onRemoveEggFromSlot={removeEggFromTeamSlot}
                    onStartBattle={handleStartBattle}
                    onStartExpedition={handleStartExpedition}
                    onContinueExpedition={handleContinueExpedition}
                    onEndExpeditionEarly={handleEndExpeditionEarly}
                    onRetryExpedition={handleRetryExpedition}
                    setGameState={setGameState}
                />
            )}
            
            {isSkinsPanelOpen && <SkinsPanel gameState={gameState} onBuySkin={buySkin} onSetActiveSkin={setActiveSkin} isOpen={isSkinsPanelOpen} onClose={() => setIsSkinsPanelOpen(false)} />}
            {isCollectibleEggsPanelOpen && <CollectibleEggsPanel gameState={gameState} onOpenDetailModal={handleOpenCollectibleEggDetail} isOpen={isCollectibleEggsPanelOpen} onClose={() => setIsCollectibleEggsPanelOpen(false)} />}
            {showCollectibleEggDetailModal && <CollectibleEggDetailModal isOpen={showCollectibleEggDetailModal} onClose={handleCloseCollectibleEggDetail} eggInstance={selectedCollectibleEggForDetail} eggDefinition={COLLECTIBLE_EGG_DEFINITIONS.find(def => def.id === selectedCollectibleEggForDetail?.definitionId) || null} />}
            {isFixedEggShopPanelOpen && <FixedEggShopPanel gameState={gameState} onBuyEgg={handleBuyFixedEggFromShop} isOpen={isFixedEggShopPanelOpen} onClose={() => setIsFixedEggShopPanelOpen(false)} />}
            {isCosmicBankPanelOpen && <CosmicBankPanel gameState={gameState} onDeposit={handleBankDeposit} onWithdraw={handleBankWithdraw} isOpen={isCosmicBankPanelOpen} onClose={() => setIsCosmicBankPanelOpen(false)} />}
            {isAchievementsPanelOpen && <AchievementsPanel gameState={gameState} isOpen={isAchievementsPanelOpen} onClose={() => setIsAchievementsPanelOpen(false)} />}
            {isSummaryPanelOpen && <PurchasedUpgradesListPanel gameState={gameState} isOpen={isSummaryPanelOpen} onClose={() => setIsSummaryPanelOpen(false)} />}
            {isHiddenDiscoveriesPanelOpen && <HiddenDiscoveriesPanel gameState={gameState} isOpen={isHiddenDiscoveriesPanelOpen} onClose={() => setIsHiddenDiscoveriesPanelOpen(false)} />}
            
            {gameState.eggTeamBattleState.showPostBattleChoiceModal && <PostBattleChoiceModal isOpen={gameState.eggTeamBattleState.showPostBattleChoiceModal} onClose={() => setGameState((prev: any) => ({ ...prev, eggTeamBattleState: { ...prev.eggTeamBattleState, showPostBattleChoiceModal: false } }))} choices={gameState.eggTeamBattleState.availablePostBattleChoices} onSelectChoice={handlePostBattleChoiceSelection} onSelectTargetedChoice={handleTargetedRewardSelection} isAwaitingTarget={gameState.eggTeamBattleState.isAwaitingTarget} />}
            {gameState.showSacredRelicChoiceModal && <SacredRelicChoiceModal isOpen={gameState.showSacredRelicChoiceModal} relics={gameState.availableSacredRelicChoices} onSelectRelic={handleSelectSacredRelic} />}

            <Modal isOpen={gameState.showNicknameModal} title="Defina seu Apelido" onClose={() => setGameState((prev:any) => ({...prev, showNicknameModal: false, showTraitModal: false }))}>
                <form onSubmit={(e) => { e.preventDefault(); handleNicknameConfirm((e.target as any).nickname.value); }}>
                    <input type="text" name="nickname" defaultValue={gameState.userNickname === 'Jogador' ? '' : gameState.userNickname} placeholder="Seu apelido aqui..." className="w-full p-3 bg-[var(--bg-interactive)] border border-[var(--border-interactive)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:border-[var(--border-accent)] outline-none transition-shadow" maxLength={30} />
                    <button type="submit" className="mt-4 w-full bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-on-button-primary)] font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]">Confirmar</button>
                </form>
            </Modal>

            <Modal isOpen={gameState.showTraitModal} title="Escolha seus Traços" onClose={() => setGameState((prev: any) => ({...prev, showTraitModal: false}))}>
                <div className="max-h-80 overflow-y-auto p-1 custom-scrollbar">
                    {TRAITS.filter(trait => gameState.unlockedTraits.includes(trait.id)).length > 0 ? (
                        TRAITS.filter(trait => gameState.unlockedTraits.includes(trait.id)).map(trait => (
                            <label key={trait.id} className="flex items-start p-3 mb-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] rounded-lg border border-[var(--border-interactive)] cursor-pointer transition-colors has-[:checked]:bg-violet-700 has-[:checked]:border-violet-500 has-[:checked]:ring-2 has-[:checked]:ring-violet-400">
                                <input type="checkbox" value={trait.id} className="mr-3 mt-1 h-5 w-5 text-violet-500 bg-slate-600 border-slate-500 rounded focus:ring-violet-400 focus:ring-offset-slate-800" defaultChecked={gameState.activeTraits.includes(trait.id)}
                                    onChange={(e) => {
                                        const { value, checked } = e.target;
                                        setGameState((prev: any) => {
                                            let newActiveTraits = [...prev.activeTraits];
                                            if (checked) {
                                                if (newActiveTraits.length < prev.maxActiveTraits) newActiveTraits.push(value);
                                                else { e.target.checked = false; showMessage(`Máximo de ${prev.maxActiveTraits} traços atingido.`, 2000); }
                                            } else newActiveTraits = newActiveTraits.filter(id => id !== value);
                                            return { ...prev, activeTraits: newActiveTraits };
                                        });
                                    }}
                                />
                                <div><h4 className="text-md font-semibold text-[var(--text-primary)] flex items-center gap-2"><i className={`${trait.icon} text-[var(--text-accent)]`}></i> {trait.name}</h4><p className="text-xs text-[var(--text-secondary)]">{trait.description}</p></div>
                            </label>
                        ))
                    ) : <p className="text-sm text-[var(--text-secondary)] text-center">Nenhum traço desbloqueado. Verifique as conquistas!</p>}
                </div>
                <button 
                    onClick={() => handleTraitSelectionConfirm(gameState.activeTraits)} 
                    className="mt-6 w-full bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-on-button-primary)] font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]"
                >
                    {gameState.unlockedTraits.length === 0 ? "Transcender (Sem Traços)" : "Confirmar Traços e Transcender"}
                </button>
            </Modal>

            <Modal isOpen={gameState.showEventModal && !!gameState.currentEventData} onClose={() => setGameState((prev:any) => ({...prev, showEventModal: false, currentEventData: null}))} title={gameState.currentEventData?.name || "Evento Misterioso"} contentClassName="max-w-lg">
                {gameState.currentEventData && (<div> <p className="text-sm text-[var(--text-secondary)] mb-4">{gameState.currentEventData.description}</p> <div className="space-y-3"> {gameState.currentEventData.options.map((option: any, index: number) => ( <button key={index} onClick={() => applyEventEffect(gameState.currentEventData!.id, index)} className="w-full bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-[var(--text-primary)] font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-left hover:scale-103 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]"> <div> <p className="font-semibold">{option.text}</p> <p className="text-xs text-[var(--text-secondary)] mt-0.5">{option.consequence}</p> </div> </button> ))} </div> </div>)}
            </Modal>

            <Modal isOpen={gameState.showAchievementPopup && !!gameState.achievementPopupData} onClose={() => setGameState((prev: any) => ({...prev, showAchievementPopup: false, achievementPopupData: null}))} title="Conquista Desbloqueada!" contentClassName="max-w-sm">
                {gameState.achievementPopupData && ( <div className="text-center"> <i className={`${gameState.achievementPopupData.icon} text-5xl text-yellow-400 mb-3 animate-bounce`}></i> <p className="text-lg font-semibold text-yellow-300">{gameState.achievementPopupData.name}</p> </div> )}
            </Modal>
            
            <Modal isOpen={gameState.showSettingsModal} onClose={() => setGameState((prev:any) => ({...prev, showSettingsModal: false}))} title="Configurações">
                <SettingsModalContent gameState={gameState} setGameState={setGameState} />
            </Modal>

            <Modal isOpen={gameState.showOfflineGainModal && !!gameState.offlineGainData} onClose={() => setGameState((prev: any) => ({...prev, showOfflineGainModal: false, offlineGainData: null}))} title="Ganhos Offline">
                {gameState.offlineGainData && ( <div className="text-center"> <i className="fas fa-bed text-5xl text-sky-400 mb-3"></i> <p className="text-lg font-semibold text-sky-300">Você ganhou {formatNumber(gameState.offlineGainData.gain)} PI</p> <p className="text-sm text-[var(--text-secondary)]">enquanto esteve fora por {formatTime(gameState.offlineGainData.time)}.</p> </div> )}
            </Modal>

            {gameState.showTranscendenceInfoModal && gameState.transcendenceInfoData && (
                <Modal isOpen={gameState.showTranscendenceInfoModal} onClose={() => setGameState((prev: any) => ({...prev, showTranscendenceInfoModal: false, transcendenceInfoData: null}))} title="Transcender!" contentClassName="max-w-2xl">
                    <TranscendencePanel transcendenceInfoData={gameState.transcendenceInfoData} />
                </Modal>
            )}

            {gameState.showEmbryoInventoryModal && (
                <Modal isOpen={gameState.showEmbryoInventoryModal} onClose={handleCloseEmbryoInventoryModal} title="Inventário do Embrião">
                    <EmbryoInventoryModalContent inventory={gameState.embryoInventory} currentSlot={gameState.currentSlotToEquip} allItemsData={gameState.embryoInventory} onEquipItem={handleEquipEmbryoItemFromModal} onClose={handleCloseEmbryoInventoryModal} />
                </Modal>
            )}

            <Modal isOpen={gameState.showPrimordialTriggerModal} onClose={handleCancelPrimordialTrigger} title="Confirmar Gatilho Primordial">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4 animate-pulse"></i>
                    <p className="text-lg font-semibold text-slate-100 mb-2">Sacrificar Progresso?</p>
                    <p className="text-sm text-slate-300 mb-4">
                        Esta ação irá resetar o nível de <strong className="text-red-400">todas as suas Melhorias Regulares</strong> e zerar todo o seu <strong className="text-red-400">Poder de Incubação</strong> atual.
                        Em troca, você receberá <strong className="text-amber-400">1 Ovo Temporário</strong>.
                        <br/><br/>
                        <strong className="text-red-400">Esta ação é irreversível nesta run.</strong> Deseja continuar?
                    </p>
                    <button
                        onClick={handleConfirmPrimordialTrigger}
                        className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-600/30"
                    >
                        <i className="fas fa-bomb mr-2"></i>
                        Confirmar e Sacrificar
                    </button>
                </div>
            </Modal>
        </>
    );
};
