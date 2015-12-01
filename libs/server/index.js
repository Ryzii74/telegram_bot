var http = require('http');

module.exports = function () {
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
        res.end(JSON.stringify(require('../en/index.js').getLevels()));
    }).listen(8080);
};