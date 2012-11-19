
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index',{
      title: 'SW ShootingApp+ChatApp(node.js+express+socket.io+ejs+coffee)',
      desc: 'SW App Test 121119' }
)};
exports.game = function(req, res){
  res.render('game');
};
exports.gameover = function(req, res){
	res.render('gameover');
};