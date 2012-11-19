// Generated by CoffeeScript 1.3.3

jQuery(function($) {
  "use strict";

  var chat, f, updateCss, updatePosition, _bullet, _bulletMap, _isSpaceKeyUp, _keyMap, _player, _socket, _userMap;
  _socket = io.connect();
  _userMap = {};
  _bulletMap = {};
  _socket.on("player-update", function(data) {
    var bullet, user;
    if (_userMap[data.userId] === undefined) {
      console.log("SW-createUser:" + data.userId, data);
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
  _socket.on("disconnect-user", function(data) {
    var bullet, user;
    user = _userMap[data.userId];
    if (user !== undefined) {
      user.element.remove();
      delete _userMap[data.userId];
      bullet = _bulletMap[data.userId];
      bullet.element.remove();
      return delete _bulletMap[data.userId];
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
  _isSpaceKeyUp = true;
  f = function() {
    var bullet, key, w_height, w_width;
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
  _socket.on("data-send", function(data) {
    var date, user;
    date = new Date();
    if (_userMap[data.userId] === undefined) {
      console.log("SW-createUser:" + data.userId, data.message);
      user = {
        userId: data.userId
      };
      user.element = $("<dt>" + date + "</dt><dd>" + data.message + "</dd>").attr("data-user-id", user.userId);
      return $("#list").prepend(user.element);
    } else {
      user = _userMap[data.userId];
      user.element = $("<dt>" + date + "</dt><dd>" + data.message + "</dd>").attr("data-user-id", user.userId);
      return $("#list").prepend(user.element);
    }
  });
  /*  DB仕込むときにはfs使って入れるかな〜
  _socket.on "data updateDB", (data) ->
    console.log data
  */

  _socket.on("disconnected", function(data) {
    var user;
    user = _userMap[data.userId];
    if (user !== undefined) {
      return user.element.remove();
    }
  });
  chat = function() {
    var msg;
    msg = $("input#message").val();
    $("input#message").val("");
    return _socket.emit("data-send", msg);
  };
  return $("button#btn").click(function() {
    return setTimeout(chat, 30);
  });
});
