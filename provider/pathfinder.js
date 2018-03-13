'use strict';
const PriorityQueue = require('js-priority-queue');
const Map = require('./map');
const Point = require('./point');

/** Defines the context for a single path search */
class SearchContext {
    constructor(map, src, dst) {
        this.prev = Array(map.size());
        this.visited = Array(map.size()).fill(false);
        this.dist = Array(map.size()).fill(Number.MAX_SAFE_INTEGER);
        this.queue = new PriorityQueue({ comparator: (a, b) => this.dist[a] < this.dist[b] });
        this.srcIdx = map.getIndex(src.x, src.y);
        this.dstIdx = map.getIndex(dst.x, dst.y);
    }
}

/** Finds paths in a given map */
class PathFinder {
    constructor(map) {
        this.map = map;
    }

    /** Finds a path from a source Point to a destination */
    find(src, dst) {
        let ctx = new SearchContext(this.map, src, dst);
        ctx.dist[ctx.srcIdx] = 0;
        ctx.queue.queue(ctx.srcIdx);

        let foundPath = this._findShortestPaths(ctx);
        return foundPath ? this._build(ctx) : [];
    }

    /**
     * Finds shortest paths from the source until the target is reached or
     * all options are exhausted
     */
    _findShortestPaths(ctx) {
        while (ctx.queue.length !== 0) {
            const pointIdx = ctx.queue.dequeue();
            const pointDist = ctx.dist[pointIdx];
            if (ctx.visited[pointIdx]) continue;

            ctx.visited[pointIdx] = true;
            if (pointIdx === ctx.dstIdx) return true;
            this._calculateNeighboringDistances(pointIdx, ctx);
        }
        return false;
    }

    /** Calculates updated distances to index's neighbors */
    _calculateNeighboringDistances(index, ctx) {
        for (let neighborIdx of this.map.getNeighborsIdx(index)) {
            // The neighbors are neighboring cells, i.e., one unit away.
            const alt = ctx.dist[index] + 1;
            if (alt < ctx.dist[neighborIdx]) {
                ctx.dist[neighborIdx] = alt;
                ctx.prev[neighborIdx] = index;
            }
            ctx.queue.queue(neighborIdx);
        }
    }

    /** Builds the path from the source point to the destination */
    _build(ctx) {
        let path = [];
        for (let n = ctx.dstIdx; n != ctx.srcIdx; n = ctx.prev[n]) {
            path.push(this.map.getPoint(n));
        }
        path.push(this.map.getPoint(ctx.srcIdx));
        return path.reverse();
    }
}

module.exports = PathFinder;