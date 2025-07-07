import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { formatNumber } from '../../utils';

const CombatPanel: React.FC = () => {
    const { gameState } = useGameContext();
    const { currentEnemy, combatLog } = gameState;

    return (
        <div className={`combat-section-wrapper w-full bg-[var(--bg-panel-accent)] rounded-xl shadow-lg border border-red-500 p-4 sm:p-5`}>
        <h3 className="text-lg sm:text-xl font-bold text-[var(--title-combat-panel)] text-center mb-3">
            <i className="fas fa-skull-crossbones mr-2"></i>Área de Confronto
        </h3>
        {currentEnemy ? (
            <div className="text-center text-red-200">
            <div className="mb-2">
                <i className={`${currentEnemy.icon} text-5xl sm:text-6xl text-red-300 block mb-1`}></i>
                <p className="text-base sm:text-lg font-semibold">{currentEnemy.name} {currentEnemy.isBoss && <span className="text-xs text-yellow-300">(Chefe)</span>}</p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 sm:h-5 border border-red-400 overflow-hidden mb-2 shadow-inner">
                <div
                className="bg-gradient-to-r from-red-500 to-rose-500 h-full rounded-full transition-all duration-300 ease-linear"
                style={{ width: `${currentEnemy.currentHp.dividedBy(currentEnemy.maxHp).times(100).clamp(0, 100).toNumber()}%` }}
                ></div>
            </div>
            <p className="text-sm sm:text-base font-medium">
                {formatNumber(currentEnemy.currentHp.clamp(0, currentEnemy.maxHp))} / {formatNumber(currentEnemy.maxHp)} HP
            </p>
            </div>
        ) : (
            <p className="text-red-200 text-center">Nenhum inimigo presente.</p>
        )}
        {combatLog && combatLog.length > 0 && (
            <div className="mt-3 sm:mt-4 text-xs text-rose-100/80 bg-black/30 p-2 rounded-md max-h-[70px] overflow-y-auto custom-scrollbar-thin">
            {combatLog.map((log, index) => (
                <p key={index} className="opacity-80">{log}</p>
            ))}
            </div>
        )}
        </div>
    );
};

export default CombatPanel;
