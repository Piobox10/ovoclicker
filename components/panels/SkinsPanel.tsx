
import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState, SkinDefinition } from '../../types';
import { SKIN_DEFINITIONS } from '../../constants/skins';
import { formatNumber } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';

interface SkinsPanelProps {
  gameState: Pick<GameState, 'incubationPower' | 'unlockedSkinIds' | 'activeSkinId'>;
  onBuySkin: (skinId: string) => void;
  onSetActiveSkin: (skinId: string) => void;
  isOpen: boolean; // To control visibility from App.tsx, similar to other panels
  onClose: () => void;
}

const SkinsPanel: React.FC<SkinsPanelProps> = ({ gameState, onBuySkin, onSetActiveSkin, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-[var(--bg-panel-secondary)] backdrop-blur-md rounded-xl shadow-2xl border-2 border-[var(--border-accent)] text-[var(--text-primary)] transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }} // Control opacity for smooth transition
    >
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-[var(--text-accent)] text-lg sm:text-xl font-bold flex items-center gap-2">
                <i className="fas fa-palette"></i> Temas Visuais
            </h2>
            <button
                onClick={onClose}
                className="text-[var(--text-secondary)] hover:text-[var(--text-accent-hover)] transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]"
                aria-label="Fechar Painel de Temas"
            >
                <i className="fas fa-times text-xl"></i>
            </button>
        </div>

        <div className="max-h-[calc(70vh-100px)] overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {SKIN_DEFINITIONS.map((skin) => {
            const isUnlocked = gameState.unlockedSkinIds.includes(skin.id);
            const isActive = gameState.activeSkinId === skin.id;
            const canAfford = gameState.incubationPower.gte(skin.cost);

            return (
              <div
                key={skin.id}
                className={`p-3 rounded-lg border bg-[var(--bg-panel-primary)] shadow-md 
                  ${isActive ? 'border-[var(--border-accent)] ring-2 ring-[var(--border-accent)]' : 'border-[var(--border-primary)]'}
                  ${!isUnlocked && !canAfford ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <i className={`${skin.icon} text-[var(--text-accent)]`}></i>
                    {skin.name}
                  </h4>
                  {skin.previewColor && (
                    <div className="w-5 h-5 rounded-full border border-slate-500" style={{ backgroundColor: skin.previewColor }}></div>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-2">{skin.description}</p>
                
                {isUnlocked ? (
                  <button
                    onClick={() => onSetActiveSkin(skin.id)}
                    disabled={isActive}
                    className={`w-full text-xs py-1.5 px-3 rounded-md font-semibold transition-colors
                      ${isActive 
                        ? 'bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-default' 
                        : 'bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover-bg)] text-[var(--text-on-button-primary)]'}`}
                  >
                    {isActive ? 'Ativo' : 'Ativar'}
                  </button>
                ) : (
                  <>
                    <p className="text-xs text-[var(--text-emphasized)] mb-1">Custo: {formatNumber(skin.cost)} PI</p>
                    <button
                      onClick={() => onBuySkin(skin.id)}
                      disabled={!canAfford}
                      className={`w-full text-xs py-1.5 px-3 rounded-md font-semibold transition-colors text-[var(--text-on-button-primary)]
                        ${canAfford 
                          ? 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)]' 
                          : 'bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'}`}
                    >
                      {canAfford ? 'Comprar' : 'PI Insuficiente'}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkinsPanel;
