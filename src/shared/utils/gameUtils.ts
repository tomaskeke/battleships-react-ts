import {useContext} from "react";
import { GameContext } from '../../contexts/gameContext.tsx';
import { type GameContextType} from "../types/game.interface.ts";

export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};
