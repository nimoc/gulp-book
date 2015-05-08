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
		log.warn('pngquant pre-build test failed');
		log.info('compiling from source');

		var libpng = process.platform === 'darwin' ? 'libpng' : 'libpng-dev';
		var builder = new BinBuild()
			.src('https://github.com/pornel/pngquant/archive/' + bin.v + '.tar.gz')
			.cmd('make install BINPREFIX="' + bin.dest() + '"');

		return builder.run(function (err) {
			if (err) {
				err.message = [
					'pngquant failed to build, make sure that',
					libpng + ' is installed'
				].join(' ');

				log.error(err.stack);
				return;
			}

			log.success('pngquant built successfully');
		});
	}

	log.success('pngquant pre-build test passed successfully');
});
