import {useUserContext} from "../shared/utils/userUtils.ts";
import {useGameContext} from "../shared/utils/gameUtils.ts";
import Shipyard from "../components/Shipyard.tsx";
import {Fleet} from "../shared/types/ship.interface.ts";
import {GameBoard} from "../components/GameBoard.tsx";
import {useNavigate} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
import {InfoText} from "../components/InfoText.tsx";
import {User} from "../shared/types/user.interface.ts";

const PlaceShips: React.FC = () => {
    const { players, setPlayers , updatePlacedShips } = useUserContext();
    const {
        currentPlayerBoard,
        gameStatus,
        setGameStatus,
        currentlySelected,
        setCurrentlySelected,
        hoveredShipCoordinates,
        setHoveredShipCoordinates
    } = useGameContext();
    const navigate = useNavigate();

    const fleet: Fleet = {
        Carrier: {
            name: 'carrier',
            size: 5,
            sunk: false,
            hitCount: 0,
            direction: 'horizontal',
        },
        Battleship: {
            name: 'battleship',
            size: 4,
            sunk: false,
            hitCount: 0,
            direction: 'horizontal',
        },
        Cruiser: {
            name: 'cruiser',
            size: 3,
            sunk: false,
            hitCount: 0,
            direction: 'horizontal',
        },
        Submarine: {
            name: 'submarine',
            size: 3,
            sunk: false,
            hitCount: 0,
            direction: 'horizontal',
        },
        Destroyer: {
            name: 'destroyer',
            size: 2,
            sunk: false,
            hitCount: 0,
            direction: 'horizontal',
        },
    };

    const handleReady = () => {
        players.player1.turn ? setPlayers((prevState: User) => ({
            ...prevState,
            player1: { ...prevState.player1, ready: true, turn: false},
        })) : players.player1.ready && setPlayers((prevState: User) => ({
            ...prevState,
            player2: { ...prevState.player2, ready: true, turn: true },
        }));
        }


    const handlePlaceShipClick = (_: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
        if (gameStatus === 'preparing') {
            if (currentlySelected && hoveredShipCoordinates) {
                const currentPlayer = players.player1.turn ? 'player1' : 'player2';
                const shipName = currentlySelected;

                if (!Array.isArray(players[currentPlayer].placedShips)) {
                    throw new Error(`players.${currentPlayer}.placedShips is not an array`);
                }

                const isCellWithinHoveredShip = hoveredShipCoordinates.some(([row, col]: [number, number]) => row === rowIndex && col === colIndex);
                const isOverlapping = hoveredShipCoordinates.some(([row, col]: [number, number]) => {
                    return currentPlayerBoard[row][col] !== 'empty';
                });

                if (isCellWithinHoveredShip && !isOverlapping) {
                    if (!players[currentPlayer].placedShips.includes(shipName)) {
                        updatePlacedShips(currentPlayer, [...players[currentPlayer].placedShips, shipName]);

                        hoveredShipCoordinates.forEach(([row, col]: [number, number]) => {
                            currentPlayerBoard[row][col] = shipName.name;
                        });

                        setCurrentlySelected({ name: '', size: 0, hitCount: 0, sunk: false, direction: '' });
                        setHoveredShipCoordinates(null);
                    }
                } else {
                    console.log('Invalid placement: Overlaps or out of bounds');
                }
            }
        }
    }

    const setTurn = useCallback(() => {
        players.player1.ready && players.player2.ready ? setGameStatus('ongoing') : setGameStatus('preparing');
        setPlayers((prevState: User) => ({
            ...prevState,
            player1: { ...prevState.player1, turn: true },
            player2: { ...prevState.player2, turn: false }
        }))
        navigate("/game")
    },[players.player1.ready, players.player2.ready, setGameStatus, setPlayers, navigate])

    useEffect(() => {
        if(players.player1.ready && players.player2.ready && players.player2.turn) {
            setTurn()
        }
    }, [players.player1.ready, players.player2.ready, players.player2.turn, setTurn])

    return (
        <>
            <div className={"flex-row justify-content-between p-4"}>
                <Shipyard fleet={fleet} />
                <InfoText />
                <GameBoard handlePlaceShipClick={handlePlaceShipClick} />
            </div>
            <div className={"flex-col"}>
                {players.player1.turn ? players.player1.placedShips.length === 5 ?
                    <button className={"btn"} onClick={handleReady}>{players.player1.name} Ready</button> :
                    <button className={"btn"} disabled>Place your ships</button> :
                    players.player2.placedShips.length === 5 ?
                    <button className={"btn"} onClick={handleReady}>{players.player2.name} Ready</button> :
                    <button className={"btn"} disabled>Place your ships</button>
                }

            </div>
        </>
    );
};
export default PlaceShips;