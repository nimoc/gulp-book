'use strict';
var execFile = require('child_process').execFile;
var findVersions = require('find-versions');

module.exports = function (bin, cb) {
	execFile(bin, ['--version'], function (err, stdout, stderr) {
		if (err) {
			if (err.code === 'ENOENT') {
				err.message = 'Couldn\'t find the `' + bin + '` binary. Make sure it\'s installed and in your $PATH';
			}

			return cb(err);
		}

		cb(null, findVersions(stdout.trim() || stderr.trim(), {loose: true})[0]);
	});
};
