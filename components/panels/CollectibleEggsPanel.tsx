
import React from 'react';
import { GameState, CollectibleEggDefinition, PlayerCollectibleEgg, CollectibleEggDisplayRarity } from '../../types';
import { COLLECTIBLE_EGG_RARITY_STYLES } from '../../constants'; 
import { ABILITY_DEFINITIONS } from '../../constants/abilities';
import { COLLECTIBLE_EGG_DEFINITIONS } from '../../constants/collectibles';
import { formatNumber } from '../../utils'; // Assuming formatNumber might be used for stats if they become Decimal

interface CollectibleEggsPanelProps {
  gameState: Pick<GameState, 'collectibleEggs'>;
  isOpen: boolean;
  onClose: () => void;
  onOpenDetailModal: (eggInstance: PlayerCollectibleEgg) => void; // New prop
}

const CollectibleEggsPanel: React.FC<CollectibleEggsPanelProps> = ({ gameState, isOpen, onClose, onOpenDetailModal }) => {
  if (!isOpen) {
    return null;
  }

  const getEggDefinition = (definitionId: string): CollectibleEggDefinition | undefined => {
    return COLLECTIBLE_EGG_DEFINITIONS.find(def => def.id === definitionId);
  };

  const getAbilityDisplay = (abilityDefId: string) => {
    const ability = ABILITY_DEFINITIONS.find(ad => ad.id === abilityDefId);
    return ability ? (
      <span className="flex items-center gap-1">
        <i className={`${ability.icon} text-xs`}></i> {ability.name}
      </span>
    ) : (
      <span>Habilidade Desconhecida</span>
    );
  };


  return (
    <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-[var(--bg-panel-secondary)] bg-opacity-95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-amber-500 text-[var(--text-primary)] transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }}
    >
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-amber-400 text-lg sm:text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-egg"></i> Ovos Colecionáveis ({gameState.collectibleEggs.length})
                </h2>
                <button
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-amber-300 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label="Fechar Painel de Ovos Colecionáveis"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>

            {gameState.collectibleEggs.length === 0 ? (
                <p className="text-center text-[var(--text-secondary)] py-4">Nenhum ovo colecionável ainda. Continue clicando!</p>
            ) : (
                <div className="max-h-[calc(80vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gameState.collectibleEggs.map((eggInstance) => {
                            const definition = getEggDefinition(eggInstance.definitionId);
                            if (!definition) return null;

                            const rarityStyle = COLLECTIBLE_EGG_RARITY_STYLES[definition.rarity] || COLLECTIBLE_EGG_RARITY_STYLES['Comum'];

                            return (
                                <div
                                    key={eggInstance.instanceId}
                                    className={`p-4 rounded-lg border-2 ${rarityStyle.border} ${rarityStyle.bg} ${rarityStyle.shadow || 'shadow-md'} transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer`}
                                    onClick={() => onOpenDetailModal(eggInstance)} // Added onClick
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Ver detalhes de ${definition.name}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className={`text-base font-bold ${rarityStyle.nameColor} flex items-center gap-2`}>
                                            <i className={`${definition.icon} text-2xl ${rarityStyle.text}`}></i>
                                            {definition.name}
                                        </h4>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${rarityStyle.badgeBg} ${rarityStyle.badgeText}`}>
                                            {definition.rarity}
                                        </span>
                                    </div>
                                    <p className={`text-xs mb-1 ${rarityStyle.text}`}>{definition.description}</p>
                                    
                                    <div className="mt-2 pt-2 border-t ${rarityStyle.border} border-opacity-50">
                                        <p className={`text-xs ${rarityStyle.text} mb-0.5`}><span className="font-semibold">Tipo:</span> {definition.type}</p>
                                        <div className={`text-xs ${rarityStyle.text} grid grid-cols-2 gap-x-2 mb-0.5`}>
                                            <p><span className="font-semibold">HP Máx:</span> {eggInstance.actualBaseStats ? eggInstance.actualBaseStats.hpMax : definition.baseStats.hpMax}</p>
                                            <p><span className="font-semibold">Ataque:</span> {eggInstance.actualBaseStats ? eggInstance.actualBaseStats.attack : definition.baseStats.attack}</p>
                                            <p><span className="font-semibold">Defesa:</span> {eggInstance.actualBaseStats ? eggInstance.actualBaseStats.defense : definition.baseStats.defense}</p>
                                            <p><span className="font-semibold">Velocidade:</span> {eggInstance.actualBaseStats ? eggInstance.actualBaseStats.speed : definition.baseStats.speed}</p>
                                        </div>
                                        {definition.abilityDefinitionIds.slice(0,1).map((abilityId, index) => ( // Show only first ability for brevity
                                            <p key={index} className={`text-xs ${rarityStyle.text} mb-0.5 truncate`}>
                                                <span className="font-semibold">Habilidade:</span> {getAbilityDisplay(abilityId)}
                                            </p>
                                        ))}
                                        <p className={`text-[10px] ${rarityStyle.text} opacity-70 text-right`}>Coletado: {new Date(eggInstance.collectedTimestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CollectibleEggsPanel;
