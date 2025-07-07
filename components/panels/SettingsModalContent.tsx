
import React from 'react';
import { GAME_SAVE_KEY } from '../../constants';
import { GameState } from '../../types';

interface SettingsModalContentProps {
  gameState: Pick<GameState, 'isSoundEnabled' | 'isMusicEnabled'>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>; // For sound/music toggles
  // Add other settings props as needed
}

const SettingsModalContent: React.FC<SettingsModalContentProps> = ({ gameState, setGameState }) => {
  
  const handleResetGame = () => {
    if (window.confirm("Tem certeza que deseja resetar TODO o progresso do jogo? Esta ação é irreversível!")) {
        if (window.confirm("CONFIRMAÇÃO FINAL: Resetar o jogo? Não haverá como recuperar os dados.")) {
            localStorage.removeItem(GAME_SAVE_KEY);
            window.location.reload();
        }
    }
  };

  const toggleSound = () => {
    setGameState(prev => ({...prev, isSoundEnabled: !prev.isSoundEnabled}));
    // Logic to actually play/stop sound would go here or in a dedicated sound manager
  };

  const toggleMusic = () => {
    setGameState(prev => ({...prev, isMusicEnabled: !prev.isMusicEnabled}));
    // Logic to actually play/stop music
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
        <label htmlFor="soundToggle" className="text-slate-200">Efeitos Sonoros</label>
        <button
          id="soundToggle"
          onClick={toggleSound}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${gameState.isSoundEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-600 hover:bg-slate-500'} text-white`}
          aria-pressed={gameState.isSoundEnabled}
        >
          {gameState.isSoundEnabled ? 'Ligado' : 'Desligado'} <i className={`fas ${gameState.isSoundEnabled ? 'fa-volume-up' : 'fa-volume-mute'} ml-2`}></i>
        </button>
      </div>
      <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
        <label htmlFor="musicToggle" className="text-slate-200">Música de Fundo</label>
        <button
          id="musicToggle"
          onClick={toggleMusic}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${gameState.isMusicEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-600 hover:bg-slate-500'} text-white`}
          aria-pressed={gameState.isMusicEnabled}
        >
          {gameState.isMusicEnabled ? 'Ligada' : 'Desligada'} <i className={`fas ${gameState.isMusicEnabled ? 'fa-music' : 'fa-minus-circle'} ml-2`}></i>
        </button>
      </div>
      
      {/* Add other settings here */}
      {/* <p className="text-slate-400 text-xs text-center">Mais configurações em breve...</p> */}

      <button
        onClick={handleResetGame}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-700"
      >
        <i className="fas fa-trash-alt mr-2"></i>Resetar Jogo (PERMANENTE)
      </button>
    </div>
  );
};

export default SettingsModalContent;
