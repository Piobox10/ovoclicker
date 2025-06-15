
import React from 'react';
import { Decimal } from 'decimal.js';
import { EggStage, EggForm, ActiveTemporaryBuffState } from '../../types';
import EggCanvas from '../EggCanvas'; // Assuming EggCanvas is in components/
import { formatNumber, formatTime } from '../../utils';

interface EggInteractionPanelProps {
  currentStage: EggStage;
  nextStageThreshold: Decimal | null;
  activeEggForms: EggForm[]; // Changed to array
  onEggClick: () => void;
  message: { text: string; id: number } | null;
  activeTemporaryBuff: ActiveTemporaryBuffState | null;
  // Old event props removed
  // availableEventId: string | null; 
  // eventSummonTimer: Decimal;
  // onActivatePendingEvent: () => void;
}

const EggInteractionPanel: React.FC<EggInteractionPanelProps> = ({
  currentStage,
  nextStageThreshold,
  activeEggForms,
  onEggClick,
  message,
  activeTemporaryBuff,
  // availableEventId, // Removed
  // eventSummonTimer, // Removed
  // onActivatePendingEvent, // Removed
}) => {
  const primaryActiveForm = activeEggForms.length > 0 ? activeEggForms[0] : null;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <EggCanvas
        currentStage={currentStage}
        nextStageThreshold={nextStageThreshold}
        activeEggForm={primaryActiveForm} // Pass only the primary active form or null
        onClick={onEggClick}
        formatNumber={formatNumber}
      />
      {message && (
        <div className="message-box w-full bg-slate-700/80 backdrop-blur-sm text-slate-100 p-3 rounded-lg text-sm font-medium text-center shadow-lg border border-slate-600">
          {message.text}
        </div>
      )}
      {activeTemporaryBuff && (
        <div className="active-temp-buff-display w-full bg-sky-800/80 backdrop-blur-sm border border-sky-600 text-white p-3 rounded-lg text-sm text-center shadow-md">
          <p className="font-semibold flex items-center justify-center gap-2">
            <i className={`${activeTemporaryBuff.icon} text-sky-300`}></i> {activeTemporaryBuff.name}
          </p>
          <p className="text-xs text-sky-200 truncate" title={activeTemporaryBuff.description}>
            {activeTemporaryBuff.description}
          </p>
          <p className="text-xs text-sky-300">Duração: {formatTime(activeTemporaryBuff.remainingDuration)}</p>
        </div>
      )}
      {/* Removed old event summon button logic */}
    </div>
  );
};

export default EggInteractionPanel;
