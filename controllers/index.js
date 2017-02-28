var express = require('express');
var router = express.Router();

var returnRouter = function() {
    //router setup
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
        //get 75 most recent pins
        getPins().then(function(response, error) {
            var pins = response;
            if (req.user) {
                // if user is signed in, get their userID and pass it to page
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

    //when user sends post to add or remove a pin to their board
    router.post('/', stormpath.getUser, function(req, res) {
        var pinID = req.body.id;
        // get the id of the user trying to toggle a pin
        getUserID(req.user.href).then(function(response, error) {
            //toggle pin or unpin
            togglePin(pinID, response).then(function(response, error) {
                if (response == "PIN_OWNER") {
                    res.end();
                } else {
                    res.redirect('back');
                    res.end();
                }
            });
        })
    });

    // get pins
    function getPins() {
        return new Promise(function(resolve, replace) {
            pins.find({}).limit(75).sort({
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
            // find the pin being toggle if the current user has toggled it
            pins.findOne({
                    _id: pinID,
                    pinnedBy: userID
                },
                function(err, docs) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else if (docs) {
                        // if found, the user has added the pin, and is not the owner
                        if (userID != docs.pinOwnerID) {
                            // find that pin and remove(pull) the users pin
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
                            // find the user and remove(pull) the pin
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
                        }
                        //otherwise the user is the pin owner so do nothing.
                        else {
                            resolve("PIN_OWNER");
                        }
                        //otherwise, the user hasn't added the pin, and can't be the owner
                    } else {
                        // find the pin and add the users pin/like
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
                        // find the user and add the pin to their board
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

    //get the id of the user logged in
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
