const GameBoard = require("./gameboard");
const Ship = require("./ship");




describe("Validator", () => {
    const board = new GameBoard();
    it("defines placeShip()", () => {
        expect(typeof board.placeShip).toBe("function");
    });

    it("defines receiveAttack()", () => {
        expect(typeof board.receiveAttack).toBe("function");
    });

    it("defines missedAttacks", () => {
        expect(typeof board.missedAttacks).toBe("number");
    });

    it("defines shipsRemain()", () => {
        expect(typeof board.shipsRemain).toBe("function");
    })
});