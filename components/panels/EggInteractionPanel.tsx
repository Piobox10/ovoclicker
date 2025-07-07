import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import EggCanvas from '../EggCanvas';
import { formatNumber, formatTime } from '../../utils';
import { EGG_FORMS_DATA } from '../../constants';

const EggInteractionPanel: React.FC = () => {
    const {
        gameState,
        currentStageData,
        nextStageThreshold,
        handleEggClick,
        handleClaimRandomEggFromFragments,
    } = useGameContext();
    
    const { message, activeTemporaryBuffs, eggFragments, eggFragmentCostForRandomRoll, activeEggFormIds } = gameState;
    const activeEggForms = activeEggFormIds.map(id => EGG_FORMS_DATA.find(f => f.id === id)).filter(Boolean) as any;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <EggCanvas
        currentStage={currentStageData}
        nextStageThreshold={nextStageThreshold}
        activeEggForms={activeEggForms}
        onClick={handleEggClick}
        formatNumber={formatNumber}
      />
      <div className="w-full bg-slate-700/60 backdrop-blur-sm text-slate-200 p-3 rounded-lg text-sm text-center shadow-md border border-slate-600">
        <p className="mb-1">
          <i className="fas fa-puzzle-piece text-orange-400 mr-1.5"></i>Fragmentos de Ovo: 
          <span className="font-bold text-orange-300"> {formatNumber(eggFragments)} / {formatNumber(eggFragmentCostForRandomRoll)}</span>
        </p>
        <button
          onClick={handleClaimRandomEggFromFragments}
          disabled={eggFragments.lt(eggFragmentCostForRandomRoll)}
          className="w-full max-w-xs mx-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1.5 px-3 rounded-md text-xs shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-700"
        >
          Obter Ovo Aleatório ({formatNumber(eggFragmentCostForRandomRoll)} Frag.)
        </button>
      </div>
      {message && (
        <div className="message-box w-full bg-slate-700/80 backdrop-blur-sm text-slate-100 p-3 rounded-lg text-sm font-medium text-center shadow-lg border border-slate-600">
          {message.text}
        </div>
      )}
      {activeTemporaryBuffs && activeTemporaryBuffs.length > 0 && (
        <div className="w-full space-y-2">
            {activeTemporaryBuffs.map(buff => (
                <div key={buff.id} className="active-temp-buff-display w-full bg-sky-800/80 backdrop-blur-sm border border-sky-600 text-white p-3 rounded-lg text-sm text-center shadow-md">
                    <p className="font-semibold flex items-center justify-center gap-2">
                        <i className={`${buff.icon} text-sky-300`}></i> {buff.name}
                    </p>
                    <p className="text-xs text-sky-200 truncate" title={buff.description}>
                        {buff.description}
                    </p>
                    <p className="text-xs text-sky-300">Duração: {formatTime(buff.remainingDuration)}</p>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default EggInteractionPanel;