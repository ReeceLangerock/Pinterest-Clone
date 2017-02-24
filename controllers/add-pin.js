var express = require('express');
var router = express.Router();

var returnRouter = function() {
    var request = require('request');
    var stormpath = require('express-stormpath');
    var bodyParser = require('body-parser');
    var pins = require('../models/pins.js')
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());

    router.post('/', stormpath.getUser, function(req, res){      
      var response = pins.schema.methods.newPin(req.body.image_url, req.body.image_title, req.body.image_description, req.user.givenName, req.user.href);
      console.log(response);
      res.redirect('/');
      res.end();
    })


    return router;
}
module.exports = returnRouter;
