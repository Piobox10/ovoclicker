import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { formatNumber, formatTime } from '../../utils';

const RunStatsPanel: React.FC = () => {
    const { gameState } = useGameContext();
    return (
        <div className="w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 border border-[var(--border-primary)] text-xs">
            <h2 className="text-[var(--title-run-stats)] text-sm font-bold mb-2 text-center">
                <i className="fas fa-chart-line mr-2"></i>Estatísticas da Run
            </h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[var(--text-secondary)]">
                <p>Cliques: <span className="font-semibold text-[var(--text-primary)]">{formatNumber(gameState.totalClicksThisRun)}</span></p>
                <p>Max PI: <span className="font-semibold text-[var(--text-primary)]">{formatNumber(gameState.maxIncubationPowerAchieved)}</span></p>
                <p>Tempo Ativo: <span className="font-semibold text-[var(--text-primary)]">{formatTime(gameState.activePlayTime)}</span></p>
                <p>Tempo Ocioso: <span className="font-semibold text-[var(--text-primary)]">{formatTime(gameState.activeIdleTime)}</span></p>
            </div>
        </div>
    );
};

export default RunStatsPanel;
