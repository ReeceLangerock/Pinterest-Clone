'use strict';

var assert = require('assert');

var async = require('async');

var Config = require('../index');

describe('Config', function() {
  describe('#()', function() {
    it('should accept no input', function() {
      assert.doesNotThrow(function() {
        new Config();
      }, Error);
    });

    it('should accept json input', function() {
      assert.doesNotThrow(function() {
        new Config({ hi: 'there' });
      }, Error);
    });

    it('should bind all passed values to itself', function() {
      var config = new Config({ hi: 'there', yo: 'momma', test: { nested: 'stuff' } });
      assert.equal(config.hi, 'there');
      assert.equal(config.yo, 'momma');
      assert.deepEqual(config.test, { nested: 'stuff' });
    });

    it('should bind additional properties to itself', function() {
      var config = new Config({ hi: 'there' });
      config.yo = 'momma';
      assert.equal(config.hi, 'there');
      assert.equal(config.yo, 'momma');
    });
  });

  describe('#validate()', function() {
    it('should require a callback to be passed', function() {
      assert.throws(function() {
        new Config().validate();
      }, Error);
    });

    it('should return an error for an empty config', function(done) {
      var config = new Config();
      config.validate(function(err) {
        assert(err);
        done();
      });
    });

    it('should return an error for any config that does not include an application key', function(done) {
      var config = new Config({ hi: 'there' });
      config.validate(function(err) {
        assert(err);
        done();
      });
    });

    it('should return an error for any config that does not include either application.href, application.name, or application.description', function(done) {
      var config = new Config({ application: { hi: 'there' } });
      config.validate(function(err) {
        assert(err);
        done();
      });
    });

    it('should return no error for any valid config', function(done) {
      var config = new Config({
        application: { name: 'test' },
        client: { apiKey: { file: 'woo' } }
      });

      config.validate(function(err) {
        assert.ifError(err);
        done();
      });
    });

    it('should return an error for any config that does not include a client key', function(done) {
      var config = new Config({ what: 'up' });
      config.validate(function(err) {
        assert(err);
        done();
      });
    });

    it('should return an error for any config that does not include a client.apiKey key', function(done) {
      var config = new Config({ client: { what: 'up' } });
      config.validate(function(err) {
        assert(err);
        done();
      });
    });

    it('should return an error for any config that does not include either client.apiKey.id + client.apiKey.secret, or client.apiKey.file', function(done) {
      async.parallel([
        function(next) {
          var config = new Config({ application: { name: 'hi' }, client: { apiKey: { id: 'hi' } } });
          config.validate(function(err) {
            assert(err);
            next();
          });
        },
        function(next) {
          var config = new Config({ application: { name: 'hi' }, client: { apiKey: { id: 'hi', secret: 'woot' } } });
          config.validate(function(err) {
            assert.ifError(err);
            next();
          });
        },
        function(next) {
          var config = new Config({ application: { name: 'hi' }, client: { apiKey: { file: 'hi' } } });
          config.validate(function(err) {
            assert.ifError(err);
            next();
          });
        }
      ], function() {
        done();
      });
    });
  });
});
