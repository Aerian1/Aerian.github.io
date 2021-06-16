'use strict'

var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
};

https.createServer(options, function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.end("https server!\n");
}).listen(8001);