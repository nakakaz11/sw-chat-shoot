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
# mongoose - 1127 ------#
mongoose = require('mongoose')
Schema = mongoose.Schema   # スキーマ定義
UserSchema = new Schema
  message: String
  date: Date
uri = process.env.MONGOHQ_URL || 'mongodb://localhost/mongo_data' #for HEROKU
mongoose.connect(uri)
User = mongoose.model('User', UserSchema)  #スキーマの設定
# mongoose - 1127 ------#
io = require("socket.io").listen(server, "log level": 1)
io.configure ->  # heroku Only Use Socket.IO server object
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)
_userId = 0
# 基底class -------------------------#
class SwSocket
  #constructor: (@keyname) ->
    # @keyname = keynameと等価
  make: (socket,keyname) ->
    socket.on keyname, (data) ->  # クライアント以外にイベント送
      socket.broadcast.json.emit keyname ,
        userId: socket.handshake.userId
        data: data
        playmess: data
        ca_cr: data   # canvs add
class SwSockClient extends SwSocket
  #constructor: ->
    # super(@keyname)と等価
  make: (socket,keyname) ->
    super(socket,keyname)  # 親make()
    socket.on keyname, (data) ->  # クライアント側にイベント送
      socket.json.emit keyname,
        userId: socket.handshake.userId
        playmess: data
      @makeMongoDB(data)
  # mongoose - 1127 ------#
  makeMongoDB: (data) ->  # DB登録
    user = new User
    user.MOID = data.userId
    user.playmess = data.playmess
    user.date = new Date()
    user?.save (err) ->
      if err then console.info err # log
    User.find (err,userData) ->
      socket.json.emit keyname userData
    if keyname = "deleteDB" then @deleteMongoDB()
  deleteMongoDB: (socket,keyname) ->   # DB削除
    socket.emit keyname
    socket.broadcast.json.emit keyname
    User.find().remove()

# override -------#
p_u = new SwSocket
b_c = new SwSocket
c_c = new SwSocket
d_u = new SwSocket
p_m = new SwSockClient
# DO it -------#
io.sockets.on "connection", (socket) ->
  socket.handshake.userId = _userId
  _userId++
# connection -------------------------#
  p_u.make(socket,'player-update')
  b_c.make(socket,'bullet-create')
  # canvs add
  c_c.make(socket,'canvas-create')
  d_u.make(socket,'disconnect')
  p_m.make(socket,'player-message')
  return

# サニタイズ（いまは使わん）sanitized = escapeHTML(msg)
###
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
###
