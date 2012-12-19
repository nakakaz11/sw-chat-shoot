// Generated by CoffeeScript 1.4.0
/*
$.backstretch([
  "../images/bks_s01.jpg",
  "../images/bks_s02.jpg",
  "../images/bks_s02.jpg"
  ], {
    fade: 1750,
    duration: 15000
});
*/

//jQuery(function($) {
    var images = [
        "/images/bks_s01.jpg",
        "/images/bks_s02.jpg",
        "/images/bks_s02.jpg"
    ];

    $(images).each(function(){
       $('<img/>')[0].src = this;
    });

    var index = 0;
    $.backstretch(images[index], {speed: 1500});
    setInterval(function() {
        index = (index >= images.length - 1) ? 0 : index + 1;
        $.backstretch(images[index]);
    }, 15000);
// });

$('document').ready(function () {
  window.setTimeout(function () {
    $(".box2d").box2d({'y-velocity':9.8, 'x-velocity':-0.05, 'debug':false});
  }, 180000);
});
