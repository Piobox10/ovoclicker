import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../../types';
import { formatNumber, formatTime } from '../../utils';

interface RunStatsPanelProps {
  gameState: Pick<GameState, 'totalClicksThisRun' | 'maxIncubationPowerAchieved' | 'activePlayTime' | 'activeIdleTime'>;
}

const RunStatsPanel: React.FC<RunStatsPanelProps> = ({ gameState }) => {
  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 border border-slate-700 text-xs">
      <h2 className="text-slate-400 text-sm font-bold mb-2 text-center">
        <i className="fas fa-chart-line mr-2"></i>Estatísticas da Run
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
        <p>Cliques: <span className="font-semibold text-slate-200">{formatNumber(gameState.totalClicksThisRun)}</span></p>
        <p>Max PI: <span className="font-semibold text-slate-200">{formatNumber(gameState.maxIncubationPowerAchieved)}</span></p>
        <p>Tempo Ativo: <span className="font-semibold text-slate-200">{formatTime(gameState.activePlayTime)}</span></p>
        <p>Tempo Ocioso: <span className="font-semibold text-slate-200">{formatTime(gameState.activeIdleTime)}</span></p>
      </div>
    </div>
  );
};

export default RunStatsPanel;