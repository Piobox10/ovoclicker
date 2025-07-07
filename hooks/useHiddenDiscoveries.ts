
import { useEffect, useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, HiddenDiscoveryDefinition, HiddenDiscoveryState } from '../types';
import { INITIAL_HIDDEN_DISCOVERY_DEFINITIONS } from '../constants/hiddenDiscoveries';
import { playSound } from '../utils';

export const useHiddenDiscoveries = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  showMessage: (text: string, duration?: number) => void
) => {
  const checkAndUnlockDiscoveries = useCallback(() => {
    let stateChanged = false;
    let newHiddenDiscoveriesData = [...gameState.hiddenDiscoveriesData];
    let aDiscoveryWasMadeThisCheck = false;

    INITIAL_HIDDEN_DISCOVERY_DEFINITIONS.forEach(definition => {
      const currentDiscoveryState = newHiddenDiscoveriesData.find(d => d.id === definition.id);
      if (currentDiscoveryState && !currentDiscoveryState.isDiscovered) {
        if (definition.triggerCondition(gameState)) {
          const discoveryIndex = newHiddenDiscoveriesData.findIndex(d => d.id === definition.id);
          if (discoveryIndex !== -1) {
            newHiddenDiscoveriesData[discoveryIndex] = {
              ...currentDiscoveryState,
              isDiscovered: true,
              nameToDisplay: definition.revealedName,
              descriptionToDisplay: definition.revealedDescription,
              iconToDisplay: definition.revealedIcon,
            };
            stateChanged = true;
            aDiscoveryWasMadeThisCheck = true;
            // The actual reward application will be handled in the setGameState updater
            // to use the most current state.
            showMessage(`✨ Descoberta Secreta: ${definition.revealedName}! ✨`, 4000);
          }
        }
      }
    });

    if (stateChanged || gameState.justTranscended) {
      setGameState(prev => {
        let finalState = { ...prev };
        if (stateChanged) {
          finalState.hiddenDiscoveriesData = newHiddenDiscoveriesData;
        }

        // Apply rewards for newly discovered items by comparing with prev state
        newHiddenDiscoveriesData.forEach(discoveryState => {
            if(discoveryState.isDiscovered) {
                const definition = INITIAL_HIDDEN_DISCOVERY_DEFINITIONS.find(d => d.id === discoveryState.id);
                const previousInternalStateDiscovery = prev.hiddenDiscoveriesData.find(d => d.id === discoveryState.id);
                
                if (definition && (!previousInternalStateDiscovery || !previousInternalStateDiscovery.isDiscovered)) {
                    // Apply reward using 'prev' as the base for the reward function's logic,
                    // but the main setGameState will handle merging.
                    definition.rewardEffect(prev, setGameState, showMessage); 
                }
            }
        });

        if (aDiscoveryWasMadeThisCheck) {
            playSound('discovery.mp3', prev.isSoundEnabled, 0.8);
        }
        
        if (prev.justTranscended) { // Reset the flag if it was set
            finalState.justTranscended = false;
        }
        
        return finalState;
      });
    }
  }, [gameState, setGameState, showMessage]); // gameState as dependency to re-check when it changes

  useEffect(() => {
    checkAndUnlockDiscoveries();
  }, [
    gameState.totalClicksThisRun, 
    gameState.transcendenceCount, 
    gameState.modularEXP, 
    gameState.spentModularEXPThisRun,
    gameState.embryoEffectiveStats, 
    gameState.currentStageIndex,
    gameState.hasPurchasedRegularUpgradeThisRun,
    gameState.embryoTookDamageThisRun,
    gameState.activeTraits,
    gameState.unlockedEggForms,
    gameState.justTranscended, // Add as dependency
    checkAndUnlockDiscoveries 
  ]); 
};
