
import React from 'react';
import { EmbryoInventoryModalContentProps, EmbryoItem, EmbryoEquipmentType, EmbryoEquipmentSlotKey } from '../../types';
import { RARITY_COLORS_EMBRYO } from '../../constants';

const EmbryoInventoryModalContent: React.FC<EmbryoInventoryModalContentProps> = ({ inventory, currentSlot, allItemsData, onEquipItem, onClose }) => {
  if (!currentSlot) return <p className="text-slate-300">Erro: Slot não especificado.</p>;

  const slotToEquipmentType: Record<EmbryoEquipmentSlotKey, EmbryoEquipmentType> = {
    weapon: 'Weapon',
    armor: 'Armor',
    passiveChip: 'PassiveChip',
    especial: 'SpecialAccessory' 
  };
  const targetEquipmentType = slotToEquipmentType[currentSlot];

  // Filter inventory for items matching the target equipment type.
  // Each item in `inventory` is a unique instance.
  const filteredInventory = inventory.filter(item => item.equipmentType === targetEquipmentType);

  return (
    <div>
      <h4 className="text-lg font-semibold text-lime-300 mb-3">Equipar no Slot: {currentSlot.charAt(0).toUpperCase() + currentSlot.slice(1)}</h4>
      {filteredInventory.length === 0 ? (
        <p className="text-slate-400 text-center py-4">Nenhum item compatível no inventário.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredInventory.map(item => {
            const rarityStyle = RARITY_COLORS_EMBRYO[item.rarity];
            return (
              <div 
                key={item.instanceId || item.id} // Use instanceId if available, fallback to id for fused items that might use id as unique
                className={`p-3 rounded-lg border ${rarityStyle.border} ${rarityStyle.bg} cursor-pointer hover:ring-2 hover:ring-lime-400`}
                onClick={() => {
                  if (item.instanceId) { // Ensure we pass the instanceId
                     onEquipItem(item.instanceId, currentSlot);
                     onClose(); // Close modal after equipping
                  } else if (item.isFused) { // Fused items use their 'id' as the unique instance identifier
                     onEquipItem(item.id, currentSlot);
                     onClose();
                  } else {
                    console.error("Item without instanceId cannot be equipped from modal:", item);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <i className={`${item.icon} ${rarityStyle.text}`}></i>
                  <span className={`${rarityStyle.text} text-sm font-medium`}>{item.fusedName || item.name}</span>
                  <span className="ml-auto text-xs text-slate-400">({item.rarity})</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{item.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmbryoInventoryModalContent;