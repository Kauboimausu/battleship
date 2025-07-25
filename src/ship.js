class Ship {
    constructor(length) {
        this.length = length;
        this.damaged = 0;
    }

    hit() {
        this.damaged += 1;
    }

    isSunk() {
        return this.damaged == this.length;
    }
}

module.exports = Ship;