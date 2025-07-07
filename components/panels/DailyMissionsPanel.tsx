import React from 'react';
import { Decimal } from 'decimal.js';
import { GameState, DailyMission } from '../../types';
import { MISSION_RARITY_COLORS } from '../../constants/missions';
import { formatNumber } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';

interface DailyMissionsPanelProps {
  dailyMissions: DailyMission[];
  onClaimReward: (missionId: string) => void;
  isModalView?: boolean;
}

const DailyMissionsPanel: React.FC<DailyMissionsPanelProps> = ({ dailyMissions, onClaimReward, isModalView = false }) => {
  const hasMissions = dailyMissions && dailyMissions.length > 0;

  const content = (
    <div className="space-y-3">
      {hasMissions ? (
        dailyMissions.map((mission) => {
          const rarityStyle = MISSION_RARITY_COLORS[mission.rarity];
          const progressPercent = mission.targetValue.isZero()
            ? new Decimal(0)
            : mission.currentProgress.dividedBy(mission.targetValue).times(100).clamp(0, 100);

          return (
            <div
              key={mission.id}
              className={`p-3 rounded-lg border ${rarityStyle.border} ${rarityStyle.bg} shadow-md flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-semibold ${rarityStyle.text} flex items-center gap-2`}>
                  <i className={`${mission.icon} ${rarityStyle.iconText}`}></i>
                  {mission.description}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${rarityStyle.bg} ${rarityStyle.text} border ${rarityStyle.border}`}>
                  {mission.rarity}
                </span>
              </div>

              <div className="w-full bg-slate-600 rounded-full h-2.5 overflow-hidden border border-slate-500">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    mission.status === 'completed' || mission.status === 'claimed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${progressPercent.toNumber()}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-300 text-center">
                Progresso: {formatNumber(mission.currentProgress)} / {formatNumber(mission.targetValue)}
              </p>

              <p className="text-xs text-amber-300">
                Recompensa: <span className="font-medium">{mission.reward.description}</span>
              </p>

              {mission.status === 'completed' && (
                <button
                  onClick={() => onClaimReward(mission.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-1.5 px-3 rounded-md text-xs shadow-sm hover:from-green-600 hover:to-emerald-700 active:scale-95 transition-all"
                >
                  <i className="fas fa-gift mr-1"></i> Reivindicar
                </button>
              )}
              {mission.status === 'claimed' && (
                <p className="text-center text-green-400 font-semibold text-xs py-1.5">
                  <i className="fas fa-check-circle mr-1"></i> Recompensa Reivindicada!
                </p>
              )}
               {mission.status === 'incomplete' && (
                 <button
                  disabled
                  className="w-full bg-slate-500 text-slate-300 font-bold py-1.5 px-3 rounded-md text-xs shadow-sm cursor-not-allowed opacity-70"
                >
                  Em Progresso...
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-slate-400 text-center text-sm py-4">Nenhuma missão diária disponível no momento. Volte amanhã!</p>
      )}
    </div>
  );

  if (isModalView) {
    return (
      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
        {content}
      </div>
    );
  }

  return (
    <CollapsibleSection title="Missões Diárias" titleIcon="fas fa-tasks" initiallyOpen={true}>
      {content}
    </CollapsibleSection>
  );
};

export default DailyMissionsPanel;
