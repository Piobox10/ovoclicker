import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../../types';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases, formatTime } from '../../utils';

interface TranscendencePanelProps {
  gameState: Pick<GameState, 'transcendentEssence' | 'transcendentalBonusesData' | 'etPermanentUpgradesData' | 'activeTraits' | 'specialUpgradesData' | 'achievementsData' | 'transcendenceSpamPenaltyActive' | 'embryoUpgradesData' | 'transcendenceSpamPenaltyDuration'>;
  onBuyTranscendentalBonus: (id: string, quantity: Decimal | 'max', type: 'transcendental') => void;
  onBuyEtPermanentUpgrade: (id: string, quantity: Decimal | 'max', type: 'et_permanent') => void;
  // onTranscend and calculatedRequiredPiToTranscend are removed as the button is now in App.tsx
}

const TranscendencePanel: React.FC<TranscendencePanelProps> = ({
  gameState,
  onBuyTranscendentalBonus,
  onBuyEtPermanentUpgrade,
}) => {
  return (
    <div className="transcendence-panel-wrapper w-full flex flex-col gap-3 sm:gap-4">
      <div className="transcendence-main-section w-full bg-gradient-to-b from-slate-900 to-purple-900/30 rounded-2xl p-4 sm:p-6 border border-purple-700 text-center shadow-lg">
        <h2 className="text-purple-300 text-lg sm:text-xl font-bold mb-1">
            <i className="fas fa-infinity mr-2"></i>Painel de Transcendência
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mb-1">
            Essência Transc.: <span className="font-bold text-pink-400">{formatNumber(gameState.transcendentEssence)} ET</span>
        </p>
        {/* Transcend button and PI requirement text removed from here */}
        {gameState.transcendenceSpamPenaltyActive && (
             <p className="text-xs text-red-400 mt-2 animate-pulse">Custo Espiritual Ativo! (Custo base de Upgrades Regulares +50% por {formatTime(gameState.transcendenceSpamPenaltyDuration)})</p>
        )}
      </div>

      <div className="upgrades-section w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
        <h3 className="text-purple-400 text-base sm:text-lg font-bold mb-3 text-center">
            <i className="fas fa-star mr-2"></i>Bônus Transcendentais (ET)
        </h3>
        <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {gameState.transcendentalBonusesData.map(upgrade => (
            <UpgradeItem
              key={upgrade.id}
              upgrade={upgrade}
              currency={gameState.transcendentEssence}
              currencySymbol="ET"
              onBuy={(id, quantity) => onBuyTranscendentalBonus(id, quantity, 'transcendental')}
              calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)} // Spam penalty doesn't apply
              calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
              formatNumber={formatNumber}
            />
          ))}
        </div>
      </div>

      <div className="upgrades-section w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
        <h3 className="text-teal-400 text-base sm:text-lg font-bold mb-3 text-center">
            <i className="fas fa-shield-alt mr-2"></i>Melhorias Permanentes (ET)
        </h3>
        <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {gameState.etPermanentUpgradesData.map(upgrade => (
            <UpgradeItem
              key={upgrade.id}
              upgrade={upgrade}
              currency={gameState.transcendentEssence}
              currencySymbol="ET"
              onBuy={(id, quantity) => onBuyEtPermanentUpgrade(id, quantity, 'et_permanent')}
               calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
              calculateMax={(curr, upg) => calculateGenericMaxPurchases(curr, upg, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
              formatNumber={formatNumber}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranscendencePanel;