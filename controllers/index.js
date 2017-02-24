var express = require('express');
var router = express.Router();

var returnRouter = function() {
  var request = require('request');
  var stormpath = require('express-stormpath');
  var bodyParser = require('body-parser');
  router.use(bodyParser.urlencoded({
      extended: true
  }));
  router.use(bodyParser.json());

  router.get('/', stormpath.getUser, function(req, res){
    res.render('test');
    console.log(req.user.givenName);

  });

  router.get('/test', function(req, res){

    console.log(req);



    res.render('test');
  });



  return router;
}
module.exports = returnRouter;
