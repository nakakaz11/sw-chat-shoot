// Generated by CoffeeScript 1.4.0

jQuery(function($) {
  "use strict";

  var canvas, canvasHtml, chat, coord, createCtxU, ctx, ctxU, f, mousedown, updateCss, updatePosCanv, updatePosition, _bullet, _bulletMap, _canvasMap, _isSpaceKeyUp, _isUserCanvas, _keyMap, _player, _socket, _userMap;
  _socket = io.connect();
  _userMap = {};
  _bulletMap = {};
  _canvasMap = {};
  canvasHtml = function(uid) {
    return "<div id='user-coord" + uid + "'>UserCanvas (ID) " + uid + "</div><canvas id='user-canvas" + uid + "' class='user-canvas' width='200' height='200'></canvas>";
  };
  mousedown = false;
  canvas = document.getElementById("my-canvas");
  coord = document.getElementById("coord");
  ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#DE3D9C";
  ctx.lineWidth = 5;
  _isUserCanvas = false;
  ctxU = {};
  createCtxU = function(uid) {
    var ctxUid;
    if (_isUserCanvas === true) {
      ctxUid = document.getElementById("user-canvas" + uid);
      ctxU = ctxUid.getContext("2d");
      ctxU.strokeStyle = "#83B14E";
      ctxU.lineWidth = 5;
      return ctxU;
    } else {
      return false;
    }
  };
  /*canvas.onmousedown = (e) ->
    # handle mouse events on canvas
    pos = updatePosCanv(e, canvas)
    mousedown = true
    ctx.beginPath()
    ctx.moveTo pos.c_x, pos.c_y
    false
  canvas.onmousemove = (e) ->
    pos = updatePosCanv(e, canvas)
    coord.innerHTML = "(" + pos.c_x + "," + pos.c_y + ")"
    if mousedown
      ctx.lineTo pos.c_x, pos.c_y
      ctx.stroke()
  canvas.onmouseup = (e) ->
    mousedown = false
  */

  _socket.on("player-update", function(data) {
    var bullet, uCanv, user;
    if (_userMap[data.userId] === undefined) {
      user = {
        x: 0,
        y: 0,
        v: 0,
        rotate: 0,
        userId: data.userId
      };
      user.element = $("<img src=\"/images/unit.png\" class=\"player\" />").attr("data-user-id", user.userId);
      $("body").append(user.element);
      _userMap[data.userId] = user;
      bullet = {
        x: -100,
        y: -100,
        v: 0,
        rotate: 0,
        userId: data.userId
      };
      bullet.element = $("<img src=\"/images/bullet.png\" class=\"bullet\" />").attr("data-user-id", user.userId);
      $("body").append(bullet.element);
      _bulletMap[data.userId] = bullet;
      uCanv = {
        c_x: 0,
        c_y: 0,
        userId: data.userId
      };
      uCanv.element = $(canvasHtml(user.userId)).attr("data-user-id", user.userId);
      $("#canvasUser").append(uCanv.element);
      _canvasMap[data.userId] = uCanv;
      return _isUserCanvas = true;
    } else {
      user = _userMap[data.userId];
    }
    user.x = data.data.x;
    user.y = data.data.y;
    user.rotate = data.data.rotate;
    user.v = data.data.v;
    return updateCss(user);
  });
  _socket.on("bullet-create", function(data) {
    var bullet;
    bullet = _bulletMap[data.userId];
    if (bullet !== undefined) {
      bullet.x = data.data.x;
      bullet.y = data.data.y;
      bullet.rotate = data.data.rotate;
      return bullet.v = data.data.v;
    }
  });
  _socket.on("canvas-create", function(data) {
    var uCanv;
    uCanv = _canvasMap[data.userId];
    console.info("SW-UserLog:" + data.userId + ":" + data.ca_cr.c_x + ":" + data.ca_cr.c_y + ":" + data.ca_cr.c_UM);
    if (uCanv !== undefined) {
      uCanv.c_x = data.ca_cr.c_x;
      uCanv.c_y = data.ca_cr.c_y;
      if (_isUserCanvas) {
        createCtxU(data.userId);
        switch (data.ca_cr.c_UM) {
          case "onmousedown":
            ctxU.beginPath();
            return ctxU.moveTo(uCanv.c_x, uCanv.c_y);
          case "onmousemove":
            ctxU.lineTo(uCanv.c_x, uCanv.c_y);
            return ctxU.stroke();
          case "onmouseup":
            break;
          default:
            return null;
        }
      }
    }
  });
  _socket.on("disconnect", function(data) {
    var bullet, uCanv, user;
    user = _userMap[data.userId];
    if (user !== undefined) {
      user.element.remove();
      delete _userMap[data.userId];
      bullet = _bulletMap[data.userId];
      bullet.element.remove();
      delete _bulletMap[data.userId];
      uCanv = _canvasMap[data.userId];
      uCanv.element.remove();
      delete _canvasMap[data.userId];
      return _isUserCanvas = false;
    }
  });
  _keyMap = [];
  _player = {
    x: Math.random() * 1000 | 0,
    y: Math.random() * 500 | 0,
    v: 0,
    rotate: 0,
    element: $("#my-player")
  };
  _bullet = {
    x: -100,
    y: -100,
    v: 0,
    rotate: 0,
    element: $("#my-bullet")
  };
  updatePosition = function(unit) {
    unit.x += unit.v * Math.cos(unit.rotate * Math.PI / 180);
    return unit.y += unit.v * Math.sin(unit.rotate * Math.PI / 180);
  };
  updateCss = function(unit) {
    return unit.element.css({
      left: unit.x | 0 + "px",
      top: unit.y | 0 + "px",
      transform: "rotate(" + unit.rotate + "deg)"
    });
  };
  updatePosCanv = function(e, gCanvasEle) {
    var canvasX, canvasY;
    if (e.pageX || e.pageY) {
      canvasX = e.pageX;
      canvasY = e.pageY;
    } else {
      canvasX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      canvasY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    canvasX -= gCanvasEle.offsetLeft;
    canvasY -= gCanvasEle.offsetTop;
    return {
      c_x: canvasX,
      c_y: canvasY
    };
  };
  _isSpaceKeyUp = true;
  f = function() {
    var bullet, key, w_height, w_width;
    canvas.onmousedown = function(e) {
      var pos;
      pos = updatePosCanv(e, canvas);
      mousedown = true;
      ctx.beginPath();
      ctx.moveTo(pos.c_x, pos.c_y);
      _socket.emit("canvas-create", {
        c_x: pos.c_x,
        c_y: pos.c_y,
        c_UM: "onmousedown"
      });
      return false;
    };
    canvas.onmousemove = function(e) {
      var pos;
      pos = updatePosCanv(e, canvas);
      coord.innerHTML = "(" + pos.c_x + "," + pos.c_y + ")";
      if (mousedown) {
        _socket.emit("canvas-create", {
          c_x: pos.c_x,
          c_y: pos.c_y,
          c_UM: "onmousemove"
        });
        ctx.lineTo(pos.c_x, pos.c_y);
        return ctx.stroke();
      }
    };
    canvas.onmouseup = function(e) {
      mousedown = false;
      return _socket.emit("canvas-create", {
        c_UM: "onmouseup"
      });
    };
    if (_keyMap[37] === true) {
      _player.rotate -= 3;
    }
    if (_keyMap[38] === true) {
      _player.v += 0.5;
    }
    if (_keyMap[39] === true) {
      _player.rotate += 3;
    }
    if (_keyMap[40] === true) {
      _player.v -= 0.5;
    }
    if (_keyMap[32] === true && _isSpaceKeyUp) {
      _isSpaceKeyUp = false;
      _bullet.x = _player.x + 20;
      _bullet.y = _player.y + 20;
      _bullet.rotate = _player.rotate;
      _bullet.v = Math.max(_player.v + 3, 3);
      _socket.emit("bullet-create", {
        x: _bullet.x | 0,
        y: _bullet.y | 0,
        rotate: _bullet.rotate | 0,
        v: _bullet.v
      });
    }
    _player.v *= 0.95;
    updatePosition(_player);
    w_width = $(window).width();
    w_height = $(window).height();
    if (_player.x < -50) {
      _player.x = w_width;
    }
    if (_player.y < -50) {
      _player.y = w_height;
    }
    if (_player.x > w_width) {
      _player.x = -50;
    }
    if (_player.y > w_height) {
      _player.y = -50;
    }
    updatePosition(_bullet);
    for (key in _bulletMap) {
      bullet = _bulletMap[key];
      updatePosition(bullet);
      updateCss(bullet);
      if (_player.x < bullet.x && bullet.x < _player.x + 50 && _player.y < bullet.y && bullet.y < _player.y + 50) {
        location.href = "/gameover";
      }
    }
    updateCss(_bullet);
    updateCss(_player);
    _socket.emit("player-update", {
      x: _player.x | 0,
      y: _player.y | 0,
      rotate: _player.rotate | 0,
      v: _player.v
    });
    return setTimeout(f, 30);
  };
  setTimeout(f, 30);
  $(window).keydown(function(e) {
    return _keyMap[e.keyCode] = true;
  });
  $(window).keyup(function(e) {
    if (e.keyCode === 32) {
      _isSpaceKeyUp = true;
    }
    return _keyMap[e.keyCode] = false;
  });
  _socket.on("player-message", function(data) {
    var date, user;
    console.log("SW-UserLog:" + data.userId + ":" + data.playmess);
    date = new Date();
    if (_userMap[data.userId] === undefined) {
      user = {
        userId: data.userId
      };
      user.txt = $("<dt>" + date + "</dt><dd>" + data.playmess + ":ID" + user.userId + "</dd>").attr("data-user-id", user.userId);
      $("#list").prepend(user.txt);
      return _userMap[data.userId] = user;
    } else {
      user = _userMap[data.userId];
      user.txt = $("<dt>" + date + "</dt><dd>" + data.playmess + ":ID" + user.userId + "</dd>").attr("data-user-id", user.userId);
      $("#list").prepend(user.txt);
      return _userMap[data.userId] = user;
    }
  });
  _socket.on("disconnect", function(data) {});
  chat = function() {
    var msg;
    msg = $("input#message").val();
    $("input#message").val("");
    return _socket.emit("player-message", msg);
  };
  $("button#btn").click(function() {
    return setTimeout(chat, 30);
  });
  return $("button#btnDbDel").click(function() {
    _socket.emit('deleteDB');
    return $('#list').empty();
  });
});
