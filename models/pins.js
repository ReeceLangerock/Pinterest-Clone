const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var userModel = require('../models/users');

var pinSchema = mongoose.Schema({
    '_id': String,
    'pinOwner': String,
    'pinOwnerID': String,
    'pinUrl': String,
    'pinTitle': String,
    'pinDescription': String,
    'creationDate': Date,
    // pinLikes will be array of userID that have liked a image, get total number by .length
    'pinnedBy': [String]

});

pinSchema.methods.newPin = function(url, title, description, owner, ownerID) {
    var tempID = new ObjectID();
    var newPin = new pinModel({
        '_id': tempID,
        'pinOwner': owner,
        'pinOwnerID': ownerID,
        'pinUrl': url,
        'pinTitle': title,
        'pinDescription': description,
        'creationDate': new Date(),
        'pinnedBy': [ownerID]
    })

    newPin.save(function(err) {
        if (err) {
            throw err;
        } else {
            return tempID;
        }
    }).then(function(){
      userModel.findOneAndUpdate({ // find user doc
          '_id': ownerID
      }, {
          $push: {
              'pinnedPins': tempID //add newly create poll to the user doc
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
