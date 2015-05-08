#!/usr/bin/env node
'use strict';

var fs = require('fs');
var meow = require('meow');
var getStdin = require('get-stdin');
var Decompress = require('./');

var cli = meow({
	help: [
		'Usage',
		'  decompress <file> [directory]',
		'  cat <file> | decompress [directory]',
		'',
		'Example',
		'  decompress --strip 1 file.zip out',
		'  cat file.zip | decompress out',
		'',
		'Options',
		'  -m, --mode     Set mode on the extracted files',
		'  -s, --strip    Equivalent to --strip-components for tar'
	].join('\n')
}, {
	string: [
		'mode',
		'strip'
	],
	alias: {
		m: 'mode',
		s: 'strip'
	}
});

function isFile(path) {
	if (/^[^\s]+\.\w*$/g.test(path)) {
		return true;
	}

	try {
		return fs.statSync(path).isFile();
	} catch (e) {
		return false;
	}
}

function run(src, dest, opts) {
	var decompress = new Decompress(opts)
		.src(src)
		.dest(dest)
		.use(Decompress.tar(opts))
		.use(Decompress.tarbz2(opts))
		.use(Decompress.targz(opts))
		.use(Decompress.zip(opts));

	decompress.run(function (err) {
		if (err) {
			console.error(err.message);
			process.exit(1);
		}
	});
}

if (process.stdin.isTTY) {
	var src = cli.input;
	var dest = process.cwd();

	if (!src.length) {
		console.error([
			'Specify a file to decompress',
			'',
			'Example',
			'  decompress --strip 1 file.zip out',
			'  cat file.zip | decompress out'
		].join('\n'));

		process.exit(1);
	}

	if (!isFile(src[src.length - 1])) {
		dest = src[src.length - 1];
		src.pop();
	}

	run(src, dest, cli.flags);
} else {
	var dest = cli.input;

	if (dest.length && !isFile(dest[dest.length - 1])) {
		dest = dest[dest.length - 1];
	} else {
		dest = process.cwd();
	}

	getStdin.buffer(function (buf) {
		run(buf, dest, cli.flags);
	});
}
