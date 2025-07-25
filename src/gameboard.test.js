/* eslint-disable no-undef */
const GameBoard = require("./gameboard");
const Ship = require("./ship");

describe("Ship", () => {
    const ship = new Ship(5);
    it("defines length", () => {
        expect(typeof ship.length).toBe("number");
    });

    it("defines damaged", () => {
        expect(typeof ship.damaged).toBe("number");
    });

    it("defines hit()", () => {
        expect(typeof ship.hit).toBe("function");
    });

    it("defines isSunk()", () => {
        expect(typeof ship.isSunk).toBe("function");
    });
});

describe("GameBoard", () => {
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
    });

    it("defines squares", () => {
        expect(typeof board.squares).toBe("object");
    });

    it("verifies squares dimensions", () => {
        expect(board.squares.length).toBe(10);
    });

    it("verifies squares' 2nd dimension", () => {
        expect(board.squares[0].length).toBe(10);
    });

    it("verifies list of ships type", () => {
        expect(board.ships).toBe("object");
    });

    it("verifies ships defeated exists", () => {
        expect(board.shipsDefeated).toBe("number");
    });
});

describe("ship methods and attributes", () => {
    const ship = new Ship(3);
    it("Ship length", () => {
        expect(ship.length).toBe(3);
    });

    ship.hit();
    it("Ship hit register", () => {
        expect(ship.damaged).toBe(1);
    });

    it("Ship hit register 2", () => {
        expect(ship.damaged).toBe(2);
    });

    it("Ship hit register 3", () => {
        expect(ship.damaged).toBe(3);
    });

    it("Ship sunk register", () => {
        expect(ship.isSunk).toBeTruthy();
    });
});

describe("board methods and attributes", () => {
    const board = new GameBoard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(5);
    const ship3 = new Ship(4);

    // First we'll try testing some valid ship placements and verify they were done correctly

    board.placeShip(3, 1, ship1, "vertical");
    expect(board.squares[3][1]).toEqual({
        ship: ship1,
        hit: false,
    });

    expect(board.squares[2][1]).toEqual({
        ship: ship1,
        hit: false,
    });

    expect(board.squares[1][1]).toEqual({
        ship: ship1,
        hit: false,
    });

    board.placeShip(5, 1, ship2, "horizontal");
    expect(board.squares[5][1]).toEqual({
        ship: ship2,
        hit: false,
    });

    expect(board.squares[5][2]).toEqual({
        ship: ship2,
        hit: false,
    });

    expect(board.squares[5][3]).toEqual({
        ship: ship2,
        hit: false,
    });

    expect(board.squares[5][4]).toEqual({
        ship: ship2,
        hit: false,
    });

    expect(board.squares[5][5]).toEqual({
        ship: ship2,
        hit: false,
    });

    // Then we'll test a square that should be empty

    expect(board.squares[5][6]).toEqual({
        ship: null,
        hit: false,
    });

    // Now we'll check the placed ships have been added to the list
    expect(board.ships).toContain(ship1);
    expect(board.ships).toContain(ship2);

    // Then we'll try some out of bounds ship placements

    expect(() => board.placeShip(0, 0, ship3, "vertical")).toThrow(
        "Out of Bounds",
    );
    expect(() => board.placeShip(3, 7, ship3, "horizontal")).toThrow(
        "Out of Bounds",
    );

    // We'll check to see that the ship reference wasnt added into the square

    expect(board.squares[0][0]).toEqual({
        ship: null,
        hit: false,
    });

    expect(board.squares[3][7]).toEqual({
        ship: null,
        hit: false,
    });

    // We'll check that the failed attempts didn't add the ship

    expect(board.ships).not.toContain(ship3);

    // Now we'll try to add ships that would conflict against already added ships, this should throw an error
    expect(() => board.placeShip(2, 0, ship3, "horizontal")).toThrow("Clashing Ships");
    expect(() => board.placeShip(7, 2, ship3, "vertical")).toThrow("Clashing Ships");

    // Again, we'll check to see that the ship hasnt been added to the ships list
    expect(board.ships).not.toContain(ship3);

    // And again we'll check that the ship reference hasn't been added

    expect(board.squares[2][0]).toEqual({
        ship: null,
        hit: false,
    });

    expect(board.squares[7][2]).toEqual({
        ship: null,
        hit: false,
    });

    // Now we're gonna test squares to be hit when the receive attack function is called
    // This should have destroyed ship1

    board.receiveAttack(3, 1);
    board.receiveAttack(2, 1);
    board.receiveAttack(1, 1);

    expect(board.squares[3][1]).toEqual({
        ship: ship1,
        hit: true,
    });

    expect(board.squares[2][1]).toEqual({
        ship: ship1,
        hit: true,
    });

    expect(board.squares[1][1]).toEqual({
        ship: ship1,
        hit: true,
    });

    expect(board.squares[0][1]).toEqual({
        ship: null,
        hit: false,
    });

    // We'll make sure we throw an error if we try to hit a square that's already been hit
    expect(() => board.receiveAttack(3,1)).toThrow("Square already hit");
    expect(() => board.receiveAttack(2,1)).toThrow("Square already hit");
    expect(() => board.receiveAttack(1,1)).toThrow("Square already hit");

    // Now we'll check that the shipsDefeated counter has increased
    // We'll also check that the ship identifies itself as sunk

    expect(board.shipsDefeated).toBe(1);
    expect(ship1.isSunk()).toBeTruthy();

    // We'll also try to call the receiveAttack function on squares that have already been attacked, this should return an error

    expect(board.receiveAttack(3, 1)).toThrow("Square Already Attacked");
    expect(board.receiveAttack(2, 1)).toThrow("Square Already Attacked");
    expect(board.receiveAttack(1, 1)).toThrow("Square Already Attacked");
});
