import React, { createContext, useState, ReactNode } from 'react';
import { type Ship } from "../shared/types/ship.interface.ts";
import { type GameContextType } from "../shared/types/game.interface.ts";

export const GameContext = createContext<GameContextType | undefined>(undefined);

type GameProviderProps = {
    children: ReactNode;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [currentPlayerBoard, setCurrentPlayerBoard] = useState<Array<Array<string>>>([]);
    const [gameStatus, setGameStatus] = useState<string>('preparing');
    const [winner, setWinner] = useState<string>('');
    const [currentlySelected, setCurrentlySelected] = useState<Ship>({} as Ship);
    const [hoveredShipCoordinates, setHoveredShipCoordinates] = useState<[number, number][] | null>(null);


    const generateBoard = (rows: number, cols: number, initialValue: string): Array<Array<string>> => {
        return Array.from({ length: rows }, () => Array.from({ length: cols }, () => initialValue));
    };

    const gameContextValue: GameContextType = {
        currentPlayerBoard,
        setCurrentPlayerBoard,
        gameStatus,
        setGameStatus,
        winner,
        setWinner,
        currentlySelected,
        setCurrentlySelected,
        generateBoard,
        hoveredShipCoordinates,
        setHoveredShipCoordinates,

    };

    return (
        <GameContext.Provider value={gameContextValue}>
            {children}
        </GameContext.Provider>
    );
};
