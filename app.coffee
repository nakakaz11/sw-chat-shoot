# coffee -wcb *.coffee
# sw-chat-shoot 冗長部分を基底class+extends化 1121
# mongoDB(read/write OK,emit統合,{json}/[obj])化 1128
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
  userId: Number
  playmess: String
  date: Date
User = mongoose.model('User', UserSchema)  #スキーマの設定
uri = process.env.MONGOHQ_URL || 'mongodb://localhost/makeMongoDB' #Connect for HEROKU
mongoose.connect(uri)
# mongoose - 1127 ------#

io = require("socket.io").listen(server, "log level": 1)
io.configure ->  # heroku Only Use Socket.IO server object
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)
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
class SwSockClient extends SwSocket  # 一応便宜上 extend
  make: (socket,keyname) ->  # chat用
    #super(socket,keyname)  # 親make()
    socket.on keyname, (data) ->  # クライアント側にイベント送
      # mongoose -------#
      userMG = new User
      userMG.userId = socket.handshake.userId
      userMG.playmess = data.playmess
      userMG.date = new Date().toLocaleString()
      userMG.save (err) ->       # DB write
        if err then console.info "swMongoSave:"+err # log

      if keyname is 'deleteDB'  # DB削除
        socket.emit keyname
        socket.broadcast.emit keyname
        User.find().remove()

    #sanitized = escapeHTML(data) # これobj前にやんなきゃね。
  deleteMongoDB = (socket,keyname) ->   # DB削除
    #socket.emit keyname
    #socket.broadcast.emit keyname

# override -------#
p_u = new SwSocket
b_c = new SwSocket
c_c = new SwSocket
d_u = new SwSocket
p_m = new SwSockClient
d_db = new SwSockClient
# DO it -------#
_userId = 0
io.sockets.on "connection", (socket) ->
  socket.handshake.userId = _userId
  _userId++
  # mongoose -------#
  User.find (err,userMGD) -> # DB read
    if err then console.info "swMongoFind:"+err # log
    socket.emit 'player-message', userMGD

# connection -------------------------#
  p_u.make(socket,'player-update')
  b_c.make(socket,'bullet-create')
  c_c.make(socket,'canvas-create') # canvs add
  d_u.make(socket,'disconnect')
  p_m.make(socket,'player-message')
  d_db.make(socket,'deleteDB')  # mongoDB add
  return

# サニタイズ sanitized = escapeHTML(msg)
###
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
###
