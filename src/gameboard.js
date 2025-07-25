class GameBoard {
    constructor() {
        this.squares = Array.from({ length: 10 }, () => Array.from(Array(10), () => 
            ({
                "ship": null,
                "hit": false
            })
        ));
        this.missedAttacks = 0;
    }

    placeShip() {
        return "hi";
    }

    receiveAttack() {
        return "hi";
    }

    shipsRemain() {
        return "hi";
    }
}

module.exports = GameBoard;