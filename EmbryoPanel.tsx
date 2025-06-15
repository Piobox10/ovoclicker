
import React from 'react';
import { Decimal } from 'decimal.js';
import { EmbryoPanelProps } from '../../types'; // Updated to use EmbryoPanelProps
import { formatNumber } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';
import EmbryoShopPanel from './EmbryoShopPanel'; 
import EmbryoEquipmentPanel from './EmbryoEquipmentPanel';

const EmbryoPanel: React.FC<EmbryoPanelProps> = ({ 
  gameState, 
  onBuyEmbryoUpgrade,
  onBuyEmbryoStoreItem,
  onOpenInventoryModal,
  onUnequipItem
}) => {
  const expProgressPercent = gameState.embryoEXPToNextLevel.isZero() ? 
    new Decimal(0) : 
    gameState.embryoCurrentEXP.dividedBy(gameState.embryoEXPToNextLevel).times(100).clamp(0, 100);

  const stats = gameState.embryoEffectiveStats;
  const upgradesDisabled = gameState.areEmbryoUpgradesDisabledThisRun;

  return (
    <div className={`embryo-section-wrapper w-full bg-gradient-to-br from-emerald-600 via-green-700 to-lime-700 rounded-xl shadow-lg border border-emerald-500 p-4 sm:p-5 h-full flex flex-col gap-3`}>
      <h2 className="text-lime-100 text-lg sm:text-xl font-bold text-center flex items-center justify-center gap-2">
        <i className={`${gameState.embryoIcon} text-lime-300 text-2xl`}></i>Ovo Embrionário
      </h2>
      <div className="text-center mb-1">
        <p className="text-base text-slate-100">
          Nível: <span className="font-bold text-lime-200">{formatNumber(gameState.embryoLevel)}</span>
        </p>
        <div className="w-full bg-slate-800 rounded-full h-3.5 my-1 border border-lime-400 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-lime-400 to-green-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${expProgressPercent.toNumber()}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-200">
          EXP: {formatNumber(gameState.embryoCurrentEXP)} / {formatNumber(gameState.embryoEXPToNextLevel)}
        </p>        
        <p className="text-xs text-slate-300 mt-0.5">
          EXP Modular Total: <span className="font-semibold text-emerald-300">{formatNumber(gameState.modularEXP)}</span>
        </p>
      </div>

      {/* Display Embryo Stats */}
      <div className="stats-display-embryo bg-slate-800/50 p-3 rounded-lg mb-1 border border-lime-800">
        <h4 className="text-sm font-semibold text-lime-200 mb-1.5 text-center">Atributos do Embrião</h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-200">
          <div>HP: 
            <span className="font-bold text-lime-300"> {formatNumber(stats.currentHp)} / {formatNumber(stats.maxHp)}</span>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-0.5 border border-lime-600 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{width: `${stats.maxHp.isZero() ? 0 : stats.currentHp.div(stats.maxHp).times(100).clamp(0,100).toNumber()}%`}}></div>
            </div>
          </div>
          <p>Ataque: <span className="font-bold text-lime-300">{formatNumber(stats.attack)}</span></p>
          <p>Defesa: <span className="font-bold text-lime-300">{formatNumber(stats.defense)}</span></p>
          <p>Velocidade: <span className="font-bold text-lime-300">{formatNumber(stats.speed)}</span></p>
          <p>Crítico: <span className="font-bold text-lime-300">{(stats.critChance.times(100)).toFixed(1)}%</span></p>
          <p>Veneno Ch.: <span className="font-bold text-lime-300">{(stats.poisonChance.times(100)).toFixed(1)}%</span></p>
          <p>Dano Chefes: <span className="font-bold text-lime-300">+{ (stats.bossDamageBonus.times(100)).toFixed(1)}%</span></p>
          <p>Golpe Duplo: <span className="font-bold text-lime-300">{(stats.doubleHitChance.times(100)).toFixed(1)}%</span></p>
          <p>Roubo Vida: <span className="font-bold text-lime-300">{(stats.lifestealRate.times(100)).toFixed(1)}%</span></p>
          <p>Efeito Caos: <span className="font-bold text-lime-300">{(stats.chaosEffectChance.times(100)).toFixed(1)}%</span></p>
          {/* New Defensive Stats */}
          <p>Atraso Inim.: <span className="font-bold text-lime-300">{(stats.enemyDelayChance.times(100)).toFixed(1)}%</span></p>
          <p>Reflexão Dano: <span className="font-bold text-lime-300">{(stats.damageReflection.times(100)).toFixed(1)}%</span></p>
          <p>Resist. Crítico: <span className="font-bold text-lime-300">{(stats.critResistance.times(100)).toFixed(1)}%</span></p>
          <p>Escudo Periód.: <span className="font-bold text-lime-300">{formatNumber(stats.periodicShieldValue)}</span></p>
          <p>Esquiva Ch.: <span className="font-bold text-lime-300">{(stats.dodgeChance.times(100)).toFixed(1)}%</span></p>
          <p>Redução Dano: <span className="font-bold text-lime-300">{(stats.overallDamageReduction.times(100)).toFixed(1)}%</span></p>
          <p>Regen. HP: <span className="font-bold text-lime-300">{(stats.hpRegenPerInterval.times(100)).toFixed(1)}%/int</span></p>
        </div>
      </div>

      {/* Genetic Upgrades Section (original) */}
      <CollapsibleSection title="Melhorias Genéticas" titleIcon="fas fa-dna" initiallyOpen={false}>
          {upgradesDisabled && <p className="text-center text-red-400 font-semibold text-xs mb-2">Melhorias do embrião desabilitadas nesta run!</p>}
          <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {gameState.embryoUpgradesData.map(upgrade => (
            <div key={upgrade.id} className={`bg-slate-800/70 border rounded-lg p-3 mb-2 shadow-md ${upgrade.purchased ? 'border-lime-500 opacity-70' : 'border-slate-600 hover:border-lime-400'}`}>
                <h4 className="text-slate-100 text-sm font-semibold flex items-center gap-2">
                    <i className={`${upgrade.icon} text-lime-300`}></i> {upgrade.name}
                </h4>
                <p className="text-slate-200 text-xs mt-1">{upgrade.description}</p>
                {!upgrade.purchased ? (
                    <>
                        <p className="text-slate-200 text-xs mt-1">
                            Custo: <span className="font-medium text-amber-300">{formatNumber(upgrade.cost)} EXP Modular</span>
                        </p>
                        <button
                            onClick={() => onBuyEmbryoUpgrade(upgrade.id)} 
                            disabled={gameState.modularEXP.lt(upgrade.cost) || upgradesDisabled}
                            className="mt-2 w-full bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold py-1 px-2.5 rounded-md text-xs shadow-sm hover:from-lime-600 hover:to-green-700 disabled:opacity-50"
                        >
                            Comprar
                        </button>
                    </>
                ) : (
                    <p className="text-center text-lime-300 font-semibold mt-2 text-xs">Adquirido!</p>
                )}
            </div>
            ))}
            {gameState.embryoUpgradesData.length === 0 && <p className="text-xs text-slate-300 text-center">Nenhuma melhoria genética disponível.</p>}
          </div>
      </CollapsibleSection>

      {/* Embryo Shop Panel */}
      <EmbryoShopPanel
        shopItems={gameState.embryoShopItems}
        playerResources={{
            modularEXP: gameState.modularEXP,
            incubationPower: gameState.incubationPower,
            transcendentEssence: gameState.transcendentEssence,
        }}
        onBuyItem={onBuyEmbryoStoreItem}
        embryoInventory={gameState.embryoInventory} 
      />

      {/* Embryo Equipment Panel */}
      <EmbryoEquipmentPanel
        equippedItems={gameState.equippedEmbryoItems}
        allItemsData={gameState.embryoShopItems} // Or combine with inventory if items can be obtained outside shop
        onOpenInventoryModal={onOpenInventoryModal}
        onUnequipItem={onUnequipItem}
      />
    </div>
  );
};

export default EmbryoPanel;
