
import React from 'react';
import { Decimal } from 'decimal.js';
import { SpecialUpgrade } from '../types';

interface SpecialUpgradeItemProps {
  sUpgrade: SpecialUpgrade;
  onBuy: (id: string) => void;
  isUnlocked: boolean;
  currentTemporaryEggs?: Decimal; // Optional, for specific upgrades like 'Forma Nula'
  formatNumber?: (num: Decimal) => string; // Optional for displaying numbers
}

const SpecialUpgradeItem: React.FC<SpecialUpgradeItemProps> = ({ sUpgrade, onBuy, isUnlocked, currentTemporaryEggs, formatNumber }) => {
  if (!isUnlocked) {
    return null;
  }

  const isPurchased = sUpgrade.purchased.equals(1);
  let canActivate = !isPurchased;

  // Specific logic for 'Forma Nula'
  if (sUpgrade.id === 'stage9Bonus' && currentTemporaryEggs && currentTemporaryEggs.lessThanOrEqualTo(0)) {
    canActivate = false;
  }
  
  return (
    <div className={`bg-slate-800 border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow duration-200 ${isPurchased ? 'border-emerald-500 opacity-70' : 'border-slate-700 hover:border-yellow-500'}`}>
      <h3 className="text-slate-100 text-base sm:text-lg font-semibold flex items-center gap-2">
        <i className={`${sUpgrade.icon} text-yellow-400 text-lg sm:text-xl`}></i> {sUpgrade.name}
      </h3>
      <p className="text-slate-300 text-xs sm:text-sm">{sUpgrade.description}</p>
      {sUpgrade.id === 'stage9Bonus' && currentTemporaryEggs && formatNumber && (
         <p className="text-xs text-slate-400">Ovos Temporários: {formatNumber(currentTemporaryEggs)}</p>
      )}
      <button
        onClick={() => onBuy(sUpgrade.id)}
        disabled={!canActivate}
        className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-800"
      >
        {isPurchased ? 'Ativado' : 'Ativar'}
      </button>
    </div>
  );
};

export default SpecialUpgradeItem;
