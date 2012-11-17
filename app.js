// Generated by CoffeeScript 1.3.3
var app, ejs, express, http, io, path, socket;

express = require("express");

http = require('http');

path = require('path');

ejs = require("ejs");

io = require("socket.io");

app = express();

app.configure(function() {
  app.use(express["static"](path.join(__dirname, 'public')));
  app.set('port', process.env.PORT || 3000);
  app.set("view engine", "ejs");
  return app.set("view options", {
    layout: false
  });
});

app.get('/', routes.index);

app.get('/users', user.list);

/*
app.get "/", (req, res) ->
  console.log "/"
  res.render "index",
    locals:
      port: app.get('port')
*/


http.createServer(app).listen(app.get('port'), function() {
  return console.log("SW port " + app.get('port'));
});

socket = io.listen(app);

socket.on("connection", function(client) {
  client.on("message", function(msg) {
    client.send(msg);
    return client.broadcast(msg);
  });
  return client.on("disconnect", function() {
    return console.log("disconnect");
  });
});
