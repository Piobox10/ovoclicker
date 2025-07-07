
import React, { useState } from 'react';
import { Decimal } from 'decimal.js';
import { EmbryoItem, EmbryoShopPanelProps, EmbryoStoreItemCategory, GameState } from '../../types'; // Added GameState for embryoInventory access
import { RARITY_COLORS_EMBRYO } from '../../constants';
import { formatNumber } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';

// EmbryoShopPanelProps already includes embryoInventory from types/Embryo.ts

const EmbryoShopPanel: React.FC<EmbryoShopPanelProps> = ({ shopItems, playerResources, onBuyItem, embryoInventory }) => {
  const categories: EmbryoStoreItemCategory[] = ['Ofensivo', 'Defensivo', 'Passivo', 'Especial'];
  const [activeTab, setActiveTab] = useState<EmbryoStoreItemCategory>(categories[0]);

  const itemsInCategory = shopItems.filter(item => item.storeCategory === activeTab);

  const getCurrencySymbol = (currency: EmbryoItem['cost'][number]['currency']) => {
    if (currency === 'modularEXP') return 'EXP Mod.';
    if (currency === 'incubationPower') return 'PI';
    if (currency === 'transcendentEssence') return 'ET';
    return '';
  };

  const canAfford = (item: EmbryoItem) => {
    return item.cost.every(costPart => {
        if (costPart.currency === 'modularEXP') return playerResources.modularEXP.gte(costPart.amount);
        if (costPart.currency === 'incubationPower') return playerResources.incubationPower.gte(costPart.amount);
        if (costPart.currency === 'transcendentEssence') return playerResources.transcendentEssence.gte(costPart.amount);
        return false;
    });
  };

  // isOwned check is removed as items are now stackable by instance

  return (
    <CollapsibleSection title="Loja do Embrião" titleIcon="fas fa-store" initiallyOpen={false}>
      <div className="flex border-b border-lime-700 mb-3">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex-1 py-2 px-1 text-xs sm:text-sm font-medium transition-colors duration-200
              ${activeTab === category 
                ? 'border-b-2 border-lime-400 text-lime-300' 
                : 'text-slate-400 hover:text-lime-400'}`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {itemsInCategory.length > 0 ? itemsInCategory.map(item => {
          const rarityStyle = RARITY_COLORS_EMBRYO[item.rarity];
          const itemCanBeAfforded = canAfford(item);
          
          return (
            <div key={item.id} className={`p-3 rounded-lg border ${rarityStyle.border} ${rarityStyle.bg} shadow-md`}>
              <h4 className={`text-sm font-semibold ${rarityStyle.text} flex items-center gap-2`}>
                <i className={`${item.icon} ${rarityStyle.text}`}></i> {item.name} 
                <span className="ml-auto text-xs font-normal text-slate-400">({item.rarity})</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1">{item.description}</p>
              {item.effects.length > 0 && (
                <div className="mt-1 text-xs">
                  <span className="text-slate-400">Efeitos:</span>
                  {item.effects.map((eff, i) => (
                    <span key={i} className={`ml-1 ${eff.value.isPositive() ? 'text-green-400' : 'text-red-400'}`}>
                      {eff.stat}: {eff.type === 'flat' ? formatNumber(eff.value) : `${eff.value.times(100).toFixed(0)}%`}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-amber-400 mt-1">
                Custo: {item.cost.map(c => `${formatNumber(c.amount)} ${getCurrencySymbol(c.currency)}`).join(' + ')}
              </p>
              <button
                onClick={() => onBuyItem(item.id)}
                disabled={!itemCanBeAfforded}
                className={`mt-2 w-full text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm transition-all duration-200 
                  ${itemCanBeAfforded ? 'bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 active:scale-95' 
                                     : 'bg-slate-600 cursor-not-allowed opacity-70'}`}
              >
                Comprar
              </button>
            </div>
          );
        }) : <p className="text-xs text-slate-400 text-center py-4">Nenhum item nesta categoria.</p>}
      </div>
    </CollapsibleSection>
  );
};

export default EmbryoShopPanel;
