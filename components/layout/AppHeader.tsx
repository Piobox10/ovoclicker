import React from 'react';
import { useGameContext } from '../../contexts/GameContext';

const AppHeader: React.FC = () => {
  const {
    gameState, setGameState,
    isSkinsPanelOpen, setIsSkinsPanelOpen,
    toggleEggTeamBattlePanel,
    isFixedEggShopPanelOpen, setIsFixedEggShopPanelOpen,
    isCollectibleEggsPanelOpen, setIsCollectibleEggsPanelOpen,
    isHiddenDiscoveriesPanelOpen, setIsHiddenDiscoveriesPanelOpen,
    isCosmicBankPanelOpen, setIsCosmicBankPanelOpen,
    isAchievementsPanelOpen, setIsAchievementsPanelOpen,
    isSummaryPanelOpen, setIsSummaryPanelOpen,
    addTestPIData,
  } = useGameContext();

  const showHiddenDiscoveriesPanelAccess = gameState.hiddenDiscoveriesData?.some(d => d.isDiscovered) ?? false;
  const isBattlePanelActive = gameState.eggTeamBattleState.isActive || gameState.eggTeamBattleState.isTeamSetupActive;


  const getButtonBaseClasses = "p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]";
  const getButtonInactiveClasses = "bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:ring-[var(--focus-ring-color)]";
  const getButtonActiveClasses = (colorName: string, textDark: boolean = false) => {
    const textClass = textDark ? "text-slate-800" : "text-white";
    return `bg-${colorName}-500 hover:bg-${colorName}-600 ${textClass} focus:ring-${colorName}-400`;
  };

  return (
    <div className="header-row flex justify-between items-center mb-0 sm:mb-2">
      <h1 className="text-[var(--text-accent)] text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
        Ovo Clicker: <span className="text-[var(--text-accent-hover)]">React Edition</span>
      </h1>
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
        <button onClick={() => setIsSkinsPanelOpen(prev => !prev)} className={`${getButtonBaseClasses} ${isSkinsPanelOpen ? getButtonActiveClasses("teal") : getButtonInactiveClasses}`} aria-label="Temas Visuais" title="Temas Visuais">
          <i className="fas fa-palette text-base sm:text-lg"></i>
        </button>
        <button onClick={toggleEggTeamBattlePanel} className={`${getButtonBaseClasses} ${isBattlePanelActive ? getButtonActiveClasses("purple") : getButtonInactiveClasses}`} aria-label="Batalha de Ovos" title="Batalha de Ovos">
          <i className="fas fa-chess-knight text-base sm:text-lg"></i>
        </button>
        <button onClick={() => setIsFixedEggShopPanelOpen(prev => !prev)} className={`${getButtonBaseClasses} ${isFixedEggShopPanelOpen ? getButtonActiveClasses("orange") : getButtonInactiveClasses}`} aria-label="Loja de Ovos Fixos" title="Loja de Ovos Fixos">
          <i className="fas fa-store text-base sm:text-lg"></i>
        </button>
        <button onClick={() => setIsCollectibleEggsPanelOpen(prev => !prev)} className={`${getButtonBaseClasses} ${isCollectibleEggsPanelOpen ? getButtonActiveClasses("amber", true) : getButtonInactiveClasses}`} aria-label="Ovos Colecionáveis" title="Ovos Colecionáveis">
          <i className="fas fa-egg text-base sm:text-lg"></i>
        </button>
        {showHiddenDiscoveriesPanelAccess && (
          <button onClick={() => setIsHiddenDiscoveriesPanelOpen(prev => !prev)} className={`${getButtonBaseClasses} ${isHiddenDiscoveriesPanelOpen ? getButtonActiveClasses("purple") : getButtonInactiveClasses}`} aria-label="Descobertas Secretas" title="Descobertas Secretas">
            <i className="fas fa-low-vision text-base sm:text-lg"></i>
          </button>
        )}
        <button onClick={() => setIsCosmicBankPanelOpen(prev => !prev)} className={`${getButtonBaseClasses} ${isCosmicBankPanelOpen ? getButtonActiveClasses("green") : getButtonInactiveClasses}`} aria-label="Banco Cósmico" title="Banco Cósmico">
          <i className="fas fa-landmark text-base sm:text-lg"></i>
        </button>
        <button onClick={() => setIsAchievementsPanelOpen(prev => !prev)} className={`${getButtonBaseClasses} ${isAchievementsPanelOpen ? getButtonActiveClasses("yellow", true) : getButtonInactiveClasses}`} aria-label="Conquistas" title="Conquistas">
          <i className="fas fa-trophy text-base sm:text-lg"></i>
        </button>
        <button onClick={() => setIsSummaryPanelOpen(prev => !prev)} className={`${getButtonBaseClasses} ${isSummaryPanelOpen ? getButtonActiveClasses("slate", true) : getButtonInactiveClasses}`} aria-label="Sumário de Aquisições" title="Sumário de Aquisições">
          <i className="fas fa-archive text-base sm:text-lg"></i>
        </button>
        <button onClick={() => setGameState(prev => ({ ...prev, showSettingsModal: true }))} className={`${getButtonBaseClasses} ${gameState.showSettingsModal ? getButtonActiveClasses("indigo") : getButtonInactiveClasses}`} aria-label="Configurações" title="Configurações">
          <i className="fas fa-cog text-base sm:text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default AppHeader;