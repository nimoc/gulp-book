'use strict';

var BinWrapper = require('bin-wrapper');
var path = require('path');
var pkg = require('../package.json');

/**
 * Variables
 */

var BIN_VERSION = '2.3.0';
var BASE_URL = 'https://raw.github.com/imagemin/pngquant-bin/v' + pkg.version + '/vendor/';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ global: true, progress: false })
	.src(BASE_URL + 'osx/pngquant', 'darwin')
	.src(BASE_URL + 'linux/x86/pngquant', 'linux', 'x86')
	.src(BASE_URL + 'linux/x64/pngquant', 'linux', 'x64')
	.src(BASE_URL + 'win/pngquant.exe', 'win32')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'pngquant.exe' : 'pngquant');

/**
 * Module exports
 */

module.exports = bin;
module.exports.v = BIN_VERSION;
