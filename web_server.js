'use strict'

var http = require('http');
var https = require('https');
var fs = require('fs');

var express = require('express');
var serveIndex = require('serve-index');

var socketIo = require('socket.io');

var app = express();
app.use(serveIndex('./public'));
app.use(express.static('./public'));

// http server
var http_server = http.createServer(app);
http_server.listen(8000);

var options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
};

// https server
var https_server = https.createServer(options, app);
var io = socketIo.listen(https_server);

io.sockets.on('connection', function (socket) {
    socket.on('join', (room) => {
        socket.join(room);
        var myRoom = io.sockets.adapter.rooms[room];
        var users = Object.keys(myRoom.sockets).length;
        // 给房间里除了自己的所有人发
        socket.to(room).emit('joined', room, socket.id);
    });

    socket.on('leave', (room) => {
        var myRoom = io.sockets.adapter.rooms[room];
        var users = Object.keys(myRoom.sockets).length;

        socket.leave(room);
        // 给房间里除了自己的所有人发
        socket.to(room).emit('leaved', room, socket.id);
    });
});
https_server.listen(8001);