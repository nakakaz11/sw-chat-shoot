// Generated by CoffeeScript 1.4.0
var app, ejs, express, http, io, path, routes, server, socket, user;

express = require("express");

routes = require('./routes');

user = require('./routes/user');

http = require('http');

path = require('path');

ejs = require("ejs");

io = require("socket.io");

app = express();

app.configure(function() {
  app.use(express["static"](path.join(__dirname, 'public')));
  app.set('port', process.env.PORT || 3000);
  return app.set("view engine", "ejs");
});

/*
  app.set "view options",
    layout: false
*/


server = http.createServer(app);

server.listen(app.get('port'), function() {});

app.get("/", function(req, res) {
  res.render("index", {
    title: 'SW (node.js+express+socket.io ChatApp)use ejs+coffee',
    desc: 'SW chat App Test',
    locals: {
      port: server.listen(app.get('port'))
    }
  });
  return console.log("SW isPort " + app.get('port'));
});

socket = io.listen(server);

socket.on("connection", function(client) {
  client.on("message", function(msg) {
    client.send(msg);
    return client.broadcast(msg);
  });
  return client.on("disconnect", function() {
    return console.log("disconnect");
  });
});
