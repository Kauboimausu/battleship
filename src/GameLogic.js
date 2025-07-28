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

    // This will generate all the legal moves that you can make, we're doing this ensure the moves are random but we don't get repeats
    const possibleMoves = (() => {
        let moves = [];
        // We'll generate all the available moves for the computer
        for(let j = 0; j < 10; j++) {
            for(let i = 0; i < 10; i++) {
                moves.push([j, i]);
            }
        }
        // Next we'll shuffle the array in place using the Durstenfeld shuffle algorithm
        for(let index = moves.length - 1; index > 0; index--) {
            let x = Math.floor(Math.random() * (index + 1));
            let temp = moves[index];
            moves[index] = moves[x];
            moves[x] = temp;
        }
        return moves;
    })();

    const computerMove = () => {
        // We'll use set timeout to create an artificial delay and make it seem as if the computer were thinking, we'll use 2 seconds
        setTimeout(() => {
            while(!playersTurn && !gameOver) {
                // We'll take the last move of the list, recall that the list is well shuffled
                const nextMove = possibleMoves.pop();
                // Next we'll hit the ship in the given coordinates
                const shipWasHit = player1.board.receiveAttack(nextMove[0], nextMove[1]);
                // and we'll mark it on the UI too
                DOMHandler.markAttack(nextMove[0], nextMove[1], "Player", shipWasHit);
                // We'll also pass the turn if the computer missed
                if(!shipWasHit) {
                    playersTurn = true;
                }
                if(player1.board.defeated) {
                    gameOver = true;
                    DOMHandler.updateMessage(`${player1.name} lost!`)
                }
            }
        }, 1500);

    }

    // Adds event listeners to all squares on the board
    const addSquareListeners = (squares) => {
        for(let index = 0; index < squares.length; index++){
            const square = squares[index];
            square.addEventListener("click", () => {
                // first we're gonna make sure it's the player's turn
                if(playersTurn) {
                    // We'll encapsulate all the code inside this while to make sure the player can have consecutive turns should they hit a ship
                    // We'll make the sure game isn't over every time as well, the game is over if all ships on one side are destroyed
                    while(playersTurn && !gameOver) {
                        const shipWasHit = player2.board.receiveAttack(Math.floor(index / 10), index % 10);
                        DOMHandler.markAttack(Math.floor(index / 10), index % 10, "Computer", shipWasHit);
                        // If the ship wasn't hit we'll let the player have another turns until they miss
                        if(!shipWasHit) {
                            playersTurn = false
                        }
                        if(player2.board.defeated) {
                            gameOver = true;
                            DOMHandler.updateMessage(`${player2.name} lost!`)
                        } else if(!playersTurn){
                            // After the player makes a move the computer will make their move, but only if the player didn't miss
                            computerMove();
                        }
                    }
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
        
        const squares = DOMHandler.createGrids();
        addSquareListeners(squares);
        DOMHandler.markShip(5, 5, ship1.length, "vertical", "Player");
        DOMHandler.markShip(8, 3, ship2.length, "horizontal", "Player");
        DOMHandler.markShip(1, 4, ship3.length, "horizontal", "Computer");
        DOMHandler.markShip(6, 7, ship4.length, "vertical", "Computer");
        
    }

    return { setUpRoutine };
})();

export default GameLogicHandler;