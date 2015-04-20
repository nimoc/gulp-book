'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var log = require('imagemin-log');

/**
 * Install binary and check whether it works.
 * If the test fails, try to build it.
 */

bin.run(['--version'], function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('gifsicle pre-build test failed');
		log.info('compiling from source');

		var cfg = [
			'./configure --disable-gifview --disable-gifdiff',
			'--prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"'
		].join(' ');

		var builder = new BinBuild()
			.src('http://www.lcdf.org/gifsicle/gifsicle-' + bin.v + '.tar.gz')
			.cmd('autoreconf -ivf')
			.cmd(cfg)
			.cmd('make install');

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('gifsicle built successfully');
		});
	}

	log.success('gifsicle pre-build test passed successfully');
});
