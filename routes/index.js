
var express = require('express');
var router = express.Router();

var wcfschema = require('./../db/wcf_schema.js');
var playerlist = wcfschema.playerlist;

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'World Cup Foosball', display_red: redscore, display_blue: bluescore});
  res.render('index', { title: 'World Cup Foosball'});
});

router.get('/scoreboard', function(req, res, next) {
  res.render('scoreboard', { title: 'World Cup Foosball', players: playerlist });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'World Cup Foosball' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'World Cup Foosball' });
});

router.post('/home', function(req, res) {
  var query = {play_name: req.body.playername, password: req.body.password};
  console.log(req.body.playername);

  (function(){
    playerlist.count(query, function(err, doc){
      if(doc == 1){
        console.log(query.play_name + "login success " + new Date());
        res.render('home', { title: 'World Cup Foosball' });
      }else{
        console.log(query.play_name + "login fail " + new Date());
        res.redirect('/login');
      }
    });
  })(query);
});


/* GET login page. */
router.get('/test', function(req, res, next) {
  playerlist.find(function(err, doc) {
    res.json(doc);
  });

});

module.exports = router;
