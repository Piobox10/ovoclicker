
import { GameState } from './GameState'; // Full GameState for effect application

export interface GameEventOption {
    text: string;
    consequence: string;
    applyEffect: (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>, showMessage: (text: string, duration?: number) => void) => void;
}

export interface GameEvent {
    id: string;
    name: string;
    description: string;
    options: GameEventOption[];
}
