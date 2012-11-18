// Generated by CoffeeScript 1.4.0

$(function() {
  //socket.ioのインスタンスもportを指定しちゃだめ。
  //var socket = new io.Socket(null, { port: port });
/*
  var socket = new io.Socket();
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
*/
  socket.on('message:receive', function (data) {
    var date;
    date = new Date();
    return $("#list").prepend($("<dt>" + date + "</dt><dd>" + data.message + "</dd>"));
    //$("div#chat-area").prepend("<div>" + data.message + "</div>");
  });

  function send() {
    var msg = $("#message").val();  //$("input#message").val();
    $("input#message").val("");
    socket.emit('message:send', { message: msg });
  }});
