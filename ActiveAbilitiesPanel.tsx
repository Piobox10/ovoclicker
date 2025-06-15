import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../../types';
import { formatNumber, formatTime } from '../../utils';

interface ActiveAbilitiesPanelProps {
  gameState: Pick<GameState, 'activeAbilitiesData' | 'incubationPower' | 'globalAbilityCooldownMultiplier'>;
  onBuyAbility: (abilityId: string) => void;
  onActivateAbility: (abilityId: string) => void;
}

const ActiveAbilitiesPanel: React.FC<ActiveAbilitiesPanelProps> = ({ gameState, onBuyAbility, onActivateAbility }) => {
  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h2 className="text-red-400 text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-bolt mr-2"></i>Habilidades Ativas
      </h2>
      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {gameState.activeAbilitiesData.map(ability => {
          const isDisabled = ability.cooldownRemaining.gt(0) || (!ability.purchased && gameState.incubationPower.lt(ability.cost));
          const effectiveCooldown = ability.cooldown.times(gameState.globalAbilityCooldownMultiplier);
          return (
            <div key={ability.id} className={`p-3 rounded-lg border transition-all duration-200 ${ability.purchased ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/70 border-slate-600'}`}>
              <h3 className="text-base font-semibold text-red-300 flex items-center gap-2">
                <i className={`${ability.icon} ${ability.cooldownRemaining.gt(0) ? 'text-slate-500' : 'text-red-400'}`}></i>
                {ability.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">{ability.description}</p>
              {!ability.purchased ? (
                <p className="text-xs text-amber-400 mt-1">Custo: {formatNumber(ability.cost)} PI</p>
              ) : (
                <p className="text-xs text-slate-400 mt-1">Cooldown: {formatTime(effectiveCooldown)}</p>
              )}

              {ability.purchased ? (
                <button
                  onClick={() => onActivateAbility(ability.id)}
                  disabled={ability.cooldownRemaining.gt(0)}
                  className="mt-2 w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm hover:from-red-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  {ability.cooldownRemaining.gt(0) ? `Recarregando (${formatTime(ability.cooldownRemaining)})` : 'Ativar'}
                </button>
              ) : (
                <button
                  onClick={() => onBuyAbility(ability.id)}
                  disabled={gameState.incubationPower.lt(ability.cost)}
                  className="mt-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
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