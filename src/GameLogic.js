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

    // we'll use this array to display the coordinate that was hit in an UI message
    let numberCoordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function that places down enemy's ships in random locations
    const placeEnemyShips = () => {
        // We'll keep track of how many ships we've placed
        let placedShips = 0;
        // array with the ships 
        const ships = [new Ship(2), new Ship(3), new Ship(3), new Ship(4), new Ship(5)];
        while(placedShips < 5) {
            // We'll generate random coordinates and randomly decide to place the ship horizontally or vertically
            const column = Math.floor(Math.random() * 9);
            const row = Math.floor(Math.random() * 9);
            // Recall that 1 is truthy while 0 is not
            let direction = "";
            Math.random() < .5 ? direction = "vertical" : direction = "horizontal";
            try {
                player2.board.placeShip(row, column, ships[placedShips], direction);
                DOMHandler.markShip(row, column, ships[placedShips].length, direction, "Computer");
                placedShips++;
            } catch (error) {
                // We won't actually do anything with the error, we'll just try again
                // The errors that can arise come from trying to place the ship out of bounds or over another ship
            }
        }
    }

    const computerMove = async () => {
        // We'll use set timeout to create an artificial delay and make it seem as if the computer were thinking, we'll use 2 seconds
        
            while(!playersTurn && !gameOver) {
                await delay(1000);
                const destroyedShips = player1.board.shipsDefeated;
                // We'll take the last move of the list, recall that the list is well shuffled
                const nextMove = possibleMoves.pop();
                // Next we'll hit the ship in the given coordinates
                const shipWasHit = player1.board.receiveAttack(nextMove[0], nextMove[1]);
                // and we'll mark it on the UI too
                DOMHandler.markAttack(nextMove[0], nextMove[1], "Player", shipWasHit);
                // We'll also pass the turn if the computer missed
                if(!shipWasHit) {
                    DOMHandler.changeTurnText(player1.name);
                    playersTurn = true;
                    DOMHandler.updateMessage(`${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and missed`);
                } else if(destroyedShips == player1.board.shipsDefeated){
                    DOMHandler.updateMessage(`${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and hit an enemy ship!`);
                } else {
                    DOMHandler.updateMessage(`${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and destroyed an enemy ship!`);
                }
                if(player1.board.defeated) {
                    gameOver = true;
                    DOMHandler.updateMessage(`${player1.name} lost!`);
                    DOMHandler.updateMessage(`${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and destroyed the remaining fleet`);
                }
            }

    }

    // Adds event listeners to all squares on the board
    const addSquareListeners = (squares) => {
        for(let index = 0; index < squares.length; index++){
            const square = squares[index];
            square.addEventListener("click", () => {
                
                // We'll encapsulate all the code inside this while to make sure the player can have consecutive turns should they hit a ship
                // We'll make the sure game isn't over every time as well, the game is over if all ships on one side are destroyed
                if(playersTurn && !gameOver) {
                    // We'll save how many ships were destroyed at the beginning of the turn, we'll compare at the end to know if a ship was defeated
                    const destroyedShips = player2.board.shipsDefeated;
                    const shipWasHit = player2.board.receiveAttack(Math.floor(index / 10), index % 10);
                    DOMHandler.markAttack(Math.floor(index / 10), index % 10, "Computer", shipWasHit);
                    // If the ship wasn't hit we'll let the player have another turns until they miss
                    if(!shipWasHit) {
                        DOMHandler.changeTurnText(player2.name);
                        playersTurn = false
                        DOMHandler.updateMessage(`${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and missed`);
                    } else if( destroyedShips == player2.board.shipsDefeated){
                        DOMHandler.updateMessage(`${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and hit an enemy ship!`);
                    } else {
                        DOMHandler.updateMessage(`${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and destroyed an enemy ship!`);
                    }
                    if(player2.board.defeated) {
                        gameOver = true;
                        DOMHandler.updateMessage(`${player2.name} lost!`);
                        DOMHandler.updateMessage(`${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and destroyed the remaining fleet!`);
                    } else if(!playersTurn){
                        // After the player makes a move the computer will make their move, but only if the player didn't miss
                        computerMove();
                    }
                }
            });
        }
    }

    const setUpRoutine = async () => {

        
        
        let ship1 = new Ship(3);
        let ship2 = new Ship(4);
        
        player1.board.placeShip(5, 5, ship1, "vertical");
        player1.board.placeShip(8, 3, ship2, "horizontal");
        
        const squares = DOMHandler.createGrids();
        addSquareListeners(squares);
        DOMHandler.markShip(5, 5, ship1.length, "vertical", "Player");
        DOMHandler.markShip(8, 3, ship2.length, "horizontal", "Player");
        placeEnemyShips();
        
    }

    return { setUpRoutine };
})();

export default GameLogicHandler;