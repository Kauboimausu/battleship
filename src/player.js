const GameBoard = require("./gameboard");

class Player {
    constructor(name = "Odin", real = false) {
        this.name = name;
        // If the player is real it'll be the human player, otherwise it's the computer
        this.real = real;
        this.board = new GameBoard();
    }
}

module.exports = Player;
