'use strict';

var objectAssign = require('object-assign');
var through = require('through2');

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new Error('Streaming is not supported'));
			return;
		}

		cb(null, objectAssign(file, opts));
	});
};
