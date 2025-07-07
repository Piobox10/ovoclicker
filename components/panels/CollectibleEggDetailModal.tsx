
import React from 'react';
import Modal from '../Modal';
import { PlayerCollectibleEgg, CollectibleEggDefinition, AbilityDefinition } from '../../types';
import { COLLECTIBLE_EGG_RARITY_STYLES } from '../../constants';
import { ABILITY_DEFINITIONS } from '../../constants/abilities';
import { COLLECTIBLE_EGG_DEFINITIONS } from '../../constants/collectibles';
import { formatNumber } from '../../utils';

interface CollectibleEggDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eggInstance: PlayerCollectibleEgg | null;
  eggDefinition: CollectibleEggDefinition | null;
}

const CollectibleEggDetailModal: React.FC<CollectibleEggDetailModalProps> = ({
  isOpen,
  onClose,
  eggInstance,
  eggDefinition,
}) => {
  if (!isOpen || !eggInstance || !eggDefinition) {
    return null;
  }

  const rarityStyle = COLLECTIBLE_EGG_RARITY_STYLES[eggDefinition.rarity] || COLLECTIBLE_EGG_RARITY_STYLES['Comum'];
  const actualStats = eggInstance.actualBaseStats || eggDefinition.baseStats;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={eggDefinition.name} modalClassName="max-w-lg">
      <div className={`p-4 rounded-lg border-2 ${rarityStyle.border} bg-gradient-to-br ${rarityStyle.bg} from-opacity-30 to-opacity-50`}>
        <div className="flex flex-col items-center mb-4">
          <i className={`${eggDefinition.icon} text-6xl ${rarityStyle.text} mb-2`}></i>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${rarityStyle.badgeBg} ${rarityStyle.badgeText} shadow-sm`}>
            {eggDefinition.rarity}
          </span>
        </div>

        <p className={`text-sm ${rarityStyle.text} mb-3 text-center`}>{eggDefinition.description}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">
          <p className={`${rarityStyle.text}`}><strong className={`${rarityStyle.nameColor}`}>Tipo:</strong> {eggDefinition.type}</p>
          <p className={`${rarityStyle.text}`}><strong className={`${rarityStyle.nameColor}`}>Personalidade:</strong> {eggDefinition.personality}</p>
          <p className={`${rarityStyle.text}`}><strong className={`${rarityStyle.nameColor}`}>HP Máx:</strong> {formatNumber(actualStats.hpMax)}</p>
          <p className={`${rarityStyle.text}`}><strong className={`${rarityStyle.nameColor}`}>Ataque:</strong> {formatNumber(actualStats.attack)}</p>
          <p className={`${rarityStyle.text}`}><strong className={`${rarityStyle.nameColor}`}>Defesa:</strong> {formatNumber(actualStats.defense)}</p>
          <p className={`${rarityStyle.text}`}><strong className={`${rarityStyle.nameColor}`}>Velocidade:</strong> {formatNumber(actualStats.speed)}</p>
          {actualStats.resourceMax !== undefined && (
            <p className={`${rarityStyle.text}`}><strong className={`${rarityStyle.nameColor}`}>{eggDefinition.baseStats.resourceName || 'Recurso'}:</strong> {formatNumber(actualStats.resourceMax)}</p>
          )}
        </div>

        <h5 className={`text-sm font-semibold mt-3 mb-2 ${rarityStyle.nameColor}`}>Habilidades:</h5>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {eggDefinition.abilityDefinitionIds.map(abilityId => {
            const abilityDef = ABILITY_DEFINITIONS.find(ad => ad.id === abilityId);
            if (!abilityDef) return null;
            return (
              <div key={abilityId} className={`p-2 rounded-md bg-slate-700/50 border border-slate-600`}>
                <div className={`text-xs font-semibold ${rarityStyle.text} flex items-center justify-between`}>
                  <span className="flex items-center gap-1.5">
                    <i className={`${abilityDef.icon} ${rarityStyle.text} opacity-80`}></i> {abilityDef.name}
                  </span>
                  {abilityDef.resourceCost.gt(0) && (
                    <span className={`text-xs ${rarityStyle.text} opacity-90`}>
                      Custo: {formatNumber(abilityDef.resourceCost)} {eggDefinition.baseStats.resourceName || 'Recurso'}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] ${rarityStyle.text} opacity-70 mt-0.5`}>{abilityDef.description}</p>
              </div>
            );
          })}
        </div>
         <p className={`text-[10px] ${rarityStyle.text} opacity-60 text-center mt-3`}>ID Instância: {eggInstance.instanceId}</p>
      </div>
    </Modal>
  );
};

export default CollectibleEggDetailModal;
