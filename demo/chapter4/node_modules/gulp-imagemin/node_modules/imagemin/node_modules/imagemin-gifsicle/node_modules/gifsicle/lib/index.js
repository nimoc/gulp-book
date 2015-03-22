'use strict';

var BinWrapper = require('bin-wrapper');
var path = require('path');
var pkg = require('../package.json');

/**
 * Variables
 */

var BIN_VERSION = '1.86';
var BASE_URL = 'https://raw.github.com/imagemin/gifsicle-bin/v' + pkg.version + '/vendor/';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ global: true, progress: false })
	.src(BASE_URL + 'osx/gifsicle', 'darwin')
	.src(BASE_URL + 'linux/x86/gifsicle', 'linux', 'x86')
	.src(BASE_URL + 'linux/x64/gifsicle', 'linux', 'x64')
	.src(BASE_URL + 'freebsd/x86/gifsicle', 'freebsd', 'x86')
	.src(BASE_URL + 'freebsd/x64/gifsicle', 'freebsd', 'x64')
	.src(BASE_URL + 'win/x86/gifsicle.exe', 'win32', 'x86')
	.src(BASE_URL + 'win/x64/gifsicle.exe', 'win32', 'x64')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'gifsicle.exe' : 'gifsicle');

/**
 * Module exports
 */

module.exports = bin;
module.exports.v = BIN_VERSION;
