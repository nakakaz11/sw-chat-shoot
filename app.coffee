# coffee -wcb *.coffee
# http://d.hatena.ne.jp/sugyan/20101227/1293455185
express = require("express")
routes = require('./routes')
#user = require('./routes/user')
http = require('http')
path = require('path')
#ejs = require("ejs")

app = express()

app.configure ->
  app.set('port', process.env.PORT || 8080)    #sw add
  app.set "view engine", "ejs"
  app.use express.favicon()
  app.use express.logger 'dev'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use(express["static"](path.join(__dirname, 'public'))) # sw add
  ###
  app.set "view options",
    layout: false
  ###
app.configure "development", ->
  app.use express.errorHandler()

app.get('/', routes.index)
#app.get('/users', user.list)

#swadd express3.0
server = http.createServer(app)
server.listen app.get('port')
io = require("socket.io").listen(server ,
  "log level": 1 )


# ioはSocket.IOサーバオブジェクトであると仮定
io.configure 'herokuset', ->
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)

#実装部分
_userId = 0
io.sockets.on "connection", (socket) ->   # ユーザが接続して来たら実行される
# 接続時の初期化処理を書く
  socket.handshake.userId = _userId
  _userId++    #複数人のuserIdを管理
  # jsonでやりとりに変更〜1119
  socket.on 'data-send', (data) ->  # クライアント側からのイベントを受取
    socket.emit 'data-push', data  # 送って来た本人に送る  .message
    socket.broadcast.json.emit 'data-push', data # 送って来た人以外全員に送る .message
    #sanitized = escapeHTML(msg)
      userId: socket.handshake.userId
      data: data

  socket.on "disconnect", ->    # クライアントが切断したら実行される。
    console.log "disconnect"
    socket.broadcast.json.emit 'disconnected',
    # 他全員に切断した人のsessionIdを送る。
      userId: socket.handshake.userId

# サニタイズ（いまは使わん）
###
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
###
