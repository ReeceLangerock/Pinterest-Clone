var users = require('../models/users.js');
var express = require('express');
var app = express();
module.exports = {

    handleLogin: function(account) {
        // check to see if the current user has been added, if not then create entry
        checkForExistingUser(account.href).then(function(response, error) {
            if (response == 'NOT_FOUND') {
                users.schema.methods.newUser(account.href, account.givenName);
            }
        })
    }
}

function checkForExistingUser(userHREF) {
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
