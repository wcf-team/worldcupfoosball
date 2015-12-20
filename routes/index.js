var LCD = require('jsupm_i2clcd');
var groveSensor = require('jsupm_grove');
// Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS)
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

//ÐýÅ¥Çý¶¯

var upm_grove = require('jsupm_grove');
var groveRotary = new upm_grove.GroveRotary(0);

var game = 0;

var redscore =0;
var bluescore = 0;

//MP3Çý¶¯
//mp3 kt403a Çý¶¯

//uart³õÊ¼»¯
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion());
mp3 = new m.Uart(0);

function sleep(delay) {
  delay += new Date().getTime();
  while (new Date() < delay) { }
}

console.log("Set UART parameters");
function char(x) { return parseInt(x, 16); }



mp3.setBaudRate(9600);
mp3.setMode(8, 0, 1);
mp3.setFlowcontrol(false, false);
console.log("sleep");
sleep(200);
console.log("sleep done");

//uart test
//mp3.writeStr("test\n");
/*
 buf2 = mp3.writeStr("test");
 sleep(200);
 console.log("write done");
 console.log("re = "+buf2.toString(16));
 console.log("read done");
 sleep(200);
 console.log("done");
 */

function Kt403ASelectDevice(device)
{
  var buf = new Buffer(8);
  buf[0] = char('0x7E');
  buf[1] = char('0xFF');
  buf[2] = char('0x06');
  buf[3] = char('0x09');
  buf[4] = char('0x00');
  buf[5] = char('0x00');
  buf[6] = char('0x01');
  buf[7] = char('0xEF');
  mp3.write(buf);
  sleep(200);
  console.log("Kt403ASelectDevice");
  /*
   mp3.write(0x7E);
   mp3.write(0xFF);
   mp3.write(0x06);
   mp3.write(0x09);
   mp3.write(uint8_t(0x00));
   mp3.write(uint8_t(0x00));
   mp3.write(device);
   mp3.write(0xEF);
   */

}

function Kt403AMusicPlay(hbyte,lbyte)
{
  var buf = new Buffer(8);
  buf[0] = char('0x7E');
  buf[1] = char('0xFF');
  buf[2] = char('0x06');
  buf[3] = char('0x03');
  buf[4] = char('0x00');
  buf[5] = char('0x00');
  buf[6] = char(lbyte);
  buf[7] = char('0xEF');
  mp3.write(buf);
  sleep(200);
  console.log("Kt403AMusicPlay");

  /*
   mp3.write(0x7E);
   mp3.write(0xFF);
   mp3.write(0x06);
   mp3.write(0x03);
   mp3.write(0x00);
   mp3.write(hbyte);
   mp3.write(lbyte);
   mp3.write(0xEF);
   sleep(10);
   */
}

function Kt403ADebug()
{
  var c;

  //while(mp3.available())
  {
    c = mp3.read();
    console.log(c);
  }
}

Kt403ASelectDevice();
sleep(200);
//Kt403ADebug();
//sleep(200);
//Kt403AMusicPlay(0,8);
sleep(200);
//Kt403ADebug();
//sleep(200);

function voice_play(voice)
{
  Kt403AMusicPlay(0,voice);
}

var ScoreIndex = 10;
var ScoreReadInterval = 1000;
var ScoreDeadTime     = 5000;
var ScoreHistory = new Array(10);

var d = new Date();
var Nowtime = (d.getTime() + 5000);
var Lasttime = d.getTime()  -5000;
var countButton = 0;

for(i=0; i<10; i++) {
  ScoreHistory[i] = new Array(4);
}

for(i=0; i<10; i++) {
  for (n=0; n<4; n++) {
    ScoreHistory[i][n] = 0;
  }
}
myLcd.setCursor(0,0);
// RGB Blue
myLcd.setColor(53, 39, 249);
// RGB Red
//myLcd.setColor(0, 0, 255);
myLcd.write('  Red  &  Blue  ');
myLcd.setCursor(1,7);
myLcd.write(':');

myLcd.setCursor(1,5);
myLcd.write('Ready!');

//myLcd.setCursor(1,3);
//myLcd.write('00');

//myLcd.setCursor(1,10);
//myLcd.write('00');

// Create the button object using GPIO pin 0
var RedGoal = new groveSensor.GroveButton(2);
var BlueGoal = new groveSensor.GroveButton(3);
var ButtonValue = new groveSensor.GroveButton(4);

// display the lcd
function displayRedGoal(redgoal)
{
  myLcd.setCursor(1,3);
  if(redgoal < 10) {
    myLcd.write('0'+redgoal.toString());
  } else {
    myLcd.write(redgoal.toString());
  }
}

function displayBlueGoal(bluegoal)
{
  myLcd.setCursor(1,10);
  if (bluegoal < 10) {
    myLcd.write('0'+bluegoal.toString());
  } else  {
    myLcd.write(bluegoal.toString());
  }
}


// Read the input and print, waiting one second between readings
function readGoalValue() {
  var goal = 0;
  var d = new Date();
  Nowtime = d.getTime();

  if(game === 0)
    return ;
  if ((RedGoal.value() === 0) && ((Nowtime - Lasttime) >= ScoreDeadTime)) {  // there's a red ball in
    goal = 1;
  }
  else if ((BlueGoal.value() === 0) && ((Nowtime - Lasttime) >= ScoreDeadTime) ) {
    goal = 2;
  }else {
  }
  if(goal>0)
  {

    Lasttime = d.getTime();   // second
    ScoreIndex++;
    ScoreHistory[(ScoreIndex%10)][0] = ScoreHistory[(ScoreIndex - 1)%10][0];
    ScoreHistory[(ScoreIndex%10)][1] = ScoreHistory[(ScoreIndex - 1)%10][1];
    ScoreHistory[(ScoreIndex%10)][goal-1]++;
    ;
    ScoreHistory[(ScoreIndex%10)][2] = goal;
    if((ScoreHistory[(ScoreIndex%10)][goal-1]===1) || (ScoreHistory[(ScoreIndex-1)%10][2]!=goal))//µÚÒ»´ÎµÃ·Ö»òÕßÉÏÒ»¸öµÃ·ÖµÄÊÇ1ºÅ
      ScoreHistory[(ScoreIndex%10)][3] = 1;
    else
      ScoreHistory[(ScoreIndex%10)][3] = ScoreHistory[(ScoreIndex-1)%10][3] + 1;

    var total = (ScoreHistory[(ScoreIndex%10)][0]+ScoreHistory[(ScoreIndex%10)][1])
    console.log("goal = "+ goal + " >> " + total);
    console.log("red = "+ ScoreHistory[(ScoreIndex%10)][0]);
    console.log("blue = "+ ScoreHistory[(ScoreIndex%10)][1]);

    if(total===1)
      voice_play(1);
    else if(ScoreHistory[(ScoreIndex%10)][3]<=7 && ScoreHistory[(ScoreIndex%10)][3]>=2)
      voice_play(ScoreHistory[(ScoreIndex%10)][3]);
    else if(ScoreHistory[(ScoreIndex%10)][3]>=7)
      voice_play(7);
    else
      voice_play(8);
    if(goal==1) displayRedGoal(ScoreHistory[(ScoreIndex%10)][0]);
    if(goal==2) displayBlueGoal(ScoreHistory[(ScoreIndex%10)][1]);


    redscore = ScoreHistory[(ScoreIndex%10)][0];
    bluescore = ScoreHistory[(ScoreIndex%10)][1];


    if(ScoreHistory[(ScoreIndex%10)][0]>=7)
    {
      myLcd.setCursor(1,3);
      myLcd.write('Red Win!');
      game = 0;
    }
    else if(ScoreHistory[(ScoreIndex%10)][1]>=7)
    {
      myLcd.setCursor(1,3);
      myLcd.write('Blue Win!');
      game = 0;
    }
  }
}

var ii = 0;
function readButton()
{

  if (ButtonValue.value() === 1) {
    countButton++;
    console.log(ButtonValue.name() + "value is" + countButton);
  } else {

    if ((countButton > 0) && (countButton < 20)) {
      console.log("short pressed");
      //voice_play(ii);
      //            ii++;
      if(game != 0)
      {
        if (ScoreIndex-- <= 10) {
          ScoreIndex = 10;
        }
      }
      displayRedGoal(ScoreHistory[(ScoreIndex%10)][0]);
      displayBlueGoal(ScoreHistory[(ScoreIndex%10)][1]);
    } else if (countButton>=20) {
      console.log("long pressed");
      ScoreIndex = 10;
      ScoreHistory[ScoreIndex%10][0] = 0;
      ScoreHistory[ScoreIndex%10][1] = 0;
      displayRedGoal(ScoreHistory[(ScoreIndex%10)][0]);
      displayBlueGoal(ScoreHistory[(ScoreIndex%10)][1]);
      game = 1;
      voice_play(8);
      myLcd.setCursor(1,3);
      myLcd.write('               ');
      myLcd.setCursor(1,3);
      myLcd.write('00');

      myLcd.setCursor(1,10);
      myLcd.write('00');
    }
    countButton = 0;
  }

}


function readRotary()
{
  var abs = groveRotary.abs_value();
  var absdeg = groveRotary.abs_deg();
  var absrad = groveRotary.abs_rad();

  var rel = groveRotary.rel_value();
  var reldeg = groveRotary.rel_deg();
  var relrad = groveRotary.rel_rad();


  //console.log("rotary:"+abs);
  //myLcd.setColor(53, 39, 249);
  myLcd.setColor(53*abs/1024, 39*abs/1024, 249*abs/1024);
  //myLcd.setColor(abs/4, abs/4, abs/4);
  //write the knob value to the console in different formats
  //console.log("Abs: " + abs + " " + Math.round(parseInt(absdeg)) + " " + absrad.toFixed(3));
  //console.log("Rel: " + rel + " " + Math.round(parseInt(reldeg)) + " " + relrad.toFixed(3));
}



setInterval(readGoalValue, 100);
setInterval(readButton, 100);
setInterval(readRotary, 100);


var express = require('express');
var router = express.Router();

var wcfschema = require('./../db/wcf_schema.js');
var playerlist = wcfschema.playerlist;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'World Cup Foosball', display_red: redscore, display_blue: bluescore});
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
