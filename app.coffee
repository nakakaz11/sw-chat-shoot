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
  app.set('port', process.env.PORT || 3000)    #sw add
  app.set "view engine", "ejs"
  app.use express.logger 'dev'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use(express["static"](path.join(__dirname, 'public'))) # sw add
  ###
  app.set "view options",
    layout: false
  ###
app.get('/', routes.index)
#app.get('/users', user.list)

#swadd express3.0
server = http.createServer(app)
io = require("socket.io").listen(server)
server.listen app.get('port')

# ioはSocket.IOサーバオブジェクトであると仮定
io.configure 'herokuset', ->
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)

#実装部分
io.sockets.on "connection", (socket) ->   # ユーザが接続して来たら実行される
# 接続時の初期化処理を書く
  socket.on 'data send', (data) ->  # クライアント側からのイベントを受取
    socket.emit 'data push', data  # 送って来た本人に送る  .message
    socket.broadcast.emit 'data push', data # 送って来た人以外全員に送る .message
    #sanitized = escapeHTML(msg)

  socket.on "disconnect", ->    # クライアントが切断したら実行される。
    console.log "disconnect"
    socket.broadcast socket.id + ' disconnected'
    # 他全員に切断した人のsessionIdを送る。

# サニタイズ
###
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
###
