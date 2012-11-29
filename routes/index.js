/* GET home page. */
var title = 'SW Shooting+Canvas+Chat:App(node.js+express+socket.io+ejs+mongoHQ:coffee)';
// 日本標準時を扱うためのユーティリティ関数
/*var JSTDate = function (str) {  return ISODate(str + "T00+09:00");  };*/
var date = new Date().getTimezoneOffset()
var desc = '>SW App Test:'+date-540;
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