'use strict';

var deepExtend = require('deep-extend');

/**
 * Creates a new Config object to handle the initialization, validation, and
 * parsing of express-stormpath configuration data.
 *
 * @class
 */
function Config(data) {
  deepExtend(this, data);
}

/**
 * @callback validateCallback
 * @param {Error} err - The error (if there is one).
 */

/**
 * Validate this configuration data.
 *
 * @param {validateCallback} callback - The callback that handles the response.
 */
Config.prototype.validate = function(callback) {
  if (!callback) {
    throw new Error('Config.validate() requires a callback.');
  }

  if (!this.client) {
    callback(new Error('No client config found. This is a required configuration option.'));
  } else if (!this.client.apiKey) {
    callback(new Error('No client.apiKey config found. This is a required configuration option.'));
  } else if (!((this.client.apiKey.id && this.client.apiKey.secret) || this.client.apiKey.file)) {
    callback(new Error('Invalid client.apiKey config found. You must specify either client.apiKey.id + client.apiKey.secret, or client.apiKey.file.'));
  } else if (!this.application) {
    callback(new Error('No application config found. This is a required configuration option.'));
  } else if (!(this.application.href || this.application.name || this.application.description)) {
    callback(new Error('Invalid application config found. You must specify either application.href, application.name, or application.description.'));
  } else {
    callback();
  }
};

module.exports = Config;
