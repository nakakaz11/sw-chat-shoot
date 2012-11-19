# coffee -wcb *.coffee
# js2coffee client.js > client.coffee
# http://www.atmarkit.co.jp/ait/articles/1210/10/news115_2.html

jQuery ($) ->
  "use strict"
  _socket = io.connect()
  _userMap = {}
  _bulletMap = {}
# game
  _socket.on "player-update", (data) ->   # userオブジェクト作成/初期化
    if _userMap[data.userId] is `undefined`     # なかったら作る
      console.log "SW-createUser:" + data.userId, data
      user =
        x: 0
        y: 0
        v: 0
        rotate: 0
        userId: data.userId

      user.element = $("<img src=\"/images/unit.png\" class=\"player\" />")
        .attr("data-user-id", user.userId)
      $("body").append(user.element)
      _userMap[data.userId] = user
      bullet =                            # bullet弾 作成/初期化
        x: -100
        y: -100
        v: 0
        rotate: 0
        userId: data.userId

      bullet.element = $("<img src=\"/images/bullet.png\" class=\"bullet\" />")
        .attr("data-user-id", user.userId)
      $("body").append(bullet.element)
      _bulletMap[data.userId] = bullet
    else                                        # あったらoverride
      user = _userMap[data.userId]
    user.x = data.data.x
    user.y = data.data.y
    user.rotate = data.data.rotate
    user.v = data.data.v
    updateCss(user)

  _socket.on "bullet-create", (data) ->
    bullet = _bulletMap[data.userId]
    if bullet isnt `undefined`
      bullet.x = data.data.x
      bullet.y = data.data.y
      bullet.rotate = data.data.rotate
      bullet.v = data.data.v

  _socket.on "disconnect-user", (data) ->
    user = _userMap[data.userId]
    if user isnt `undefined`
      user.element.remove()
      delete _userMap[data.userId]

      bullet = _bulletMap[data.userId]
      bullet.element.remove()
      delete _bulletMap[data.userId]

  # myの初期値
  _keyMap = []
  _player =
    x: Math.random() * 1000 | 0
    y: Math.random() * 500 | 0
    v: 0
    rotate: 0
    element: $("#my-player")

  _bullet =
    x: -100
    y: -100
    v: 0
    rotate: 0
    element: $("#my-bullet")

  updatePosition = (unit) ->
    unit.x += unit.v * Math.cos(unit.rotate * Math.PI / 180)
    unit.y += unit.v * Math.sin(unit.rotate * Math.PI / 180)

  updateCss = (unit) ->  # CSSで動的アニメート
    unit.element.css
      left: unit.x | 0 + "px"
      top: unit.y | 0 + "px"
      transform: "rotate(" + unit.rotate + "deg)"

  #メインループ
  _isSpaceKeyUp = true    # スペースキー用判定
  f = ->                  # key判定
    #left
    _player.rotate -= 3  if _keyMap[37] is true
    #up
    _player.v += 0.5  if _keyMap[38] is true
    #right
    _player.rotate += 3  if _keyMap[39] is true
    #down
    _player.v -= 0.5  if _keyMap[40] is true
    if _keyMap[32] is true and _isSpaceKeyUp
      #space  -> bullet
      _isSpaceKeyUp = false
      _bullet.x = _player.x + 20
      _bullet.y = _player.y + 20
      _bullet.rotate = _player.rotate
      _bullet.v = Math.max(_player.v + 3, 3)
      _socket.emit "bullet-create",
        x: _bullet.x | 0
        y: _bullet.y | 0
        rotate: _bullet.rotate | 0
        v: _bullet.v

    _player.v *= 0.95
    # ここはMapのループ出現処理？
    updatePosition(_player)
    w_width = $(window).width()
    w_height = $(window).height()
    _player.x = w_width  if _player.x < -50
    _player.y = w_height  if _player.y < -50
    _player.x = -50  if _player.x > w_width
    _player.y = -50  if _player.y > w_height
    updatePosition(_bullet)
    # 衝突判定まわし
    for key of _bulletMap
      bullet = _bulletMap[key]
      updatePosition(bullet)
      updateCss(bullet)
      # 衝突判定
      location.href = "/gameover"  if _player.x < bullet.x and bullet.x < _player.x + 50 and _player.y < bullet.y and bullet.y < _player.y + 50
    updateCss(_bullet)
    updateCss(_player)
    _socket.emit "player-update",
      x: _player.x | 0
      y: _player.y | 0
      rotate: _player.rotate | 0
      v: _player.v

    return setTimeout(f, 30)

  setTimeout(f, 30)         # key 押し下げ判定（タイムラグ付）
  $(window).keydown (e) ->
    _keyMap[e.keyCode] = true

  $(window).keyup (e) ->
    _isSpaceKeyUp = true  if e.keyCode is 32
    _keyMap[e.keyCode] = false

# chat
  #サーバーが受け取ったメッセージを返して実行する
  _socket.on "data-send", (data) ->
    date = new Date()
    if _userMap[data.userId] is `undefined`     # なかったら作る
      console.log "SW-createUser:" + data.userId, data.message
      user =    # userのjson make
        userId: data.userId
      user.txt = $("<dt>" + date + "</dt><dd>" + data.message + "</dd>")
        .attr("data-user-id", user.userId)
      $("#list").prepend(user.txt)  # リストDOM挿入
    else                                        # あったらoverride
      user = _userMap[data.userId]
      user.txt = $("<dt>" + date + "</dt><dd>" + data.message + "</dd>")
        .attr("data-user-id", user.userId)
      $("#list").prepend(user.txt)  # リストDOM挿入

  ###  DB仕込むときにはfs使って入れるかな〜
  _socket.on "data updateDB", (data) ->
    console.log data
  ###
  # セッション切断時（今は使わん）
  _socket.on "disconnected", (data) ->
    user = _userMap[data.userId]
    if user isnt `undefined`
      user.element.remove()
      #delete _bulletMap[data.userId]


  #サーバーにメッセージを引数にイベントを実行する----- clickEvent
  chat = ->
    msg = $("input#message").val()
    $("input#message").val ""
    #_socket.emit('message:send', { message: msg });
    _socket.emit "data-send", msg
  $("button#btn").click ->
    setTimeout(chat, 30)         # 押し下げ判定（タイムラグ付）

