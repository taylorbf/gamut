var connect = require('connect'),
    http = require('http'),
    app = connect().use(connect.static(__dirname)).listen(8080),
    io = require('socket.io').listen(app);
    osc = require('node-osc'),
    client = new osc.Client('localhost', 4040);

console.log("http server on 8080, osc client on 4040");
console.log(__dirname);

io.sockets.on('connection', function (socket) {

    socket.on('nx', function (data) {
      client.send(data.oscName, data.value);
    });

});
