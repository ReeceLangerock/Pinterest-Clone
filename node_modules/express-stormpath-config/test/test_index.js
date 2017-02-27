'use strict';

var assert = require('assert');

var getFunctionName = require('get-function-name');

describe('index', function() {
  it('should not throw an error', function() {
    assert.doesNotThrow(function() {
      require('../index');
    }, Error);
  });

  it('should export the Config object', function() {
    assert.equal(getFunctionName(require('../index')), 'Config');
  });
});
