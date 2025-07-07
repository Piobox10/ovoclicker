import React from 'react';
import { Decimal } from 'decimal.js';
import { BattleEgg, BattleStatusEffectInstance, BattleEggRarity, GameState } from '../../types';
import { BATTLE_EGG_RARITY_STYLES } from '../../constants';
import { formatNumber } from '../../utils';

interface BattleEggCardProps {
  egg: BattleEgg;
  isEnemy: boolean;
  isActiveTurn?: boolean; // To highlight if it's this egg's turn
  onClick?: () => void; // For potential future interactions like targeting
  currentActingEggId?: GameState['eggTeamBattleState']['currentActingEggId'];
}

const BattleEggCard: React.FC<BattleEggCardProps> = ({ egg, isEnemy, onClick, currentActingEggId }) => {
  if (!egg) return null;

  const isActive = egg.instanceId === currentActingEggId;
  const rarityStyle = BATTLE_EGG_RARITY_STYLES[egg.rarity] || BATTLE_EGG_RARITY_STYLES['Common'];
  const hpPercentage = egg.maxHp.gt(0) ? egg.currentHp.div(egg.maxHp).times(100).clamp(0, 100).toNumber() : 0;
  
  const resourcePercentage = (egg.maxResource && egg.maxResource.gt(0) && egg.currentResource) 
    ? egg.currentResource.div(egg.maxResource).times(100).clamp(0, 100).toNumber() 
    : 0;


  return (
    <div
      id={`battle-egg-${egg.instanceId}`}
      className={`battle-egg-card w-20 sm:w-24 p-1 rounded-md shadow-md transition-all duration-200 flex-shrink-0
                  ${rarityStyle.bg} border-2 ${isActive ? `ring-2 ring-offset-2 ring-offset-[var(--bg-panel-primary)] ${rarityStyle.border} ring-opacity-100 scale-105 shadow-xl` : rarityStyle.border} 
                  ${onClick ? 'cursor-pointer hover:brightness-110' : ''}
                  ${egg.currentHp.lte(0) ? 'opacity-50 grayscale filter brightness-75' : ''}`}
      onClick={onClick}
      aria-label={`Ovo de Batalha: ${egg.name}, Nível ${egg.level}`}
    >
      <div className="flex flex-col items-center text-center">
        <i className={`${egg.icon} ${rarityStyle.text} text-2xl sm:text-3xl mb-0.5 ${egg.avatarAnimationState === 'attacking' ? 'animate-pulse' : ''} ${egg.avatarAnimationState === 'hit' ? 'animate-ping once' : ''}`}></i>
        <p className={`text-[9px] sm:text-[10px] font-bold ${rarityStyle.nameColor} truncate w-full`} title={egg.name}>
          {egg.name} <span className="text-slate-400">Nv.{egg.level}</span>
        </p>
      </div>

      {/* HP Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 sm:h-2.5 my-0.5 border border-slate-600 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${hpPercentage}%` }}
          role="progressbar"
          aria-valuenow={hpPercentage}
          aria-label={`Vida: ${formatNumber(egg.currentHp)} / ${formatNumber(egg.maxHp)}`}
        ></div>
      </div>
      <p className="text-[7px] sm:text-[9px] text-center text-red-200 -mt-0.5 mb-0.5">{formatNumber(egg.currentHp)}/{formatNumber(egg.maxHp)}</p>

      {/* Resource Bar (if applicable) */}
      {egg.maxResource && egg.maxResource.gt(0) && (
        <>
          <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2 my-0.5 border border-slate-600 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-linear"
              style={{ width: `${resourcePercentage}%` }}
              role="progressbar"
              aria-valuenow={resourcePercentage}
              aria-label={`${egg.resourceName || 'Recurso'}: ${formatNumber(egg.currentResource || new Decimal(0))} / ${formatNumber(egg.maxResource)}`}
            ></div>
          </div>
          <p className="text-[7px] sm:text-[9px] text-center text-sky-200 -mt-0.5 mb-0.5">{egg.resourceName || 'Recurso'}: {formatNumber(egg.currentResource || new Decimal(0))}/{formatNumber(egg.maxResource)}</p>
        </>
      )}

      {/* Status Effects */}
      {egg.statusEffects && egg.statusEffects.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-0.5 mt-0.5 min-h-[16px]">
          {egg.statusEffects.slice(0, 4).map((effect) => ( 
            <div 
              key={effect.instanceId}
              className="relative group"
            >
              <i
                className={`${effect.icon} text-[10px] sm:text-xs p-0.5 rounded ${effect.type === 'buff' ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}
              ></i>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="font-bold">{effect.name}</p>
                <p>{effect.description}</p>
                <p>Duração: {effect.remainingDurationTurns} turnos</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {egg.currentHp.lte(0) && (
        <p className="text-[9px] text-center font-bold text-red-500 mt-0.5">DERROTADO</p>
      )}
       <style>{`
        .animate-ping.once {
            animation: pingOnce 0.7s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
        @keyframes pingOnce {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default BattleEggCard;