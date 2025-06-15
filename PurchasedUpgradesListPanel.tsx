
import React from 'react';
import { GameState } from '../../types';
import { formatNumber } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';

interface PurchasedUpgradesListPanelProps {
  // gameState: Pick<GameState, 'upgradesData'>; // Old prop
  gameState: GameState; // Now receives full gameState
}

const PurchasedUpgradesListPanel: React.FC<PurchasedUpgradesListPanelProps> = ({ gameState }) => {
  const regularUpgrades = gameState.upgradesData.filter(upg => upg.purchased.gt(0));
  const transcendentalBonuses = gameState.transcendentalBonusesData.filter(b => b.purchased.gt(0));
  const etPermanentUpgrades = gameState.etPermanentUpgradesData.filter(epu => epu.purchased.gt(0));
  const specialUpgrades = gameState.specialUpgradesData.filter(su => su.purchased.equals(1));
  const activeAbilities = gameState.activeAbilitiesData.filter(aa => aa.purchased);
  const legendaryUpgrades = gameState.legendaryUpgradesData.filter(lu => lu.activated);
  const secretRuptureUpgrades = gameState.secretRuptureUpgradesData.filter(sru => sru.obtained);
  const embryoUpgrades = gameState.embryoUpgradesData.filter(eu => eu.purchased);

  const allPurchasedItems = [
    ...regularUpgrades,
    ...transcendentalBonuses,
    ...etPermanentUpgrades,
    ...specialUpgrades,
    ...activeAbilities,
    ...legendaryUpgrades,
    ...secretRuptureUpgrades,
    ...embryoUpgrades,
  ];

  if (allPurchasedItems.length === 0) {
    return null; // Don't render if nothing is purchased/activated
  }

  const renderSection = (title: string, items: any[], colorClass: string, showQuantity: boolean = false) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-3">
        <h4 className={`text-sm font-semibold mb-1.5 ${colorClass}`}>{title}</h4>
        <div className="space-y-1">
          {items.map(item => (
            <div
              key={item.id}
              className="p-1.5 bg-slate-800/70 rounded border border-slate-700 flex justify-between items-center"
            >
              <div className="flex items-center gap-1.5">
                <i className={`${item.icon} ${colorClass} text-xs`}></i>
                <span className="text-slate-300 text-xs">{item.name}</span>
              </div>
              {showQuantity && 'purchased' in item && item.purchased.gt(0) && (
                <span className="text-emerald-400 font-medium text-xs">
                  x{formatNumber(item.purchased)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <CollapsibleSection title="Sumário de Aquisições" titleIcon="fas fa-archive" initiallyOpen={false}>
        <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {renderSection("Melhorias Regulares (PI)", regularUpgrades, "text-indigo-400", true)}
            {renderSection("Bônus Transcendentais (ET)", transcendentalBonuses, "text-purple-400", true)}
            {renderSection("Melhorias Permanentes (ET)", etPermanentUpgrades, "text-teal-400", true)}
            {renderSection("Melhorias de Estágio", specialUpgrades, "text-yellow-400")}
            {renderSection("Habilidades Ativas Compradas", activeAbilities, "text-red-400")}
            {renderSection("Relíquias Lendárias Ativadas", legendaryUpgrades, "text-yellow-500")}
            {renderSection("Segredos da Ruptura Obtidos", secretRuptureUpgrades, "text-fuchsia-400")}
            {renderSection("Melhorias do Embrião Adquiridas", embryoUpgrades, "text-lime-400")}
        </div>
    </CollapsibleSection>
  );
};

export default PurchasedUpgradesListPanel;
