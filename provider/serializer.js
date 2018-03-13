'use strict';

/** Converts paths to a portable JSON format */
class Serializer {
    convert(path) {
        let converted = {path: []};
        for (let point of path) {
            converted.path.push({'x': point.x, 'y': point.y});
        }
        return JSON.stringify(converted);
    }
}

module.exports = Serializer;