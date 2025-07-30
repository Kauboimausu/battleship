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
        this.defeated = false;
    }

    placeShip(yCoordinate, xCoordinate, ship, direction) {
        const shipLength = ship.length;
        // We'll place the ship differently depending on whether it's placed horizontally or vertically
        if(direction == "horizontal") {
            // We'll check to see if the ship is being placed out of bounds, we'll throw an error if it is
            if(xCoordinate + (shipLength - 1) > 9) {
                throw new Error("Out of Bounds");
            } else {
                // Otherwise we'll check that there's not ships in the way, if there are we'll throw out an error
                for(let index = xCoordinate; index < xCoordinate + shipLength; index++) {
                    if(this.squares[yCoordinate][index].ship != null){
                        throw new Error("Clashing Ships");
                    }
                }
            }
            // Then we'll change the ship values for each of the squares the ship is placed in
            for(let index = xCoordinate; index < xCoordinate + shipLength; index++){
                this.squares[yCoordinate][index].ship = ship;
            }
            // Finally we'll add the ship to the list of ships on the board
            this.ships.push(ship);
        } else if(direction == "vertical") {
            // We'll do pretty much the same here
            if(yCoordinate - (shipLength - 1) < 0) {
                throw new Error("Out of Bounds");
            } else {
                for(let index = yCoordinate; index > yCoordinate - shipLength; index--) {
                    if(this.squares[index][xCoordinate].ship != null){
                        throw new Error("Clashing Ships");
                    }
                }
            }
            for(let index = yCoordinate; index > yCoordinate - shipLength; index--){
                this.squares[index][xCoordinate].ship = ship;
            }
            this.ships.push(ship);
        }
    }

    // Function that given coordinates strikes the given square and handles the appropriate logic
    receiveAttack(yCoordinate, xCoordinate) {
        // First we'll make the square hasn't been hit already, if it has we'll throw out an error
        if(this.squares[yCoordinate][xCoordinate].hit == true) {
            throw new Error("Square Already Attacked");
        }
        // Naturally we'll mark the square as hit
        this.squares[yCoordinate][xCoordinate].hit = true;
        // Then if there's a ship in the square and we already made sure the square hadn't been hit before we need to register a new hit
        if(this.squares[yCoordinate][xCoordinate].ship != null) {
            this.squares[yCoordinate][xCoordinate].ship.hit();
            // then we'll check if the ship has been sunk, if it has we'll check if the ship was sunken
            if(this.squares[yCoordinate][xCoordinate].ship.isSunk()) {
                // We'll increase the number of sunken ships
                this.shipsDefeated++;
                // Then we'll check if all our ships have been sunk, if so then we just lost the game
                if(this.ships.length == this.shipsDefeated) {
                    this.defeated = true;
                }
            }
            // We'll return true if a ship was hit
            return true;
        }
    }

    shipsRemain() {
        return "hi";
    }
}

module.exports = GameBoard;