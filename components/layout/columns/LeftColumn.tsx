
import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import { 
    StatusDisplayPanel, 
    EggInteractionPanel, 
    ActiveAbilitiesPanel, 
    RunStatsPanel, 
    ActiveTraitsDisplayPanel, 
    RankingPanel,
    DailyMissionsPanel
} from '../../panels';
import { formatNumber } from '../../../utils';
import { Decimal } from 'decimal.js';

const LeftColumn: React.FC = () => {
    const { 
        gameState, 
        calculatedRequiredPiToTranscend,
        handleTranscendModalOpen,
        handlePrimordialTrigger,
        addTestPIData,
        claimMissionReward
    } = useGameContext();

    const primordialTriggerAvailable = gameState.specialUpgradesData.find(su => su.id === 'stage35Bonus' && su.purchased.equals(new Decimal(1))) && !gameState.primordialTriggerUsedThisRun;

    return (
        <div className="main-col-left flex flex-col gap-3 sm:gap-4">
            <StatusDisplayPanel />
            <EggInteractionPanel />
            <ActiveAbilitiesPanel />
            <div className="w-full bg-gradient-to-br from-purple-700/50 via-indigo-700/50 to-pink-700/50 rounded-xl p-3 sm:p-4 border border-[var(--border-accent)] shadow-lg text-center">
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-2">
                    Acumule <span className="font-bold text-[var(--text-emphasized)]">{formatNumber(calculatedRequiredPiToTranscend)}</span> PI para transcender.
                </p>
                <button
                    onClick={handleTranscendModalOpen}
                    disabled={gameState.incubationPower.lessThan(calculatedRequiredPiToTranscend)}
                    className="w-full max-w-xs mx-auto bg-[var(--button-primary-bg)] text-[var(--text-on-button-primary)] font-bold py-2 sm:py-2.5 px-4 rounded-lg shadow-md hover:bg-[var(--button-primary-hover-bg)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled-bg)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-purple-700"
                >
                    <i className="fas fa-infinity mr-1.5"></i> Transcender ({formatNumber(gameState.transcendenceCount)})
                </button>
            </div>
            {primordialTriggerAvailable && (
                <div className="w-full bg-gradient-to-br from-red-800 via-gray-900 to-red-800 rounded-xl p-3 sm:p-4 border border-red-600 shadow-lg text-center">
                    <p className="text-red-200 text-xs sm:text-sm mb-2">
                        Use o Gatilho Primordial para sacrificar todas as melhorias de PI por 1 Ovo Temporário. Uso único por run.
                    </p>
                    <button
                        onClick={handlePrimordialTrigger}
                        className="w-full max-w-xs mx-auto bg-red-600 text-white font-bold py-2 sm:py-2.5 px-4 rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        <i className="fas fa-bomb mr-1.5"></i> Ativar Gatilho Primordial
                    </button>
                </div>
            )}
            <button onClick={addTestPIData} className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-secondary)]">
                <i className="fas fa-plus-circle mr-2"></i> Add Test Data
            </button>
            <RunStatsPanel />
            <ActiveTraitsDisplayPanel />
            <RankingPanel gameState={gameState} />
            <DailyMissionsPanel dailyMissions={gameState.dailyMissions} onClaimReward={claimMissionReward} />
        </div>
    );
};

export default LeftColumn;
