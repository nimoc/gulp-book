'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var log = require('logalot');

/**
 * Install binary and check whether it works.
 * If the test fails, try to build it.
 */

bin.run(['--version'], function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('optipng pre-build test failed');
		log.info('compiling from source');

		var cfg = [
			'./configure --with-system-zlib --prefix="' + bin.dest() + '"',
			'--bindir="' + bin.dest() + '"'
		].join(' ');

		var builder = new BinBuild()
			.src('http://downloads.sourceforge.net/project/optipng/OptiPNG/optipng-' + bin.v + '/optipng-' + bin.v + '.tar.gz')
			.cmd(cfg)
			.cmd('make install');

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('optipng built successfully');
		});
	}

	log.success('optipng pre-build test passed successfully');
});
