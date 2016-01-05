/**
 * Created by shi.pengyan on 2016-01-04.
 */
//原生websocket

var server = require('websocket').server, http = require('http');

var port = 1337;

var socket = new server({
    httpServer: http.createServer().listen(port, function () {
        console.log('listen', port);
    })
});

socket.on('connect', function (client) {
    console.log('connect one client');
});

socket.on('request', function (request) {
    var connection = request.accept(null, request.origin);

    connection.on('message', function (message) {
        console.log(message.utf8Data);
        connection.sendUTF('this is reply form server: ' + message.utf8Data); //向前台发送数据
    });

    connection.on('close', function (connection) {
        console.log('connection closed');
    });
});