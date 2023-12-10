import React, {useCallback, useEffect, useState} from 'react';
import {useGameContext} from '../shared/utils/gameUtils.ts';
import {useUserContext} from "../shared/utils/userUtils.ts";
import "./GameBoard.css";
import {useNavigate} from "react-router-dom";
import {Ship} from "../shared/types/ship.interface.ts";
import {User} from "../shared/types/user.interface.ts";

// handlePlaceShipClick is optional because it's only used in the PlaceShips component
type GameBoardProps = {
    handlePlaceShipClick?: (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => void,
}
export const GameBoard: React.FC<GameBoardProps> = ({handlePlaceShipClick}) => {
    const {
        currentPlayerBoard,
        setCurrentPlayerBoard,
        gameStatus,
        setGameStatus,
        currentlySelected,
        setCurrentlySelected,
        hoveredShipCoordinates,
        setHoveredShipCoordinates,
    } = useGameContext();

    const {players, setPlayers, updatePlacedShips, resetPlayers} = useUserContext();
    const [lastShot, setLastShot] = useState<string | null>(null);
    const [isRecapPhase, setIsRecapPhase] = useState<boolean>(false);
    const [isRecapTurnedOff, setIsRecapTurnedOff] = useState<boolean>(false);
    const navigate = useNavigate();

    const evaluateWinner = useCallback((currentPlayerShips: Ship[], winner: "player1" | "player2") => {
        const hasWon = currentPlayerShips.every((ship) => ship.sunk);
        const otherPlayer = players.player1.turn ? 'player2' : 'player1';
        if (hasWon) {
            setGameStatus('finished');
            setPlayers((prevState: User) => ({
                ...prevState,
                [winner]: {...prevState[winner], ready: false, placedShips: []},
                [otherPlayer]: {...prevState[otherPlayer], ready: false, placedShips: []}
            }))
            alert(`${players[winner].name} has won!`);
            resetPlayers();
            navigate("/")
        }
    }, [navigate, players, setGameStatus, setPlayers, resetPlayers]);

    const checkHitOrMiss = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {

        const squareValue = currentPlayerBoard[rowIndex][colIndex];
        const isSquareEmpty = squareValue === 'empty';
        const isSquareNotMissOrHit = squareValue !== 'miss' && squareValue !== 'hit';

        // Check if the square is empty or not
        if (isSquareEmpty && isSquareNotMissOrHit) {
            currentPlayerBoard[rowIndex][colIndex] = 'miss';
            e.currentTarget!.classList.add('miss');
            setLastShot('Missed!');
            setIsRecapPhase(true)
        } else if (!isSquareEmpty && isSquareNotMissOrHit) {
            currentPlayerBoard[rowIndex][colIndex] += ' hit';
            e.currentTarget!.classList.add('hit');
            setLastShot('Hit!');
            const shipName = e.currentTarget.dataset.ship?.trim();
            // Check if the square is a ship
            if (shipName) {
                const currentBoard = players.player1.turn ? 'player2' : 'player1';
                const currentPlayerTurn = players.player1.turn ? 'player1' : 'player2';
                const shipIndex = players[currentBoard].placedShips.findIndex((ship: Ship) => ship.name === shipName);
                if (shipIndex === -1) {
                    throw new Error(`Could not find ship with name ${shipName}`);
                }
                const updatedPlacedShips = [...players[currentBoard].placedShips];
                const updatedShip = {...updatedPlacedShips[shipIndex]};
                updatedShip.hitCount += 1;
                updatedShip.sunk = updatedShip.hitCount === updatedShip.size;
                updatedPlacedShips[shipIndex] = updatedShip;
                updatePlacedShips(currentBoard, updatedPlacedShips);
                evaluateWinner(updatedPlacedShips, currentPlayerTurn);
            }

            setIsRecapPhase(true)
        }

    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
        if (gameStatus === 'ongoing') {
            if (e.currentTarget.classList.contains('miss') || e.currentTarget.classList.contains('hit')) {
                return;
            }
            if (isRecapTurnedOff) {
                const currentPlayer = players.player1.turn ? 'player1' : 'player2';
                const otherPlayer = players.player1.turn ? 'player2' : 'player1';
                setPlayers((prevState: User) => ({
                    ...prevState,
                    [currentPlayer]: {...prevState[currentPlayer], turn: !prevState[currentPlayer].turn},
                    [otherPlayer]: {...prevState[otherPlayer], turn: !prevState[otherPlayer].turn}
                }))
            } else {
                if (isRecapPhase) {
                    return;
                }
            }
            checkHitOrMiss(e, rowIndex, colIndex);
        }
    }

    const handleRecapClick = () => {
        setIsRecapPhase((prevState: boolean) => !prevState);
        const currentPlayer = players.player1.turn ? 'player1' : 'player2';
        const otherPlayer = players.player1.turn ? 'player2' : 'player1';
        setPlayers((prevState: User) => ({
            ...prevState,
            [currentPlayer]: {...prevState[currentPlayer], turn: !prevState[currentPlayer].turn},
            [otherPlayer]: {...prevState[otherPlayer], turn: !prevState[otherPlayer].turn}
        }))
    }

    const handleRecapOption = () => {
        setIsRecapTurnedOff((prevState: boolean) => !prevState);
    }

    // handleMouseLeave is only used in the preparing game phase
    const handleMouseLeave = () => {
        setHoveredShipCoordinates(null);
    };

    // handleMouseOver is only used in the preparing game phase
    const handleMouseOver = (rowIndex: number, colIndex: number) => {
        if (gameStatus === 'preparing' && currentlySelected) {
            const shipCoordinates: [number, number][] = [];
            const direction = currentlySelected.direction === 'horizontal' ? 1 : 10;

            for (let i = 0; i < currentlySelected.size; i++) {
                const row = rowIndex + (direction === 1 ? 0 : i);
                const col = colIndex + (direction === 10 ? 0 : i);
                shipCoordinates.push([row, col]);
            }
            if (shipCoordinates.some(([row, col]) => row > 9 || col > 9)) {
                return;
            }
            setHoveredShipCoordinates(shipCoordinates);
        }
    };
    // checkTurn is only used in the ongoing game phase
    const checkTurn = useCallback(() => {
        setCurrentPlayerBoard(
            gameStatus === 'ongoing'
                ? (players.player1.turn ? players.player2.board : players.player1.board)
                : (players.player1.turn ? players.player1.board : players.player2.board)
        );
    }, [gameStatus, players, setCurrentPlayerBoard]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'r') {
                setCurrentlySelected((prevState: Ship) => ({
                    ...prevState,
                    direction: prevState.direction === 'horizontal' ? 'vertical' : 'horizontal',
                }));
            }
            if (e.key === "Escape") {
                setCurrentlySelected({name: "", size: 0, hitCount: 0, sunk: false, direction: ""})
            }
        };
        checkTurn();
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRecapTurnedOff, checkTurn, setCurrentlySelected]);
    return (
        <div className={"game-board"}>
            {gameStatus === 'ongoing' && (
                <>
                    <div className={"info-box"} style={{}}>
                        {lastShot ?
                            <h4>{players.player1.turn ? `${players.player2.name} ${lastShot}` : `${players.player1.name} ${lastShot}`}</h4> :
                            <h4>Take your first shot!</h4>}
                    </div>
                    <div className="recap-prompt">
                        {isRecapTurnedOff ? <h4>Recap is turned off</h4> : <h4>Recap is turned on</h4>}
                        <button
                            onClick={handleRecapOption}>{isRecapTurnedOff ? "Enable recap?" : "Disable recap?"}</button>
                    </div>
                </>
            )}

            {isRecapPhase && !isRecapTurnedOff && (
                <div className={"recap"}>
                    <div className={"recap-content"}>
                        <h4>{players.player1.turn ? players.player1.name : players.player2.name} {lastShot}</h4>
                        <div className={"recap-board flex-col"}>
                            <button onClick={handleRecapClick}>Exit Recap</button>
                        </div>
                    </div>
                </div>
            )}
            {currentPlayerBoard.map((boardRow: string[], rowIndex: number) => (
                <div key={rowIndex} className="flex row">
                    {boardRow.map((boardCol, colIndex) => {
                        const isHovered = hoveredShipCoordinates?.some(([row, col]: [number, number]) => row === rowIndex && col === colIndex);
                        let squareClassName = `${boardCol} square`;
                        if (gameStatus === "preparing" && isHovered && currentlySelected) {
                            squareClassName += ` ${currentlySelected.name}`;
                        } else if (gameStatus === "ongoing") {
                            squareClassName += ` ${boardCol !== "hit" && boardCol !== "miss" ? "blank" : ''}`;
                        }
                        const currentPlayerClassName = players.player1.turn ? "player1" : "player2";
                        return (
                            <div
                                key={colIndex}
                                tabIndex={0}
                                onClick={(e) => gameStatus === "preparing" ? handlePlaceShipClick!(e, rowIndex, colIndex) : handleClick(e, rowIndex, colIndex)}
                                onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                                onMouseLeave={handleMouseLeave}
                                data-ship={boardCol}
                                className={`${currentPlayerClassName} ${squareClassName}`}
                            >
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};