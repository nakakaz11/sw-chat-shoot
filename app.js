// Generated by CoffeeScript 1.4.0
var app, express, http, io, path, routes, server, _userId;

express = require("express");

routes = require('./routes');

http = require('http');

path = require('path');

app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set("view engine", "ejs");
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  return app.use(express["static"](path.join(__dirname, 'public')));
  /*
    app.set "view options",
      layout: false
  */

});

app.configure("development", function() {
  return app.use(express.errorHandler());
});

app.get('/', routes.index);

server = http.createServer(app);

server.listen(app.get('port'), function() {
  return console.log("SW-portLog " + app.get("port"));
});

io = require("socket.io").listen(server, {
  "log level": 1
});

_userId = 0;

io.sockets.on("connection", function(socket) {
  socket.handshake.userId = _userId;
  _userId++;
  socket.on('data-send', function(data) {
    return socket.broadcast.json.emit('data-send', {
      userId: socket.handshake.userId,
      data: data.message
    });
  });
  return socket.on("disconnect", function() {
    console.log("disconnect");
    return socket.broadcast.json.emit('disconnected', {
      userId: socket.handshake.userId
    });
  });
});

/*
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
*/

