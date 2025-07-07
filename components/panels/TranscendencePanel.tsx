import React from 'react';
import { Decimal } from 'decimal.js';
import { useGameContext } from '../../contexts/GameContext';
import { TranscendenceInfoModalData } from '../../types';
import UpgradeItem from '../UpgradeItem';
import { formatNumber, calculateGenericUpgradeCost, calculateGenericMaxPurchases, formatTime } from '../../utils';

interface TranscendencePanelProps {
  transcendenceInfoData: TranscendenceInfoModalData;
}

const TranscendencePanel: React.FC<TranscendencePanelProps> = ({ transcendenceInfoData }) => {
  const { 
      gameState,
      buyGenericUpgradeHandler,
      finalizeTranscendence,
  } = useGameContext();

  return (
    <div className="transcendence-panel-wrapper w-full flex flex-col gap-3 sm:gap-4">
      <div className="transcendence-main-section w-full bg-gradient-to-b from-slate-900 to-purple-900/30 rounded-2xl p-4 sm:p-6 border border-purple-700 text-center shadow-lg">
        <h2 className="text-purple-300 text-lg sm:text-xl font-bold mb-1">
            <i className="fas fa-infinity mr-2"></i>Confirmação de Transcendência
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mb-1">
            PI Acumulado: <span className="font-bold text-amber-400">{formatNumber(transcendenceInfoData.accumulatedPI)}</span>
        </p>
        <p className="text-slate-300 text-xs sm:text-sm mb-1">
            ET a Ganhar: <span className="font-bold text-pink-400">+{formatNumber(transcendenceInfoData.etToGainNext)} ET</span>
        </p>
        <p className="text-slate-300 text-xs sm:text-sm mb-3">
            Novo Bônus Global: <span className="font-bold text-green-400">+{formatNumber(transcendenceInfoData.newGlobalMultiplierPercentage)}%</span>
        </p>
        
        <div className="milestones-section w-full bg-slate-800/70 rounded-xl p-3 sm:p-4 border border-slate-600 mt-1 mb-3">
          <h3 className="text-indigo-300 text-base sm:text-lg font-semibold mb-2 text-center">
            <i className="fas fa-flag-checkered mr-2"></i>Marcos da Transcendência
          </h3>
          {transcendenceInfoData.milestones.length > 0 ? (
            <ul className="space-y-1.5 max-h-[120px] sm:max-h-[150px] overflow-y-auto pr-1 custom-scrollbar-thin text-xs sm:text-sm">
              {transcendenceInfoData.milestones.map((milestone) => {
                const alreadyAchievedInPast = gameState.transcendenceCount.gte(milestone.count);
                const willAchieveThisRun = milestone.isAchieved && !alreadyAchievedInPast;
                const pending = !milestone.isAchieved;

                let className = 'p-2 rounded-md flex items-center gap-2 ';
                let titleText = '';
                let iconClass = 'fas fa-circle-notch text-slate-500';

                if (alreadyAchievedInPast) {
                  className += 'bg-green-800/50 border border-green-700 text-green-400 line-through opacity-75';
                  titleText = "Já Conquistado";
                  iconClass = 'fas fa-check-double text-green-500';
                } else if (willAchieveThisRun) {
                  className += 'bg-sky-700/60 border border-sky-500 text-sky-200 animate-pulse';
                  titleText = "Será Conquistado Nesta Transcendência!";
                  iconClass = 'fas fa-star text-yellow-400';
                } else {
                  className += 'bg-slate-700/50 border border-slate-600 text-slate-400 opacity-80';
                  titleText = `Ainda Não Conquistado (Próxima: ${milestone.count} Transc.)`;
                  iconClass = 'fas fa-hourglass-half text-slate-500';
                }
                
                return (
                  <li key={milestone.count} className={className} title={titleText}>
                    <i className={`${iconClass} mr-1.5 text-base`}></i>
                    <span><span className="font-medium">({milestone.count}x):</span> {milestone.description}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-400 text-center text-xs">Nenhum marco definido.</p>
          )}
        </div>

        {gameState.transcendenceSpamPenaltyActive && (
             <p className="text-xs text-red-400 mt-2 animate-pulse">Custo Espiritual Ativo! (Custo base de Upgrades Regulares +50% por {formatTime(gameState.transcendenceSpamPenaltyDuration)})</p>
        )}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <button onClick={() => finalizeTranscendence('essence')} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
            Caminho da Essência (+5 ET Bônus)
          </button>
          <button onClick={() => finalizeTranscendence('rupture')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
            Caminho da Ruptura (Buff de Produção)
          </button>
        </div>
      </div>

      <div className="upgrades-section w-full bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-700">
        <h3 className="text-purple-400 text-base sm:text-lg font-bold mb-3 text-center">
            <i className="fas fa-star mr-2"></i>Bônus Transcendentais (ET)
        </h3>
        <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {gameState.transcendentalBonusesData.map(upgrade => (
            <UpgradeItem
              key={upgrade.id}
              upgrade={upgrade}
              currency={gameState.transcendentEssence.plus(transcendenceInfoData.etToGainNext)}
              currencySymbol="ET"
              onBuy={(id, quantity) => buyGenericUpgradeHandler(id, quantity, 'transcendental')}
              calculateCost={(upg, qty) => calculateGenericUpgradeCost(upg, qty, undefined, gameState.activeTraits, gameState.specialUpgradesData, gameState.achievementsData, false, gameState.embryoUpgradesData)}
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
        <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {gameState.etPermanentUpgradesData.map(upgrade => (
            <UpgradeItem
              key={upgrade.id}
              upgrade={upgrade}
              currency={gameState.transcendentEssence.plus(transcendenceInfoData.etToGainNext)}
              currencySymbol="ET"
              onBuy={(id, quantity) => buyGenericUpgradeHandler(id, quantity, 'et_permanent')}
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
