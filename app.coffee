# coffee -wcb *.coffee
# sw-chat-shoot 冗長部分を基底class+extends化 1121
"use strict"
express = require("express")
routes = require("./routes")
http = require("http")
path = require("path")
app = express()
# settings -------#
app.configure ->
  app.set('port', process.env.PORT || 3000)
  app.set "views", __dirname + "/views"
  app.set "view engine", "ejs"
  app.use express.logger("dev")
  app.use express.favicon()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use(express["static"](path.join(__dirname, 'public')))
app.configure "development", ->
  app.use express.errorHandler()

app.get "/", routes.index
app.get "/game", routes.game
app.get "/gameover", routes.gameover
# createServer -------#
server = http.createServer(app)
server.listen app.get("port"), ->
  console.log "listening on port " + app.get("port")

io = require("socket.io").listen(server, "log level": 1)
io.configure ->  # heroku Only Use Socket.IO server object
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)
# http://www.atmarkit.co.jp/ait/articles/1210/10/news115_2.html
_userId = 0
# 基底class -------------------------#
###
class SwSocket
  constructor: (socket,keyname) ->
    socket.on keyname, (data) ->
      socket.broadcast.json.emit keyname ,
        userId: socket.handshake.userId
        data: data
###
class SwSockClient # extends SwSocket
  # DO it -------#
  io.sockets.on "connection", (socket) ->
    socket.handshake.userId = _userId
    _userId++
  mesOn: (socket,keyname) ->
    #super(socket,keyname)   # message:dataだから super()しない？
    socket.on keyname, (data) ->  # クライアント以外にイベント送
      socket.broadcast.json.emit keyname ,
        userId: socket.handshake.userId
        message: data
    socket.on keyname, (data) ->  # クライアント側にイベント送
      socket.json.emit keyname,
        message: data
# override -------#
p_u = new SwSocket
b_c = new SwSocket
d_u = new SwSocket
p_m = new SwSockClient
# connection -------------------------#
#p_u(socket,'player-update')
#b_c(socket,'bullet-create')
#d_u(socket,'disconnect-user')
p_m(socket,'player-message')



  ###
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
  socket.on 'player-message', (data) ->  # クライアント側からのイベントを受取
    socket.json.emit 'player-message', # handshake io
      message: data
    socket.broadcast.json.emit 'player-message', # handshake io
      userId: socket.handshake.userId
      message: data
  ###

# サニタイズ（いまは使わん）
#sanitized = escapeHTML(msg)
###
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
###
