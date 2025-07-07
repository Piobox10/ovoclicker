
import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState, CollectibleEggDefinition } from '../../types';
import { COLLECTIBLE_EGG_DEFINITIONS, FIXED_EGG_SHOP_COSTS } from '../../constants/collectibles';
import { COLLECTIBLE_EGG_RARITY_STYLES } from '../../constants';
import { formatNumber, playSound } from '../../utils';

interface FixedEggShopPanelProps {
  gameState: Pick<GameState, 'eggFragments' | 'isSoundEnabled'>;
  onBuyEgg: (definitionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FixedEggShopPanel: React.FC<FixedEggShopPanelProps> = ({ gameState, onBuyEgg, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  // Filter eggs that have a defined cost for their rarity
  const buyableEggs = COLLECTIBLE_EGG_DEFINITIONS.filter(def => {
    return FIXED_EGG_SHOP_COSTS[def.rarity] !== undefined;
  });

  return (
    <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl bg-[var(--bg-panel-secondary)] bg-opacity-95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-amber-600 text-[var(--text-primary)] transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }}
    >
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-amber-500 text-lg sm:text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-store"></i> Loja de Ovos (Fragmentos)
                </h2>
                <button
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-amber-400 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-label="Fechar Loja de Ovos"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>
            <p className="text-xs text-center text-[var(--text-secondary)] mb-3">
              Troque seus Fragmentos de Ovo por ovos específicos! <br/> Fragmentos Atuais: <span className="font-bold text-orange-400">{formatNumber(gameState.eggFragments)}</span>
            </p>

            {buyableEggs.length === 0 ? (
                <p className="text-center text-[var(--text-secondary)] py-4">Nenhum ovo disponível na loja no momento.</p>
            ) : (
                <div className="max-h-[calc(70vh-150px)] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {buyableEggs.map((definition) => {
                            const cost = FIXED_EGG_SHOP_COSTS[definition.rarity];
                            if (!cost) return null; // Should not happen due to filter, but good practice

                            const rarityStyle = COLLECTIBLE_EGG_RARITY_STYLES[definition.rarity] || COLLECTIBLE_EGG_RARITY_STYLES['Comum'];
                            const canAfford = gameState.eggFragments.gte(cost);

                            return (
                                <div
                                    key={definition.id}
                                    className={`p-3 rounded-lg border ${rarityStyle.border} ${rarityStyle.bg} ${rarityStyle.shadow || 'shadow-md'} flex flex-col justify-between`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <h4 className={`text-sm font-bold ${rarityStyle.nameColor} flex items-center gap-1.5`}>
                                                <i className={`${definition.icon} text-xl ${rarityStyle.text}`}></i>
                                                {definition.name}
                                            </h4>
                                            <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${rarityStyle.badgeBg} ${rarityStyle.badgeText}`}>
                                                {definition.rarity}
                                            </span>
                                        </div>
                                        <p className={`text-[11px] mb-1 ${rarityStyle.text} opacity-80`}>{definition.description}</p>
                                    </div>
                                    <div className="mt-auto">
                                        <p className={`text-xs text-center font-semibold mb-1.5 ${rarityStyle.text}`}>
                                            Custo: <span className="text-orange-400">{formatNumber(cost)}</span> Fragmentos
                                        </p>
                                        <button
                                            onClick={() => onBuyEgg(definition.id)}
                                            disabled={!canAfford}
                                            className={`w-full py-1.5 px-3 text-xs font-semibold rounded-md shadow-sm transition-all duration-200 active:scale-95
                                                        ${canAfford ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                                    : 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-70'}`}
                                        >
                                            {canAfford ? 'Comprar Ovo' : 'Fragmentos Insuficientes'}
                                        </button>
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

export default FixedEggShopPanel;
