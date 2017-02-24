const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var userModel = require('../models/user');

var pinSchema = mongoose.Schema({
    '_id': String,
    'pinOwner': String,
    'pinUrl': String,
    'pinTitle': String,
    'pinDescription': String,
    // pinLikes will be array of userID that have liked a image, get total number by .length
    'pinLikes': [String]

});

pinSchema.methods.newPin = function(url, title, description, owner, ownerHREF) {
    var tempID = new ObjectID();
    var newPin = new pinModel({
        '_id': tempID,
        'pinOwner': owner,
        'pinUrl': url,
        'pinTitle': title,
        'pinDescription': description,
        'pinLikes': []
    })

    newPin.save(function(err) {
        if (err) {
            throw err;
        } else {
            return tempID;
        }
    }).then(function(){
      userModel.findOneAndUpdate({ // find user doc
          userHREF: ownerHREF
      }, {
          $push: {
              'pins': tempID //add newly create poll to the user doc
          }
      }, {
          safe: true,
          upsert: true,
          new: true
      }, function(err, doc) {

      })

    })
}

var pinModel = mongoose.model('pin', pinSchema, 'pins');
module.exports = pinModel;
