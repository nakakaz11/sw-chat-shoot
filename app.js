// Generated by CoffeeScript 1.3.3
var app, ejs, escapeHTML, express, http, io, path, server;

express = require("express");

http = require('http');

path = require('path');

ejs = require("ejs");

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

io = require("socket.io").listen(server);

server.listen(app.get('port'));

console.log("SW isPort " + app.get('port'));

app.get("/", function(req, res) {
  return res.render("index", {
    title: 'SW (node.js+express+socket.io ChatApp)use ejs+coffee',
    desc: 'SW chat App Test'
  });
});

/*
    locals:
        port:port  # portは要検証
*/


io.on("connection", function(client) {
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

escapeHTML = function(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;");
};
