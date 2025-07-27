const Player = require("./player");
const Ship = require("./ship");
const DOMHandler = require("./DOMHandler");


const GameLogicHandler = (function() {

    // Indicates whether someone's won the game
    let gameOver = false;
    // Indicates whether it's the player's turn or not
    let playersTurn = true;
    let player1 = new Player("Isa", true);
    let player2 = new Player("Odin");

    // Adds event listeners to all squares on the board
    const addSquareListeners = (squares) => {
        for(let index = 0; index < squares.length; index++){
            const square = squares[index];
            square.addEventListener("click", () => {
                // first we're gonna make sure the game isn't over and it's the player's turn
                if(!gameOver && playersTurn) {
                    DOMHandler.markAttack(Math.floor(index / 10), index % 10, "Computer");
                    player2.board.receiveAttack(Math.floor(index / 10), index % 10);
                    console.log(player2.board.defeated);
                    
                }
            });
        }
    }

    const setUpRoutine = async () => {

        
        
        let ship1 = new Ship(3);
        let ship2 = new Ship(4);
        let ship3 = new Ship(3);
        let ship4 = new Ship(4);
        player1.board.placeShip(5, 5, ship1, "vertical");
        player1.board.placeShip(8, 3, ship2, "horizontal");
        
        player2.board.placeShip(1,4, ship3, "horizontal");
        player2.board.placeShip(6, 7, ship4, "vertical");
        
        const squares = await DOMHandler.createGrids();
        addSquareListeners(squares);
        DOMHandler.markShip(5, 5, ship1.length, "vertical", "Player");
        DOMHandler.markShip(8, 3, ship2.length, "horizontal", "Player");
        DOMHandler.markShip(1, 4, ship3.length, "horizontal", "Computer");
        DOMHandler.markShip(6, 7, ship4.length, "vertical", "Computer");
        
    }

    return { setUpRoutine };
})();

export default GameLogicHandler;