const Player = require("./player");
const Ship = require("./ship");
const DOMHandler = require("./DOMHandler");


const GameLogicHandler = (function() {
    const setUpRoutine = () => {

        let player1 = new Player("Isa", true);
        let player2 = new Player("Odin");
        
        let ship1 = new Ship(3);
        let ship2 = new Ship(4);
        let ship3 = new Ship(3);
        let ship4 = new Ship(4);
        player1.board.placeShip(5, 5, ship1, "vertical");
        player1.board.placeShip(8, 3, ship2, "horizontal");
        
        player2.board.placeShip(1,4, ship3, "horizontal");
        player2.board.placeShip(6, 7, ship4, "vertical");
        
        DOMHandler.createGrids();
    }

    return { setUpRoutine };
})();

export default GameLogicHandler;