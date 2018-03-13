'use strict';
const MapLoader = require('./loader');
const PathFinder = require('./pathfinder');
const Point = require('./point');
const Serializer = require('./serializer');

/** Exposes the pathfinding abilities of the application */
class Service {
    constructor() {
        this.map = new MapLoader().loadFrom('../map/brc202d.map');
        this.pathfinder = new PathFinder(this.map);
        this.serializer = new Serializer();
    }

    /** Finds a path from a source point to a destination */
    findPath(srcX, srcY, dstX, dstY) {
        const path = this._getPath(srcX, srcY, dstX, dstY);
        if (path.length === 0) throw new Error('path not found');
        return this.serializer.convert(path);
    }

    _getPath(srcX, srcY, dstX, dstY) {
        const origin = new Point(srcX, srcY);
        const destination = new Point(dstX, dstY);
        return this.pathfinder.find(origin, destination);
    }
}

module.exports = Service;