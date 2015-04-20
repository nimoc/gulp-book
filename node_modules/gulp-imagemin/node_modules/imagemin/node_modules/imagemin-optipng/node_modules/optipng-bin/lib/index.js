'use strict';

var BinWrapper = require('bin-wrapper');
var path = require('path');
var pkg = require('../package.json');

/**
 * Variables
 */

var BIN_VERSION = '0.7.5';
var BASE_URL = 'https://raw.github.com/imagemin/optipng-bin/v' + pkg.version + '/vendor/';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ global: true, progress: false })
	.src(BASE_URL + 'osx/optipng', 'darwin')
	.src(BASE_URL + 'linux/x86/optipng', 'linux', 'x86')
	.src(BASE_URL + 'linux/x64/optipng', 'linux', 'x64')
	.src(BASE_URL + 'freebsd/optipng', 'freebsd')
	.src(BASE_URL + 'sunos/x86/optipng', 'sunos', 'x86')
	.src(BASE_URL + 'sunos/x64/optipng', 'sunos', 'x64')
	.src(BASE_URL + 'win/optipng.exe', 'win32')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'optipng.exe' : 'optipng')
	.version('>=' + BIN_VERSION);

/**
 * Module exports
 */

module.exports = bin;
module.exports.v = BIN_VERSION;
