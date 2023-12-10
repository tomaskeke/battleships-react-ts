import React, {createContext, useState, ReactNode} from 'react';
import {useGameContext} from "../shared/utils/gameUtils.ts";
import { type Ship } from "../shared/types/ship.interface.ts";
import { type User, type UserContextType } from "../shared/types/user.interface.ts";


export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
};


export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { generateBoard } = useGameContext();

    const initialPlayersState: User = {
        player1: {
            name: '',
            turn: false,
            board: generateBoard(10, 10, 'empty'),
            placedShips: [],
            ready: false,
        },
        player2: {
            name: '',
            turn: false,
            board: generateBoard(10, 10, 'empty'),
            placedShips: [],
            ready: false,
        },
    };

    const [players, setPlayers] = useState<User>(initialPlayersState);

    const updatePlacedShips = (player: 'player1' | 'player2', newShips: Ship[]) => {
        setPlayers((prevState) => {
            const newState = prevState as User;
            newState[player].placedShips = newShips;
            return newState;
        });
    };
    const resetPlayers = () => {
        setPlayers(initialPlayersState);
    }

    return (
        <UserContext.Provider value={{ players, setPlayers, updatePlacedShips, resetPlayers, }}>
            {children}
        </UserContext.Provider>
    );
};
