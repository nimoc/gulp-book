'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var log = require('logalot');
var path = require('path');

/**
 * Install binary and check whether it works.
 * If the test fails, try to build it.
 */

var args = [
	'-copy', 'none',
	'-optimize',
	'-outfile', path.join(__dirname, '../test/fixtures/test-optimized.jpg'),
	path.join(__dirname, '../test/fixtures/test.jpg')
];

bin.run(args, function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('jpegtran pre-build test failed');
		log.info('compiling from source');

		var cfg = [
			'./configure --disable-shared',
			'--prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"'
		].join(' ');

		if (process.platform === 'darwin' && process.arch === 'x64') {
			cfg = 'CFLAGS="-m32" LDFLAGS="-m32" ' + cfg;
		}

		var builder = new BinBuild()
			.src('http://downloads.sourceforge.net/project/libjpeg-turbo/' + bin.v + '/libjpeg-turbo-' + bin.v + '.tar.gz')
			.cmd(cfg)
			.cmd('make install');

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('jpegtran built successfully');
		});
	}

	log.success('jpegtran pre-build test passed successfully');
});
