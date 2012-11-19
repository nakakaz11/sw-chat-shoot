/* GET home page. */
var title = 'SW ShootingApp+ChatApp(node.js+express+socket.io+ejs+coffee)'
var desc = 'SW App Test 121119'
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