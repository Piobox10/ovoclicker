
import { useEffect, useCallback } from 'react';
import { GameState } from '../types';
import { EGG_FORMS_DATA, INITIAL_REGULAR_UPGRADES } from '../constants';
import { playSound } from '../utils';

export const useEggFormUnlocker = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  showMessage: (text: string, duration?: number) => void
) => {
  const checkEggFormUnlocks = useCallback(() => {
    const newUnlocks: string[] = [];

    EGG_FORMS_DATA.forEach(form => {
      if (!gameState.unlockedEggForms.includes(form.id)) {
        let conditionMet = false;

        // Check stage-based unlocks
        if (form.stageRequired > 0 && gameState.currentStageIndex >= form.stageRequired) {
          conditionMet = true;
        }

        // Check specific conditions by ID for more complex logic
        switch (form.id) {
          case 'fractalCrystalEgg':
            const clickUpgrades = gameState.upgradesData.filter(u => {
                const initialDef = INITIAL_REGULAR_UPGRADES.find(initU => initU.id === u.id);
                return initialDef?.type === 'clicks' && !initialDef.hidden;
            });
            const ippsUpgrades = gameState.upgradesData.filter(u => {
                const initialDef = INITIAL_REGULAR_UPGRADES.find(initU => initU.id === u.id);
                return initialDef?.type === 'ipps' && !initialDef.hidden;
            });
            const allClickUpgradesMet = clickUpgrades.every(u => u.purchased.gte(100));
            const allIppsUpgradesMet = ippsUpgrades.every(u => u.purchased.gte(100));
            if (clickUpgrades.length > 0 && ippsUpgrades.length > 0 && allClickUpgradesMet && allIppsUpgradesMet) {
                conditionMet = true;
            }
            break;

          case 'dreamWeaverEgg':
            if (new Set(gameState.abilitiesUsedThisRun).size >= 5) {
              conditionMet = true;
            }
            break;

          case 'necroEnergyEgg':
            if (gameState.enemiesDefeatedThisRun.gte(50)) {
              conditionMet = true;
            }
            break;
          
          // SECRET_EGG_FORM_SILENT is handled by hidden discoveries, so we don't need to check it here.
        }

        if (conditionMet) {
          newUnlocks.push(form.id);
        }
      }
    });

    if (newUnlocks.length > 0) {
      setGameState(prev => {
        const newlyUnlockedForms = newUnlocks
          .map(id => EGG_FORMS_DATA.find(f => f.id === id))
          .filter((f): f is NonNullable<typeof f> => !!f);
        
        newlyUnlockedForms.forEach(form => {
          showMessage(`Nova Forma de Ovo desbloqueada: ${form.name}!`, 3000);
        });

        if (newlyUnlockedForms.length > 0) {
          playSound('discovery.mp3', prev.isSoundEnabled, 0.8);
        }
        
        return {
          ...prev,
          unlockedEggForms: [...new Set([...prev.unlockedEggForms, ...newUnlocks])]
        };
      });
    }
  }, [
    gameState.unlockedEggForms,
    gameState.currentStageIndex,
    gameState.upgradesData,
    gameState.abilitiesUsedThisRun,
    gameState.enemiesDefeatedThisRun,
    setGameState,
    showMessage
  ]);

  useEffect(() => {
    checkEggFormUnlocks();
  }, [checkEggFormUnlocks]);
};
