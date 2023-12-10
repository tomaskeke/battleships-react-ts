import {Dispatch, SetStateAction} from "react";
import {Ship} from "./ship.interface.ts";
import {User} from "./user.interface.ts";

export interface GameContextType {
    currentPlayerBoard: User['player1']['board'] | User['player2']['board'];
    setCurrentPlayerBoard: Dispatch<SetStateAction<Array<Array<string>>>>;
    gameStatus: string;
    setGameStatus: Dispatch<SetStateAction<string>>;
    winner: string;
    setWinner: Dispatch<SetStateAction<string>>;
    currentlySelected: Ship;
    setCurrentlySelected: Dispatch<SetStateAction<Ship>>;
    generateBoard: (rows: number, cols: number, initialValue: string) => Array<Array<string>>;
    hoveredShipCoordinates: [number, number][] | null;
    setHoveredShipCoordinates: Dispatch<SetStateAction<[number, number][] | null>>;
};