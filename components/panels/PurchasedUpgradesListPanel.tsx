
import React from 'react';
import { GameState } from '../../types';
import { formatNumber } from '../../utils';

interface PurchasedUpgradesListPanelProps {
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
}

const PurchasedUpgradesListPanel: React.FC<PurchasedUpgradesListPanelProps> = ({ gameState, isOpen, onClose }) => {
  const regularUpgrades = gameState.upgradesData.filter(upg => upg.purchased.gt(0));
  const transcendentalBonuses = gameState.transcendentalBonusesData.filter(b => b.purchased.gt(0));
  const etPermanentUpgrades = gameState.etPermanentUpgradesData.filter(epu => epu.purchased.gt(0));
  const specialUpgrades = gameState.specialUpgradesData.filter(su => su.purchased.equals(1));
  const activeAbilities = gameState.activeAbilitiesData.filter(aa => aa.purchased);
  const legendaryUpgrades = gameState.legendaryUpgradesData.filter(lu => lu.activated);
  const secretRuptureUpgrades = gameState.secretRuptureUpgradesData.filter(sru => sru.obtained);
  const embryoUpgrades = gameState.embryoUpgradesData.filter(eu => eu.purchased.gt(0)); // Changed to gt(0) for stackable

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

  if (!isOpen) {
    return null;
  }

  if (allPurchasedItems.length === 0 && isOpen) { 
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[var(--bg-panel-secondary)] bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-[var(--border-accent)] text-[var(--text-primary)] p-4 sm:p-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-[var(--title-summary-panel)] text-lg sm:text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-archive"></i> Sumário de Aquisições
                </h2>
                <button
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-accent-hover)] transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]"
                    aria-label="Fechar Sumário"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>
            <p className="text-center text-[var(--text-secondary)]">Nenhuma aquisição feita ainda.</p>
        </div>
    );
  }

  const renderSection = (title: string, items: any[], colorClassVar: string, showQuantity: boolean = false) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-3">
        <h4 className={`text-sm font-semibold mb-1.5 text-[${colorClassVar}]`}>{title}</h4>
        <div className="space-y-1">
          {items.map(item => (
            <div
              key={item.id}
              className="p-1.5 bg-[var(--bg-interactive)] rounded border border-[var(--border-secondary)] flex justify-between items-center"
            >
              <div className="flex items-center gap-1.5">
                <i className={`${item.icon} text-[${colorClassVar}] text-xs`}></i>
                <span className="text-[var(--text-primary)] text-xs">{item.name}</span>
              </div>
              {showQuantity && 'purchased' in item && item.purchased.gt(0) && (
                <span className="text-emerald-400 font-medium text-xs"> {/* Consider theming this specific color */}
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
    <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[var(--bg-panel-secondary)] bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-[var(--border-accent)] text-[var(--text-primary)] transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }}
    >
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[var(--title-summary-panel)] text-lg sm:text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-archive"></i> Sumário de Aquisições
                </h2>
                <button
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-accent-hover)] transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]"
                    aria-label="Fechar Sumário"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>

            <div className="max-h-[calc(70vh-100px)] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {renderSection("Melhorias Regulares (PI)", regularUpgrades, "var(--title-regular-upgrades)", true)}
                {renderSection("Bônus Transcendentais (ET)", transcendentalBonuses, "var(--title-et-bonuses)", true)}
                {renderSection("Melhorias Permanentes (ET)", etPermanentUpgrades, "var(--title-et-permanent)", true)}
                {renderSection("Melhorias de Estágio", specialUpgrades, "var(--title-special-upgrades)")}
                {renderSection("Habilidades Ativas Compradas", activeAbilities, "var(--title-active-abilities)")}
                {renderSection("Relíquias Lendárias Ativadas", legendaryUpgrades, "var(--title-legendary-secret)")}
                {renderSection("Segredos da Ruptura Obtidos", secretRuptureUpgrades, "var(--title-secrets-subheader)")}
                {renderSection("Melhorias do Embrião Adquiridas", embryoUpgrades, "var(--title-embryo-panel)", true)}
            </div>
        </div>
    </div>
  );
};

export default PurchasedUpgradesListPanel;