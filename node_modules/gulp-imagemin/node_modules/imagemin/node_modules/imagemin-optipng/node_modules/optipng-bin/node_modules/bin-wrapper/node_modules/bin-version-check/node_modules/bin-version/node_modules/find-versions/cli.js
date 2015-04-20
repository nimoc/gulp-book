#!/usr/bin/env node
'use strict';
var stdin = require('get-stdin');
var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');
var findVersions = require('./');
var input = argv._[0];

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Usage',
		'    find-versions <string> [--first] [--loose]',
		'    echo <string> | find-versions',
		'',
		'  Example',
		'    find-versions \'unicorns v1.2.3\'',
		'    1.2.3',
		'',
		'    curl --version | find-versions --first',
		'    7.30.0',
		'',
		'  Options',
		'    --first  Return the first match',
		'    --loose  Match non-semver versions like 1.88'
	].join('\n'));
}

function init(data) {
	var ret = findVersions(data, {loose: argv.loose});
	console.log(argv.first ? ret[0] : ret.join('\n'));
}

if (argv.help) {
	help();
	return;
}

if (argv.version) {
	console.log(pkg.version);
	return;
}

if (process.stdin.isTTY) {
	if (!input) {
		help();
		return;
	}

	init(input);
} else {
	stdin(init);
}
