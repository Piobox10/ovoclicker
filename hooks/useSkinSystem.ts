
import { useCallback, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, SkinDefinition } from '../types';
import { SKIN_DEFINITIONS } from '../constants/skins'; // Corrected import path
import { formatNumber, playSound } from '../utils';

export const useSkinSystem = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  showMessage: (text: string, duration?: number) => void
) => {
  const applySkinCss = useCallback((skinId: string) => {
    const skin = SKIN_DEFINITIONS.find(s => s.id === skinId);
    if (!skin) {
      console.warn(`Skin with id "${skinId}" not found. Applying default.`);
      applySkinCss('default'); // Fallback to default
      return;
    }

    // Apply CSS Variables
    for (const key in skin.cssVariables) {
      if (Object.prototype.hasOwnProperty.call(skin.cssVariables, key)) {
        document.documentElement.style.setProperty(key, (skin.cssVariables as any)[key]);
      }
    }

    // Apply Body Background
    document.body.style.background = skin.backgroundStyle;

  }, []);

  const setActiveSkin = useCallback((skinId: string) => {
    setGameState(prev => {
      if (!prev.unlockedSkinIds.includes(skinId)) {
        showMessage("Tema não desbloqueado.", 1500);
        return prev;
      }
      if (prev.activeSkinId === skinId) {
        // No need to re-apply if already active, unless forced
        // applySkinCss(skinId); // Force re-apply if needed for some reason
        return prev;
      }
      
      applySkinCss(skinId);
      showMessage(`Tema "${SKIN_DEFINITIONS.find(s => s.id === skinId)?.name || skinId}" ativado!`, 2000);
      return { ...prev, activeSkinId: skinId };
    });
  }, [setGameState, showMessage, applySkinCss]);

  const buySkin = useCallback((skinId: string) => {
    setGameState(prev => {
      const skin = SKIN_DEFINITIONS.find(s => s.id === skinId);
      if (!skin) {
        showMessage("Tema não encontrado.", 1500);
        return prev;
      }
      if (prev.unlockedSkinIds.includes(skinId)) {
        showMessage("Tema já desbloqueado.", 1500);
        return prev;
      }
      if (prev.incubationPower.lt(skin.cost)) {
        showMessage(`PI insuficiente. Necessário: ${formatNumber(skin.cost)} PI.`, 2000);
        return prev;
      }

      playSound('purchase.mp3', prev.isSoundEnabled, 0.7);
      showMessage(`Tema "${skin.name}" comprado por ${formatNumber(skin.cost)} PI!`, 2500);
      
      // Automatically activate the new skin
      applySkinCss(skinId);

      return {
        ...prev,
        incubationPower: prev.incubationPower.minus(skin.cost),
        unlockedSkinIds: [...prev.unlockedSkinIds, skinId],
        activeSkinId: skinId, // Auto-activate new skin
      };
    });
  }, [setGameState, showMessage, applySkinCss]);

  // Effect to apply the active skin when the game loads or activeSkinId changes
  useEffect(() => {
    // This effect relies on gameState being available and loaded.
    // It will be called from App.tsx after initial load and gameState hydration.
    // For now, this hook provides the functions, and App.tsx handles the initial call.
  }, []);


  return { applySkinCss, setActiveSkin, buySkin };
};
