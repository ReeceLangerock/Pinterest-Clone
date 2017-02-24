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

    router.get('/', stormpath.getUser, function(req, res) {
        if (req.user) {
            res.render('index', {
                    authenticatedUser: true
                });
            }
        else {
          res.render('index', {
                  authenticatedUser: false
              });
        }

    });


    return router;
}
module.exports = returnRouter;
