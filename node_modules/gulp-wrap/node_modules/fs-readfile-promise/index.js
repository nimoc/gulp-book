'use strict';

var fs = require('graceful-fs');

var ES6Promise = global.Promise || require('es6-promise').Promise;

module.exports = function fsReadFilePromise(filePath, options) {
  var resolve;
  var reject;

  fs.readFile(filePath, options, function(err, buf) {
    if (err) {
      reject(err);
      return;
    }
    resolve(buf);
  });

  return new ES6Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
};
