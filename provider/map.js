'use strict';
const Point = require('./point');

/** Represents a two-dimensional map */
class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = Array(width * height);
    }

    /** Returns the number of tiles in the map */
    size() {
        return this.cells.length;
    }

    /** Sets the value of the (x, y) tile */
    set(x, y, val) {
        this.cells[this.getIndex(x, y)] = val;
    }

    /** Gets the tile at a given raw index */
    getTile(index) {
        return this.cells[index];
    }

    /** Gets the tile index of a coordinate pair */
    getIndex(x, y) {
        return x + y * this.width;
    }

    /** Gets the index's equivalent (x, y) pair */
    getPoint(index) {
        return new Point(Math.floor(index % this.width), Math.floor(index / this.width));
    }
}

/** Represents a map that can be navigated like a graph */
class TraversableMap extends Map {
    constructor(width, height) {
        super(width, height)
    }

    /** Gets the indices of all tiles that are adjacent to the index */
    getNeighborsIdx(index) {
        return this.getNeighbors(index % this.width, index / this.width);
    }

    /** Gets the indices of all tiles that are adjacent to the (x, y) location */
    getNeighbors(x, y) {
        let neighbors = [];
        for (let i = 0; i < 9; i++) {
            if (i != 4) this._addNeighbor(Math.floor(x + i/3 - 1), Math.floor(y + i%3 - 1), neighbors);
        }
        return neighbors;
    }

    _addNeighbor(x, y, vals) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            let i = this.getIndex(x, y);
            if (this.canTraverse(i)) vals.push(i);
        }
    }

    /** Determines if the tile at an index can be traversed */
    canTraverse(index) {
        return this.getTile(index) === '.';
    }
}

module.exports = {
    Map: Map,
    TraversableMap: TraversableMap
};