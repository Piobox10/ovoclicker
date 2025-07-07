import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import SpecialUpgradeItem from '../SpecialUpgradeItem';

const SpecialUpgradesPanel: React.FC = () => {
    const { gameState } = useGameContext();

    return (
        <div className="upgrades-section w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
        <h2 className="text-[var(--title-special-upgrades)] text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
            <i className="fas fa-certificate mr-2"></i>Melhorias de Estágio
        </h2>
        {gameState.entropySeedSpecialUpgradesDisabled && (
            <p className="text-xs text-center text-red-400 mb-2">(Desabilitado pela Semente da Entropia)</p>
        )}
        <div className="max-h-[200px] sm:max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {gameState.specialUpgradesData.map(sUpgrade => (
            <SpecialUpgradeItem
                key={sUpgrade.id}
                sUpgrade={sUpgrade}
                isUnlocked={gameState.currentStageIndex >= sUpgrade.stageRequired && !gameState.entropySeedSpecialUpgradesDisabled}
                currentTemporaryEggs={sUpgrade.id === 'stage9Bonus' ? gameState.temporaryEggs : undefined}
            />
            ))}
            {gameState.specialUpgradesData.length === 0 && <p className="text-slate-400 text-sm text-center">Nenhuma melhoria de estágio disponível.</p>}
        </div>
        </div>
    );
};

export default SpecialUpgradesPanel;
