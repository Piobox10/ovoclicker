import { useCallback, useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, EggForm } from '../types';
import { EGG_FORMS_DATA } from '../constants'; // For form details

export const useEggFormHandler = (
    gameState: Pick<GameState, 'activeEggFormIds' | 'legendaryUpgradesData' | 'unlockedEggForms' | 'dualCoreMaxEggFormsActive' | 'specialUpgradesData'>,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    showMessage: (text: string, duration?: number) => void
) => {
    const effectiveMaxActiveEggForms = useMemo(() => {
        const percepcaoIncandescente = gameState.specialUpgradesData.find(su => su.id === 'stage33Bonus' && su.purchased.equals(1));
        if (percepcaoIncandescente?.effect?.allEggFormsActive) {
            return new Decimal(EGG_FORMS_DATA.length);
        }

        const formShatterer = gameState.legendaryUpgradesData.find(lu => lu.id === 'formShatterer' && lu.activated);
        if (formShatterer) {
            return new Decimal(EGG_FORMS_DATA.length); // Allow all forms if formShatterer is active
        }

        let maxForms = new Decimal(1); 
        if (gameState.dualCoreMaxEggFormsActive) { 
            maxForms = new Decimal(2);
        }
        
        const ruinaIluminada = gameState.legendaryUpgradesData.find(lu => lu.id === 'illuminatedRuin' && lu.activated);
        if (ruinaIluminada?.effect?.setMaxActiveEggForms) {
            maxForms = Decimal.max(maxForms, ruinaIluminada.effect.setMaxActiveEggForms as Decimal);
        }

        const resilienciaFraturada = gameState.specialUpgradesData.find(su => su.id === 'stage16Bonus' && su.purchased.equals(1));
        if (resilienciaFraturada?.effect?.setMaxActiveEggForms) {
            maxForms = Decimal.max(maxForms, resilienciaFraturada.effect.setMaxActiveEggForms as Decimal);
        }

        return maxForms;
    }, [gameState.legendaryUpgradesData, gameState.dualCoreMaxEggFormsActive, gameState.specialUpgradesData]);

    const handleToggleEggForm = useCallback((formId: string) => {
        setGameState(prev => {
            const formDetails = EGG_FORMS_DATA.find(f => f.id === formId);
            if (!formDetails || !prev.unlockedEggForms.includes(formId)) {
                showMessage("Forma de ovo não disponível.", 1500);
                return prev;
            }

            let newActiveForms = [...prev.activeEggFormIds];
            let newTemporaryEggs = prev.temporaryEggs;
            let newEggFormsActivatedThisRun = new Set(prev.eggFormsActivatedThisRun);

            if (newActiveForms.includes(formId)) {
                newActiveForms = newActiveForms.filter(id => id !== formId);
                showMessage(`Forma "${formDetails.name}" desativada.`, 1500);
            } else {
                if (newActiveForms.length < effectiveMaxActiveEggForms.toNumber()) {
                    newActiveForms.push(formId);
                    newEggFormsActivatedThisRun.add(formId);

                    const criacaoResiduadaUpgrade = prev.specialUpgradesData.find(su => su.id === 'stage28Bonus' && su.purchased.equals(1));
                    if (criacaoResiduadaUpgrade && newEggFormsActivatedThisRun.size > 0 && newEggFormsActivatedThisRun.size % 5 === 0) {
                        newTemporaryEggs = newTemporaryEggs.plus(1);
                        showMessage("Criação Residuada: +1 Ovo Temporário ganho!", 2000);
                    }

                    showMessage(`Forma "${formDetails.name}" ativada!`, 1500);
                } else {
                    showMessage(`Limite de ${effectiveMaxActiveEggForms.toString()} formas ativas atingido.`, 2000);
                }
            }
            return { 
                ...prev, 
                activeEggFormIds: newActiveForms,
                temporaryEggs: newTemporaryEggs,
                eggFormsActivatedThisRun: newEggFormsActivatedThisRun,
            };
        });
    }, [setGameState, showMessage, effectiveMaxActiveEggForms]);

    return { handleToggleEggForm, effectiveMaxActiveEggForms };
};
