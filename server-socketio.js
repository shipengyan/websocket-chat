/**
 * Created by shi.pengyan on 2015-12-30.
 */
var express = require('express');


var app = express();
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

io = io.of('/my-websocket'); //私有命名空间

var count = 0;
io.on('connection', function (socket) {

    socket.userId = 'user' + count++;
    console.log('One client has connected.', new Date());

    // 广播,除了发送者,公共渠道
    socket.broadcast.emit('public', socket.userId + ' has connected chat server.');

    socket.on('private', function (data) {
        console.log('Received message from client:', data);

        switch (data.type) {
            case 'CHANGE_ROOM':
                socket.leave(data.beforeRoom); //离开之前的房间
            case 'INIT_ROOM':
                socket.join(data.room);//加入新房间
                socket.emit('private', socket.userId + ' go into ' + data.room);
                break;
            default:
                // 收到什么样的消息再发出去
                socket.emit('private', 'this is from server:' + data);
                break;
        }
    });

    socket.on('public', function (data) {
        switch (data.type) {
            case 'BROADCAST':
                io.emit('public', socket.userId + '广播了一条消息：' + data.message);
                break;

            case 'BROADCAST_ROOM':
                io.to(data.room).emit('public', socket.userId + ' 在房间【' + data.room + '】发了一条消息：' + data.message);
                break;
        }

        //socket.broadcast.emit('public', socket.userId + '广播了一条消息：' + data);
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('public', socket.userId + ' has disconnected.');
    });

});

app.get('/', function (req, res) {
    res.send('<h1>Welcome Realtime Server</h1>');
});


server.listen(3000, function () {
    console.log('listening on *:3000');
});