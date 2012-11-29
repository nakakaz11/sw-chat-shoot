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
  console.info "listening on port " + app.get("port")

# mongoose - 1127 ------#
mongoose = require('mongoose')
Schema = mongoose.Schema   # スキーマ定義
UserSchema = new Schema
  userId: Number
  playmess: String
  date: String
User = mongoose.model('User', UserSchema)  #スキーマの設定
uri = process.env.MONGOHQ_URL || 'mongodb://localhost/makeMongoDB' #Connect for HEROKU
mongoose.connect(uri)
# mongoose -------#

io = require("socket.io").listen(server, "log level": 1)
io.configure ->  # heroku Only Use Socket.IO server object
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)
# 基底class -------------------------#
class SwSocket
  #constructor: (@keyname) ->
    # @keyname = keynameと等価
  make: (socket,keyname) ->
    socket.on keyname, (data) ->
      socket.broadcast.json.emit keyname ,
        userId: socket.handshake.userId
        data: data
        playmess: data
        ca_cr: data   # canvs add
class SwSockClient extends SwSocket  # 一応便宜上 extend
  make: (socket,keyname) ->  # chat with mongoose用
    #super(socket,keyname)  # 親make()
    makeMongo = (socket,keyname) ->  # sendDB
      User.find (userMGD) -> # DB read  (err,userMGD)
        #if err then console.info "swMongoFind:"+err # log
        socket.emit keyname, userMGD   # 自分にイベント送
        socket.broadcast.emit keyname, userMGD  # 自分以外に送
    makeMongo(socket,keyname)
    socket.on keyname, (data) ->
      # mongoose -------#
      date = new Date()
      JSTDate = date
      userMG = new User
      userMG.userId = socket.handshake.userId
      userMG.playmess = data.playmess
      userMG.date = JSTDate
      userMG.save (err) ->       # DB write
        if err then console.log "swMongoSave:"+err # log
      #sanitized = escapeHTML(data) # これobj前にやんなきゃね。
      makeMongo(socket,keyname)

# override -------#
p_u = new SwSocket
b_c = new SwSocket
c_c = new SwSocket
d_u = new SwSocket
p_m = new SwSockClient
# DO it -------#
_userId = 0
io.sockets.on "connection", (socket) ->
  socket.handshake.userId = _userId
  _userId++
# connection -------------------------#
  p_u.make(socket,'player-update')
  b_c.make(socket,'bullet-create')
  c_c.make(socket,'canvas-create') # canvs add
  d_u.make(socket,'disconnect')
  p_m.make(socket,'player-message')
  socket.on 'deleteDB', (delid) ->
    _uid = delid
    #console.log "swMongoDel:"+_uid.userId
    User.find().remove()   # userId:_uid.userId
    socket.emit 'deleteDB'
    socket.broadcast.emit 'deleteDB'
  return

# サニタイズ sanitized = escapeHTML(msg)
###
escapeHTML = (str) ->
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;")
###
