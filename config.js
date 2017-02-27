var config = (function() {
    var mongoUser = '';
    var mongoPass = '';
    var STORMPATH_CLIENT_APIKEY_ID= '';
    var STORMPATH_CLIENT_APIKEY_SECRET= '';
    var STORMPATH_APPLICATION_HREF= '';

    return {
        getMongoUser: function() {
            return mongoUser;
        },
        getMongoPass: function() {
            return mongoPass;
        },
        getSTORMPATH_CLIENT_APIKEY_ID: function() {
            return mongoUser;
        },
        getSTORMPATH_CLIENT_APIKEY_SECRET: function() {
            return STORMPATH_CLIENT_APIKEY_SECRET;
        },
        getSTORMPATH_APPLICATION_HREF: function() {
            return mongoUser;
        },
    };

})();

module.exports = config;
