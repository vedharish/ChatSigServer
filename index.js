var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  globalHash = {};

server.listen(8080, function() {
  console.log('Server Listening to 8080');
});

app.use(express.static(__dirname + '/public'));

process.on('unhandledRejection', function(e) {
  console.log('Global Rejection: ' + ( e.stack || e ).toString());
});
process.on('uncaughtException', function(e) {
  console.log('Global Exception: ' + ( e.stack || e ).toString());
});

io.on('connection', function(socket) {
  console.log('ON CONNECT');

  socket.on('message', function(data) {
    console.log('RECEIVED MESSAGE ' + JSON.stringify(data));
    if(data.connectHash) {
      var hash = data.connectHash.toString();
      if(data.type == 'init') {
        globalHash[hash] = socket;
      } else if(globalHash[hash]) {
        var clientSocket = globalHash[hash];
        clientSocket.emit('message', {
          sourceData: data
        });
      }
    }
  });
});
