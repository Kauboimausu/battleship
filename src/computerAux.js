const ComputerMoveHandler = (function () {
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

    // A list of higher likelihood to hit moves for the computer to prioritize, if there are any
    // let prioritizedMoves = [];
    // Computer move that last hit
    // let lastHit;

    // gets adjacent squares to a square, this is to add better AI
    // const getAdjacencies = (row, column) => {
    //     // we'll check that the square isn't out of bounds
    //     if (row + 1 < 10) {
    //         if (column + 1 <= 9) {
    //             prioritizedMoves.push([row + 1, column + 1]);
    //         }
    //         if (column - 1 >= 0) {
    //             prioritizedMoves.push([row + 1, column - 1]);
    //         }
    //     }
    //     if (row - 1 >= 0) {
    //         if (column + 1 <= 9) {
    //             prioritizedMoves.push([row - 1, column + 1]);
    //         }
    //         if (column - 1 >= 0) {
    //             prioritizedMoves.push([row - 1, column - 1]);
    //         }
    //     }
    // };

    return { possibleMoves, delay };
})();

export default ComputerMoveHandler;
