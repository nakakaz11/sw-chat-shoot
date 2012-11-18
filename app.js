// Generated by CoffeeScript 1.4.0
var app, ejs, escapeHTML, express, http, io, path, port, routes, server, socket, user;

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
  return app.set("view engine", "ejs");
});

/*
  app.set "view options",
    layout: false
*/


server = http.createServer(app);

port = server.listen(app.get('port'), function() {
  return console.log("SW isPort " + app.get('port'));
});

app.get("/", function(req, res) {
  return res.render("index", {
    title: 'SW (node.js+express+socket.io ChatApp)use ejs+coffee',
    desc: 'SW chat App Test',
    locals: {
      port: port
    }
  });
});

io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  return io.set("polling duration", 10);
});

escapeHTML = function(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;");
};

socket = io.listen(server);

socket.on("connection", function(client) {
  client.on("message", function(msg) {
    var sanitized;
    sanitized = escapeHTML(msg);
    client.send(sanitized);
    return client.broadcast(sanitized);
  });
  return client.on("disconnect", function() {
    console.log("disconnect");
    return client.broadcast(client.sessionId + ' disconnected');
  });
});
