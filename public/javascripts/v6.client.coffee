# coffee -wcb *.coffee  # js2coffee v3.client.js > v3.client.coffee
jQuery ($) ->
  "use strict"
  _socket = io.connect()
  _myId = {}
  _myIC = {}
  _userMap = {}
  _bulletMap = {}
  _ddMap = {}
  _canvasMap = {}
  # canvs add -------------------------#
  canvasHtml = (uid) -> "<div id='user-coord#{uid}'>UserCanvas (ID) #{uid}</div><canvas id='user-canvas#{uid}' class='user-canvas' width='200' height='200'></canvas>"
  mousedown = false
  canvas = document.getElementById("my-canvas")
  coord = document.getElementById("coord")
  mycoord = document.getElementById("mycoord")
  ctx = canvas.getContext("2d")  # get 2D context
  ctx.strokeStyle = "#DE3D9C"    #Fill Color
  ctx.lineWidth = 5
  _isUserCanvas = false
  ctxU = {}  # userCanvas用のオブジェクト
  createCtxU = (uid) ->
    if _isUserCanvas is true
      ctxUid =  document.getElementById("user-canvas#{uid}")
      ctxU = ctxUid.getContext("2d")  # get 2D context
      ctxU.strokeStyle = "#83B14E"    #Fill Color
      ctxU.lineWidth = 5
      return ctxU
    else
      false
  mycoord.innerHTML = "MyCanvas "

  _socket.on "player-update", (data) ->   # userオブジェクト作成/初期化
    # game Engine  -------------------------#
    if _userMap[data.userId] is `undefined`     # なかったら作る
      user =
        x: 0
        y: 0
        v: 0
        rotate: 0
        userId: data.userId
      user.element = $("<img src=\"/images/unit.png\" class=\"player box2d\" />").attr("data-user-id", user.userId)   # 対戦相手のエレメントappend
      $("body").append(user.element)
      _userMap[data.userId] = user        # 対戦相手のobj代入

      bullet =                            # bullet弾 作成/初期化
        x: -100
        y: -100
        v: 0
        rotate: 0
        userId: data.userId
      bullet.element = $("<img src=\"/images/bullet.png\" class=\"bullet\" />").attr("data-user-id", user.userId)
      $("body").append(bullet.element)
      _bulletMap[data.userId] = bullet   # 対戦相手のobj代入

      # dDrop 作成/初期化---------------------#
      dDrop =
        #dd: 'dd test!'
        #ddmess: null
        userId: data.userId
      _ddMap[data.userId] = dDrop        # dragdropのobj代入
      #console.info 'UserId:' , dDrop.userId
      # uCanv 作成/初期化---------------------#
      uCanv =                            # uCanv 作成/初期化
         ###c_x: 0
         c_y: 0###
         userId: data.userId
      uCanv.element = $(canvasHtml(user.userId)).attr("data-user-id", user.userId)
      $("#canvasUser").append(uCanv.element)
      _canvasMap[data.userId] = uCanv    # 対戦相手のobj代入
      _isUserCanvas = true   # flag

    else
      user = _userMap[data.userId]      # もうあったら廻してuserObj更新

    user.x = data.data.x
    user.y = data.data.y
    user.rotate = data.data.rotate
    user.v = data.data.v

    updateCss(user)  # 相手のplayer


  _socket.on "bullet-create", (data) ->
    bullet = _bulletMap[data.userId]
    if bullet isnt `undefined`
      bullet.x = data.data.x
      bullet.y = data.data.y
      bullet.rotate = data.data.rotate
      bullet.v = data.data.v

  #-------------受け側----------- dragdrop add ----------------------------------#
  _socket.on "dd-create", (data) ->
    dDrop = _ddMap[data.userId]
    if dDrop isnt `undefined`
      dDrop.ddid    = data.dd_dt.ddid          #data-id
      dDrop.src     = data.dd_dt.src
      dDrop.alt     = data.dd_dt.alt
      dDrop.tit     = data.dd_dt.tit
      dDrop.ddesc   = data.dd_dt.ddesc
      dDrop.userId  = data.userId
      dDrop.ddmess  = data.dd_dt.ddmess
      dDrop.ddpos   = data.dd_dt.ddpos
      dDrop.ddcount = data.dd_dt.ddOwnCount
      $dDrop1 = $("<img data-id='#{dDrop.ddid}' class='test box2d' alt='#{dDrop.alt}' title='#{dDrop.tit}' src='#{dDrop.src}' data-description='#{dDrop.ddesc}' data-userid='#{dDrop.userId}' data-count='#{dDrop.ddcount}'>").css("opacity", 0.5)
      #ddMyCountTarget = $("img.test[data-count='#{dDrop.ddcount}']")
      #console.info "dd-CountID1:", dDrop.ddcount       # log -----------#
      switch dDrop.ddmess
        when 'dd-create_mouseup'
          $("img.test[data-userid='#{dDrop.userId}'][data-count='#{dDrop.ddcount}']")
            .animate(dDrop.ddpos,"fast","easeOutExpo")
        when 'dd-create_remove'
          $("img.test[data-userid='#{dDrop.userId}'][data-count='#{dDrop.ddcount}']")
            .remove()
        when 'dd-create_toolenter'
          $dDrop1.css(dDrop.ddpos)
          $("body").append($dDrop1)
        else return
  #-------- 自分のIDへ〜〜 ------------------------------#
  _socket.on "dd-back", (data) ->
    _myId.mid = data.myId
    console.info "_myId:", _myId.mid       # log -----------#

  _socket.on "dd-x", (data) ->
    _myIC.userI = data.dd_x.userI
    _myIC.userC = data.dd_x.userC
    console.info "_myUserIC:", _myIC.userI, _myIC.userC        # log -----------#
    $("img.test[data-userid='#{_myIC.userI}'][data-count='#{_myIC.userC}']")
      .attr("src","../images/out.png")
      .addClass('outImage')
  #-------- 自分のIDへ〜〜 ------------------------------#
  ###
coffee -wcb *.coffee
  ###
  # dragdrop tool ------------------------------#
  $toolbar = $("div.toolbar")   # toolBarパレットの生成元
  $.each tools, (i, tool) ->     #JSONを$()に展開回し〜
    $("<img>", tool).appendTo($toolbar)

  sotoFlag = false    # toolbarから来たか判定
  dropImg = {}   # obj返し〜 _dropImg{}
  ddcount = 0
  $("div.toolbar img.tools").draggable
        appendTo:'body'
        helper:'clone'
        start:->
          sotoFlag = true  # toolbarから来たか判定
  # dragdrop tool ------------------------------#
  $("body").droppable(
    tolerance:'fit'
    #deactivate: (ev,ui) ->
    drop: (ev,ui) ->
      $own = ui.helper.clone()
      #---送り側--- dragdrop drop ----------------------#
      #console.info 'myId2:' , _myId
      if sotoFlag
        $own.addClass("myDropImg box2d")
        $own.attr("data-userid",_myId.mid)
        $(@).append($own)
        _dropImg = {}
        _dropImg.dataId = $own.attr("data-id")
        _dropImg.src    = $own.attr('src')
        _dropImg.alt    = $own.attr('alt')
        _dropImg.tit    = $own.attr('title')
        _dropImg.ddesc  = $own.attr('data-description')
        #_dropImg.uipos  = ui.position # とりあえず直近のDropの位置をbulletに送る
        _socket.emit 'dd-create',
          ddid:        _dropImg.dataId
          src:         _dropImg.src
          alt:         _dropImg.alt
          tit:         _dropImg.tit
          ddesc:       _dropImg.ddesc
          ddmess:     'dd-create_toolenter'
          ddpos:       ui.position
          ddOwnCount : ddcount            # drop 追加していくカウント emit
        dropImg = _dropImg                # obj返し〜 _dropImg
        $own.attr("data-count",ddcount)   # drop 追加していくカウント attr
        ddcount++
      #---送り側--- dragdrop move ----------------------#
      sotoFlag = false
      $us = $("img.tools.myDropImg")
      $us.one 'mousemove', ()->  #'click'
        $(@).draggable()
      _$sendCount = $(ui.helper)
      #console.info "dd-MoveEle:", _$sendCount.get(0)      # log -----------#
      _socket.emit 'dd-create',
        ddid:         dropImg.dataId
        src:          dropImg.src
        alt:          dropImg.alt
        tit:          dropImg.tit
        ddesc:        dropImg.ddesc
        ddmess:      'dd-create_mouseup'
        ddpos:        ui.position
        ddOwnCount:  _$sendCount.attr("data-count")
          #dropBack.ddOwnCount
      $us.on 'dblclick', (ev)->
        _socket.emit 'dd-create',
          ddid:       dropImg.dataId
          src:        dropImg.src
          alt:        dropImg.alt
          tit:        dropImg.tit
          ddesc:      dropImg.ddesc
          ddmess:     'dd-create_remove'
          ddOwnCount: $(@).attr("data-count")
        $(@).remove()
        ev.preventDefault()
      false
  )
  #------------------------ dragdrop add ----------------------------------#
  # canvs add -------------------------#
  _socket.on "canvas-create", (data) ->
    uCanv = _canvasMap[data.userId]
    if uCanv isnt `undefined`
      uCanv.c_x = data.ca_cr.c_x
      uCanv.c_y = data.ca_cr.c_y
      if _isUserCanvas
        createCtxU(data.userId)
        switch data.ca_cr.c_UM   # switch文 sw
          when "onmousedown"
            ctxU.beginPath()
            ctxU.moveTo uCanv.c_x, uCanv.c_y
          when "onmousemove"
            ctxU.lineTo uCanv.c_x, uCanv.c_y
            ctxU.stroke()
          when "onmouseup"
          else null

  _socket.on "disconnect", (data) ->
    user = _userMap[data.userId]
    if user isnt `undefined`
      user.element.remove()
      delete _userMap[data.userId]
      bullet = _bulletMap[data.userId]
      bullet.element.remove()
      delete _bulletMap[data.userId]
      uCanv = _canvasMap[data.userId]
      uCanv.element.remove()
      delete _canvasMap[data.userId]
      _isUserCanvas = false   # flag
      # dragdrop disconnect
      delete _ddMap[data.userId]
      $("img.test[data-userid='#{data.userId}']").remove()

  # myPlayerの初期値
  _keyMap = []
  _player =  # 自分のplayer
    x: Math.random() * 1000 | 0
    y: Math.random() * 500 | 0
    v: 0
    rotate: 0
    element: $("#my-player")
  _bullet =  # 自分のbullet
    x: -100
    y: -100
    v: 0
    rotate: 0
    element: $("#my-bullet")
  ###_myCurrentDrop =                 # とりあえず直近のDropの位置（dropImg）をbulletにもってくる
    x : dropImg.uipos.left
    y : dropImg.uipos.top###

  updatePosition = (unit) -> # user用のTween  Class
    unit.x += unit.v * Math.cos(unit.rotate * Math.PI / 180)
    unit.y += unit.v * Math.sin(unit.rotate * Math.PI / 180)

  updateCss = (unit) ->  # CSSで動的アニメート用にアップデート Class
    unit.element.css( #jQ css obj update
      left: unit.x | 0 + "px"
      top: unit.y | 0 + "px"
      transform: "rotate(" + unit.rotate + "deg)" )
  # canvs add -- mouseEV -------------------#
  updatePosCanv = (e, gCanvasEle) ->  # canvasのMousePosを取得
    if e.pageX or e.pageY  # たぶんIE処理だろうな。
      canvasX = e.pageX
      canvasY = e.pageY
    else
      canvasX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      canvasY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    canvasX -= gCanvasEle.offsetLeft
    canvasY -= gCanvasEle.offsetTop
    c_x:canvasX
    c_y:canvasY   # objに代入

  _isSpaceKeyUp = true    # スペースキー用判定

  #メインループ　myPlayer自分の部分
  f = ->
    # handle mouse events on canvas  -------------------------#
    canvas.onmousedown = (e) ->
      pos = updatePosCanv(e, canvas)
      mousedown = true
      ctx.beginPath()
      ctx.moveTo pos.c_x, pos.c_y
      _socket.json.emit "canvas-create",
        c_x:pos.c_x
        c_y:pos.c_y
        c_UM:"onmousedown"   # switch文flag
      false
    canvas.onmousemove = (e) ->
      pos = updatePosCanv(e, canvas)
      coord.innerHTML = "(" + pos.c_x + "," + pos.c_y + ")"
      if mousedown
        _socket.json.emit "canvas-create",
          c_x:pos.c_x
          c_y:pos.c_y
          c_UM:"onmousemove"  # switch文flag
        ctx.lineTo pos.c_x, pos.c_y
        ctx.stroke()
    canvas.onmouseup = (e) ->
      mousedown = false
      _socket.json.emit "canvas-create",
        c_UM:"onmouseup"       # switch文flag
    # handle mouse events on canvas  -------------------------#
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
      _socket.json.emit "bullet-create",
        x: _bullet.x | 0
        y: _bullet.y | 0
        rotate: _bullet.rotate | 0
        v: _bullet.v
    _player.v *= 0.95
    updatePosition(_player)               # myPlayer自分

    # ここはMapのループ出現処理？
    w_width = $(window).width()
    w_height = $(window).height()
    _player.x = w_width  if _player.x < -50
    _player.y = w_height  if _player.y < -50
    _player.x = -50  if _player.x > w_width
    _player.y = -50  if _player.y > w_height
    updatePosition(_bullet)               # myBullet自分

    # bullet 判定まわし
    for key of _bulletMap
      bullet = _bulletMap[key]
      updatePosition(bullet)
      updateCss(bullet)
      # 衝突判定 Shooting　相手のbulletが自分の_playerに当たったらif
      if _player.x < bullet.x and bullet.x < _player.x + 50 and _player.y < bullet.y and bullet.y < _player.y + 50
        location.href = "/gameover"  # あうとぉ。
      # 衝突判定 DragDrop
      $("img.myDropImg").each ->
        myPos = $(@).position()
        if myPos.left < bullet.x and bullet.x < myPos.left + 50 and myPos.top < bullet.y and bullet.y < myPos.top + 50
          $(@).removeClass('box2d')
          $(@).wrap($("<div class='out'>(´･_･`):OUT...</div>"))
          _userI = $(@).attr("data-userid")
          _userC = $(@).attr("data-count")
          _socket.emit "dd-x",
            userI : _userI
            userC : _userC
        else return
    updateCss(_bullet) # 自分のbullet
    updateCss(_player) # 自分のplayer

    # ここでuser Update!  [emit]
    _socket.json.emit "player-update",
      x: _player.x | 0   # ビット演算子 | or
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

  #chat -------------------------#
  #DB入れたから変更　1128
  _socket.on "player-message", (data) ->
    if data.length isnt 0
      $("#list").empty()  # まず空にして
      for name,val of data
        user =    # userのjson make
          userId: val.userId
        user.txt = $("<dt>"+val.date+"</dt><dd>"+val.playmess+":ID"+val.userId+"</dd>")
          .attr("data-user-id", val.userId)
        $("#list").prepend(user.txt)  # DOM挿入

  #サーバーにメッセージを引数にイベントを実行する----- clickEvent
  chat = ->
    msg = $("input#message").val()
    $("input#message").val ""
    _socket.json.emit "player-message",
      playmess:msg
  delId = ->
    del = $("input#delId").val()
    $("input#delId").val ""
    _socket.json.emit 'deleteDB',
      userId:del
     # v0.7.xからは socket.json.send() により明示的にJSONへ
     # 変換するように指定できるようになりました。（省略可）
    #console.info("SW-DelNo:"+del+ ":clicked") # log -----------#
    $("#list dd").each ->
      if  $(this).attr('data-user-id') is del
          $(this).replaceWith($("<dd>(´･_･`)...:ID:#{del}is Deleted</dd>"))
          return
  $("button#btn").click ->
    setTimeout(chat, 19)         # 押し下げ判定（タイムラグ付）
  $("button#btnDbDel").click ->
    setTimeout(delId, 19)         # 押し下げ判定（タイムラグ付）


  ###
coffee -wcb *.coffee
  ###



  #---------- onMove -- customEvent --- Add SW- on()off()の勉強でもある ----------#
  #$(".foo button").on("click", function(){ $("#log").append("<div>bind</div>")});
  # ↑旧.bind()
  #$(".foo").on("click", "button", function(){$("#log").append("<div>delegate</div>")});
  # ↑旧.delegate()
  #$(document).on("click",".foo button",function(){$("#log").append("<div>live</div>")});
  # ↑旧.live()
  #---------- onMove -- customEvent --- Add SW- on()off()の勉強でもある ----------#
  # dragdrop -------------#


tools = [  #------------- define toolset (JSON, e.g. from database)... ------------#
  "data-id": 1
  class: "tools"
  alt: "sun"
  title: "sun"
  src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Sunny.png"
  "data-description": "sun in photo"
,
  "data-id": 2
  class: "tools"
  alt: "snow"
  title: "snow"
  src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Thermometer_Snowflake.png"
  "data-description": "snow in photo"
,
  "data-id": 3
  class: "tools"
  alt: "cloud"
  title: "cloud"
  src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Overcast.png"
  "data-description": "cloud in photo"
,
  "data-id": 4
  class: "tools"
  alt: "rain"
  title: "rain"
  src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Night_Rain.png"
  "data-description": "rain in photo"
,
  "data-id": 5
  class: "tools"
  alt: "rainbow"
  title: "rainbow"
  src: "http://cdn1.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Rainbow.png"
  "data-description": "rainbow in photo"
,
  "data-id": 6
  class: "tools"
  alt: "mac icon"
  title: "mac icon"
  src: "http://cdn1.iconfinder.com/data/icons/gadgets/48/MBP.png"
  "data-description": "macbook pro"
,
  "data-id": 7
  class: "tools"
  alt: "flag"
  title: "flag"
  src: "http://cdn1.iconfinder.com/data/icons/realistiK-new/48x48/apps/kiten.png"
  "data-description": "japan icon"
,
  "data-id": 8
  class: "tools"
  alt: "face"
  title: "face"
  src: "http://cdn1.iconfinder.com/data/icons/humano2/48x48/emotes/face-plain.png"
  "data-description": "rplain icon"
,
  "data-id": 9
  class: "tools"
  alt: "flower"
  title: "flower"
  src: "http://cdn1.iconfinder.com/data/icons/CrystalClear/48x48/apps/licq.png"
  "data-description": "flower icon"
,
  "data-id": 10
  class: "tools"
  alt: "blackcat"
  title: "blackcat"
  src: "http://cdn1.iconfinder.com/data/icons/hallowen_linux/48/Black_Cat.png"
  "data-description": "animal black cat icon"
]

# coffee -wcb *.coffee

