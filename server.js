var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var exec = require('child_process').exec;
var Redis = require('ioredis');
var redis = new Redis();

server.listen(6001);

// when user connects to browser
io.on('connection', function (socket) {
  console.log('user connected');
  socket.on('send:paint:Start', function (data) {
    console.log(`paint:Start:${data.channel}`);
    socket.broadcast.emit(`paint:Start:${data.channel}`, data);
  });
  socket.on('send:paint:ing', function (data) {
    socket.broadcast.emit(`paint:ing:${data.channel}`, data);
  });

  socket.on('send:save', function (data) {
    console.log('data saved');
    socket.broadcast.emit(`paint:End:${data.channel}`, data);
    redis.hmset(data.channel, {
      data: data.data
    })
  })

  socket.on('send:share', function () {
    socket.emit('show:share');
  })
});

// when the socket server starts
server.on('listening', function() {
  console.log(`
----------------------------------------
               A P P . J S
----------------------------------------`
  );
});
