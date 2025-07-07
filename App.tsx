import React from 'react';
import { GameProvider } from './contexts/GameContext';
import AppLayout from './components/AppLayout';

export const App: React.FC = () => {
    return (
        <GameProvider>
            <AppLayout />
        </GameProvider>
    );
};
