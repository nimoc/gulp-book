#!/usr/bin/env node
'use strict';

var executable = require('./');
var meow = require('meow');

/**
 * Initialize CLI
 */

var cli = meow({
	help: [
		'Usage',
		'  executable <file>',
		'',
		'Example',
		'  executable optipng'
	].join('\n')
});

/**
 * Check for arguments
 */

if (!cli.input.length) {
	console.error([
		'Specify a filename',
		'',
		'Example',
		'  executable optipng'
	].join('\n'));

	process.exit(1);
}

/**
 * Run
 */

executable(cli.input[0], function (err, exec) {
	if (err) {
		console.error(err.message);
		process.exit(1);
	}

	console.log(exec ? 'true' : 'false');
	process.exit(exec ? 0 : 1);
});
