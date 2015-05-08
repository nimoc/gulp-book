'use strict';

var BinWrapper = require('bin-wrapper');
var path = require('path');
var pkg = require('../package.json');

/**
 * Variables
 */

var BIN_VERSION = '1.3.0';
var BASE_URL = 'https://raw.github.com/imagemin/jpegtran-bin/v' + pkg.version + '/vendor/';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ progress: false })
	.src(BASE_URL + 'osx/jpegtran', 'darwin')
	.src(BASE_URL + 'linux/x86/jpegtran', 'linux', 'x86')
	.src(BASE_URL + 'linux/x64/jpegtran', 'linux', 'x64')
	.src(BASE_URL + 'freebsd/jpegtran', 'freebsd')
	.src(BASE_URL + 'sunos/x86/jpegtran', 'sunos', 'x86')
	.src(BASE_URL + 'sunos/x64/jpegtran', 'sunos', 'x64')
	.src(BASE_URL + 'win/x86/jpegtran.exe', 'win32', 'x86')
	.src(BASE_URL + 'win/x64/jpegtran.exe', 'win32', 'x64')
	.src(BASE_URL + 'win/x86/libjpeg-62.dll', 'win32', 'x86')
	.src(BASE_URL + 'win/x64/libjpeg-62.dll', 'win32', 'x64')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'jpegtran.exe' : 'jpegtran');

/**
 * Module exports
 */

module.exports = bin;
module.exports.v = BIN_VERSION;
