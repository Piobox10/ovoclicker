import React from 'react';
import { Decimal } from 'decimal.js';
import { useGameContext } from '../../contexts/GameContext';
import { EmbryoItem, FusedAttribute } from '../../types';
import { RARITY_COLORS_EMBRYO } from '../../constants';
import { MIN_FUSION_ITEMS, MAX_FUSION_ITEMS } from '../../constants/fusion'; 
import { formatNumber } from '../../utils';

const FusionWorkshopPanelComponent: React.FC = () => {
    const { 
        gameState, 
        toggleFusionSelection, 
        fuseItems, 
        rerollFusedItemAttributes 
    } = useGameContext();
    const { embryoInventory, fusionSelectedInventoryItemIds, lastFusedItem, transcendentEssence } = gameState;

    const selectedItemsDetails: EmbryoItem[] = fusionSelectedInventoryItemIds
        .map(instanceId => embryoInventory.find(item => item.instanceId === instanceId))
        .filter(Boolean) as EmbryoItem[];

    const canFuse = selectedItemsDetails.length >= MIN_FUSION_ITEMS && selectedItemsDetails.length <= MAX_FUSION_ITEMS;

    return (
        <div className="w-full bg-[var(--bg-panel-primary)] rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)]">
        <h2 className="text-[var(--title-crafting-workshop)] text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
            <i className="fas fa-atom-alt mr-2"></i>Oficina de Fusão
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-panel-secondary)] p-3 rounded-lg border border-[var(--border-secondary)]">
            <h3 className="text-sm font-semibold text-[var(--text-accent)] mb-2">Inventário do Embrião (Selecionar {MIN_FUSION_ITEMS}-{MAX_FUSION_ITEMS})</h3>
            {embryoInventory.filter(item => !item.isFused).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Inventário de chips base vazio.</p>
            ) : (
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {embryoInventory.map(item => {
                    if (item.isFused || !item.instanceId) return null;
                    const isSelected = fusionSelectedInventoryItemIds.includes(item.instanceId);
                    const rarityStyle = RARITY_COLORS_EMBRYO[item.rarity];
                    return (
                    <div key={item.instanceId} onClick={() => toggleFusionSelection(item.instanceId!)} className={`p-2 rounded-md border cursor-pointer flex items-center gap-2 transition-all ${isSelected ? `${rarityStyle.border} ring-2 ${rarityStyle.border} bg-opacity-40 ${rarityStyle.bg}` : `${rarityStyle.border} bg-opacity-20 ${rarityStyle.bg} hover:bg-opacity-30`}`}>
                        <input type="checkbox" checked={isSelected} readOnly className="form-checkbox h-4 w-4 text-lime-500 bg-slate-700 border-slate-600 rounded focus:ring-lime-400 cursor-pointer" />
                        <i className={`${item.icon} ${rarityStyle.text} text-sm`}></i>
                        <span className={`text-xs font-medium ${rarityStyle.text}`}>{item.name} ({item.rarity})</span>
                    </div>
                    );
                })}
                </div>
            )}
            <button onClick={fuseItems} disabled={!canFuse} className="w-full mt-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95">
                <i className="fas fa-magic mr-2"></i>Fusionar Itens ({selectedItemsDetails.length})
            </button>
            </div>

            <div className="bg-[var(--bg-panel-secondary)] p-3 rounded-lg border border-[var(--border-secondary)]">
            <h3 className="text-sm font-semibold text-[var(--text-accent)] mb-2">Último Item Fundido</h3>
            {lastFusedItem ? (
                <div className={`p-3 rounded-lg border ${RARITY_COLORS_EMBRYO[lastFusedItem.rarity || 'Common'].border} ${RARITY_COLORS_EMBRYO[lastFusedItem.rarity || 'Common'].bg} bg-opacity-30`}>
                <p className={`text-sm font-medium ${RARITY_COLORS_EMBRYO[lastFusedItem.rarity || 'Common'].text} mb-1`}><i className={`${lastFusedItem.icon} mr-1.5`}></i>{lastFusedItem.fusedName || lastFusedItem.name}</p>
                <p className="text-xs text-slate-300 mb-2">{lastFusedItem.description}</p>
                <ul className="space-y-1 text-xs mb-2">
                    {lastFusedItem.fusedAttributes?.map((attr, index) => (
                    <li key={index} className={`p-1 bg-slate-700/50 rounded-md border ${attr.value && attr.value.isNegative() ? 'border-red-500' : 'border-slate-600'}`}>
                        <span className={`${attr.value && attr.value.isNegative() ? 'text-red-400' : (attr.isSpecialEffect ? 'text-purple-300' : 'text-green-300')}`}>{attr.description}</span>
                    </li>
                    ))}
                </ul>
                {lastFusedItem.rerollCostET && lastFusedItem.rerollCostET.gt(0) && (
                    <button onClick={rerollFusedItemAttributes} disabled={transcendentEssence.lt(lastFusedItem.rerollCostET)} className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Rerolar Atributos ({formatNumber(lastFusedItem.rerollCostET)} ET)
                    </button>
                )}
                </div>
            ) : (
                <p className="text-xs text-slate-400 text-center py-4">Nenhum item fundido recentemente.</p>
            )}
            </div>
        </div>
        </div>
    );
};

export { FusionWorkshopPanelComponent as FusionWorkshopPanel };
