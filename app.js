//SETUP
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var port = process.env.PORT || 3000;
var config = require('./config');
var stormpath = require('express-stormpath');
var apiKey = config.getSTORMPATH_CLIENT_APIKEY_ID();
//var passport = require('passport');
//var session = require('express-session');
//var cookieSession = require('cookie-session');


//MONGOOSE CONFIG
mongoose.connect('mongodb://'+config.getMongoUser()+':'+config.getMongoPass()+'@ds157459.mlab.com:57459/pinterest-clone-srl');
//below mongoose.connect saved for when moving to heroku
//mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds145669.mlab.com:45669/nightlife`);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection eror:'));
db.once('open', function(){
  console.log("connected");
})


//EXPRESS SETUP
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(function(err, req, res, next){
  res.sendStatus(404);
  res.send("404");
  return;
})

/*
app.use(cookieSession({
  name: 'session',
  keys: [process.env.cookieSecret],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//passport setup
app.use(session(process.env.passportSecret));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', require('./controllers/index2'));
app.use('/auth', require('./controllers/signin'));
app.use('/logout', require('./controllers/logout'))
*/

app.use(stormpath.init(app, {
  website: true
}));
app.set('stormpathRedirectUrl', '/');

app.use('/', require('./controllers/index')());
app.use('/add-pin', require('./controllers/add-pin')());
app.use(function (req, res, next) {
  res.status(404).render('404');
})

//launch
app.on('stormpath.ready', function(){
app.listen(port, function(){
  console.log(`Pinterest Clone listening on port ${port}!`);
});
})
