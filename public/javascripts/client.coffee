# coffee -wcb *.coffee
$ -> # new socket.io
  #socket.ioのインスタンスもportを指定しちゃだめ。
  _socket = io.connect()
  _userMap = {} # userのjson make
  #サーバーが受け取ったメッセージを返して実行する
  _socket.on "data-push", (data) ->
    date = new Date()
    if _userMap[data.userId] is `undefined`     # なかったら作る
      console.log "create user " + data.userId, data
      user =    # userのjson make
        userId: data.userId
      $("#list").prepend $("<dt>" + date + "</dt><dd>" + data + "</dd>")
    else                                        # あったらoverride
      user = _userMap[data.userId]


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
  $("button#btn").click ->
    msg = $("input#message").val()
    $("input#message").val ""
    
    #_socket.emit('message:send', { message: msg });
    _socket.emit "data-send", msg


