# coffee -wcb *.coffee
# js2coffee app.js > app.coffee
# https://github.com/coppieee/node-shooting-demo
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
# http://www.atmarkit.co.jp/ait/articles/1210/10/news115_2.html
_userId = 0
io.sockets.on "connection", (socket) ->
  socket.handshake.userId = _userId
  _userId++
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



