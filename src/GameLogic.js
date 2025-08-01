const Player = require("./player");
const Ship = require("./ship");
import DOMHandler from "./DOMHandler";

const GameLogicHandler = (function () {
    // Indicates whether someone's won the game
    let gameOver = false;
    // Indicates whether it's the player's turn or not
    let playersTurn = true;
    let player1 = new Player("Nemo", true);
    let player2 = new Player("Odin");

    // we'll use this array to display the coordinate that was hit in an UI message
    let numberCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    // This will generate all the legal moves that you can make, we're doing this ensure the moves are random but we don't get repeats
    const possibleMoves = (() => {
        let moves = [];
        // We'll generate all the available moves for the computer
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 10; i++) {
                moves.push([j, i]);
            }
        }
        // Next we'll shuffle the array in place using the Durstenfeld shuffle algorithm
        for (let index = moves.length - 1; index > 0; index--) {
            let x = Math.floor(Math.random() * (index + 1));
            let temp = moves[index];
            moves[index] = moves[x];
            moves[x] = temp;
        }
        return moves;
    })();

    // Dummy waiting function
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Function that places down enemy's ships in random locations
    const placeEnemyShips = () => {
        // We'll keep track of how many ships we've placed
        let placedShips = 0;
        // array with the ships
        const ships = [
            new Ship(2),
            new Ship(3),
            new Ship(3),
            new Ship(4),
            new Ship(5),
        ];
        while (placedShips < 5) {
            // We'll generate random coordinates and randomly decide to place the ship horizontally or vertically
            const column = Math.floor(Math.random() * 9);
            const row = Math.floor(Math.random() * 9);
            // Recall that 1 is truthy while 0 is not
            let direction = "";
            Math.random() < 0.5
                ? (direction = "vertical")
                : (direction = "horizontal");
            try {
                player2.board.placeShip(
                    row,
                    column,
                    ships[placedShips],
                    direction,
                );
                // DOMHandler.markShip(
                //     row,
                //     column,
                //     ships[placedShips].length,
                //     direction,
                //     "Computer",
                // );
                placedShips++;
            } catch (error) {
                // We won't actually do anything with the error, we'll just try again
                // The errors that can arise come from trying to place the ship out of bounds or over another ship
            }
        }
    };

    // Makes a random computer move
    const computerMove = async () => {
        // We'll use set timeout to create an artificial delay and make it seem as if the computer were thinking, we'll use 2 seconds

        while (!playersTurn && !gameOver) {
            await delay(1000);
            const destroyedShips = player1.board.shipsDefeated;
            // We'll take the last move of the list, recall that the list is well shuffled
            try {
                const nextMove = possibleMoves.pop();
                // Next we'll hit the ship in the given coordinates
                const shipWasHit = player1.board.receiveAttack(
                    nextMove[0],
                    nextMove[1],
                );
                // and we'll mark it on the UI too
                DOMHandler.markAttack(
                    nextMove[0],
                    nextMove[1],
                    "Player",
                    shipWasHit,
                );
                // We'll also pass the turn if the computer missed
                if (!shipWasHit) {
                    DOMHandler.changeTurnText(player1.name);
                    playersTurn = true;
                    DOMHandler.updateMessage(
                        `${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and missed`,
                    );
                } else if (destroyedShips == player1.board.shipsDefeated) {
                    DOMHandler.updateMessage(
                        `${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and hit an enemy ship!`,
                    );
                } else {
                    DOMHandler.updateMessage(
                        `${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and destroyed an enemy ship!`,
                    );
                }
                if (player1.board.defeated) {
                    gameOver = true;
                    DOMHandler.updateMessage(`${player1.name} lost!`);
                    DOMHandler.updateMessage(
                        `${player2.name} struck at (${numberCoordinates[nextMove[1]]}, ${nextMove[0] + 1}) and destroyed the remaining fleet`,
                    );
                    DOMHandler.gameOverText(player2.name);
                    DOMHandler.changeWinnerText(player2.name);
                    DOMHandler.showRestartWindow();
                }
            } catch (error) {
                // In this case we won't do anything, as is there is no risk of the computer hitting the same square but should I add more intelligence to the computer it could happen
            }
        }
    };

    // Adds event listeners to squares on enemy board so that it responds adequately when clicked
    const addSquareListeners = (squares) => {
        for (let index = 0; index < squares.length; index++) {
            const square = squares[index];
            square.addEventListener("click", () => {
                // We'll encapsulate all the code inside this while to make sure the player can have consecutive turns should they hit a ship
                // We'll make the sure game isn't over every time as well, the game is over if all ships on one side are destroyed
                if (playersTurn && !gameOver) {
                    // We'll save how many ships were destroyed at the beginning of the turn, we'll compare at the end to know if a ship was defeated
                    const destroyedShips = player2.board.shipsDefeated;
                    try {
                        const shipWasHit = player2.board.receiveAttack(
                            Math.floor(index / 10),
                            index % 10,
                        );
                        DOMHandler.markAttack(
                            Math.floor(index / 10),
                            index % 10,
                            "Computer",
                            shipWasHit,
                        );
                        // If the ship wasn't hit we'll let the player have another turns until they miss
                        if (!shipWasHit) {
                            DOMHandler.changeTurnText(player2.name);
                            playersTurn = false;
                            DOMHandler.updateMessage(
                                `${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and missed`,
                            );
                        } else if (
                            destroyedShips == player2.board.shipsDefeated
                        ) {
                            DOMHandler.updateMessage(
                                `${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and hit an enemy ship!`,
                            );
                        } else {
                            DOMHandler.updateMessage(
                                `${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and destroyed an enemy ship!`,
                            );
                        }
                        if (player2.board.defeated) {
                            gameOver = true;
                            DOMHandler.updateMessage(`${player2.name} lost!`);
                            DOMHandler.updateMessage(
                                `${player1.name} struck at (${numberCoordinates[index % 10]}, ${Math.floor(index / 10) + 1}) and destroyed the remaining fleet!`,
                            );
                            DOMHandler.gameOverText(player1.name);
                            DOMHandler.changeWinnerText(player1.name);
                            DOMHandler.showRestartWindow();
                        } else if (!playersTurn) {
                            // After the player makes a move the computer will make their move, but only if the player didn't miss
                            computerMove();
                        }
                    } catch (error) {
                        DOMHandler.updateMessage(
                            "That square has already been hit",
                        );
                    }
                }
            });
        }
    };

    let playerName;

    const addNameListener = () => {
        const nameInput = document.getElementById("player-name");
        nameInput.addEventListener("blur", () => {
            if (nameInput.value == "") {
                DOMHandler.showErrorMessage("A name is required");
            } else {
                playerName = nameInput.value;
                DOMHandler.showErrorMessage("");
            }
        });
    };

    // These will be used to place the battleships before the game starts
    let selectedShip;
    let shipName;
    let selectedDirection;

    const addButtonListeners = () => {
        const carrier = new Ship(5);
        const battleship = new Ship(4);
        const cruiser = new Ship(3);
        const submarine = new Ship(3);
        const destroyer = new Ship(2);

        const carrierBtn = document.getElementById("carrier");
        const battleshipBtn = document.getElementById("battleship");
        const cruiserBtn = document.getElementById("cruiser");
        const submarineBtn = document.getElementById("submarine");
        const destroyerBtn = document.getElementById("destroyer");
        const directionBtn = document.querySelector(".direction-button");

        // We'll start the direction as vertical by default 
        selectedDirection = "vertical";

        carrierBtn.addEventListener("click", () => {
            selectedShip = carrier;
            shipName = "carrier";
        });

        battleshipBtn.addEventListener("click", () => {
            selectedShip = battleship;
            shipName = "battleship";
        });

        cruiserBtn.addEventListener("click", () => {
            selectedShip = cruiser;
            shipName = "cruiser";
        });

        submarineBtn.addEventListener("click", () => {
            selectedShip = submarine;
            shipName = "submarine";
        });

        destroyerBtn.addEventListener("click", () => {
            selectedShip = destroyer;
            shipName = "destroyer";
        });

        directionBtn.addEventListener("click", () => {
            if (directionBtn.classList.contains("vertical")) {
                selectedDirection = "horizontal";
                directionBtn.textContent = "Horizontal";
                directionBtn.classList.add("horizontal");
                directionBtn.classList.remove("vertical");
            } else {
                selectedDirection = "vertical";
                directionBtn.textContent = "Vertical";
                directionBtn.classList.add("vertical");
                directionBtn.classList.remove("horizontal");
            }
        });
    };

    // Confusing name, it sets up the event listener for the setup squares so ships can be placed
    const setUpSetupSquares = (squares) => {
        // Naturally we'll iterate over all the squares
        for (let index = 0; index < squares.length; index++) {
            const square = squares[index];

            square.addEventListener("mouseover", () => {
                // we'll show the highlighting only if the ship hasn't been placed
                if (
                    selectedShip != null &&
                    player1.board.ships.filter((ship) => ship === selectedShip)
                        .length == 0
                ) {
                    DOMHandler.highlightSquares(
                        Math.floor(index / 10),
                        index % 10,
                        selectedShip.length,
                        selectedDirection,
                        "Setup",
                    );
                }
            });

            square.addEventListener("mouseout", () => {
                if (
                    selectedShip != null &&
                    player1.board.ships.filter((ship) => ship === selectedShip)
                        .length == 0
                ) {
                    DOMHandler.unhighlightSquares(
                        Math.floor(index / 10),
                        index % 10,
                        selectedDirection,
                        "Setup",
                    );
                }
            });

            // We'll add an event for clicking and placing the ship
            square.addEventListener("click", () => {
                // we'll make sure a ship is selected and that the ship hasn't been placed already
                if (
                    selectedShip != null &&
                    player1.board.ships.filter((ship) => ship === selectedShip)
                        .length == 0
                ) {
                    try {
                        // we'll try placing the ship
                        player1.board.placeShip(
                            Math.floor(index / 10),
                            index % 10,
                            selectedShip,
                            selectedDirection,
                        );
                        // we'll mark the ship on the board if succesfully placed
                        DOMHandler.markShip(
                            Math.floor(index / 10),
                            index % 10,
                            selectedShip.length,
                            selectedDirection,
                            "Setup",
                        );
                        // we'll mark it on both the setup board and the player board
                        DOMHandler.markShip(
                            Math.floor(index / 10),
                            index % 10,
                            selectedShip.length,
                            selectedDirection,
                            "Player",
                        );
                        DOMHandler.strikethrough(shipName);
                        // we'll clear any previous error messages
                        DOMHandler.showErrorMessage("");
                    } catch ({ name, message }) {
                        // should an error arise we'll print the message for better user feedback
                        DOMHandler.showErrorMessage(message);
                    }
                }
            });
        }
    };

    // Button that starts the game once the setup is finished
    const addStartListener = () => {
        const startButton = document.querySelector(".start-game-button");
        startButton.addEventListener("click", (e) => {
            e.preventDefault();
            // We'll start the game only if the player entered their name and placed their ships
            if (playerName != "" && player1.board.ships.length == 5) {
                player1.name = playerName;
                DOMHandler.changePlayerName(player1.name);
                DOMHandler.changeTurnText(player1.name);
                DOMHandler.updateMessage("");

                DOMHandler.closeSetupWindow();
                
                // We'll reset the name field before sending
                document.getElementById("player-name").value = "";
            } else if (playerName == "" && player1.board.ships.length != 5) {
                DOMHandler.showErrorMessage(
                    "Please enter a name and place all 5 ships on the board",
                );
            } else if (playerName == "" && player1.board.ships.length == 5) {
                DOMHandler.showErrorMessage("Please enter a name");
            } else {
                DOMHandler.showErrorMessage(
                    "Please place all 5 ships on the board",
                );
            }
        });
    };

    // This will restart the game once it's finished
    const addRestartListener = () => {
        const restartBtn = document.querySelector(".restart-game");

        // we'll add a restart listener to the button
        restartBtn.addEventListener("click", () => {
            // here we'll reset all the variables necessary for the game to work
            gameOver = false;
            playersTurn = true;
            player1 = new Player("Nemo", true);
            player2 = new Player("Odin");
            playerName = "";

            // then we'll erase the squares and rebuild them add the necessary listeners
            DOMHandler.removeSquares();
            const squares = DOMHandler.createGrids();
            const setupSquares = DOMHandler.createSetupGrid();
            // We'll also rebuild the buttons
            DOMHandler.buildShipButtons();
            addButtonListeners();

            setUpSetupSquares(setupSquares);
            addSquareListeners(squares);
            placeEnemyShips();

            // we'll also reset these variables
            selectedShip = null;
            shipName = "";
            selectedDirection = "vertical";


            // Finally we'll hide the restart window and show the setup window
            DOMHandler.closeRestartWindow();
            DOMHandler.showSetupWindow();
        });
    };

    const setUpRoutine = async () => {
        DOMHandler.buildShipButtons();
        addButtonListeners();
        DOMHandler.showSetupWindow();
        const squares = DOMHandler.createGrids();
        const setupSquares = DOMHandler.createSetupGrid();
        addNameListener();
        setUpSetupSquares(setupSquares);
        addSquareListeners(squares);
        placeEnemyShips();
        addRestartListener();
        addStartListener();
        addRestartListener();
    };

    return { setUpRoutine };
})();

export default GameLogicHandler;
