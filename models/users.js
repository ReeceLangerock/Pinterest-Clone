const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

var userSchema = mongoose.Schema({
    '_id': String,
    'userHREF': String,
    'userName': String,
    'pinnedPins': [String]
});

userSchema.methods.newUser = function(href, name){

  var newUser = new userModel({
    '_id':  new ObjectID(),
    'userHREF': href,
    'userName': name,
    'pinnedPins': []
  });

  newUser.save(function(err){
    if(err){
      throw err;
    }
    else{
      return 'success';
    }
  })
}

var userModel = mongoose.model('user', userSchema, 'users');
module.exports = userModel;
