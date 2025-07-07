import React, { useState } from 'react';
import { ExpeditionRewardOption, GameState } from '../../types'; 
import Modal from '../Modal'; 

interface PostBattleChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  choices: ExpeditionRewardOption[];
  onSelectChoice: (choiceId: string) => void;
  onSelectTargetedChoice: (choice: ExpeditionRewardOption) => void;
  isAwaitingTarget: boolean;
}

const RARITY_STYLES = {
  comum: { border: 'border-slate-500', bg: 'bg-slate-700/50', text: 'text-slate-300', name: 'text-slate-200' },
  incomum: { border: 'border-green-500', bg: 'bg-green-700/40', text: 'text-green-300', name: 'text-green-200' },
  raro: { border: 'border-sky-500', bg: 'bg-sky-700/40', text: 'text-sky-300', name: 'text-sky-200' },
  épico: { border: 'border-purple-500', bg: 'bg-purple-700/40', text: 'text-purple-300', name: 'text-purple-200' },
  lendário: { border: 'border-amber-500', bg: 'bg-amber-700/40', text: 'text-amber-300', name: 'text-amber-200' },
};

const PostBattleChoiceModal: React.FC<PostBattleChoiceModalProps> = ({
  isOpen,
  onClose,
  choices,
  onSelectChoice,
  onSelectTargetedChoice,
  isAwaitingTarget
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (choice: ExpeditionRewardOption) => {
    if (selected) return;
    setSelected(choice.id);

    if (choice.type === 'escolha dramática') {
        onSelectTargetedChoice(choice);
    } else {
        setTimeout(() => {
            onSelectChoice(choice.id);
        }, 500); // Short delay to show selection
    }
  };

  if (isAwaitingTarget) return null; // Hide this modal while targeting mode is active

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={undefined}
      title="Vitória na Fase!" 
      modalClassName="max-w-4xl"
    >
      <div className="space-y-3">
        <p className="text-sm text-[var(--text-secondary)] text-center mb-3">
          Seu time prevaleceu. Escolha uma vantagem para continuar a expedição. A escolha é permanente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {choices.map((choice) => {
            const style = RARITY_STYLES[choice.rarity] || RARITY_STYLES.comum;
            const isSelected = selected === choice.id;
            const isBlocked = selected !== null && !isSelected;

            return (
              <div
                key={choice.id}
                onClick={() => handleSelect(choice)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ease-in-out transform flex flex-col
                  ${style.border} ${style.bg}
                  ${isSelected ? 'scale-105 ring-4 ring-offset-2 ring-offset-slate-800 ring-white' : ''}
                  ${isBlocked ? 'opacity-40 grayscale filter' : 'cursor-pointer hover:scale-105 hover:shadow-lg'}
                  ${isBlocked && style.border ? `hover:border-${style.border}` : 'hover:border-white'}`}
                title={choice.description}
              >
                <div className="flex items-center gap-3 mb-2">
                  <i className={`${choice.icon} text-2xl ${style.text}`}></i>
                  <h4 className={`font-bold text-lg ${style.name}`}>{choice.name}</h4>
                </div>
                <p className={`text-xs flex-grow ${style.text}`}>{choice.description}</p>
                <div className={`mt-3 text-right text-xs font-semibold uppercase ${style.text} opacity-80`}>
                  {choice.rarity}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default PostBattleChoiceModal;
