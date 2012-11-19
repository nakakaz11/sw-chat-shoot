# coffee -wcb *.coffee
# sw-chat-shoot
"use strict"
express = require("express")
routes = require("./routes")
http = require("http")
path = require("path")
app = express()
app.configure ->
  app.set('port', process.env.PORT || 3000)
  app.set "views", __dirname + "/views"
  app.set "view engine", "ejs"
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use(express["static"](path.join(__dirname, 'public')))

app.configure "development", ->
  app.use express.errorHandler()

app.get "/", routes.index
app.get "/game", routes.game
app.get "/gameover", routes.gameover
server = http.createServer(app)
server.listen app.get("port"), ->
  console.log "listening on port " + app.get("port")

io = require("socket.io").listen(server,
  "log level": 1
)
# assuming io is the Socket.IO server object
io.configure ->
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)

# http://www.atmarkit.co.jp/ait/articles/1210/10/news115_2.html
_userId = 0
io.sockets.on "connection", (socket) ->
  socket.handshake.userId = _userId
  _userId++

  # game
  socket.on "player-update", (data) ->
    socket.broadcast.json.emit "player-update",
      userId: socket.handshake.userId
      data: data

  socket.on "bullet-create", (data) ->
    socket.broadcast.json.emit "bullet-create",
      userId: socket.handshake.userId
      data: data

  socket.on "disconnect", ->
    socket.broadcast.json.emit "disconnect-user",
      userId: socket.handshake.userId

  #chat
  # 接続時の初期化処理を書く
  socket.handshake.userId = _userId
  _userId++    #複数人のuserIdを管理
  # jsonでやりとりに変更〜1119
  socket.on 'data-send', (data) ->  # クライアント側からのイベントを受取
    socket.json.emit 'data-send', # handshake io
      message: data
    socket.broadcast.json.emit 'data-send', # handshake io
      userId: socket.handshake.userId
      message: data

  socket.on "disconnect", ->    # クライアントが切断したら実行される。
    console.log "disconnect"
    socket.broadcast.json.emit 'disconnected',
    # 他全員に切断した人のsessionIdを送る。
      userId: socket.handshake.userId



# サニタイズ（いまは使わん）
#sanitized = escapeHTML(msg)
###
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
###
