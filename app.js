// Generated by CoffeeScript 1.4.0
"use strict";

var app, express, http, io, path, routes, server, _userId;

express = require("express");

routes = require("./routes");

http = require("http");

path = require("path");

app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  app.use(express.logger("dev"));
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  return app.use(express["static"](path.join(__dirname, 'public')));
});

app.configure("development", function() {
  return app.use(express.errorHandler());
});

app.get("/", routes.index);

app.get("/game", routes.game);

app.get("/gameover", routes.gameover);

server = http.createServer(app);

server.listen(app.get("port"), function() {
  return console.log("listening on port " + app.get("port"));
});

io = require("socket.io").listen(server, {
  "log level": 1
});

io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  return io.set("polling duration", 10);
});

_userId = 0;

io.sockets.on("connection", function(socket) {
  socket.handshake.userId = _userId;
  _userId++;
  socket.on("player-update", function(data) {
    return socket.broadcast.json.emit("player-update", {
      userId: socket.handshake.userId,
      data: data
    });
  });
  socket.on("bullet-create", function(data) {
    return socket.broadcast.json.emit("bullet-create", {
      userId: socket.handshake.userId,
      data: data
    });
  });
  socket.on("disconnect", function() {
    return socket.broadcast.json.emit("disconnect-user", {
      userId: socket.handshake.userId
    });
  });
  socket.on('player-update', function(data) {
    socket.json.emit('player-update', {
      message: data
    });
    return socket.broadcast.json.emit('data-send', {
      userId: socket.handshake.userId,
      message: data
    });
  });
  return socket.on("disconnect", function() {
    console.log("disconnect");
    return socket.broadcast.json.emit('disconnect', {
      userId: socket.handshake.userId
    });
  });
});

/*
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
*/

