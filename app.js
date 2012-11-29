// Generated by CoffeeScript 1.4.0
"use strict";

var Schema, SwSockClient, SwSocket, User, UserSchema, app, b_c, c_c, d_u, express, http, io, mongoose, p_m, p_u, path, routes, server, uri, _userId,
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
  return console.info("listening on port " + app.get("port"));
});

mongoose = require('mongoose');

Schema = mongoose.Schema;

UserSchema = new Schema({
  userId: Number,
  playmess: String,
  date: Date
});

User = mongoose.model('User', UserSchema);

uri = process.env.MONGOHQ_URL || 'mongodb://localhost/makeMongoDB';

mongoose.connect(uri);

io = require("socket.io").listen(server, {
  "log level": 1
});

io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  return io.set("polling duration", 10);
});

SwSocket = (function() {

  function SwSocket() {}

  SwSocket.prototype.make = function(socket, keyname) {
    return socket.on(keyname, function(data) {
      return socket.broadcast.json.emit(keyname, {
        userId: socket.handshake.userId,
        data: data,
        playmess: data,
        ca_cr: data
      });
    });
  };

  return SwSocket;

})();

SwSockClient = (function(_super) {

  __extends(SwSockClient, _super);

  function SwSockClient() {
    return SwSockClient.__super__.constructor.apply(this, arguments);
  }

  SwSockClient.prototype.make = function(socket, keyname) {
    var makeMongo;
    makeMongo = function(socket, keyname) {
      return User.find(function(err, userMGD) {
        socket.emit(keyname, userMGD);
        return socket.broadcast.emit(keyname, userMGD);
      });
    };
    makeMongo(socket, keyname);
    return socket.on(keyname, function(data) {
      var userMG;
      userMG = new User;
      userMG.userId = socket.handshake.userId;
      userMG.playmess = data.playmess;
      userMG.date = new Date();
      userMG.save(function(err) {
        if (err) {
          return console.log("swMongoSave:" + err);
        }
      });
      return makeMongo(socket, keyname);
    });
  };

  return SwSockClient;

})(SwSocket);

p_u = new SwSocket;

b_c = new SwSocket;

c_c = new SwSocket;

d_u = new SwSocket;

p_m = new SwSockClient;

_userId = 0;

io.sockets.on("connection", function(socket) {
  socket.handshake.userId = _userId;
  _userId++;
  p_u.make(socket, 'player-update');
  b_c.make(socket, 'bullet-create');
  c_c.make(socket, 'canvas-create');
  d_u.make(socket, 'disconnect');
  p_m.make(socket, 'player-message');
  socket.on('deleteDB', function(err, delid) {
    var uid;
    uid = delid.uid;
    console.log("swMongoDel:" + uid);
    if (err) {
      console.log("swMongoDel:" + err);
    }
    return User.find().remove({
      userId: uid
    });
  });
});

/*
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
*/

