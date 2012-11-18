// Generated by CoffeeScript 1.4.0
var app, ejs, escapeHTML, express, http, io, path, port, server, socket;

express = require("express");

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


/*
@io.configure =>    # this バインド要る？
  @io.set("transports", ["xhr-polling"])
  @io.set("polling duration", 10)
*/


server = http.createServer(app);

socket = server.listen(app);

port = app.get('port');

console.log("SW isPort " + port);

app.get("/", function(req, res) {
  return res.render("index", {
    title: 'SW (node.js+express+socket.io ChatApp)use ejs+coffee',
    desc: 'SW chat App Test',
    locals: {
      port: port
    }
  });
});

escapeHTML = function(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;");
};

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
