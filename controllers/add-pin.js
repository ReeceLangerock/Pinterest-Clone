var express = require('express');
var router = express.Router();

var returnRouter = function() {
    // router setup
    var request = require('request');
    // var stormpath = require('express-stormpath');
    var bodyParser = require('body-parser');
    // mongoose models
    var pins = require('../models/pins.js')
    var users = require('../models/users.js');
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());


    router.post('/', function(req, res) {
        // get data from post
        var url = req.body.image_url;
        var title = req.body.image_title;
        var description = req.body.image_description;
        var userName = req.user.givenName
        //double check the user is logged
        if (req.user) {
            //get the user ID
            getUserData(req.user.href).then(function(response, error) {
                    var userID = response['_id'];
                    // save the pin data to a new pin
                    pins.schema.methods.newPin(url, title, description, userName, userID);
                })
                .then((response, error) => {
                    res.redirect('back');
                    res.end();
                }).catch(function(err) {
                    console.log(err);
                });

        } else {
            res.redirect('back');
            res.end();
        }
    });

    function getUserData(userHREF) {
        return new Promise(function(resolve, replace) {
            users.findOne({
                    'userHREF': userHREF
                },
                function(err, docs) {
                    if (err) {
                        console.log('error');
                        reject(err);
                    } else if (docs) {
                        resolve(docs)
                    } else {
                        resolve('NOT_FOUND');
                    }
                })
        });
    }

    return router;
}
module.exports = returnRouter;
