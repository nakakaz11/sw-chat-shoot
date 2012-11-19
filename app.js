// Generated by CoffeeScript 1.4.0
var app, express, http, io, path, routes, server;

express = require("express");

routes = require('./routes');

http = require('http');

path = require('path');

app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 8080);
  app.set("view engine", "ejs");
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

app.get('/', routes.index);

server = http.createServer(app);

io = require("socket.io").listen(server);

server.listen(app.get('port'));

io.configure('herokuset', function() {
  io.set("transports", ["xhr-polling"]);
  return io.set("polling duration", 10);
});

io.sockets.on("connection", function(socket) {
  socket.on('data send', function(data) {
    socket.emit('data push', data);
    return socket.broadcast.emit('data push', data);
  });
  return socket.on("disconnect", function() {
    console.log("disconnect");
    return socket.broadcast(socket.id + ' disconnected');
  });
});

/*
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
*/

