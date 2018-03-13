'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Service = require('./service');

const app = express();
app.use(bodyParser.json());

const pathService = new Service();
app.post('/v1/paths', (req, res) => {
    try {
        let path = pathService.findPath(
            req.body.src.x,
            req.body.src.y,
            req.body.dst.x,
            req.body.dst.y
        );
        res.send(path);
    } catch (err) {
        res.status(404).send(JSON.stringify({
            'message': err.message
        }));
    }
});

app.listen(8080);
console.log('server started');