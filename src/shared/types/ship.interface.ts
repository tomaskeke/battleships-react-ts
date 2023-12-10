export interface Ship {
    name: string;
    size: number;
    sunk: boolean;
    hitCount: number;
    direction: string;
}
export type ShipType = 'Carrier' | 'Battleship' | 'Cruiser' | 'Submarine' | 'Destroyer';

export type Fleet = {
    [key in ShipType]: Ship;
};
