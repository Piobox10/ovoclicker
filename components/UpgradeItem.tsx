import React from 'react';
import { Decimal } from 'decimal.js';
import { UpgradeBase, EtPermanentUpgrade } from '../types';

interface UpgradeItemProps {
  upgrade: UpgradeBase | EtPermanentUpgrade;
  currency: Decimal;
  currencySymbol: string; 
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

  const buttonBgVar = upgradeType === 'et_permanent' ? 'var(--button-secondary-bg)' : 'var(--button-primary-bg)';
  const buttonHoverBgVar = upgradeType === 'et_permanent' ? 'var(--button-secondary-hover-bg)' : 'var(--button-primary-hover-bg)';
  const iconColorVar = upgradeType === 'et_permanent' ? 'text-teal-400' : 'text-[var(--text-accent)]'; // Keep specific color for ET perm, or make new var

  return (
    <div className={`bg-[var(--bg-panel-secondary)] border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow duration-200 ${isMaxLevelReached ? 'border-[var(--border-secondary)] opacity-70' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`}>
      <h3 className="text-[var(--text-primary)] text-base sm:text-lg font-semibold flex items-center gap-2">
        <i className={`${upgrade.icon} ${iconColorVar} text-lg sm:text-xl`}></i> {upgrade.name}
      </h3>
      <p className="text-[var(--text-secondary)] text-xs sm:text-sm">{upgrade.description}</p>
      <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
        Custo: <span className="font-medium text-[var(--text-emphasized)]">{isMaxLevelReached ? "MAX" : `${formatNumber(cost1x)} ${currencySymbol}`}</span>
      </p>
      <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
        Comprados: <span className="font-medium text-emerald-400">{formatNumber(upgrade.purchased)}</span> {/* Keep specific color for "purchased" or make var */}
        {'maxLevel' in upgrade && upgrade.maxLevel && <span className="text-[var(--text-secondary)]"> / {formatNumber(upgrade.maxLevel)}</span>}
      </p>
      {!isMaxLevelReached ? (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <button
            onClick={() => onBuy(upgrade.id, new Decimal(1), upgradeType)}
            disabled={!canAfford1x}
            className={`flex-1 text-[var(--text-on-button-primary)] font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled-bg)] disabled:text-[var(--button-disabled-text)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]`}
            style={{ backgroundColor: canAfford1x ? buttonBgVar : undefined }}
            onMouseEnter={e => { if (canAfford1x) e.currentTarget.style.backgroundColor = buttonHoverBgVar; }}
            onMouseLeave={e => { if (canAfford1x) e.currentTarget.style.backgroundColor = buttonBgVar; }}
          >
            Comprar 1x
          </button>
          <button
            onClick={() => onBuy(upgrade.id, new Decimal(10), upgradeType)}
            disabled={!canAfford10x}
            className={`flex-1 text-[var(--text-on-button-primary)] font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled-bg)] disabled:text-[var(--button-disabled-text)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]`}
            style={{ backgroundColor: canAfford10x ? buttonBgVar : undefined }}
            onMouseEnter={e => { if (canAfford10x) e.currentTarget.style.backgroundColor = buttonHoverBgVar; }}
            onMouseLeave={e => { if (canAfford10x) e.currentTarget.style.backgroundColor = buttonBgVar; }}
          >
            Comprar 10x
          </button>
          <button
            onClick={() => onBuy(upgrade.id, 'max', upgradeType)}
            disabled={!canAffordMax}
            className={`flex-1 text-[var(--text-on-button-primary)] font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled-bg)] disabled:text-[var(--button-disabled-text)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]`}
            style={{ backgroundColor: canAffordMax ? buttonBgVar : undefined }}
            onMouseEnter={e => { if (canAffordMax) e.currentTarget.style.backgroundColor = buttonHoverBgVar; }}
            onMouseLeave={e => { if (canAffordMax) e.currentTarget.style.backgroundColor = buttonBgVar; }}
          >
            Comprar Máx ({formatNumber(maxPurchases)})
          </button>
        </div>
      ) : (
         <p className="text-center text-emerald-400 font-semibold mt-2 text-sm">Nível Máximo Atingido!</p>
      )}
    </div>
  );
};

export default UpgradeItem;
