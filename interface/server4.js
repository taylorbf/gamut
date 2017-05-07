#!/usr/bin/env node


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080,
    url  = 'http://localhost:' + port + '/';

var osc = require('node-osc'),
    client = new osc.Client('localhost', 4040);


server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

  // Emit a message to send it to the client.
  socket.emit('ping', { msg: 'Hello. I know socket.io.' });

  // Print messages from the client.
  socket.on('pong', function (data) {
    console.log(data.msg);
  });

  client.send("/code", data);

});


var data = "a = sound(1,2,4,5,7) \n queue[0](a)"
