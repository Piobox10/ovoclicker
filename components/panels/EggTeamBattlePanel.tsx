import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EggTeamBattleState, FloatingText, PlayerCollectibleEgg, CollectibleEggDefinition, BattleEgg, BattleStatusEffectInstance, BattleReward, ExpeditionRewardOption } from '../../types';
import { formatNumber } from '../../utils'; 
import BattleTeamDisplay from './BattleTeamDisplay';
import BattleEggCard from './BattleEggCard';
import { COMBAT_SPEED_OPTIONS, COLLECTIBLE_EGG_RARITY_STYLES, MAX_TEAM_SIZE, EXPEDITION_MAX_STAGES, EXPEDITION_STAGES_CONFIG, BATTLE_EGG_RARITY_STYLES } from '../../constants';
import { ABILITY_DEFINITIONS } from '../../constants/abilities';
import { STATUS_EFFECT_DEFINITIONS } from '../../constants/statusEffects';
import { COLLECTIBLE_EGG_DEFINITIONS } from '../../constants/collectibles';
import AcquiredRewardsPanel from './AcquiredRewardsPanel';


interface EggTeamBattlePanelProps {
  eggTeamBattleState: EggTeamBattleState;
  collectibleEggs: PlayerCollectibleEgg[];
  onTogglePause: () => void;
  onMinimize: () => void;
  onChangeCombatSpeed: () => void;
  onSelectEggForPlacement: (inventoryEggInstanceId: string) => void;
  onPlaceEggInSlot: (slotIndex: number) => void;
  onRemoveEggFromSlot: (slotIndex: number) => void;
  onStartBattle: () => void;
  onStartExpedition: () => void;
  onContinueExpedition: () => void; 
  onEndExpeditionEarly: () => void;
  onRetryExpedition: () => void; // New callback
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const EggTeamBattlePanel: React.FC<EggTeamBattlePanelProps> = ({
  eggTeamBattleState,
  collectibleEggs,
  onTogglePause,
  onMinimize,
  onChangeCombatSpeed,
  onSelectEggForPlacement,
  onPlaceEggInSlot,
  onRemoveEggFromSlot,
  onStartBattle,
  onStartExpedition,
  onContinueExpedition,
  onEndExpeditionEarly,
  onRetryExpedition,
  setGameState
}) => {
  const {
    battleName,
    currentRound,
    totalRounds,
    combatSpeed,
    isPaused,
    enemyTeam,
    playerTeam,
    battleLog,
    floatingTexts,
    isTeamSetupActive,
    playerTeamLineup,
    selectedInventoryEggInstanceIdForPlacement,
    currentActingEggId,
    battlePhase,
    isBattleOver,
    winner,
    battleStats,
    battleRewards,
    isExpeditionMode,
    currentExpeditionStage,
    expeditionOutcome,
    acquiredExpeditionUpgrades,
  } = eggTeamBattleState;

  const [eggPositions, setEggPositions] = useState<Record<string, { top: number; left: number; width: number; height: number }>>({});
  const battleArenaRef = useRef<HTMLDivElement>(null);
  const [roundKey, setRoundKey] = useState(0);

  useEffect(() => {
    // Animate round number change
    setRoundKey(prevKey => prevKey + 1);
  }, [currentRound]);


  const updateEggPositions = useCallback(() => {
    if (!battleArenaRef.current) return;
    const arenaRect = battleArenaRef.current.getBoundingClientRect();
    const newPositions: Record<string, { top: number; left: number; width: number; height: number }> = {};

    [...playerTeam, ...enemyTeam].forEach(egg => {
        const el = document.getElementById(`battle-egg-${egg.instanceId}`);
        if (el) {
            const rect = el.getBoundingClientRect();
            newPositions[egg.instanceId] = {
                top: rect.top - arenaRect.top,
                left: rect.left - arenaRect.left,
                width: rect.width,
                height: rect.height,
            };
        }
    });
    setEggPositions(newPositions);
  }, [playerTeam, enemyTeam]);

  useEffect(() => {
    updateEggPositions();
    const debouncedUpdate = setTimeout(() => updateEggPositions(), 50);

    window.addEventListener('resize', updateEggPositions);
    return () => {
        window.removeEventListener('resize', updateEggPositions);
        clearTimeout(debouncedUpdate);
    };
  }, [playerTeam, enemyTeam, updateEggPositions]);

    const handleFloatingTextAnimationEnd = useCallback((id: string) => {
        if (setGameState) {
            setGameState(prev => ({
                ...prev,
                eggTeamBattleState: {
                    ...prev.eggTeamBattleState,
                    floatingTexts: prev.eggTeamBattleState.floatingTexts.filter(ft => ft.id !== id),
                }
            }));
        }
    }, [setGameState]);

  if (!isTeamSetupActive && !eggTeamBattleState.isActive) {
    return null;
  }

  if (isTeamSetupActive) {
    const getEggDefinition = (definitionId: string): CollectibleEggDefinition | undefined => {
      return COLLECTIBLE_EGG_DEFINITIONS.find(def => def.id === definitionId);
    };

    return (
      <div className="egg-team-battle-panel fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-40 flex flex-col p-2 sm:p-4 text-slate-100">
        <div className="panel-header flex justify-between items-center p-2 sm:p-3 bg-slate-800/80 rounded-t-lg">
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            Preparar Time para: {battleName}
          </h2>
          <button
            onClick={onMinimize}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 sm:px-3 text-xs sm:text-sm rounded shadow-md hover:scale-105 active:scale-95"
            aria-label="Fechar Painel de Batalha"
          >
            <i className="fas fa-times sm:mr-1"></i>
            <span className="hidden sm:inline">Fechar</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-800/50 rounded-b-lg custom-scrollbar">
          <div className="inventory-selection bg-slate-700/70 p-3 rounded-lg">
            <h3 className="text-md font-semibold mb-2 text-center text-amber-300">Seu Inventário de Ovos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {collectibleEggs.map(eggInstance => {
                const def = getEggDefinition(eggInstance.definitionId);
                if (!def) return null;
                const rarityStyle = COLLECTIBLE_EGG_RARITY_STYLES[def.rarity] || COLLECTIBLE_EGG_RARITY_STYLES['Comum'];
                const isSelected = selectedInventoryEggInstanceIdForPlacement === eggInstance.instanceId;
                const isInTeam = playerTeamLineup.some(battleEgg => battleEgg?.instanceId === eggInstance.instanceId);

                return (
                  <div
                    key={eggInstance.instanceId}
                    onClick={() => !isInTeam && onSelectEggForPlacement(eggInstance.instanceId)}
                    className={`p-2 rounded border-2 ${
                      isSelected ? `ring-2 ring-offset-2 ring-offset-slate-700 ${rarityStyle.border} ring-lime-400` : rarityStyle.border
                    } ${rarityStyle.bg} ${isInTeam ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}`}
                  >
                    <i className={`${def.icon} ${rarityStyle.text} text-2xl block text-center mb-1`}></i>
                    <p className={`text-[10px] font-bold ${rarityStyle.nameColor} truncate text-center`} title={def.name}>
                      {def.name}
                    </p>
                    <p className={`text-[9px] ${rarityStyle.text} text-center`}>({def.rarity})</p>
                    {isInTeam && <p className="text-[8px] text-center text-slate-400 mt-0.5">(No Time)</p>}
                  </div>
                );
              })}
              {collectibleEggs.length === 0 && <p className="text-xs text-slate-400 col-span-full text-center py-3">Nenhum ovo no inventário.</p>}
            </div>
          </div>

          <div className="team-lineup-slots bg-slate-700/70 p-3 rounded-lg">
            <h3 className="text-md font-semibold mb-2 text-center text-sky-300">Seu Time (Máx: {MAX_TEAM_SIZE})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Array.from({ length: MAX_TEAM_SIZE }).map((_, index) => {
                const battleEggInSlot = playerTeamLineup[index];
                const def = battleEggInSlot ? getEggDefinition(battleEggInSlot.definitionId) : null;
                const rarityStyle = def ? (COLLECTIBLE_EGG_RARITY_STYLES[def.rarity] || COLLECTIBLE_EGG_RARITY_STYLES['Comum']) : COLLECTIBLE_EGG_RARITY_STYLES['Comum'];

                return (
                  <div
                    key={index}
                    onClick={() => onPlaceEggInSlot(index)}
                    className={`h-24 sm:h-28 p-2 rounded border-2 border-dashed ${
                      selectedInventoryEggInstanceIdForPlacement && !battleEggInSlot ? 'border-lime-400 bg-lime-700/30 hover:bg-lime-600/40 cursor-pointer' : 'border-slate-600 bg-slate-800/50'
                    } flex flex-col items-center justify-center text-center`}
                  >
                    {battleEggInSlot && def ? (
                      <>
                        <i className={`${def.icon} ${rarityStyle.text} text-3xl block mb-1`}></i>
                        <p className={`text-[10px] font-bold ${rarityStyle.nameColor} truncate w-full`} title={def.name}>
                          {def.name}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveEggFromSlot(index); }}
                          className="text-[9px] bg-red-500 hover:bg-red-600 text-white px-1.5 py-0.5 rounded mt-1"
                        >
                          Remover
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500">{selectedInventoryEggInstanceIdForPlacement ? 'Colocar Aqui' : 'Vazio'}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
            <button
              onClick={onStartBattle}
              disabled={playerTeamLineup.every(egg => egg === null)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-play mr-2"></i>Iniciar Batalha Amistosa
            </button>
            <button
              onClick={onStartExpedition}
              disabled={playerTeamLineup.every(egg => egg === null)}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-hiking mr-2"></i>Iniciar Expedição
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (isExpeditionMode && battlePhase === 'expedition_inter_stage_reward') {
    // Retorna null para remover a tela "Avançando na expedição..."
    // O AppModals.tsx será responsável por exibir o PostBattleChoiceModal.
    return null;
  }

  const showFinalEndScreenForPanel = 
    (!isExpeditionMode && isBattleOver) || 
    (isExpeditionMode && (expeditionOutcome || battlePhase === 'battle_over_expedition_stage_victory')); 


  if (showFinalEndScreenForPanel) {
    let title = "Fim da Batalha";
    let message = "A batalha terminou.";
    let isVictory = false;

    if (battlePhase === 'battle_over_expedition_stage_victory') {
        isVictory = true;
        title = `Vitória no Estágio ${currentExpeditionStage}!`;
        message = `Você venceu o estágio ${currentExpeditionStage} da expedição.`;
    } else if (isExpeditionMode && expeditionOutcome) {
        isVictory = expeditionOutcome === 'victory';
        title = isVictory ? 'Vitória na Expedição!' : 'Fim da Expedição';
        message = isVictory 
            ? `Você conquistou todos os ${EXPEDITION_MAX_STAGES} estágios!` 
            : `Você foi derrotado no estágio ${currentExpeditionStage}.`;
    } else if (!isExpeditionMode && isBattleOver) {
        isVictory = winner === 'player';
        title = winner === 'player' ? 'Vitória!' : winner === 'enemy' ? 'Derrota!' : 'Empate!';
        message = winner === 'player' ? 'Seu time venceu a batalha!' : winner === 'enemy' ? 'Seu time foi derrotado.' : 'A batalha terminou em empate.';
    }


    return (
      <div className="egg-team-battle-panel fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-4 text-slate-100">
        <i className={`fas ${isVictory ? 'fa-trophy text-yellow-400' : 'fa-skull-crossbones text-red-400'} text-6xl mb-4`}></i>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg mb-4">{message}</p>
        
        {isExpeditionMode && battlePhase === 'battle_over_expedition_stage_victory' && (
             <div className="bg-slate-800 p-4 rounded-lg mb-4 text-sm text-center">
                <p>Dano Causado neste Estágio:</p>
                <ul className="text-xs space-y-1 mt-1">
                {playerTeam.filter(egg => battleStats.damageDealtByEgg[egg.instanceId] && new Decimal(battleStats.damageDealtByEgg[egg.instanceId] || '0').gt(0))
                    .map(egg => (
                        <li key={egg.instanceId} className="flex justify-between items-center">
                        <span className="text-slate-300 flex items-center">
                            <i className={`${egg.icon} mr-1.5 ${BATTLE_EGG_RARITY_STYLES[egg.rarity]?.text || 'text-slate-300'}`}></i>
                            {egg.name}:
                        </span>
                        <span className="font-semibold text-sky-300">{formatNumber(new Decimal(battleStats.damageDealtByEgg[egg.instanceId] || '0'))}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        {isExpeditionMode && expeditionOutcome && (
          <div className="bg-slate-800 p-4 rounded-lg mb-4 text-sm text-center">
            <p>Dano Total Causado na Expedição: <span className="font-semibold text-sky-300">{formatNumber(eggTeamBattleState.expeditionDamageDealt)}</span></p>
            <p>Ovos Aliados Perdidos na Expedição: <span className="font-semibold text-red-300">{eggTeamBattleState.expeditionEggsDefeated}</span></p>
            <p>Estágios Completos: <span className="font-semibold text-green-300">{expeditionOutcome === 'victory' ? EXPEDITION_MAX_STAGES : currentExpeditionStage -1}</span></p>
          </div>
        )}

        {(!isExpeditionMode || expeditionOutcome) && battleStats && Object.keys(battleStats.damageDealtByEgg).length > 0 && battlePhase !== 'battle_over_expedition_stage_victory' && (
            <div className="bg-slate-700/50 p-3 rounded-lg mb-3 w-full max-w-md">
                <h3 className="text-md font-semibold text-slate-200 mb-2 text-center">Estatísticas de Dano (Aliados):</h3>
                <ul className="text-xs space-y-1">
                {playerTeam.filter(egg => battleStats.damageDealtByEgg[egg.instanceId] && new Decimal(battleStats.damageDealtByEgg[egg.instanceId] || '0').gt(0))
                    .map(egg => (
                        <li key={egg.instanceId} className="flex justify-between items-center">
                        <span className="text-slate-300 flex items-center">
                            <i className={`${egg.icon} mr-1.5 ${BATTLE_EGG_RARITY_STYLES[egg.rarity]?.text || 'text-slate-300'}`}></i>
                            {egg.name}:
                        </span>
                        <span className="font-semibold text-sky-300">{formatNumber(new Decimal(battleStats.damageDealtByEgg[egg.instanceId] || '0'))}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}


        {(!isExpeditionMode || expeditionOutcome) && battleRewards && battleRewards.length > 0 && (
          <div className="bg-slate-700 p-3 rounded-lg mb-4 w-full max-w-md">
            <h3 className="text-md font-semibold text-amber-300 mb-2 text-center">Recompensas:</h3>
            {battleRewards.map((reward, idx) => (
              <p key={idx} className="text-xs text-slate-200"><i className={`${reward.icon || 'fas fa-gem'} mr-1.5 text-yellow-400`}></i>{reward.description}</p>
            ))}
          </div>
        )}

        {battlePhase === 'battle_over_expedition_stage_victory' ? (
            <div className="flex gap-4 w-full max-w-md">
                <button
                    onClick={onContinueExpedition}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md"
                >
                    Continuar Expedição
                </button>
                <button
                    onClick={onEndExpeditionEarly}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-md"
                >
                    Encerrar Expedição (Coletar)
                </button>
            </div>
        ) : isExpeditionMode && expeditionOutcome === 'defeat' ? (
             <div className="flex gap-4 mt-4 w-full max-w-md">
                <button
                    onClick={onRetryExpedition}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
                >
                    <i className="fas fa-redo-alt mr-2"></i>Tentar Novamente
                </button>
                <button
                    onClick={onEndExpeditionEarly}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
                >
                    <i className="fas fa-times-circle mr-2"></i>Desistir
                </button>
            </div>
        ) : (
             <button
                onClick={onMinimize} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md"
            >
                Continuar
            </button>
        )}

      </div>
    );
  }
  
  if (eggTeamBattleState.isActive) { 
    const expeditionProgressPercent = isExpeditionMode ? (currentExpeditionStage / EXPEDITION_MAX_STAGES) * 100 : 0;
    const currentStageConfig = isExpeditionMode ? EXPEDITION_STAGES_CONFIG.find(s => s.stage === currentExpeditionStage) : null;
    const stageName = currentStageConfig ? currentStageConfig.name : battleName;
    const stageTheme = currentStageConfig ? currentStageConfig.theme : `Round ${currentRound}`;

    return (
      <div className="egg-team-battle-panel fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-40 flex flex-col p-2 sm:p-4 text-slate-100">
        <div className="panel-header flex flex-col p-2 sm:p-3 bg-slate-800/80 rounded-t-lg border-b-2 border-purple-700 shadow-lg shrink-0">
          {isExpeditionMode && (
            <div className="w-full px-2 mb-2">
              <p className="text-xs text-slate-300 text-center mb-1">Progresso da Expedição ({currentExpeditionStage}/{EXPEDITION_MAX_STAGES})</p>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${expeditionProgressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center w-full">
            <div className="flex-1 text-left">
              <h2 className="text-sm sm:text-lg font-bold text-purple-300 truncate" title={stageName}>
                {stageName}
              </h2>
              <p className="text-xs text-slate-400 truncate" title={stageTheme}>{stageTheme}</p>
            </div>

            <div className="flex-1 text-center">
              <div 
                  key={roundKey} 
                  className="text-lg sm:text-2xl font-black text-slate-100 animate-jump-in"
              >
                <span className="text-sm font-semibold text-slate-400">Round</span>
                <br />
                {currentRound}
              </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-1.5 sm:gap-2">
              <button onClick={onChangeCombatSpeed} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-1 px-2 text-xs sm:text-sm rounded-md shadow-sm">
                Vel: {combatSpeed}x
              </button>
              <button onClick={onTogglePause} className={`${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold py-1 px-2 text-xs sm:text-sm rounded-md shadow-sm`}>
                {isPaused ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>}
              </button>
              <button
                onClick={onMinimize}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 text-xs sm:text-sm rounded-md shadow-sm"
                aria-label="Minimizar Batalha"
              >
               <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          {isExpeditionMode && acquiredExpeditionUpgrades.length > 0 && (
            <div className="mt-2">
              <AcquiredRewardsPanel rewards={acquiredExpeditionUpgrades} />
            </div>
          )}
        </div>


        <div ref={battleArenaRef} className="battle-arena-container flex-grow overflow-hidden p-1 sm:p-2 flex flex-col bg-slate-800/50 relative">
            <BattleTeamDisplay team={enemyTeam} isEnemyTeam={true} />
            <div className="my-1 sm:my-2 border-y-2 border-dashed border-slate-700/50 min-h-[20px] sm:min-h-[30px] relative shrink-0">
            </div>
            <BattleTeamDisplay team={playerTeam} isEnemyTeam={false} />
          
            {battleLog && battleLog.length > 0 && (
                <div className="battle-log bg-black/40 p-1.5 sm:p-2 rounded max-h-24 text-[9px] sm:text-[10px] overflow-y-auto custom-scrollbar-thin my-2 shrink-0">
                {battleLog.map((log, index) => (
                    <p key={index} className="opacity-80 leading-tight">{log}</p>
                ))}
                </div>
            )}

          {floatingTexts.map(ft => {
              const targetPosition = ft.targetId ? eggPositions[ft.targetId] : null;

              let style: React.CSSProperties = {
                  position: 'absolute',
                  animationDuration: `${ft.duration / 1000}s`,
                  zIndex: 1000,
              };
              
              if (targetPosition) {
                  style.left = `${targetPosition.left + targetPosition.width / 2}px`;
                  style.top = `${targetPosition.top}px`;
              } else {
                  style.left = `${ft.sourceIsEnemy ? '25%' : '75%'}`;
                  style.top = '50%';
              }

              const finalClassName = `floating-text-battle absolute text-center font-bold pointer-events-none whitespace-nowrap animate-floatAndFadeBattle ${ft.color.startsWith('text-') ? ft.color : ''}`;
              if (!ft.color.startsWith('text-')) {
                  style.color = ft.color;
              }

              return (
                  <div
                      key={ft.id}
                      className={finalClassName}
                      style={style}
                      onAnimationEnd={() => handleFloatingTextAnimationEnd(ft.id)}
                  >
                      {ft.icon && <i className={`${ft.icon} mr-1 sm:mr-1.5`}></i>}
                      {ft.text}
                  </div>
              );
          })}
          
            <div className="pt-2 space-y-2">
              {battlePhase === 'player_turn' && currentActingEggId && playerTeam.find(e => e.instanceId === currentActingEggId) && (
                <div className="player-actions bg-slate-700/80 p-2 mt-1 rounded text-center">
                  <p className="text-xs mb-1">Turno de: {playerTeam.find(e => e.instanceId === currentActingEggId)?.name}</p>
                  <p className="text-xs text-slate-400">(Controles de Habilidade Aqui)</p>
                </div>
              )}
            </div>
        </div>
         <style>{`
            .floating-text-battle { font-size: 1.1rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
            @media (min-width: 640px) { .floating-text-battle { font-size: 1.4rem; } }
            @keyframes floatAndFadeBattle { 0% { transform: translate(-50%, 5px) scale(1); opacity: 1; } 100% { transform: translate(-50%, -60px) scale(1.1); opacity: 0; } }
            .animate-floatAndFadeBattle { animation: floatAndFadeBattle ease-out forwards; }
            .animate-ping.once { animation: pingOnce 0.7s cubic-bezier(0, 0, 0.2, 1) forwards; }
            @keyframes pingOnce { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.7; } }
            @keyframes jump-in {
              0% { transform: scale(0.5); opacity: 0; }
              60% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-jump-in { animation: jump-in 0.4s ease-out forwards; }
          `}</style>
      </div>
    );
  }
  
  return null; 
};

export default EggTeamBattlePanel;