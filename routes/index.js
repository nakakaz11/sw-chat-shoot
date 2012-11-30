/* GET home page. */
var title = 'SW Shooting+Canvas+Chat:App(node.js+express+socket.io+ejs+mongoHQ:coffee)';
dd = new Date();
yy = dd.getYear();
mm = dd.getMonth() + 1;
dd = dd.getDate();
hh = dd.getHours() + 9;
ff = dd.getMinutes();
if (yy < 2000) { yy += 1900; }
//if (mm < 10) { mm = "0" + mm; }
//if (dd < 10) { dd = "0" + dd; }
if (hh < 10) { hh = "0" + hh; }
if (ff < 10) { ff = "0" + ff; }
var jst = yy+"/"+mm+"/"+dd+":"+hh+":"+ff ;

var desc = '>SW App Test:'+jst;
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