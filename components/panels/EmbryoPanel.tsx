import React from 'react';
import { Decimal } from 'decimal.js';
import { useGameContext } from '../../contexts/GameContext';
import { formatNumber, calculateEmbryoUpgradeCost } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';
import EmbryoShopPanel from './EmbryoShopPanel'; 
import EmbryoEquipmentPanel from './EmbryoEquipmentPanel';

const EmbryoPanel: React.FC = () => {
    const { 
        gameState, 
        buyEmbryoUpgradeHandler,
        buyEmbryoStoreItem,
        handleOpenEmbryoInventoryModal,
        unequipEmbryoItem
    } = useGameContext();

    const expPercentageNumber = gameState.embryoEXPToNextLevel.isZero() ? 
        0 : 
        gameState.embryoCurrentEXP.dividedBy(gameState.embryoEXPToNextLevel).times(100).clamp(0, 100).toNumber();

    const stats = gameState.embryoEffectiveStats;

    return (
        <div className={`embryo-section-wrapper w-full bg-[var(--bg-embryo-panel)] rounded-xl shadow-lg border border-[var(--border-embryo-panel)] p-4 sm:p-5 h-full flex flex-col gap-3`}>
        <h2 className="text-[var(--title-embryo-panel)] text-lg sm:text-xl font-bold text-center flex items-center justify-center gap-2">
            <i className={`${gameState.embryoIcon} text-[var(--text-accent)] text-2xl`}></i>Ovo Embrionário
        </h2>
        <div className="text-center mb-1">
            <p className="text-base text-[var(--text-primary)]">
            Nível: <span className="font-bold text-[var(--text-emphasized)]">{formatNumber(gameState.embryoLevel)}</span>
            </p>
            <div className="w-full bg-[var(--bg-panel-secondary)] rounded-full h-3.5 my-1 border border-[var(--border-accent)] overflow-hidden shadow-inner">
            <div
                className="bg-[var(--progressbar-exp-fill)] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${expPercentageNumber}%` }}
                role="progressbar"
                aria-valuenow={expPercentageNumber}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progresso de Experiência do Embrião"
            ></div>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
            EXP: {formatNumber(gameState.embryoCurrentEXP)} / {formatNumber(gameState.embryoEXPToNextLevel)}
            </p>        
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            EXP Modular Total: <span className="font-semibold text-[var(--text-emphasized)]">{formatNumber(gameState.modularEXP)}</span>
            </p>
        </div>

        <div className="stats-display-embryo bg-[var(--bg-panel-secondary)] p-3 rounded-lg mb-1 border border-[var(--border-secondary)]">
            <h4 className="text-sm font-semibold text-[var(--text-accent)] mb-1.5 text-center">Atributos do Embrião</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]">
            <div>HP: 
                <span className="font-bold text-[var(--text-emphasized)]"> {formatNumber(stats.currentHp)} / {formatNumber(stats.maxHp)}</span>
                <div className="w-full bg-[var(--bg-interactive)] rounded-full h-2.5 mt-0.5 border border-[var(--border-secondary)] overflow-hidden">
                    <div className="bg-[var(--progressbar-hp-fill)] h-full rounded-full" style={{width: `${stats.maxHp.isZero() ? 0 : stats.currentHp.div(stats.maxHp).times(100).clamp(0,100).toNumber()}%`}}></div>
                </div>
            </div>
            <div>Escudo: 
                <span className="font-bold text-sky-300"> {formatNumber(stats.currentShield || new Decimal(0))} / {formatNumber(stats.maxShield || new Decimal(0))}</span>
                <div className="w-full bg-[var(--bg-interactive)] rounded-full h-2.5 mt-0.5 border border-[var(--border-secondary)] overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{width: `${(stats.maxShield && stats.maxShield.isZero() ? 0 : (stats.currentShield || new Decimal(0)).div(stats.maxShield || new Decimal(1)).times(100).clamp(0,100).toNumber())}%`}}></div>
                </div>
            </div>
            <p>Ataque: <span className="font-bold text-[var(--text-emphasized)]">{formatNumber(stats.attack)}</span></p>
            <p>Defesa: <span className="font-bold text-[var(--text-emphasized)]">{formatNumber(stats.defense)}</span></p>
            <p>Velocidade: <span className="font-bold text-[var(--text-emphasized)]">{formatNumber(stats.speed)}</span></p>
            <p>Crítico: <span className="font-bold text-[var(--text-emphasized)]">{(stats.critChance.times(100)).toFixed(1)}%</span></p>
            <p>Veneno Ch.: <span className="font-bold text-[var(--text-emphasized)]">{(stats.poisonChance.times(100)).toFixed(1)}%</span></p>
            <p>Duração Veneno (s): <span className="font-bold text-[var(--text-emphasized)]">{formatNumber(stats.poisonDurationSeconds)}</span></p>
            <p>Dano Chefes: <span className="font-bold text-[var(--text-emphasized)]">+{ (stats.bossDamageBonus.times(100)).toFixed(1)}%</span></p>
            <p>Golpe Duplo: <span className="font-bold text-[var(--text-emphasized)]">{(stats.doubleHitChance.times(100)).toFixed(1)}%</span></p>
            <p>Roubo Vida: <span className="font-bold text-[var(--text-emphasized)]">{(stats.lifestealRate.times(100)).toFixed(1)}%</span></p>
            <p>Efeito Caos: <span className="font-bold text-[var(--text-emphasized)]">{(stats.chaosEffectChance.times(100)).toFixed(1)}%</span></p>
            <p>Atraso Inim.: <span className="font-bold text-[var(--text-emphasized)]">{(stats.enemyDelayChance.times(100)).toFixed(1)}%</span></p>
            <p>Reflexão Dano: <span className="font-bold text-[var(--text-emphasized)]">{(stats.damageReflection.times(100)).toFixed(1)}%</span></p>
            <p>Resist. Crítico: <span className="font-bold text-[var(--text-emphasized)]">{(stats.critResistance.times(100)).toFixed(1)}%</span></p>
            <p>Escudo Periód.: <span className="font-bold text-[var(--text-emphasized)]">{formatNumber(stats.periodicShieldValue)}</span></p>
            <p>Esquiva Ch.: <span className="font-bold text-[var(--text-emphasized)]">{(stats.dodgeChance.times(100)).toFixed(1)}%</span></p>
            <p>Redução Dano: <span className="font-bold text-[var(--text-emphasized)]">{(stats.overallDamageReduction.times(100)).toFixed(1)}%</span></p>
            <p>Regen. HP: <span className="font-bold text-[var(--text-emphasized)]">{(stats.hpRegenPerInterval.times(100)).toFixed(1)}%/int</span></p>
            </div>
        </div>

        <CollapsibleSection title="Melhorias Genéticas" titleIcon="fas fa-dna" initiallyOpen={false}>
            <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {gameState.embryoUpgradesData.map(upgrade => {
                    const isOneTime = upgrade.cost !== undefined && upgrade.baseCost === undefined;
                    const isStackable = upgrade.baseCost !== undefined;
                    
                    let isPurchasedOrMaxLevel = false;
                    if (isOneTime) {
                        isPurchasedOrMaxLevel = upgrade.purchased.gte(1);
                    } else if (isStackable) {
                        isPurchasedOrMaxLevel = upgrade.maxLevel ? upgrade.purchased.gte(upgrade.maxLevel) : false;
                    }

                    const nextLevelCost = isStackable ? calculateEmbryoUpgradeCost(upgrade) : (upgrade.cost || new Decimal(0));

                    return (
                        <div key={upgrade.id} className={`bg-[var(--bg-interactive)] border rounded-lg p-3 mb-2 shadow-md ${isPurchasedOrMaxLevel ? 'border-[var(--border-accent)] opacity-70' : 'border-[var(--border-secondary)] hover:border-[var(--border-accent)]'}`}>
                            <h4 className="text-[var(--text-primary)] text-sm font-semibold flex items-center gap-2">
                                <i className={`${upgrade.icon} text-[var(--text-accent)]`}></i> {upgrade.name}
                            </h4>
                            <p className="text-[var(--text-secondary)] text-xs mt-1">{upgrade.description}</p>

                            {isOneTime && !isPurchasedOrMaxLevel && upgrade.cost && (
                                <>
                                    <p className="text-[var(--text-secondary)] text-xs mt-1">Custo: <span className="font-medium text-[var(--text-emphasized)]">{formatNumber(upgrade.cost)} EXP Modular</span></p>
                                    <button onClick={() => buyEmbryoUpgradeHandler(upgrade.id)} disabled={gameState.modularEXP.lt(upgrade.cost)} className="mt-2 w-full bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover-bg)] text-[var(--text-on-button-primary)] font-bold py-1 px-2.5 rounded-md text-xs shadow-sm disabled:opacity-50">Comprar</button>
                                </>
                            )}
                            {isStackable && (
                                <>
                                    <p className="text-[var(--text-secondary)] text-xs mt-1">Nível: {formatNumber(upgrade.purchased)}{upgrade.maxLevel && ` / ${formatNumber(upgrade.maxLevel)}`}</p>
                                    {!isPurchasedOrMaxLevel && (<p className="text-[var(--text-secondary)] text-xs mt-1">Custo Próx.: <span className="font-medium text-[var(--text-emphasized)]">{formatNumber(nextLevelCost)} EXP Mod.</span></p>)}
                                    {!isPurchasedOrMaxLevel && (<button onClick={() => buyEmbryoUpgradeHandler(upgrade.id)} disabled={gameState.modularEXP.lt(nextLevelCost)} className="mt-2 w-full bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover-bg)] text-[var(--text-on-button-primary)] font-bold py-1 px-2.5 rounded-md text-xs shadow-sm disabled:opacity-50">Melhorar Nível</button>)}
                                </>
                            )}
                            {isPurchasedOrMaxLevel && (<p className="text-center text-[var(--text-accent)] font-semibold mt-2 text-xs">{isOneTime ? 'Adquirido!' : 'Nível Máximo!'}</p>)}
                        </div>
                    );
                })}
                {gameState.embryoUpgradesData.length === 0 && <p className="text-xs text-[var(--text-secondary)] text-center">Nenhuma melhoria genética disponível.</p>}
            </div>
        </CollapsibleSection>
        
        <EmbryoShopPanel
            shopItems={gameState.embryoShopItems}
            playerResources={{ modularEXP: gameState.modularEXP, incubationPower: gameState.incubationPower, transcendentEssence: gameState.transcendentEssence }}
            onBuyItem={buyEmbryoStoreItem}
            embryoInventory={gameState.embryoInventory} 
        />
        <EmbryoEquipmentPanel
            equippedItems={gameState.equippedEmbryoItems}
            allItemsData={gameState.embryoInventory} 
            onOpenInventoryModal={handleOpenEmbryoInventoryModal}
            onUnequipItem={unequipEmbryoItem}
        />
        </div>
    );
};

export default EmbryoPanel;
