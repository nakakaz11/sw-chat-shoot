# coffee -wcb *.coffee
# http://d.hatena.ne.jp/sugyan/20101227/1293455185
express = require("express")
routes = require('./routes')
#user = require('./routes/user')
http = require('http')
path = require('path')
ejs = require("ejs")

app = express()

app.configure ->
  app.use(express["static"](path.join(__dirname, 'public'))) # sw add
  app.use express.logger 'dev'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router

  app.set('port', process.env.PORT || 3000)    #sw add
  app.set "view engine", "ejs"
###
  app.set "view options",
    layout: false
###
app.get('/', routes.index)
#app.get('/users', user.list)

#swadd express3.0
server = http.createServer(app)
io = require("socket.io").listen(server)
server.listen app.get('port') ->
  console.log("SW isPort " + app.get('port'))
###
app.get "/", (req, res) ->
  res.render "index",
    title : 'SW (node.js+express+socket.io ChatApp)use ejs+coffee'
    desc  : 'SW chat App Test'
    locals:
        port:port  # portは要検証
###

io.sockets.on "connection", (client) ->   # ユーザが接続して来たら実行される
# 接続時の初期化処理を書く
  client.on "message", (msg) ->  # クライアントがメッセージを送って来たら実行。
    sanitized = escapeHTML(msg)
    client.send sanitized              # 送って来た本人だけに送る。
    client.broadcast sanitized         # 送って来た人以外全員に送る。

  client.on "disconnect", ->    # クライアントが切断したら実行される。
    console.log "disconnect"
    client.broadcast client.sessionId + ' disconnected'
    # 他全員に切断した人のsessionIdを送る。

# サニタイズ
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
