import React from 'react';
import { BattleEgg } from '../../types';
import BattleEggCard from './BattleEggCard';

interface BattleTeamDisplayProps {
  team: BattleEgg[];
  isEnemyTeam: boolean;
}

const BattleTeamDisplay: React.FC<BattleTeamDisplayProps> = ({ team, isEnemyTeam }) => {
  if (!team || team.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-2">{isEnemyTeam ? "Nenhum inimigo em combate." : "Nenhum ovo aliado em combate."}</p>;
  }

  return (
    <div className={`flex flex-wrap ${isEnemyTeam ? 'justify-end' : 'justify-start'} items-start gap-2 sm:gap-3 p-2`}>
      {team.map((egg) => (
        <BattleEggCard key={egg.instanceId} egg={egg} isEnemy={isEnemyTeam} />
      ))}
    </div>
  );
};

export default BattleTeamDisplay;