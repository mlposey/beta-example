'use strict';
const grpc = require('grpc');
const betagrpc = grpc.load('./beta.proto').betagrpc;
const client = new betagrpc.Beta('localhost:1995',
                                 grpc.credentials.createInsecure());

console.log('waiting for query...');
const readline = require('readline-sync');
const srcX = parseFloat(readline.question('origin x: '));
const srcY = parseFloat(readline.question('origin y: '));
const dstX = parseFloat(readline.question('destination x: '));
const dstY = parseFloat(readline.question('destination y: '));
console.log();
console.log('fetching route...');

const query = {
    origin: {
        longitude: srcX,
        latitude: srcY,
    },
    destination: {
        longitude: dstX,        
        latitude: dstY,
    }
};
client.mustGetRoute(query, (err, route) => {
    if (err || route.distance === 0) {
        console.log('route unavailable');
    } else {
        console.log('found route:');
        displayRoute(route);
    }
});

function displayRoute(route) {
    console.log('distance: ' + route.distance);
    process.stdout.write('path: ');
    for (let node of route.nodes) {
        process.stdout.write('(' + node.longitude + ',' + node.latitude + ') ');
    }
    console.log();
}