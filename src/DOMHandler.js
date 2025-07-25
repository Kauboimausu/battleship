const DOMHandler = (function() {
    const playerBoard = document.querySelector(".player-grid");
    const computerBoard = document.querySelector(".robot-grid");

    const gameInfo = document.querySelector(".game-info");

    // This function adds the grid to the HTML for both boards
    const createGrids = () => {
        // First we'll create the player's grid
        for(let j = 0; j < 10; j++) {
            for(let i = 0; i < 10; i++){
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

        // We'll do pretty much the same for the AI's 
        for(let j = 0; j < 10; j++) {
            for(let i = 0; i < 10; i++){
                const square = document.createElement("div");
                // We'll add a different class to indicate it's a computer square
                square.classList.add("computer-square");
                square.classList.add(`row-${j}`);
                square.classList.add(`column-${i}`);
                computerBoard.appendChild(square);
            }
        }
    }

    return { createGrids };
})();

module.exports = DOMHandler;