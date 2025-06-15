import { useCallback, useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EggForm } from '../types';
import { EGG_FORMS_DATA } from '../constants'; // For form details

export const useEggFormHandler = (
    gameState: Pick<GameState, 'activeEggFormIds' | 'legendaryUpgradesData' | 'unlockedEggForms'>,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const effectiveMaxActiveEggForms = useMemo(() => {
        const ruinaIluminada = gameState.legendaryUpgradesData.find(lu => lu.id === 'illuminatedRuin' && lu.activated);
        if (ruinaIluminada?.effect?.setMaxActiveEggForms) return ruinaIluminada.effect.setMaxActiveEggForms as Decimal;
        return new Decimal(1);
    }, [gameState.legendaryUpgradesData]);

    const handleToggleEggForm = useCallback((formId: string) => {
        setGameState(prev => {
            const formDetails = EGG_FORMS_DATA.find(f => f.id === formId);
            if (!formDetails || !prev.unlockedEggForms.includes(formId)) {
                showMessage("Forma de ovo não disponível.", 1500);
                return prev;
            }

            let newActiveForms = [...prev.activeEggFormIds];
            if (newActiveForms.includes(formId)) {
                newActiveForms = newActiveForms.filter(id => id !== formId);
                showMessage(`Forma "${formDetails.name}" desativada.`, 1500);
            } else {
                if (newActiveForms.length < effectiveMaxActiveEggForms.toNumber()) {
                    newActiveForms.push(formId);
                    showMessage(`Forma "${formDetails.name}" ativada!`, 1500);
                } else {
                    showMessage(`Limite de ${effectiveMaxActiveEggForms.toString()} formas ativas atingido.`, 2000);
                }
            }
            return { ...prev, activeEggFormIds: newActiveForms };
        });
    }, [setGameState, showMessage, effectiveMaxActiveEggForms]);

    return { handleToggleEggForm, effectiveMaxActiveEggForms };
};