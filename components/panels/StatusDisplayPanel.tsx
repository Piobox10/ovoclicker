import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { formatNumber, formatTime, getEmbryoVisuals } from '../../utils';

const StatusDisplayPanel: React.FC = () => {
  const { gameState, currentStageData } = useGameContext();

  return (
    <div className={`game-stats w-full bg-gradient-to-br from-[var(--bg-panel-primary)] to-[var(--bg-panel-secondary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)] text-[var(--text-primary)] text-sm sm:text-base text-center shadow-lg`}>
      <p className="mb-1"><i className="fas fa-egg text-[var(--text-accent)] mr-2 opacity-80"></i> PI: <span className="font-bold text-lg text-[var(--text-emphasized)]">{formatNumber(gameState.incubationPower)}</span></p>
      <p className="mb-1"><i className="fas fa-flask text-emerald-400 mr-2 opacity-80"></i> EXP Modular: <span className="font-bold text-lg text-emerald-300">{formatNumber(gameState.modularEXP)}</span></p>
      <p className="mb-1"><i className="fas fa-hourglass text-sky-400 mr-2 opacity-80"></i> Ovos Temp.: <span className="font-bold text-sky-300">{formatNumber(gameState.temporaryEggs)}</span></p>
      <p className="mb-1"><i className="fas fa-hand-pointer text-[var(--text-accent)] mr-2 opacity-80"></i> PI/Clique: <span className="font-bold text-[var(--text-primary)]">{formatNumber(gameState.effectiveClicksPerClick)}</span></p>
      <p className="mb-1"><i className="fas fa-hourglass-half text-[var(--text-accent)] mr-2 opacity-80"></i> PI/Seg: <span className="font-bold text-[var(--text-primary)]">{formatNumber(gameState.effectiveIpps)}</span></p>
      <p className="mb-1"><i className="fas fa-crosshairs text-red-400 mr-2 opacity-80"></i> Crítico: <span className="font-bold text-red-300">{gameState.effectiveCriticalClickChance.times(100).toDecimalPlaces(2).toString()}%</span></p>
      <p className="mb-1"><i className="fas fa-gem text-pink-400 mr-2 opacity-80"></i> Essência Transc.: <span className="font-bold text-pink-300">{formatNumber(gameState.transcendentEssence)}</span></p>
      <p className="mb-1"><i className="fas fa-layer-group text-teal-400 mr-2 opacity-80"></i> Estágio: <span className="font-bold text-teal-300">{currentStageData.name}</span></p>
      <p className="mb-1"><i className="fas fa-dna text-emerald-400 mr-2 opacity-80"></i> Embrião: <span className="font-bold text-emerald-300">Nível {formatNumber(gameState.embryoLevel)} ({getEmbryoVisuals(gameState.embryoLevel).nameSuffix})</span></p>
      <p className="mb-1"><i className="fas fa-skull-crossbones text-rose-400 mr-2 opacity-80"></i> Derrotados: <span className="font-bold text-rose-300">{formatNumber(gameState.enemiesDefeatedTotal)}</span></p>
      <p className="mb-1"><i className="fas fa-sync-alt text-purple-400 mr-2 opacity-80"></i> Transc.: <span className="font-bold text-purple-300">{formatNumber(gameState.transcendenceCount)}</span></p>
      {gameState.transcendenceCount.gt(0) && <p className="text-xs text-green-400 mt-1"><i className="fas fa-arrow-up text-green-400 mr-1"></i> Bônus Global: +{gameState.transcendencePassiveBonus.minus(1).times(100).toDecimalPlaces(2).toString()}%</p>}
      <p className="mt-2 text-xs text-[var(--text-secondary)]">ID: <span className="font-semibold">{gameState.userNickname}</span></p>
      {gameState.transcendenceSpamPenaltyActive && ( <p className="text-xs text-red-400 mt-1 animate-pulse">Custo Espiritual Ativo! (Base de Upgrades +50% por {formatTime(gameState.transcendenceSpamPenaltyDuration)})</p> )}
    </div>
  );
};

export default StatusDisplayPanel;
