import { useEffect, useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState } from '../types';
import { formatNumber, playSound } from '../utils';

export const useSpecialUpgradeAutoActivator = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    useEffect(() => {
        // Ensure all necessary parts of gameState are loaded before proceeding
        if (gameState.currentStageIndex === undefined || !gameState.specialUpgradesData || !gameState.incubationPower || !gameState.temporaryEggs || !gameState.transcendentEssence) {
            return;
        }

        let stateChanged = false;
        let newIncubationPower = gameState.incubationPower;
        let newTranscendentEssence = gameState.transcendentEssence;
        let newTemporaryEggs = gameState.temporaryEggs;
        let messagesToShow: string[] = [];

        const updatedSpecialUpgrades = gameState.specialUpgradesData.map(su => {
            if (gameState.currentStageIndex >= su.stageRequired && su.purchased.isZero()) {
                stateChanged = true;
                messagesToShow.push(`Melhoria de Estágio "${su.name}" ativada automaticamente!`);

                let oneTimeEffectMessage = "";
                // Handle one-time effects for specific upgrades
                if (su.id === 'stage9Bonus' && su.effect.piPerTemporaryEgg) {
                    if (newTemporaryEggs.gt(0)) {
                        const piGainedFromEggs = newTemporaryEggs.times(su.effect.piPerTemporaryEgg as Decimal);
                        newIncubationPower = newIncubationPower.plus(piGainedFromEggs);
                        newTemporaryEggs = new Decimal(0);
                        oneTimeEffectMessage = ` Ganhou ${formatNumber(piGainedFromEggs)} PI convertendo Ovos Temporários.`;
                    } else {
                        oneTimeEffectMessage = ` Nenhum Ovo Temporário para converter.`;
                    }
                } else if (su.id === 'stage13Bonus' && su.effect.bonusET) {
                    newTranscendentEssence = newTranscendentEssence.plus(su.effect.bonusET as Decimal);
                    oneTimeEffectMessage = ` Ganhou ${formatNumber(su.effect.bonusET as Decimal)} Essência Transcendente.`;
                }
                
                if (oneTimeEffectMessage) {
                    messagesToShow.push(oneTimeEffectMessage);
                }

                return { ...su, purchased: new Decimal(1) };
            }
            return su;
        });

        if (stateChanged) {
            setGameState(prev => ({
                ...prev,
                specialUpgradesData: updatedSpecialUpgrades,
                incubationPower: newIncubationPower,
                transcendentEssence: newTranscendentEssence,
                temporaryEggs: newTemporaryEggs,
            }));
            messagesToShow.forEach((msg, index) => {
                setTimeout(() => showMessage(msg, 2500 + (index * 500)), index * 500);
            });
            playSound('purchase_special.mp3', gameState.isSoundEnabled, 0.8); // A slightly different sound or volume for auto-activation
        }

    }, [gameState.currentStageIndex, gameState.specialUpgradesData, gameState.incubationPower, gameState.temporaryEggs, gameState.transcendentEssence, setGameState, showMessage, gameState.isSoundEnabled]);
};
