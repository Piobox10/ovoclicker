import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { TRAITS } from '../../constants';

const ActiveTraitsDisplayPanel: React.FC = () => {
    const { gameState } = useGameContext();
    const activeTraitDetails = gameState.activeTraits.map(id => TRAITS.find(t => t.id === id)).filter(Boolean);
    const quantumTrait = gameState.quantumCoreActiveRandomTraitId ? TRAITS.find(t => t.id === gameState.quantumCoreActiveRandomTraitId) : null;

    if (activeTraitDetails.length === 0 && !quantumTrait) {
        return null;
    }

    return (
        <div className="w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
            <h2 className="text-[var(--title-active-traits)] text-lg sm:text-xl font-bold mb-3 text-center">
                <i className="fas fa-brain mr-2"></i>Traços Ativos ({gameState.activeTraits.length}/{gameState.maxActiveTraits})
            </h2>
            <div className="space-y-2">
                {activeTraitDetails.map(trait => (
                trait && (
                    <div key={trait.id} className="p-2 bg-[var(--bg-panel-secondary)] rounded-md border border-[var(--border-secondary)]">
                    <h3 className="text-sm font-semibold text-[var(--text-accent)] flex items-center gap-1.5">
                        <i className={`${trait.icon} text-[var(--text-accent-hover)]`}></i> {trait.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">{trait.description}</p>
                    </div>
                )
                ))}
                {quantumTrait && gameState.quantumCoreActiveRandomTraitDuration.gt(0) && (
                <div key={quantumTrait.id + "_quantum"} className="p-2 bg-purple-800/50 rounded-md border border-purple-600 animate-pulse">
                    <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-1.5">
                    <i className={`${quantumTrait.icon} text-purple-400`}></i> {quantumTrait.name} (Núcleo Quântico)
                    </h3>
                    <p className="text-xs text-purple-200">{quantumTrait.description}</p>
                    <p className="text-xs text-purple-400 text-right">Duração: {gameState.quantumCoreActiveRandomTraitDuration.toFixed(0)}s</p>
                </div>
                )}
            </div>
        </div>
    );
};

export default ActiveTraitsDisplayPanel;
