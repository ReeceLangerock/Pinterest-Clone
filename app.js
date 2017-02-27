//SETUP
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var port = process.env.PORT || 3000;
console.log('before config');

console.log('before stormpath require');
var mongoLoginHandler = require('./controllers/mongoLoginHandler.js')
console.log('before mongo handler');

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds157459.mlab.com:57459/pinterest-clone-srl`);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection eror:'));
db.once('open', function(){
  console.log("connected");
})

console.log('before express');
//EXPRESS SETUP
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(function(err, req, res, next){
  res.sendStatus(404);
  res.send("404");
  return;
})

console.log('before stormpath');
//STORMPATH SETUP
app.use(stormpath.init(app, {
  postLoginHandler: function (account, req, res, next) {
    // check to see if mongo doc has been made for user
    mongoLoginHandler.handleLogin(account);
    next();
  },
  website: true
}));
app.set('stormpathRedirectUrl', '/');

console.log('before routes');
//ROUTES
app.use('/', require('./controllers/index')());
app.use('/add-pin', require('./controllers/add-pin')());
app.use('/user', require('./controllers/user')());
app.use(function (req, res, next) {
  res.status(404).render('404');
})

console.log('before launch');
//launch
app.on('stormpath.ready', function(){
app.listen(port, function(){
  console.log(`Pinterest Clone listening on port ${port}!`);
});
})
