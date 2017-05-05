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
  socket.on('send:dragStart', function (data) {
    console.log(`draw:dragStart:${data.channel}`);
    socket.broadcast.emit(`draw:dragStart:${data.channel}`, data);
  });
  socket.on('send:dragging', function (data) {
    socket.broadcast.emit(`draw:dragging:${data.channel}`, data);
  });

  socket.on('send:save', function (data) {
    console.log('data saved');
    redis.hmset(data.channel, {
      data: data.data
    })
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
