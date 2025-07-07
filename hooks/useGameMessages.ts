
import { useState, useCallback } from 'react';
import { GameState } from '../types';

export const useGameMessages = (setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {
    const showMessage = useCallback((text: string, duration = 3000) => {
        const id = Date.now();
        setGameState(prev => ({ ...prev, message: { text, id } }));
        if (duration > 0) {
            setTimeout(() => {
                setGameState(prev => (prev.message?.id === id ? { ...prev, message: null } : prev));
            }, duration);
        }
    }, [setGameState]);

    return { showMessage };
};
