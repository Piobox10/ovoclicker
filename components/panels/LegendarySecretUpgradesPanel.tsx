import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { formatNumber, formatTime } from '../../utils';
import { TITHE_RITUAL_COOLDOWN_MS, LEAD_KEY_COOLDOWN_MS } from '../../constants';

const LegendarySecretUpgradesPanel: React.FC = () => {
    const { gameState, handleActivateLegendaryUpgrade, handleLeadKeyClick, handleTitheRitualClick } = useGameContext();
    const isLegendarySystemUnlocked = gameState.transcendenceCount.gte(20);
    const leadKeyUpgrade = gameState.secretRuptureUpgradesData.find(sru => sru.id === 'leadKey' && sru.obtained);
    const titheRitualUpgrade = gameState.secretRuptureUpgradesData.find(sru => sru.id === 'titheRitual' && sru.obtained);
    const canClickLeadKey = leadKeyUpgrade ? Date.now() - gameState.lastLeadKeyClickTimestamp >= LEAD_KEY_COOLDOWN_MS : false;
    const canClickTitheRitual = titheRitualUpgrade ? Date.now() - gameState.lastTitheRitualTimestamp >= TITHE_RITUAL_COOLDOWN_MS : false;
    const leadKeyCooldownRemaining = leadKeyUpgrade ? Math.max(0, (gameState.lastLeadKeyClickTimestamp + LEAD_KEY_COOLDOWN_MS - Date.now()) / 1000) : 0;
    const titheRitualCooldownRemaining = titheRitualUpgrade ? Math.max(0, (gameState.lastTitheRitualTimestamp + TITHE_RITUAL_COOLDOWN_MS - Date.now()) / 1000) : 0;
    const obtainedSecretRuptureUpgrades = gameState.secretRuptureUpgradesData.filter(sru => sru.obtained);
    const obtainedSacredRelics = gameState.sacredRelicsData.filter(sr => sr.obtained);

    return (
        <div className="w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
            <h2 className="text-[var(--title-legendary-secret)] text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
                <i className="fas fa-atom mr-2"></i>Relíquias e Segredos
            </h2>
            <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {obtainedSacredRelics.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-amber-400 text-base font-semibold mb-2 text-center">Relíquias Sagradas</h3>
                        {obtainedSacredRelics.map(relic => (
                        <div key={relic.id} className="p-3 rounded-lg border bg-amber-900/40 border-amber-600 mb-2 shadow-inner">
                            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2"><i className={`${relic.icon} text-amber-400`}></i> {relic.name}</h3>
                            <p className="text-xs text-slate-200 mt-1">{relic.description}</p>
                        </div>
                        ))}
                    </div>
                )}
                <div className="pt-4 border-t border-slate-700/50">
                    <h3 className="text-yellow-300 text-base font-semibold mb-2 text-center">Relíquias Lendárias</h3>
                    {isLegendarySystemUnlocked ? (
                        gameState.legendaryUpgradesData.length > 0 ? gameState.legendaryUpgradesData.map(lu => (
                            lu.unlockedSystem && ( 
                                <div key={lu.id} className={`p-3 rounded-lg border ${lu.activated ? 'bg-yellow-700/30 border-yellow-500' : 'bg-[var(--bg-panel-secondary)] border-[var(--border-secondary)]'}`}>
                                <h3 className="text-base font-semibold text-[var(--text-emphasized)] flex items-center gap-2"><i className={`${lu.icon}`}></i> {lu.name}</h3>
                                <p className="text-xs text-[var(--text-primary)] mt-1">{lu.description}</p>
                                {!lu.activated && (<button onClick={() => handleActivateLegendaryUpgrade(lu.id)} className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm hover:from-yellow-600 hover:to-amber-700">Ativar</button>)}
                                </div>
                            )
                        )) : <p className="text-xs text-[var(--text-secondary)] text-center">Nenhuma Relíquia Lendária disponível.</p>
                    ) : (<p className="text-xs text-[var(--text-secondary)] text-center">Sistema de Relíquias Lendárias bloqueado (requer 20 transcendências).</p>)}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <h3 className="text-[var(--title-secrets-subheader)] text-base font-semibold mb-2 text-center">Segredos da Ruptura</h3>
                    {!gameState.secretRuptureSystemUnlocked ? (<p className="text-xs text-[var(--text-secondary)] text-center">O Caminho da Ruptura ainda não foi escolhido. Segredos permanecem ocultos.</p>) 
                    : obtainedSecretRuptureUpgrades.length > 0 ? (
                        obtainedSecretRuptureUpgrades.map(sru => (
                            <div key={sru.id} className="p-3 rounded-lg border bg-red-900/60 border-red-700 mb-2">
                                <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2"><i className={`${sru.icon} text-red-400`}></i> {sru.name}</h3>
                                <p className="text-xs text-slate-200 mt-1">{sru.description}</p>
                                {sru.id === 'leadKey' && (<button onClick={handleLeadKeyClick} disabled={!canClickLeadKey} className="mt-2 w-full bg-gradient-to-r from-gray-500 to-slate-600 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm hover:from-gray-600 hover:to-slate-700 disabled:opacity-50">{canClickLeadKey ? "Usar Chave de Chumbo" : `Recarregando (${formatTime(leadKeyCooldownRemaining)})`}</button>)}
                                {sru.id === 'titheRitual' && (<button onClick={handleTitheRitualClick} disabled={!canClickTitheRitual} className="mt-2 w-full bg-gradient-to-r from-red-700 to-rose-800 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm hover:from-red-800 hover:to-rose-900 disabled:opacity-50">{canClickTitheRitual ? "Realizar Ritual do Dízimo" : `Recarregando (${formatTime(titheRitualCooldownRemaining)})`}</button>)}
                            </div>
                        ))
                    ) : (<p className="text-xs text-[var(--text-secondary)] text-center">Sistema da Ruptura ativo! Descubra os segredos através de suas ações...</p>)}
                </div>
            </div>
        </div>
    );
};

export default LegendarySecretUpgradesPanel;
