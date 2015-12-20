var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/wcfdb');

db.on('error', function(error) {
    console.log(error);
});

var Schema = mongoose.Schema;
var playerlistScheMa = new Schema({
    player_name	 : {type : String},
    password : {type: String},
    email : {type : String},
    score : {type : Number},
    round : {type : Number},
    round_win : {type : Number},
    round_loss : {type : Number}
});

exports.playerlist = db.model('wcfplayers', playerlistScheMa);
exports.db = db;