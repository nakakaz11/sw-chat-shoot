# coffee -wcb *.coffee
# js2coffee app.js > app.coffee


# http://d.hatena.ne.jp/sugyan/20101227/1293455185
express = require("express")
http = require('http')
path = require('path')
ejs = require("ejs")
io = require("socket.io")
#port = 3000

app = express()

app.configure ->
  app.use(express["static"](path.join(__dirname, 'public'))) # sw add
  #app.use express.staticProvider(__dirname + "/static")
  app.set('port', process.env.PORT || 3000)    #sw add
  app.set "view engine", "ejs"
  app.set "view options",
    layout: false

app.get('/', routes.index)
app.get('/users', user.list)

###
app.get "/", (req, res) ->
  console.log "/"
  res.render "index",
    locals:
      port: app.get('port')
###

#swadd express
http.createServer(app).listen(app.get('port'), ->
  console.log("SW port " + app.get('port'))
)


#app.listen port
socket = io.listen(app)
socket.on "connection", (client) ->
  client.on "message", (msg) ->
    client.send msg
    client.broadcast msg

  client.on "disconnect", ->
    console.log "disconnect"


