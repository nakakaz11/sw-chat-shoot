# coffee -wcb *.coffee
# js2coffee client.js > client.coffee
# socket.io.jsファイルを読んでおく
$ ->
  #port = server.listen(app.get("port"))
  socket = new io.Socket(#null,
    #port: port
  )
  socket.connect()
  socket.on "connect", ->
    console.log "connect"

  socket.on "message", (msg) ->
    date = new Date()
    $("#list").prepend $("<dt>" + date + "</dt><dd>" + msg + "</dd>")

  socket.on "disconnect", ->
    console.log "disconnect"

  $("#form").submit ->
    message = $("#message")
    socket.send message.val()
    message.attr "value", ""
    false


