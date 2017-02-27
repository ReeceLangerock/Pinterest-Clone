var express = require('express');
var router = express.Router();

var returnRouter = function() {
    var request = require('request');
    var stormpath = require('express-stormpath');
    var bodyParser = require('body-parser');
    var pins = require('../models/pins.js')
    var users = require('../models/users.js');
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());

    router.get('/:id', stormpath.getUser, function(req, res) {

        getPins(req.params.id).then(function(response, error) {
          var pins = response;
                if (req.user) {
                  getUserID(req.user.href).then(function(response, error) {
                    res.render('userPage', {
                        pins: pins,
                        authenticatedUser: true,
                        userID: response
                    });
                  });

                } else {
                    res.render('userPage', {
                        pins: pins,
                        authenticatedUser: false,
                        userID: null
                    });
                }
            }).catch((err) => {
                if (err) {
                    throw err;
                }
            })
    });

    router.post('/remove-pin', function(req, res) {

        removePin(req.body.id).then(function(response, error) {
            if (response == 'REMOVED') {
                res.send('REMOVED');
                res.end();
            }
        })
    })

    function getUserID(href) {
        return new Promise(function(resolve, replace) {
            users.findOne({
                    'userHREF': href
                },
                function(err, docs) {
                    if (err) {
                        console.log('error');
                        reject(err);
                    } else if (docs) {
                        resolve(docs['_id'])
                    } else {
                        resolve('NOT_FOUND');
                    }
                })
        });
    }

    function getPins(id) {
        return new Promise(function(resolve, replace) {
            pins.find({
                'pinnedBy': id

            }).exec(function(err, obj) {
                if (err) {
                    return reject();
                } else if (obj) {
                    return resolve(obj);
                }
            })
        })
    }

    function removePin(id) {
        return new Promise(function(resolve, replace) {
            pins.findOneAndRemove({
                '_id': id
            }).exec(function(err, obj) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve('REMOVED');
                }
            })
        })
    }


    return router;
}
module.exports = returnRouter;
