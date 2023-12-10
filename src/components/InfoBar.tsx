import './infoBar.css';
import {useUserContext} from "../shared/utils/userUtils.ts";
import {useGameContext} from "../shared/utils/gameUtils.ts";
import { Ship } from "../shared/types/ship.interface.ts";

// InfoBar component is used to display information about the game at all screens.
export const InfoBar = () => {
    const { players } = useUserContext();
    const {gameStatus } = useGameContext();
    if(gameStatus === "new-game" || gameStatus === "finished"){
        return (
            <>
            <div className={"infoBar"}>
                {players.player1.name.length > 0 && players.player2.name.length > 0 ?
                   <h2>Proceed to place your ships!</h2> : <h2>Waiting for players to join...</h2>
                }
            </div>
            </>
        );
    }else if(gameStatus === "preparing"){
        return (
            <>
                <div className={"infoBar"}>
                    {players.player1.turn ?
                        <h2>{players.player1.name} - place your ships.</h2> : <h2>{players.player2.name} - place your ships.</h2>
                    }
                </div>
            </>
        )
    }
    if(gameStatus === "ongoing"){
        return (
                <div className={"infoBar flex-row justify-content-between"}>
                    <div className={"playerInfo flex-row"}>
                        <h2>{players.player1.name}</h2>
                        <div className={"score-container flex-row"}>
                            {players.player2.placedShips.map((ship: Ship, index: number) => {
                                    if (ship.sunk) {
                                        return (
                                            <div key={players.player1.name + index} className={"sunken-ship"}></div>
                                        );
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className={"playerTurnInfo flex-row"}>
                    {players.player1.turn ? <h2 className={"highlighted"}>{players.player1.name}'s turn</h2> : <h2 className={"highlighted"}>{players.player2.name}'s turn</h2>}
                    </div>
                    <div className={"playerInfo flex-row"}>
                        <h2>{players.player2.name}</h2>
                        <div className={"score-container flex-row"}>
                            {players.player1.placedShips.map((ship: Ship, index: number) => {
                                if (ship.sunk) {
                                    return (
                                        <div key={players.player1.name + index} className={"sunken-ship"}></div>
                                    );
                                }
                            })
                            }
                        </div>
                    </div>
                </div>

        );
    }
};