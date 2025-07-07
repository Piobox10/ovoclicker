
import React from 'react';
import { Decimal } from 'decimal.js';
import { SpecialUpgrade } from '../types';
import { formatNumber } from '../utils'; // Keep formatNumber for potential display needs

interface SpecialUpgradeItemProps {
  sUpgrade: SpecialUpgrade;
  isUnlocked: boolean;
  currentTemporaryEggs?: Decimal; // Still needed for display if 'stage9Bonus' is active
}

const SpecialUpgradeItem: React.FC<SpecialUpgradeItemProps> = ({ sUpgrade, isUnlocked, currentTemporaryEggs }) => {
  if (!isUnlocked) {
    return null;
  }

  const isActivated = sUpgrade.purchased.equals(1);
  
  return (
    <div className={`bg-[var(--bg-panel-secondary)] border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col gap-2 shadow-md transition-shadow duration-200 ${isActivated ? 'border-emerald-500 opacity-90' : 'border-slate-700 opacity-50'}`}>
      <h3 className="text-[var(--text-primary)] text-base sm:text-lg font-semibold flex items-center gap-2">
        <i className={`${sUpgrade.icon} ${isActivated ? 'text-yellow-400' : 'text-slate-500'} text-lg sm:text-xl`}></i> 
        {sUpgrade.name}
        {isActivated && <span className="text-xs text-emerald-400 ml-auto">(Ativo)</span>}
      </h3>
      <p className="text-[var(--text-secondary)] text-xs sm:text-sm">{sUpgrade.description}</p>
      {sUpgrade.id === 'stage9Bonus' && isActivated && currentTemporaryEggs && formatNumber && (
         <p className="text-xs text-[var(--text-secondary)]">Ovos Temporários na ativação: {formatNumber(currentTemporaryEggs)}</p>
      )}
       {!isActivated && (
        <p className="text-xs text-[var(--text-secondary)] text-center mt-1">Será ativado automaticamente ao atingir o estágio.</p>
      )}
    </div>
  );
};

export default SpecialUpgradeItem;