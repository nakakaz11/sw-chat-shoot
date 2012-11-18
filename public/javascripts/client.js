// Generated by CoffeeScript 1.4.0

$(function() {
  var socket;
  // Using Socket.IO with Node.js on Heroku
  /*io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
  });*/
  //socket.ioのインスタンスもportを指定しちゃだめ。
  //var socket = new io.Socket(null, { port: port });
  socket = new io.Socket();
  socket.connect();
  socket.on("connect", function() {
    return console.log("connect");
  });
  socket.on("message", function(msg) {
    var date;
    date = new Date();
    return $("#list").prepend($("<dt>" + date + "</dt><dd>" + msg + "</dd>"));
  });
  socket.on("disconnect", function() {
    return console.log("disconnect");
  });
  return $("#form").submit(function() {
    var message;
    message = $("#message");
    socket.send(message.val());
    message.attr("value", "");
    return false;
  });
});
