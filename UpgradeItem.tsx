
import React from 'react';
import { Decimal } from 'decimal.js';
import { UpgradeBase, EtPermanentUpgrade } from '../types';

interface UpgradeItemProps {
  upgrade: UpgradeBase | EtPermanentUpgrade; // Can be RegularUpgrade, TranscendentalBonus, or EtPermanentUpgrade
  currency: Decimal;
  currencySymbol: string; // "PI" or "ET"
  onBuy: (id: string, quantity: Decimal | 'max', type: 'regular' | 'transcendental' | 'et_permanent') => void;
  calculateCost: (upgrade: UpgradeBase | EtPermanentUpgrade, quantity?: Decimal, currentPurchased?: Decimal) => Decimal;
  calculateMax: (currency: Decimal, upgrade: UpgradeBase | EtPermanentUpgrade) => Decimal;
  formatNumber: (num: Decimal) => string;
  isUnlocked?: boolean;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ 
  upgrade, 
  currency, 
  currencySymbol, 
  onBuy, 
  calculateCost,
  calculateMax,
  formatNumber,
  isUnlocked = true
}) => {
  if (!isUnlocked) {
    return null;
  }

  const upgradeType = 'type' in upgrade && (upgrade.type === 'et_permanent_fixed' || upgrade.type === 'et_permanent_percentage')
    ? 'et_permanent'
    : (currencySymbol === 'ET' ? 'transcendental' : 'regular');

  const isMaxLevelReached = 'maxLevel' in upgrade && upgrade.maxLevel && upgrade.purchased.gte(upgrade.maxLevel);

  const cost1x = isMaxLevelReached ? new Decimal(Infinity) : calculateCost(upgrade, new Decimal(1));
  const canAfford1x = !isMaxLevelReached && currency.greaterThanOrEqualTo(cost1x);
  
  const cost10x = isMaxLevelReached ? new Decimal(Infinity) : calculateCost(upgrade, new Decimal(10));
  const canAfford10x = !isMaxLevelReached && currency.greaterThanOrEqualTo(cost10x);

  const maxPurchases = isMaxLevelReached ? new Decimal(0) : calculateMax(currency, upgrade);
  const canAffordMax = !isMaxLevelReached && maxPurchases.greaterThan(0);

  const getButtonClass = () => {
    if (upgradeType === 'et_permanent') {
      return "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:ring-teal-400";
    }
    return "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-400";
  };


  return (
    <div className={`bg-slate-800 border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow duration-200 ${isMaxLevelReached ? 'border-slate-600 opacity-70' : 'border-slate-700 hover:border-indigo-500'}`}>
      <h3 className="text-slate-100 text-base sm:text-lg font-semibold flex items-center gap-2">
        <i className={`${upgrade.icon} ${upgradeType === 'et_permanent' ? 'text-teal-400' : 'text-indigo-400'} text-lg sm:text-xl`}></i> {upgrade.name}
      </h3>
      <p className="text-slate-300 text-xs sm:text-sm">{upgrade.description}</p>
      <p className="text-slate-300 text-xs sm:text-sm">
        Custo: <span className="font-medium text-amber-400">{isMaxLevelReached ? "MAX" : `${formatNumber(cost1x)} ${currencySymbol}`}</span>
      </p>
      <p className="text-slate-300 text-xs sm:text-sm">
        Comprados: <span className="font-medium text-emerald-400">{formatNumber(upgrade.purchased)}</span>
        {'maxLevel' in upgrade && upgrade.maxLevel && <span className="text-slate-400"> / {formatNumber(upgrade.maxLevel)}</span>}
      </p>
      {!isMaxLevelReached ? (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <button
            onClick={() => onBuy(upgrade.id, new Decimal(1), upgradeType)}
            disabled={!canAfford1x}
            className={`flex-1 ${getButtonClass()} text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800`}
          >
            Comprar 1x
          </button>
          <button
            onClick={() => onBuy(upgrade.id, new Decimal(10), upgradeType)}
            disabled={!canAfford10x}
            className={`flex-1 ${getButtonClass()} text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800`}
          >
            Comprar 10x
          </button>
          <button
            onClick={() => onBuy(upgrade.id, 'max', upgradeType)}
            disabled={!canAffordMax}
            className={`flex-1 ${getButtonClass()} text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800`}
          >
            Comprar Max
          </button>
        </div>
      ) : (
        <p className="text-center text-teal-400 font-semibold mt-2">Nível Máximo Atingido!</p>
      )}
    </div>
  );
};

export default UpgradeItem;
