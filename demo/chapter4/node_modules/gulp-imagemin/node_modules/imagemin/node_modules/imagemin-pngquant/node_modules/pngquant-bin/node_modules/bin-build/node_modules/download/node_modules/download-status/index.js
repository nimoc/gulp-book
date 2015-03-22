'use strict';

var assign = require('object-assign');
var chalk = require('chalk');
var lpad = require('lpad-align');
var ProgressBar = require('progress');

/**
 * Progress bar download plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	return function (res, url, cb) {
		opts = opts || {};
		opts.stream = opts.stream || process.stderr;
		opts.indent = opts.indent || 2;

		if (res.headers['content-length']) {
			var words = [
				'fetch',
				'progress'
			];

			var fetch = chalk.cyan(lpad('fetch', words, opts.indent));
			var progress = chalk.cyan(lpad('progress', words, opts.indent));
			var str = progress + ' : [:bar] :percent :etas';

			var bar = new ProgressBar(str, assign({
				complete: '=',
				incomplete: ' ',
				width: 20,
				total: parseInt(res.headers['content-length'], 10)
			}, opts));

			opts.stream.write(fetch + ' : ' + url + '\n');

			res.on('data', function (data) {
				bar.tick(data.length);
			});

			res.on('end', function () {
				opts.stream.write('\n');
				cb();
			});
		}
	};
};
