/* GET home page. */
var title = 'SW ShootingApp+ChatApp(node.js+express+socket.io+ejs+coffee)'
var date = new Date();
var desc = '>SW App Test:'+ date;
exports.index = function(req, res){
  res.render('index',{
      title:  title,
      desc:   desc }
)};
exports.game = function(req, res){
  res.render('game',{
      title:  title,
      desc:   desc }
)};
exports.gameover = function(req, res){
	res.render('gameover',{
      title:  title,
      desc:   desc }
)};