import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { formatNumber, formatTime } from '../../utils';

const ActiveAbilitiesPanel: React.FC = () => {
    const { gameState, buyActiveAbilityHandler, activateAbilityHandler } = useGameContext();

    return (
        <div className="w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
        <h2 className="text-[var(--title-active-abilities)] text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
            <i className="fas fa-bolt mr-2"></i>Habilidades Ativas
        </h2>
        {gameState.orbInverseAbilitiesDisabled && (
            <p className="text-xs text-center text-red-400 mb-2">(Desabilitado pelo Orbe Inverso)</p>
        )}
        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {gameState.activeAbilitiesData.map(ability => {
            const isDisabled = ability.cooldownRemaining.gt(0) || (!ability.purchased && gameState.incubationPower.lt(ability.cost)) || gameState.orbInverseAbilitiesDisabled;
            const effectiveCooldown = ability.cooldown.times(gameState.globalAbilityCooldownMultiplier);
            return (
                <div key={ability.id} className={`p-3 rounded-lg border transition-all duration-200 ${ability.purchased ? 'bg-[var(--bg-panel-secondary)] border-[var(--border-secondary)]' : 'bg-[var(--bg-panel-secondary)] border-[var(--border-secondary)]'}`}>
                <h3 className="text-base font-semibold text-[var(--text-accent)] flex items-center gap-2">
                    <i className={`${ability.icon} ${ability.cooldownRemaining.gt(0) || gameState.orbInverseAbilitiesDisabled ? 'text-[var(--text-secondary)]' : 'text-[var(--text-accent-hover)]'}`}></i>
                    {ability.name}
                </h3>
                <p className="text-xs text-[var(--text-primary)] mt-1">{ability.description}</p>
                {!ability.purchased ? (
                    <p className="text-xs text-[var(--text-emphasized)] mt-1">Custo: {formatNumber(ability.cost)} PI</p>
                ) : (
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Cooldown: {formatTime(effectiveCooldown)}</p>
                )}

                {ability.purchased ? (
                    <button onClick={() => activateAbilityHandler(ability.id)} disabled={isDisabled} className="mt-2 w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm hover:from-red-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-[var(--button-disabled-bg)] disabled:to-gray-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]">
                    {ability.cooldownRemaining.gt(0) ? `Recarregando (${formatTime(ability.cooldownRemaining)})` : 'Ativar'}
                    </button>
                ) : (
                    <button onClick={() => buyActiveAbilityHandler(ability.id)} disabled={gameState.incubationPower.lt(ability.cost)} className="mt-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-[var(--button-disabled-bg)] disabled:to-gray-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]">
                    Comprar
                    </button>
                )}
                </div>
            );
            })}
        </div>
        </div>
    );
};

export default ActiveAbilitiesPanel;
