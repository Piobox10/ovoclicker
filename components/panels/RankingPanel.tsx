
import React, { useState, useEffect, useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { RankingEntry, MOCK_RANKING_DATA } from '../../constants';
import { GameState } from '../../types';
import { formatNumber } from '../../utils';
import CollapsibleSection from '../CollapsibleSection';

interface RankingPanelProps {
  gameState: Pick<GameState, 'incubationPower' | 'userNickname'>;
}

const RankingPanel: React.FC<RankingPanelProps> = ({ gameState }) => {
  const [rankingData, setRankingData] = useState<RankingEntry[]>([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);

  const fetchRanking = useCallback(() => {
    setIsRankingLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Simulate adding/updating player's current score to a local copy of mock data for display
      const currentPlayerEntry: RankingEntry = {
        rank: 0, // Rank will be recalculated
        nickname: gameState.userNickname,
        score: gameState.incubationPower,
      };

      let updatedMockData = MOCK_RANKING_DATA.filter(entry => entry.nickname !== gameState.userNickname);
      updatedMockData.push(currentPlayerEntry);
      
      updatedMockData.sort((a, b) => b.score.comparedTo(a.score));
      updatedMockData = updatedMockData.map((entry, index) => ({ ...entry, rank: index + 1 }));
      
      setRankingData(updatedMockData.slice(0, 10)); // Show top 10
      setIsRankingLoading(false);
    }, 1000);
  }, [gameState.userNickname, gameState.incubationPower]);

  useEffect(() => {
    fetchRanking(); // Fetch on component mount and when relevant gameState changes
  }, [fetchRanking]);

  return (
    <CollapsibleSection title="Ranking Global (Simulado)" titleIcon="fas fa-trophy" initiallyOpen={false}>
      <div className="text-center mb-3">
        <button
          onClick={fetchRanking}
          disabled={isRankingLoading}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg text-xs sm:text-sm transition-all duration-200 disabled:opacity-70 active:scale-95"
        >
          {isRankingLoading ? (
            <><i className="fas fa-spinner fa-spin mr-2"></i>Carregando...</>
          ) : (
            <><i className="fas fa-sync-alt mr-2"></i>Atualizar Ranking</>
          )}
        </button>
        <p className="text-xs text-slate-400 mt-2">
            Sua Pontuação Atual para Ranking: <span className="font-bold text-amber-300">{formatNumber(gameState.incubationPower)} PI</span>
        </p>
      </div>

      {isRankingLoading && rankingData.length === 0 ? (
        <p className="text-slate-300 text-center">Carregando ranking...</p>
      ) : rankingData.length > 0 ? (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {rankingData.map((entry) => (
            <div
              key={entry.rank}
              className={`p-2.5 rounded-lg border flex items-center justify-between text-sm
                ${entry.nickname === gameState.userNickname ? 'bg-amber-700/40 border-amber-500' : 'bg-slate-800 border-slate-700'}`}
            >
              <div className="flex items-center">
                <span className={`font-bold w-6 text-center ${
                  entry.rank === 1 ? 'text-yellow-400' : 
                  entry.rank === 2 ? 'text-slate-300' : 
                  entry.rank === 3 ? 'text-orange-400' : 'text-slate-400'
                }`}>
                  {entry.rank}°
                </span>
                <span className={`ml-2 ${entry.nickname === gameState.userNickname ? 'text-amber-200 font-semibold' : 'text-slate-200'}`}>
                  {entry.nickname}
                </span>
              </div>
              <span className={`font-semibold ${entry.nickname === gameState.userNickname ? 'text-amber-300' : 'text-sky-300'}`}>
                {formatNumber(entry.score)} PI
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center">Nenhum dado de ranking para exibir.</p>
      )}
      <p className="text-xs text-slate-500 mt-3 text-center">
        Nota: Este é um ranking simulado. Um sistema de ranking global real requer um servidor backend.
      </p>
    </CollapsibleSection>
  );
};

export default RankingPanel;
