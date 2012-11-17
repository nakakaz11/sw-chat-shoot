
/*
 * GET home page.
 */

exports.index = function(request, response){
  response.render('index', {
    title: 'SW (node.js+express+socket.io ChatApp)use ejs+coffee'
  , desc: 'SW chat App Test' });

};