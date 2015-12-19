var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://192.168.1.101/wcfdb');

db.on('error', function(error) {
    console.log(error);
});

var Schema = mongoose.Schema;
var playerlistScheMa = new Schema({
    player_name	 : {type : String},
    password : {type: String},
    email : {type : String}
});

exports.playerlist = db.model('wcfplayers', playerlistScheMa);
exports.db = db;