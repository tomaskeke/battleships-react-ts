import React from 'react';
import { useGameContext } from "../shared/utils/gameUtils.ts";
import { useUserContext } from "../shared/utils/userUtils.ts";
import { type Ship, type ShipType, type Fleet } from "../shared/types/ship.interface.ts";
import "./Shipyard.css";
interface ShipProps {
    name: ShipType;
    size: number;
    used: boolean;
}

// Shipyard component is used to display the ships that the player can place on the gameboard
const Ship: React.FC<ShipProps> = ({ name, size , used}) => {
    const { currentlySelected,setCurrentlySelected, gameStatus } = useGameContext();
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.currentTarget.children[0].classList.contains('placed')){
            return;
        }else{
            if(gameStatus === 'preparing') {
                const shipData: Ship = {
                    name,
                    size,
                    sunk: false,
                    hitCount: 0,
                    direction: 'horizontal',
                };
                setCurrentlySelected(shipData);
            }
        }


    };

    const hull = Array.from({ length: size }, (_, index) => (
        <div key={index} className={`${name} square ${used ? 'placed' : ''}${currentlySelected.name == name ? 'selected' : ''}`} data-size={size} data-index={index} />
    ));

    return (
        <div className={"flex"} style={{ justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", }}>
            <p>{name}</p>
            <div onClick={(e) => handleClick(e)} style={{ display: 'flex', marginTop: '5px' }}>
                {hull}
            </div>
        </div>
    );
};

const Shipyard: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
    const { players } = useUserContext();
    const placedShips = players.player1.turn ? players.player1.placedShips : players.player2.placedShips;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', border: "1px solid #ccc", padding: "2rem" }}>
            <h2>Shipyard</h2>
            {Object.entries(fleet).map(([ship, details]) => {
             return (
                <Ship
                    key={ship}
                    name={ship as ShipType}
                    size={details.size}
                    used={placedShips.some((placedShip: Ship) => placedShip.name === ship)}
                />
            )})}
        </div>
    );
};

export default Shipyard;
