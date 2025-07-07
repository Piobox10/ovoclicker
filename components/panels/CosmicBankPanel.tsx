
import React, { useState } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, CosmicBankResourceType, EtPermanentUpgrade, LegendaryUpgrade } from '../../types';
import { formatNumber, formatTime } from '../../utils';

interface CosmicBankPanelProps {
  gameState: Pick<GameState, 'incubationPower' | 'transcendentEssence' | 'modularEXP' | 'cosmicBank' | 'etPermanentUpgradesData' | 'legendaryUpgradesData' | 'transcendenceCount'>; // Added legendaryUpgradesData and transcendenceCount
  onDeposit: (resourceType: CosmicBankResourceType, amount: Decimal) => void;
  onWithdraw: (resourceType: CosmicBankResourceType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CosmicBankPanel: React.FC<CosmicBankPanelProps> = ({ gameState, onDeposit, onWithdraw, isOpen, onClose }) => {
  const [depositAmounts, setDepositAmounts] = useState<{ [key in CosmicBankResourceType]: string }>({
    pi: '',
    et: '',
    modularExp: '',
  });

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (resourceType: CosmicBankResourceType, value: string) => {
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0) || value === '.') {
        setDepositAmounts(prev => ({ ...prev, [resourceType]: value }));
    }
  };
  
  const getResourceDetails = (type: CosmicBankResourceType) => {
    switch (type) {
      case 'pi':
        return { name: "Pontos de Impacto", available: gameState.incubationPower, icon: 'fas fa-bullseye', color: 'text-violet-400', bankInfo: gameState.cosmicBank.pi };
      case 'et':
        return { name: "Essência Transcendental", available: gameState.transcendentEssence, icon: 'fas fa-atom', color: 'text-pink-400', bankInfo: gameState.cosmicBank.et };
      case 'modularExp':
        return { name: "XP Modular", available: gameState.modularEXP, icon: 'fas fa-microchip', color: 'text-emerald-400', bankInfo: gameState.cosmicBank.modularExp };
      default:
        throw new Error("Unknown resource type");
    }
  };

  const calculateTimeElapsed = (timestamp: number | null): Decimal => {
    if (!timestamp) return new Decimal(0);
    return new Decimal(Date.now() - timestamp).dividedBy(1000); // in seconds
  };
  
  const calculateSimulatedInterest = (
    bankedAmount: Decimal, 
    timeElapsedSeconds: Decimal,
    etPermanentUpgrades: EtPermanentUpgrade[],
    legendaryUpgrades: LegendaryUpgrade[], 
    transcendenceCount: Decimal
  ): Decimal => {
    if (bankedAmount.isZero() || timeElapsedSeconds.isZero()) return new Decimal(0);
    
    let interestRatePerSecond = new Decimal(0.0001); // Base rate

    // Apply Banco Cósmico bonus from ET Permanent Upgrades
    const bancoCosmicoUpgrade = etPermanentUpgrades.find(upg => upg.id === 'bancoCosmico' && upg.purchased.gt(0));
    if (bancoCosmicoUpgrade && bancoCosmicoUpgrade.effect.bankInterestBonusPerLevel) {
        const bonusPerLevel = bancoCosmicoUpgrade.effect.bankInterestBonusPerLevel as Decimal;
        const totalBonusMultiplier = new Decimal(1).plus(bonusPerLevel.times(bancoCosmicoUpgrade.purchased));
        interestRatePerSecond = interestRatePerSecond.times(totalBonusMultiplier);
    }

    let baseInterest = bankedAmount.times(interestRatePerSecond).times(timeElapsedSeconds);

    // Apply Compounder Core bonus from Legendary Upgrades
    const compounderCoreLegendary = legendaryUpgrades.find(lu => lu.id === 'compounderCore' && lu.activated);
    if (compounderCoreLegendary && transcendenceCount.gt(0)) {
        const compounderBonusMultiplier = new Decimal(1).plus(new Decimal(0.01).times(transcendenceCount));
        baseInterest = baseInterest.times(compounderBonusMultiplier);
    }

    return baseInterest.toDecimalPlaces(2, Decimal.ROUND_DOWN);
  };

  return (
    <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-[var(--bg-panel-secondary)] bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-[var(--border-accent)] text-[var(--text-primary)] transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }}
    >
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[var(--title-cosmic-bank)] text-lg sm:text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-landmark"></i> Banco Cósmico
                </h2>
                <button
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-accent-hover)] transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]"
                    aria-label="Fechar Banco Cósmico"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>

            <div className="space-y-4 max-h-[calc(80vh-100px)] overflow-y-auto custom-scrollbar pr-2">
                {(['pi', 'et', 'modularExp'] as CosmicBankResourceType[]).map(type => {
                const details = getResourceDetails(type);
                const timeElapsed = calculateTimeElapsed(details.bankInfo.depositTimestamp);
                const simulatedInterest = calculateSimulatedInterest(
                    details.bankInfo.depositedAmount, 
                    timeElapsed, 
                    gameState.etPermanentUpgradesData,
                    gameState.legendaryUpgradesData, // Pass legendary upgrades
                    gameState.transcendenceCount // Pass transcendence count
                );
                const currentDepositInput = new Decimal(depositAmounts[type] || '0');
                const canDeposit = currentDepositInput.gt(0) && details.available.gte(currentDepositInput);

                return (
                    <div key={type} className={`p-3 sm:p-4 rounded-xl border-2 ${details.color.replace('text-', 'border-')} bg-[var(--bg-panel-primary)] shadow-md`}>
                    <h4 className={`text-base sm:text-lg font-semibold mb-2 flex items-center ${details.color}`}>
                        <i className={`${details.icon} mr-2`}></i>{details.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Disponível: <span className="font-medium">{formatNumber(details.available)}</span></p>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <input
                        type="number"
                        value={depositAmounts[type]}
                        onChange={(e) => handleInputChange(type, e.target.value)}
                        placeholder="Quantia"
                        min="0"
                        step={type === 'pi' ? "1000" : type === 'et' ? "1" : "10"}
                        className="flex-grow p-2 bg-[var(--bg-interactive)] border border-[var(--border-interactive)] rounded-md text-[var(--text-primary)] text-sm focus:ring-1 focus:ring-[var(--focus-ring-color)] focus:border-[var(--border-accent)] outline-none transition-shadow"
                        />
                        <button
                        onClick={() => {
                            const amount = new Decimal(depositAmounts[type] || '0');
                            if (amount.gt(0)) {
                            onDeposit(type, amount);
                            setDepositAmounts(prev => ({...prev, [type]: ''})); 
                            }
                        }}
                        disabled={!canDeposit}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 text-white ${canDeposit ? 'bg-green-600 hover:bg-green-700 active:scale-95' : 'bg-slate-600 opacity-50 cursor-not-allowed'}`}
                        >
                        Depositar
                        </button>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)] space-y-0.5">
                        <p>No Banco: <span className={`font-medium ${details.color}`}>{formatNumber(details.bankInfo.depositedAmount)}</span></p>
                        {details.bankInfo.depositTimestamp && (
                        <>
                            <p>Tempo: <span className="font-medium">{formatTime(timeElapsed)}</span></p>
                            <p>Juros (Simulado): <span className="font-medium text-green-400">+{formatNumber(simulatedInterest)}</span></p>
                        </>
                        )}
                    </div>
                    
                    <button
                        onClick={() => onWithdraw(type)}
                        disabled={details.bankInfo.depositedAmount.lte(0)}
                        className={`mt-2 w-full px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 text-white ${details.bankInfo.depositedAmount.gt(0) ? 'bg-red-600 hover:bg-red-700 active:scale-95' : 'bg-slate-600 opacity-50 cursor-not-allowed'}`}
                    >
                        Sacar Tudo
                    </button>
                    </div>
                );
                })}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-4 text-center">
                Nota: Juros são simulados. O banco reseta a cada transcendência.
            </p>
        </div>
    </div>
  );
};

export default CosmicBankPanel;
