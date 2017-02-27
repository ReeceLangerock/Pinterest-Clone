# express-stormpath-config

*The configuration parser / validator for express-stormpath.*

[![NPM Version](https://img.shields.io/npm/v/express-stormpath-config.svg?style=flat)](https://npmjs.org/package/express-stormpath-config)
[![NPM Downloads](http://img.shields.io/npm/dm/express-stormpath-config.svg?style=flat)](https://npmjs.org/package/express-stormpath-config)
[![Build Status](https://img.shields.io/travis/stormpath/express-stormpath-config.svg?style=flat)](https://travis-ci.org/stormpath/express-stormpath-config)
[![Coverage Status](https://coveralls.io/repos/stormpath/express-stormpath-config/badge.svg?branch=master)](https://coveralls.io/r/stormpath/express-stormpath-config?branch=master)

This library is responsible for parsing and validating all express-stormpath
configuration data.  It is an internal module used by express-stormpath, and is
not meant for general consumption.


## Installation

To install this library, just run:

```console
$ npm install express-stormpath-config
```


## Usage

This library is pretty simple.

Firstly, you'll need to initialize a new `Config` object using the library like
so:

```javascript
var Config = require('express-stormpath-config');

var config = new Config({
  application: {
    name: 'My Stormpath Application'
  }
});
```

Secondly, you need to call the `Config.validate(callback)` method to validate
the configuration data.  You can do this like so:

```javascript
config.validate(function(err) {
  if (err) {
    console.log('Uh-oh, something is invalid:', err);
  } else {
    console.log('Everything looks good to go!');
  }
});
```


## Resources

Below are some resources you might find useful!

- [express-stormpath Github repository](https://github.com/stormpath/stormpath-express)
- [express-stormpath documentation](http://docs.stormpath.com/nodejs/express/latest/)
- [Stormpath website](https://stormpath.com)


## Contributing

You can make your own contributions by forking this repository, making your
changes in a feature branch, and then issuing a pull request back to this
repository on the `master` branch.

Here's how you might do this if you wanted to contribute something:

```console
$ git clone https://github.com/stormpath/express-stormpath-config.git
$ cd express-stormpath-config
$ git checkout -b some-feature
$ # make changes
$ git commit -m "All done!"
$ # submit a pull request
```

We regularly maintain this repository, and are quick to review pull requests
and accept changes!

We <333 contributions!


## Copyright

Copyright &copy;2015 Stormpath, Inc. and contributors.

This project is open-source via the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
