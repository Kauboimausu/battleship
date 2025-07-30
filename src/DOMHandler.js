const DOMHandler = (function () {
    const playerBoard = document.querySelector(".player-grid");
    const computerBoard = document.querySelector(".computer-grid");

    const gameInfo = document.querySelector(".game-info");

    const turnIndicator = document.querySelector(".turn-indicator");

    // We'll show the dialog as soon as the page loads so the player can start the game
    const setupDialog = document.getElementById("setup-window");
    // Page mask to opaque the background
    const pageMask = document.querySelector(".page-mask");

    const setupErrorMessage = document.querySelector(".setup-error");

    const createSetupGrid = () => {
        let setupSquares = [];
        const setupGrid = document.querySelector(".placement-grid");
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 10; i++) {
                const square = document.createElement("div");
                square.classList.add("setup-square");
                square.classList.add(`row-${j}`);
                square.classList.add(`column-${i}`);
                setupGrid.appendChild(square);
                setupSquares.push(square);
            }
        }
        return setupSquares;
    };

    const showSetupWindow = () => {
        setupDialog.showModal();
        pageMask.style.display = "inline";
    };

    const closeSetupWindow = () => {
        setupDialog.close();
        pageMask.style.display = "none";
    };

    // This will update the message to indicate the state of the game
    const updateMessage = (newMessage) => {
        gameInfo.textContent = newMessage;
    };

    const showErrorMessage = (errorMessage) => {
        setupErrorMessage.textContent = errorMessage;
    };

    // This function adds the grid to the HTML for both boards
    const createGrids = () => {
        // First we'll create the player's grid
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 10; i++) {
                // We'll create a new element for the square
                const square = document.createElement("div");
                // Then we'll add the necessary classes, we'll add the class to indicate the row and column
                square.classList.add("player-square");
                square.classList.add(`row-${j}`);
                square.classList.add(`column-${i}`);
                // Then we'll append the element to the grid
                playerBoard.appendChild(square);
            }
        }

        // We'll return all the squares at the end to add the event listener
        let computerSquares = [];
        // We'll do pretty much the same for the AI's
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 10; i++) {
                const square = document.createElement("div");
                // We'll add a different class to indicate it's a computer square
                square.classList.add("computer-square");
                square.classList.add(`row-${j}`);
                square.classList.add(`column-${i}`);
                computerBoard.appendChild(square);
                computerSquares.push(square);
            }
        }

        return computerSquares;
    };

    // Marks a ship as having been placed in the board
    const markShip = (row, column, shipLength, vector, grid) => {
        let squares;
        if (grid == "Player") {
            squares = document.querySelectorAll(".player-square");
        } else if (grid == "Computer") {
            squares = document.querySelectorAll(".computer-square");
        } else if (grid == "Setup") {
            squares = document.querySelectorAll(".setup-square");
        }
        if (vector == "horizontal") {
            // We'll take the whole horizontal vector of squares
            // squares = squares.filter(square => square.classList.contains(`row-${row}`));
            for (let index = column; index < column + shipLength; index++) {
                // Then we'll take the reference of the square with matching row and column, we'll change the color of it
                // const square = squares.filter(square => square.classList.contains(`column-${index}`))[0];
                const square = squares.item(row * 10 + index);
                square.style.backgroundColor = "yellow";
            }
        } else {
            // squares = squares.filter(square => square.classList.contains(`column-${column}`));
            for (let index = row; index > row - shipLength; index--) {
                // Then we'll take the reference of the square with matching row and column, we'll change the color of it
                // const square = squares.filter(square => square.classList.contains(`row-${index}`))[0];
                const square = squares.item(index * 10 + column);
                square.style.backgroundColor = "yellow";
            }
        }
    };

    // This function will highlight the squares where a ship will be placed so the player can preview the placement
    const highlightSquares = (row, column, shipLength, vector, grid) => {
        let squares;
        if (grid == "Player") {
            squares = document.querySelectorAll(".player-square");
        } else if (grid == "Computer") {
            squares = document.querySelectorAll(".computer-square");
        } else if (grid == "Setup") {
            squares = document.querySelectorAll(".setup-square");
        }
        if(vector == "horizontal") {
            // as always we'll check if the placement is out of bounds
            if(column + (shipLength - 1) > 9) {
                // If it is then we'll only add so much as we can
                for(let index = column; index <= 9; index++){
                    // We'll add an invalid class to let the user know this placement isn't valid
                    squares[row * 10 + index].classList.add("highlight-invalid");
                }
            } else {
                for(let index = column; index < column + shipLength; index++) {
                    squares[row * 10 + index].classList.add("highlight-valid");
                }
            }
        } else if(vector == "vertical") {
            // We'll do the same for the vertical placement, more or less
            if(row - (shipLength - 1) < 0) {
                for(let index = row; index >= 0; index--) {
                    squares[index * 10 + column].classList.add("highlight-invalid");
                }
            } else {
                for(let index = row; index > row - shipLength; index--) {
                    squares[index * 10 + column].classList.add("highlight-valid");
                }
            }
        }
    }

    const markAttack = (row, column, grid, hit = false) => {
        let squares;
        grid == "Player"
            ? (squares = document.querySelectorAll(".player-square"))
            : (squares = document.querySelectorAll(".computer-square"));
        const square = squares.item(row * 10 + column);
        square.style.border = "1px solid red";
        square.textContent = "X";
        if (hit) {
            square.style.color = "red";
        }
    };

    const changeTurnText = (name) => {
        turnIndicator.textContent = `It is ${name}'s turn`;
    };

    return {
        createGrids,
        markShip,
        markAttack,
        updateMessage,
        changeTurnText,
        createSetupGrid,
        showSetupWindow,
        closeSetupWindow,
        showErrorMessage,
        highlightSquares
    };
})();

module.exports = DOMHandler;
