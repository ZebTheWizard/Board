var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var exec = require('child_process').exec;
var Redis = require('ioredis');
var redis = new Redis();

server.listen(6001);

// when user connects to browser
io.on('connection', function (socket) {
  socket.on('send:paint:Start', function (data) {
    socket.broadcast.emit(`paint:Start:${data.channel}`, data);
  });
  socket.on('send:paint:ing', function (data) {
    socket.broadcast.emit(`paint:ing:${data.channel}`, data);
  });

  socket.on('send:save', function (data) {
    socket.broadcast.emit(`paint:End:${data.channel}`, data);
    redis.hmset(data.channel, {
      data: data.data
    })
  })

  socket.on('send:share',function () {socket.emit('show:share');})
  socket.on('send:brush-plus', function () {socket.emit('show:brush-plus');})
  socket.on('send:brush-minus', function () {socket.emit('show:brush-minus');})
  socket.on('send:clear', function () {socket.emit('show:clear');})
  socket.on('send:clear:confirm', function () {socket.broadcast.emit('show:clear:confirm');console.log('clear:confirm');})
});

// when the socket server starts
server.on('listening', function() {
  console.log(`
----------------------------------------
               A P P . J S
----------------------------------------`
  );
});
