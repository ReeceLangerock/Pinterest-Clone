var express = require('express');
var router = express.Router();

var returnRouter = function() {
    var request = require('request');
    var stormpath = require('express-stormpath');
    var bodyParser = require('body-parser');
    var pins = require('../models/pins.js')
    var users = require('../models/users.js')
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());

    router.get('/', stormpath.getUser, function(req, res) {

        getPins().then(function(response, error) {
            var pins = response;
            if (req.user) {
                getUserID(req.user.href).then(function(response, error) {

                    res.render('index', {
                        pins: pins,
                        authenticatedUser: true,
                        userID: response
                    });
                })
            } else {
                res.render('index', {
                    pins: response,
                    authenticatedUser: false,
                    userID: false
                });
            }
        }).catch((err) => {
            if (err) {
                throw err;
            }
        })
    });

    router.post('/', stormpath.getUser, function(req, res) {
        var pinID = req.body.id;
        getUserID(req.user.href).then(function(response, error) {

            togglePin(pinID, response).then(function(response, error){
              if(response == "PIN_OWNER"){
                res.end();
              } else{
                res.redirect('back');
                res.end();
              }
            });
        })
    });

    function getPins() {
        return new Promise(function(resolve, replace) {
            pins.find({}).limit(50).sort({
                'creationDate': -1 //sort by creation date
            }).exec(function(err, obj) {
                if (err) {
                    return reject();
                } else if (obj) {
                    return resolve(obj);
                }
            })
        })
    }

    function togglePin(pinID, userID) {
        return new Promise(function(resolve, reject) {
            pins.findOne({
                    _id: pinID,
                    pinnedBy: userID
                },
                function(err, docs) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else if (docs) {
                        //remove
                        console.log(userID);
                        console.log(docs.pinOwnerID);
                        if (userID != docs.pinOwnerID) {
                        console.log("if pull")
                        pins.findOneAndUpdate({
                            _id: pinID
                        }, {
                            $pull: {
                                pinnedBy: userID
                            }
                        }, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });

                            users.findOneAndUpdate({
                                id: userID
                            }, {
                                $pull: {
                                    pinnedPins: pinID
                                }
                            }, function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            resolve("REMOVED");
                        } else {
                          console.log('resolve else');
                          resolve("PIN_OWNER");
                        }

                    } else {
                      console.log("push")
                        pins.findOneAndUpdate({
                            _id: pinID
                        }, {
                            $push: {
                                pinnedBy: userID
                            }
                        }, {
                            safe: true,
                            upsert: true,
                            new: true

                        }, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        })

                        users.findOneAndUpdate({
                            id: userID
                        }, {
                            $push: {
                                pinnedPins: pinID
                            }
                        }, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        resolve('NOT_FOUND');
                    }
                })
        });

    }

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


    return router;
}
module.exports = returnRouter;
