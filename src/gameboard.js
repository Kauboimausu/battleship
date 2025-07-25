class GameBoard {
    constructor() {
        this.squares = Array.from({ length: 10 }, () => Array.from(Array(10), () => 
            ({
                "ship": null,
                "hit": false
            })
        ));
        this.missedAttacks = 0;
        this.shipsDefeated = 0;
        this.ships = [];
        this.missedAttacks = 0;
    }

    placeShip(yCoordinate, xCoordinate, ship, direction) {
        const shipLength = ship.length;
        // We'll place the ship differently depending on whether it's placed horizontally or vertically
        if(direction == "horizontal") {
            // We'll check to see if the ship is being placed out of bounds, we'll throw an error if it is
            if(xCoordinate + shipLength > 9) {
                throw new Error("Out of Bounds");
            }
            // Then we'll change the ship values for each of the squares the ship is placed in
            for(let index = xCoordinate; index < xCoordinate + shipLength; index++){
                this.squares[yCoordinate][index].ship = ship;
            }
            // Finally we'll add the ship to the list of ships on the board
            this.ships.push(ship);
        } else if(direction == "vertical") {
            // We'll do pretty much the same here
            if(yCoordinate - shipLength < 0) {
                throw new Error("Out of Bounds");
            }
            for(let index = yCoordinate; index > yCoordinate - shipLength; index--){
                this.squares[index][xCoordinate].ship = ship;
            }
            this.ships.push(ship);
        }
    }

    receiveAttack() {
        return "hi";
    }

    shipsRemain() {
        return "hi";
    }
}

module.exports = GameBoard;