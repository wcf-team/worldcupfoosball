var express = require('express');
var router = express.Router();

var wcfschema = require('./../db/wcf_schema.js');
var playerlist = wcfschema.playerlist;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { site_title: 'World Cup Foosball' });
});



router.get('/login', function(req, res, next) {
  res.render('login', { site_title: 'World Cup Foosball' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { site_title: 'World Cup Foosball' });
});


/* GET login page. */
router.get('/test', function(req, res, next) {
  playerlist.find(function(err, doc) {
    res.json(doc);
  });

});

module.exports = router;
