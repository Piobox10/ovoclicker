import React from 'react';
import { SacredRelicUpgrade } from '../../types';
import Modal from '../Modal';

interface SacredRelicChoiceModalProps {
  isOpen: boolean;
  relics: SacredRelicUpgrade[];
  onSelectRelic: (relicId: string) => void;
}

const SacredRelicChoiceModal: React.FC<SacredRelicChoiceModalProps> = ({
  isOpen,
  relics,
  onSelectRelic,
}) => {
  if (!isOpen) {
    return null;
  }
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={undefined} // Pass undefined to prevent backdrop/Esc close & hide generic "Fechar" button
      title="Conquista da Expedição!" 
      modalClassName="max-w-2xl bg-gradient-to-br from-amber-900 via-slate-900 to-amber-900 border-2 border-amber-500"
      titleClassName="text-amber-300"
    >
      <div className="space-y-4">
        <p className="text-base text-slate-200 text-center mb-4">
          Você triunfou sobre todos os desafios! O universo te oferece uma recompensa. Escolha uma Relíquia Sagrada para adicionar ao seu arsenal permanentemente.
        </p>
        {relics.map((relic) => (
          <button
            key={relic.id}
            onClick={() => onSelectRelic(relic.id)}
            className="w-full bg-slate-800/60 hover:bg-slate-700/80 text-slate-100 p-4 rounded-lg transition-all duration-200 text-left hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 border border-slate-700 hover:border-amber-500"
            aria-label={`Selecionar relíquia: ${relic.name}`}
          >
            <div className="flex items-center gap-4">
              <i className={`${relic.icon} text-3xl text-amber-400 w-10 text-center`}></i>
              <div>
                <p className="font-bold text-amber-300 text-lg">{relic.name}</p>
                <p className="text-sm text-slate-300 mt-1">{relic.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default SacredRelicChoiceModal;