import React, {useEffect, useRef} from 'react';
import {useUserContext} from '../shared/utils/userUtils';
import {User} from "../shared/types/user.interface.ts";
import {useNavigate} from 'react-router-dom';
import {useGameContext} from "../shared/utils/gameUtils.ts";
import "./Lobby.css"

const Lobby: React.FC = () => {
    const {players, setPlayers,} = useUserContext();
    const {setGameStatus} = useGameContext();
    const player1Ref = useRef<HTMLInputElement>(null);
    const player2Ref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const handlePlayerName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const player = e.target.name as keyof User;
        setPlayers((prevState: User) => ({
            ...prevState,
            [player]: {...prevState[player], name: e.target.value}
        }));
    };
    const handleFormSubmission = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {

        if (e.type === 'click' || e.type === 'keydown' && (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter') {
            const keyEvent = e as React.KeyboardEvent<HTMLInputElement>;
            if (keyEvent) {
                if (
                    players.player1.name.trim().length > 0 &&
                    players.player2.name.trim().length > 0 &&
                    player1Ref.current!.value.trim().length > 0 &&
                    player2Ref.current!.value.trim().length > 0
                ) {
                    setPlayers((prevState: User) => ({
                        ...prevState,
                        player1: {...prevState.player1, turn: true}
                    }));
                    setGameStatus('preparing');
                    navigate('/place-ships');
                } else {
                    if (!player1Ref.current?.value.trim()) {
                        player1Ref.current?.focus();
                    } else {
                        player2Ref.current?.focus();
                    }
                }
            }
        }
    }

    useEffect(() => {
        setGameStatus('new-game');
    })
    return (
        <div className={"flex-col lobby"}>
            <div className="flex-col">
                <label htmlFor="player1">Player 1:</label>
                <input
                    ref={player1Ref}
                    id="player1"
                    type="text"
                    name={"player1"}
                    placeholder="Enter Player 1 Name"
                    value={players.player1.name}
                    onChange={handlePlayerName}
                    onKeyDown={handleFormSubmission}
                />
            </div>
            <div className="flex-col">
                <label htmlFor="player2">Player 2:</label>
                <input
                    ref={player2Ref}
                    id="player2"
                    type="text"
                    name={"player2"}
                    placeholder="Enter Player 2 Name"
                    value={players.player2.name}
                    onChange={handlePlayerName}
                    onKeyDown={handleFormSubmission}
                />
            </div>
            <button className="ready-button" onClick={(e) => handleFormSubmission(e)}>
                Proceed
            </button>
        </div>
    );
};

export default Lobby;
