'use strict';

var fs = require('fs');

/**
 * Check if file is executable
 *
 * @param {String} mode
 * @param {String} gid
 * @param {String} uid
 * @api private
 */

function isExe(mode, gid, uid) {
	var ret;

	if (process.platform === 'win32') {
		ret = true;
	} else {
		ret = (mode & parseInt('0001', 8)) ||
			  (mode & parseInt('0010', 8)) && process.getgid && gid === process.getgid() ||
			  (mode & parseInt('0100', 8)) && process.getuid && uid === process.getuid();
	}

	return ret;
}

/**
 * Async
 *
 * @param {String} name
 * @param {Function} cb
 * @api public
 */

module.exports = function (name, cb) {
	fs.stat(name, function (err, stats) {
		if (err) {
			cb(err);
			return;
		}

		if (stats && stats.isFile() && isExe(stats.mode, stats.gid, stats.uid)) {
			cb(null, true);
			return;
		}

		cb(null, false);
	});
};

/**
 * Sync
 *
 * @param {String} name
 * @api public
 */

module.exports.sync = function (name) {
	var file = fs.statSync(name);

	if (file && file.isFile() && isExe(file.mode, file.gid, file.uid)) {
		return true;
	}

	return false;
};
