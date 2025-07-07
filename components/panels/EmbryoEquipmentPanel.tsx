
import React from 'react';
import { EmbryoEquipmentPanelProps, EmbryoEquipmentSlotKey, EmbryoItem } from '../../types';
import { RARITY_COLORS_EMBRYO } from '../../constants';
import CollapsibleSection from '../CollapsibleSection';

const EmbryoEquipmentPanel: React.FC<EmbryoEquipmentPanelProps> = ({ 
  equippedItems = { weapon: null, armor: null, passiveChip: null, especial: null }, // Default value
  allItemsData, // This should now be gameState.embryoInventory
  onOpenInventoryModal, 
  onUnequipItem 
}) => {
  const slots: EmbryoEquipmentSlotKey[] = ['weapon', 'armor', 'passiveChip', 'especial'];
  const slotDisplayNames: Record<EmbryoEquipmentSlotKey, string> = {
    weapon: 'Arma',
    armor: 'Armadura',
    passiveChip: 'Chip Passivo',
    especial: 'Especial'
  };

  // allItemsData is now expected to be the inventory itself, which contains instances with instanceIds
  const getEquippedItemDetails = (itemInstanceId: string | null): EmbryoItem | null => {
    if (!itemInstanceId) return null;
    return allItemsData.find(item => item.instanceId === itemInstanceId) || null;
  };

  return (
    <CollapsibleSection title="Equipamento do Embrião" titleIcon="fas fa-user-shield" initiallyOpen={false}>
      <div className="space-y-3">
        {slots.map(slotKey => {
          const equippedItemInstanceId = equippedItems[slotKey];
          const itemDetails = getEquippedItemDetails(equippedItemInstanceId);
          const rarityStyle = itemDetails ? RARITY_COLORS_EMBRYO[itemDetails.rarity] : RARITY_COLORS_EMBRYO['Common'];

          return (
            <div key={slotKey} className={`p-3 rounded-lg border ${itemDetails ? rarityStyle.border : 'border-slate-600'} ${itemDetails ? rarityStyle.bg : 'bg-slate-800/50'}`}>
              <h5 className="text-sm font-semibold text-slate-300 mb-1">{slotDisplayNames[slotKey]}</h5>
              {itemDetails ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className={`${itemDetails.icon} ${rarityStyle.text}`}></i>
                    <span className={`${rarityStyle.text} text-xs`}>{itemDetails.fusedName || itemDetails.name}</span>
                  </div>
                  <button 
                    onClick={() => onUnequipItem(slotKey)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white py-0.5 px-2 rounded"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Vazio</p>
              )}
              <button
                onClick={() => onOpenInventoryModal(slotKey)}
                className={`mt-2 w-full text-xs py-1 px-2 rounded 
                  ${itemDetails ? 'bg-sky-600 hover:bg-sky-700' : 'bg-lime-600 hover:bg-lime-700'} text-white`}
              >
                {itemDetails ? 'Trocar' : 'Equipar'}
              </button>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
};

export default EmbryoEquipmentPanel;