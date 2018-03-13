'use strict';
const fs = require('fs');
const readline = require('readline');
const { TraversableMap } = require('./map');

/** Handles map creation from files */
class MapLoader {
    constructor() {
        this.lineNumber = 0;
        this.height = 0;
        this.width = 0;
        this.map = null;
    }
    
    /** Loads a map from a filepath */
    loadFrom(filepath) {
        let content = fs.readFileSync(filepath, 'UTF-8');
        for (let line of content.split('\n')) {
            this._parseLine(line);
        }
        return this.map;
    }

    _parseLine(line) {
        switch (this.lineNumber) {
        case 0: break;
        case 1:
            this.height = parseInt(line.split(' ')[1], 10);
            break;
        case 2:
            this.width = parseInt(line.split(' ')[1], 10);
            break;
        case 3:
            this.map = new TraversableMap(this.width, this.height);
            break;
        default:
            for (let i = 0; i < line.length; i++) {
                this.map.set(i, this.lineNumber - 4, line[i]);
            }
        }
        this.lineNumber++;
    }
}

module.exports = MapLoader;