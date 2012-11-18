# coffee -wcb *.coffee
# js2coffee app.js > app.coffee

# http://d.hatena.ne.jp/sugyan/20101227/1293455185
express = require("express")
routes = require('./routes')
user = require('./routes/user')
http = require('http')
path = require('path')
ejs = require("ejs")
#swadd express3.0
server = http.createServer(app)
io = require("socket.io")
port = process.env.PORT || 3000
app = express()

app.configure ->
  app.use(express["static"](path.join(__dirname, 'public'))) # sw add
  #app.use express.staticProvider(__dirname + "/static")
  #app.set('port', process.env.PORT || 3000)    #sw add
  app.set "view engine", "ejs"
###
  app.set "view options",
    layout: false
###
# Using Socket.IO with Node.js on Heroku
###
@io.configure =>    # this バインド要る？
  @io.set("transports", ["xhr-polling"])
  @io.set("polling duration", 10)
###

#app.get('/', routes.index)
#app.get('/users', user.list)

server.listen app.get('port'), ->    # リスニングするポート
  console.log("SW isPort " + app.get('port'))
  return

app.get "/", (req, res) ->
  res.render "index",
    title : 'SW (node.js+express+socket.io ChatApp)use ejs+coffee'
    desc  : 'SW chat App Test'
    locals:
        port:port  # portは要検証


escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")

#app.listen port
socket = io.listen(server)  # socketの取得 3.0
socket.on "connection", (client) ->   # ユーザが接続して来たら実行される
# 接続時の初期化処理を書く
  client.on "message", (msg) ->  # クライアントがメッセージを送って来たら実行。
    sanitized = escapeHTML(msg)
    client.send sanitized              # 送って来た本人だけに送る。
    client.broadcast sanitized         # 送って来た人以外全員に送る。

  client.on "disconnect", ->    # クライアントが切断したら実行される。
    console.log "disconnect"
    client.broadcast client.sessionId + ' disconnected'
    # 他全員に切断した人のsessionIdを送る。
