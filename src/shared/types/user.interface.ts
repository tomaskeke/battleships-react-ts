import { Ship } from './ship.interface.ts';
import React, {Dispatch, SetStateAction} from "react";

export interface UserContextType {
    players: User;
    setPlayers: Dispatch<SetStateAction<User>>;
    updatePlacedShips: (player: 'player1' | 'player2', newShips: Ship[]) => void;
    resetPlayers: () => void;
}

export interface User {
    player1: {
        name: string;
        turn: boolean;
        board: string[][];
        placedShips: Ship[];
        ready: boolean;
    }
    player2: {
        name: string;
        turn: boolean;
        board: string[][];
        placedShips: Ship[];
        ready: boolean;
    };
}

export interface UserProviderProps {
    children: React.ReactNode;
}