'use strict';

var archiveType = require('archive-type');
var execSeries = require('exec-series');
var Decompress = require('decompress');
var Download = require('download');
var read = require('fs').readFile;
var rm = require('rimraf');
var tempfile = require('tempfile');
var urlRegex = require('url-regex');

/**
 * Initialize new `BinBuild`
 *
 * @param {Object} opts
 * @api public
 */

function BinBuild(opts) {
	if (!(this instanceof BinBuild)) {
		return new BinBuild(opts);
	}

	this.opts = opts || {};
	this.opts.strip = this.opts.strip <= 0 ? 0 : !this.opts.strip ? 1 : this.opts.strip;
	this._cmd = [];
	this._tmp = tempfile();
}

/**
 * Define the source archive to download
 *
 * @param {String} str
 * @api public
 */

BinBuild.prototype.src = function (str) {
	if (!arguments.length) {
		return this._src;
	}

	this._src = str;
	return this;
};

/**
 * Add a command to run
 *
 * @param {String} str
 * @api public
 */

BinBuild.prototype.cmd = function (str) {
	if (!arguments.length) {
		return this._cmd;
	}

	this._cmd.push(str);
	return this;
};

/**
 * Build
 *
 * @param {Function} cb
 * @api public
 */

BinBuild.prototype.run = function (cb) {
	cb = cb || function () {};
	var self = this;

	if (urlRegex().test(this.src())) {
		return this.get(function (err) {
			if (err) {
				cb(err);
				return;
			}

			self.exec(self._tmp, cb);
		});
	}

	read(this.src(), function (err, data) {
		if (err && err.code !== 'EISDIR') {
			cb(err);
			return;
		}

		if (archiveType(data)) {
			return self.decompress(function (err) {
				if (err) {
					cb(err);
					return;
				}

				self.exec(self._tmp, cb);
			});
		}

		self.exec(self.src(), cb);
	});
};

/**
 * Execute commands
 *
 * @param {String} cwd
 * @param {Function} cb
 * @api private
 */

BinBuild.prototype.exec = function (cwd, cb) {
	var self = this;

	execSeries(this.cmd(), { cwd: cwd }, function (err) {
		if (err) {
			err.message = [self.cmd().join(' && '), err.message].join('\n');
			cb(err);
			return;
		}

		rm(self._tmp, cb);
	});
};

/**
 * Decompress source
 *
 * @param {Function} cb
 * @api private
 */

BinBuild.prototype.decompress = function (cb) {
	var decompress = new Decompress({
		mode: '777',
		strip: this.opts.strip
	});

	decompress.src(this.src());
	decompress.dest(this._tmp);
	decompress.run(cb);
};

/**
 * Download source
 *
 * @param {Function} cb
 * @api private
 */

BinBuild.prototype.get = function (cb) {
	var download = new Download({
		strip: this.opts.strip,
		extract: true,
		mode: '777'
	});

	download.get(this.src());
	download.dest(this._tmp);
	download.run(cb);
};

/**
 * Module exports
 */

module.exports = BinBuild;
