// Generated by CoffeeScript 1.4.0
"use strict";

var SwSockClient, SwSocket, app, express, http, io, path, routes, server, _userId,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

SwSocket = (function() {

  function SwSocket(socket, keyname) {
    socket.on(keyname, function(data) {
      return socket.broadcast.json.emit(keyname, {
        userId: socket.handshake.userId,
        data: data
      });
    });
  }

  return SwSocket;

})();

SwSockClient = (function(_super) {

  __extends(SwSockClient, _super);

  function SwSockClient(socket, keyname) {
    SwSockClient.__super__.constructor.call(this, socket, keyname);
    socket.on(keyname, function(data) {
      return socket.json.emit(keyname, {
        message: data
      });
    });
  }

  return SwSockClient;

})(SwSocket);

io.sockets.on("connection", function(socket) {
  var b_c, d_s, d_u, p_u;
  socket.handshake.userId = _userId;
  _userId++;
  p_u = new SwSocket;
  b_c = new SwSocket;
  d_u = new SwSocket;
  d_s = new SwSocket;
  p_u(socket, 'player-update');
  b_c(socket, 'bullet-create');
  d_u(socket, 'disconnect-user');
  return d_s(socket, 'data-send');
  /*
    # game -------------------------#
    socket.on "player-update", (data) ->
      socket.broadcast.json.emit "player-update",
        userId: socket.handshake.userId
        data: data
  
    socket.on "bullet-create", (data) ->
      socket.broadcast.json.emit "bullet-create",
        # 他全員に切断した人のsessionIdを送る。
        userId: socket.handshake.userId
        data: data
  
    socket.on "disconnect-user", ->    # クライアントが切断したら実行される
      socket.broadcast.json.emit "disconnect-user",
        userId: socket.handshake.userId
    #chat -------------------------#
    # jsonでやりとりに変更〜1119
    socket.on 'data-send', (data) ->  # クライアント側からのイベントを受取
      socket.json.emit 'data-send', # handshake io
        message: data
      socket.broadcast.json.emit 'data-send', # handshake io
        userId: socket.handshake.userId
        message: data
  */

});

/*
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
*/

