
import React from 'react';
import { GameState } from '../../types';
import { formatNumber, formatTime } from '../../utils'; // Assuming formatTime might be needed
import { TITHE_RITUAL_COOLDOWN_MS, LEAD_KEY_COOLDOWN_MS } from '../../constants';

interface LegendarySecretUpgradesPanelProps {
  gameState: Pick<GameState, 'legendaryUpgradesData' | 'secretRuptureUpgradesData' | 'transcendenceCount' | 'lastLeadKeyClickTimestamp' | 'lastTitheRitualTimestamp' | 'upgradesData' | 'secretRuptureSystemUnlocked'>;
  onActivateLegendaryUpgrade: (id: string) => void;
  onLeadKeyClick: () => void;
  onTitheRitualClick: () => void;
  // Potentially add more handlers for other secret upgrade actions
}

const LegendarySecretUpgradesPanel: React.FC<LegendarySecretUpgradesPanelProps> = ({ 
    gameState, 
    onActivateLegendaryUpgrade,
    onLeadKeyClick,
    onTitheRitualClick
}) => {
  const isLegendarySystemUnlocked = gameState.transcendenceCount.gte(20); 

  const leadKeyUpgrade = gameState.secretRuptureUpgradesData.find(sru => sru.id === 'leadKey' && sru.obtained);
  const titheRitualUpgrade = gameState.secretRuptureUpgradesData.find(sru => sru.id === 'titheRitual' && sru.obtained);

  const canClickLeadKey = leadKeyUpgrade ? Date.now() - gameState.lastLeadKeyClickTimestamp >= LEAD_KEY_COOLDOWN_MS : false;
  const canClickTitheRitual = titheRitualUpgrade ? Date.now() - gameState.lastTitheRitualTimestamp >= TITHE_RITUAL_COOLDOWN_MS : false;
  
  const leadKeyCooldownRemaining = leadKeyUpgrade ? Math.max(0, (gameState.lastLeadKeyClickTimestamp + LEAD_KEY_COOLDOWN_MS - Date.now()) / 1000) : 0;
  const titheRitualCooldownRemaining = titheRitualUpgrade ? Math.max(0, (gameState.lastTitheRitualTimestamp + TITHE_RITUAL_COOLDOWN_MS - Date.now()) / 1000) : 0;

  const obtainedSecretRuptureUpgrades = gameState.secretRuptureUpgradesData.filter(sru => sru.obtained);

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h2 className="text-yellow-500 text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-atom mr-2"></i>Relíquias e Segredos
      </h2>
      <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {/* Legendary Upgrades */}
        {isLegendarySystemUnlocked ? (
            gameState.legendaryUpgradesData.length > 0 ? gameState.legendaryUpgradesData.map(lu => (
            lu.unlockedSystem && ( // Should always be true if isLegendarySystemUnlocked is true for these items
                <div key={lu.id} className={`p-3 rounded-lg border ${lu.activated ? 'bg-yellow-700/30 border-yellow-500' : 'bg-slate-800 border-slate-600'}`}>
                <h3 className="text-base font-semibold text-yellow-400 flex items-center gap-2">
                    <i className={`${lu.icon}`}></i> {lu.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{lu.description}</p>
                {!lu.activated && (
                    <button 
                    onClick={() => onActivateLegendaryUpgrade(lu.id)}
                    className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm hover:from-yellow-600 hover:to-amber-700"
                    >
                    Ativar
                    </button>
                )}
                </div>
            )
            )) : <p className="text-xs text-slate-500 text-center">Nenhuma Relíquia Lendária disponível.</p>
        ) : (
            <p className="text-xs text-slate-500 text-center">Sistema de Relíquias Lendárias bloqueado (requer 20 transcendências).</p>
        )}


        {/* Secret Rupture Upgrades */}
        <div className="mt-4 pt-4 border-t border-slate-700">
            <h3 className="text-red-500 text-base font-semibold mb-2 text-center">Segredos da Ruptura</h3>
            {!gameState.secretRuptureSystemUnlocked ? (
                <p className="text-xs text-slate-500 text-center">O Caminho da Ruptura ainda não foi escolhido. Segredos permanecem ocultos.</p>
            ) : obtainedSecretRuptureUpgrades.length > 0 ? (
                obtainedSecretRuptureUpgrades.map(sru => (
                    <div key={sru.id} className="p-3 rounded-lg border bg-red-900/60 border-red-700 mb-2">
                        <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                        <i className={`${sru.icon} text-red-400`}></i> {sru.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">{sru.description}</p>
                        {sru.id === 'leadKey' && (
                        <button
                            onClick={onLeadKeyClick}
                            disabled={!canClickLeadKey}
                            className="mt-2 w-full bg-gradient-to-r from-gray-500 to-slate-600 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm hover:from-gray-600 hover:to-slate-700 disabled:opacity-50"
                        >
                            {canClickLeadKey ? "Usar Chave de Chumbo" : `Recarregando (${formatTime(leadKeyCooldownRemaining)})`}
                        </button>
                        )}
                        {sru.id === 'titheRitual' && (
                        <button
                            onClick={onTitheRitualClick}
                            disabled={!canClickTitheRitual}
                            className="mt-2 w-full bg-gradient-to-r from-red-700 to-rose-800 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm hover:from-red-800 hover:to-rose-900 disabled:opacity-50"
                        >
                            {canClickTitheRitual ? "Realizar Ritual do Dízimo" : `Recarregando (${formatTime(titheRitualCooldownRemaining)})`}
                        </button>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-xs text-slate-400 text-center">Sistema da Ruptura ativo! Descubra os segredos através de suas ações...</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default LegendarySecretUpgradesPanel;
