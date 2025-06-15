import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EggForm } from '../../types';
import { EGG_FORMS_DATA } from '../../constants';

interface EggFormsPanelProps {
  gameState: Pick<GameState, 'unlockedEggForms' | 'activeEggFormIds' | 'legendaryUpgradesData'>;
  onToggleEggForm: (formId: string) => void;
  effectiveMaxActiveEggForms: Decimal;
}

const EggFormsPanel: React.FC<EggFormsPanelProps> = ({ gameState, onToggleEggForm, effectiveMaxActiveEggForms }) => {
  const availableForms = EGG_FORMS_DATA.filter(form => gameState.unlockedEggForms.includes(form.id));

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
      <h2 className="text-emerald-400 text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
        <i className="fas fa-egg mr-2"></i>Formas de Ovo Ativas ({gameState.activeEggFormIds.length}/{effectiveMaxActiveEggForms.toString()})
      </h2>
      {availableForms.length === 0 && <p className="text-slate-400 text-center text-sm">Nenhuma forma de ovo desbloqueada ainda.</p>}
      <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {availableForms.map(form => (
          <div
            key={form.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
              ${gameState.activeEggFormIds.includes(form.id) ? 'bg-emerald-700/50 border-emerald-500 ring-2 ring-emerald-400' : 'bg-slate-800 border-slate-700 hover:bg-slate-700/70'}`}
            onClick={() => onToggleEggForm(form.id)}
          >
            <h3 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
              <i className={`${form.icon} ${gameState.activeEggFormIds.includes(form.id) ? 'text-emerald-300' : 'text-slate-400'}`}></i>
              {form.name} {form.isLegendary && <span className="text-xs text-yellow-400">(Lendário)</span>}
            </h3>
            <p className="text-xs text-slate-300 mt-1">{form.activePassive}</p>
            <p className="text-xs text-slate-400 mt-0.5">{form.collectionBonusDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EggFormsPanel;