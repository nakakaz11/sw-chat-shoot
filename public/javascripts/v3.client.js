// Generated by CoffeeScript 1.4.0
var tools;

jQuery(function($) {
  "use strict";

  var $toolbar, $us, canvas, canvasHtml, chat, coord, createCtxU, ctx, ctxU, delId, f, mousedown, mycoord, sotoFlag, updateCss, updatePosCanv, updatePosition, _bullet, _bulletMap, _canvasMap, _ddMap, _isSpaceKeyUp, _isUserCanvas, _keyMap, _player, _socket, _userMap;
  _socket = io.connect();
  _userMap = {};
  _bulletMap = {};
  _ddMap = {};
  _canvasMap = {};
  canvasHtml = function(uid) {
    return "<div id='user-coord" + uid + "'>UserCanvas (ID) " + uid + "</div><canvas id='user-canvas" + uid + "' class='user-canvas' width='200' height='200'></canvas>";
  };
  mousedown = false;
  canvas = document.getElementById("my-canvas");
  coord = document.getElementById("coord");
  mycoord = document.getElementById("mycoord");
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
  mycoord.innerHTML = "MyCanvas ";
  _socket.on("player-update", function(data) {
    var bullet, dDrop, uCanv, user;
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
      dDrop = {
        /*dd: 'dd test!'
        ddmess: null
        ddpos: null
        */

        userId: data.userId
      };
      _ddMap[data.userId] = dDrop;
      uCanv = {
        /*c_x: 0
        c_y: 0
        */

        userId: data.userId
      };
      uCanv.element = $(canvasHtml(user.userId)).attr("data-user-id", user.userId);
      $("#canvasUser").append(uCanv.element);
      _canvasMap[data.userId] = uCanv;
      _isUserCanvas = true;
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
  _socket.on("dd-create", function(data) {
    var clone, dDelem1, dDelem2, dDrop;
    dDrop = _ddMap[data.userId];
    if (dDrop !== undefined) {
      dDrop.ddid = data.dd_dt.ddid;
      dDrop.ddmess = data.dd_dt.ddmess;
      dDrop.ddpos = data.dd_dt.ddpos;
      dDrop.userId = data.userId;
      dDelem1 = $("<div class='test'>(´･_･`..drop...userId:" + dDrop.userId + "/ddid:" + dDrop.ddid + ")</div>");
      dDelem2 = $("<div class='test'>(´･_･`..move...userId:" + dDrop.userId + "/ddid:" + dDrop.ddid + ")</div>");
      clone = $("div.toolbar img.tools").attr("data-id=" + dDrop.ddid);
      switch (dDrop.ddmess) {
        case 'dd-create_toolenter':
          dDrop.element = dDelem1.attr("data-user-id", dDrop.userId).css(dDrop.ddpos);
          return $("body").append(dDrop.element);
        case 'dd-create_mouseup':
          dDrop.element = dDelem2.attr("data-user-id", dDrop.userId).css(dDrop.ddpos);
          return $("body").append(dDrop.element);
        case 'dd-create_remove':
          return dDelem2.find("[data-id=" + dDrop.ddid + "]").remove();
        default:
          return null;
      }
    }
  });
  /*
  coffee -wcb *.coffee
  */

  _socket.on("canvas-create", function(data) {
    var uCanv;
    uCanv = _canvasMap[data.userId];
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
      _socket.json.emit("canvas-create", {
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
        _socket.json.emit("canvas-create", {
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
      return _socket.json.emit("canvas-create", {
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
      _socket.json.emit("bullet-create", {
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
    _socket.json.emit("player-update", {
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
    var name, user, val, _results;
    if (data.length !== 0) {
      $("#list").empty();
      _results = [];
      for (name in data) {
        val = data[name];
        user = {
          userId: val.userId
        };
        user.txt = $("<dt>" + val.date + "</dt><dd>" + val.playmess + ":ID" + val.userId + "</dd>").attr("data-user-id", val.userId);
        _results.push($("#list").prepend(user.txt));
      }
      return _results;
    }
  });
  chat = function() {
    var msg;
    msg = $("input#message").val();
    $("input#message").val("");
    return _socket.json.emit("player-message", {
      playmess: msg
    });
  };
  delId = function() {
    var del;
    del = $("input#delId").val();
    $("input#delId").val("");
    _socket.json.emit('deleteDB', {
      userId: del
    });
    return $("#list dd").each(function() {
      if ($(this).attr('data-user-id') === del) {
        $(this).replaceWith($("<dd>(´･_･`)...:ID:" + del + "is Deleted</dd>"));
      }
    });
  };
  $("button#btn").click(function() {
    return setTimeout(chat, 19);
  });
  $("button#btnDbDel").click(function() {
    return setTimeout(delId, 19);
  });
  $toolbar = $("div.toolbar");
  $.each(tools, function(i, tool) {
    return $("<img>", tool).appendTo($toolbar);
  });
  sotoFlag = false;
  $("div.toolbar img.tools").draggable({
    helper: 'clone',
    start: function() {
      return sotoFlag = true;
    },
    stop: function() {
      return $(this).addClass('drpd');
    }
  });
  $("body").droppable({
    tolerance: 'fit',
    deactivate: function(ev, ui) {
      var $own, pos;
      $own = ui.helper.clone();
      if (sotoFlag) {
        pos = $own.position();
        return $(this).append($own).css(pos);
      }
    }
  });
  $us = $("img.drpd");
  return $us.draggable({
    start: function() {
      return sotoFlag = false;
    },
    stop: function(e, ui) {
      $us.on('mousemove', function() {});
      $us.on('mouseup', function() {
        var fly2, pos, tes2;
        pos = $(this).position();
        tes2 = ui.helper.clone();
        fly2 = $(tes2).get(0);
        return _socket.emit('dd-create', console.info("fly2Move:" + $(fly2)), {
          ddmess: 'dd-create_mouseup',
          ddpos: pos
        });
      });
      return $us.on('dblclick', function(e) {
        var fly3;
        fly3 = $(this).attr("data-id");
        _socket.emit('dd-create', {
          ddid: fly3,
          ddmess: 'dd-create_remove'
        });
        $(this).remove();
        return e.preventDefault();
      });
    }
  });
  /*
  coffee -wcb *.coffee
  */

});

tools = [
  {
    "data-id": 1,
    "class": "tools",
    alt: "sun",
    title: "sun",
    src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Sunny.png",
    "data-description": "sun in photo"
  }, {
    "data-id": 2,
    "class": "tools",
    alt: "snow",
    title: "snow",
    src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Thermometer_Snowflake.png",
    "data-description": "snow in photo"
  }, {
    "data-id": 3,
    "class": "tools",
    alt: "cloud",
    title: "cloud",
    src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Overcast.png",
    "data-description": "cloud in photo"
  }, {
    "data-id": 4,
    "class": "tools",
    alt: "rain",
    title: "rain",
    src: "http://cdn4.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Night_Rain.png",
    "data-description": "rain in photo"
  }, {
    "data-id": 5,
    "class": "tools",
    alt: "rainbow",
    title: "rainbow",
    src: "http://cdn1.iconfinder.com/data/icons/iconsland-weather/PNG/48x48/Rainbow.png",
    "data-description": "rainbow in photo"
  }
];
