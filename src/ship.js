class Ship {
    constructor(length) {
        this.length = length;
        this.damaged = 0;
    }

    hit() {
        this.damaged++;
    }

    isSunk() {
        return (this.damaged == this.length);
    }
}

module.exports = Ship;