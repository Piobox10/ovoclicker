import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { EGG_FORMS_DATA } from '../../constants';

const EggFormsPanel: React.FC = () => {
    const { gameState, handleToggleEggForm, effectiveMaxActiveEggForms } = useGameContext();
    
    // Get all unlocked forms
    const unlockedForms = EGG_FORMS_DATA.filter(form => gameState.unlockedEggForms.includes(form.id));
    
    // Get all locked forms
    const lockedForms = EGG_FORMS_DATA.filter(form => !gameState.unlockedEggForms.includes(form.id));

    return (
        <div className="w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
            <h2 className="text-[var(--title-egg-forms)] text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
                <i className="fas fa-egg mr-2"></i>Formas de Ovo ({gameState.activeEggFormIds.length}/{effectiveMaxActiveEggForms.toString()})
            </h2>

            {/* Unlocked Forms Section */}
            <div className="unlocked-forms">
                <h3 className="text-base font-semibold text-emerald-400 mb-2">Desbloqueadas</h3>
                {unlockedForms.length === 0 ? (
                    <p className="text-[var(--text-secondary)] text-center text-sm mb-4">Nenhuma forma de ovo desbloqueada ainda.</p>
                ) : (
                    <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {unlockedForms.map(form => (
                            <div
                                key={form.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
                                ${gameState.activeEggFormIds.includes(form.id) ? 'bg-emerald-700/50 border-emerald-500 ring-2 ring-emerald-400' : 'bg-[var(--bg-panel-secondary)] border-[var(--border-secondary)] hover:bg-[var(--bg-interactive-hover)]'}`}
                                onClick={() => handleToggleEggForm(form.id)}
                                role="button"
                                tabIndex={0}
                                aria-pressed={gameState.activeEggFormIds.includes(form.id)}
                                aria-label={`Ativar/Desativar ${form.name}`}
                            >
                                <h3 className="text-base font-semibold text-[var(--text-accent)] flex items-center gap-2">
                                    <i className={`${form.icon} ${gameState.activeEggFormIds.includes(form.id) ? 'text-[var(--text-accent-hover)]' : 'text-[var(--text-secondary)]'}`}></i>
                                    {form.name} {form.isLegendary && <span className="text-xs text-yellow-400">(Lendário)</span>}
                                </h3>
                                <p className="text-xs text-[var(--text-primary)] mt-1">{form.activePassive}</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{form.collectionBonusDescription}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Locked Forms Section (if any exist) */}
            {lockedForms.length > 0 && (
                <>
                    <div className="border-t border-[var(--border-secondary)] my-4"></div>
                    <div className="locked-forms">
                        <h3 className="text-base font-semibold text-rose-400 mb-2">Bloqueadas</h3>
                        <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {lockedForms.map(form => (
                                <div
                                    key={form.id}
                                    className="p-3 rounded-lg border bg-slate-800/50 border-slate-700 opacity-70 cursor-not-allowed"
                                    title={form.unlockCondition}
                                >
                                    <h3 className="text-base font-semibold text-slate-400 flex items-center gap-2">
                                        <i className={`${form.icon} text-slate-500`}></i>
                                        {form.name} {form.isLegendary && <span className="text-xs text-slate-500">(Lendário)</span>}
                                        <i className="fas fa-lock ml-auto text-slate-500"></i>
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">{form.unlockCondition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EggFormsPanel;