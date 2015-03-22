'use strict';

var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var compareSize = require('compare-size');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var test = require('ava');
var tmp = path.join(__dirname, 'tmp');

test('rebuild the gifsicle binaries', function (t) {
	t.plan(2);

	var version = require('../').version;
	var cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		'--prefix="' + tmp + '" --bindir="' + tmp + '"'
	].join(' ');

	var builder = new BinBuild()
		.src('http://www.lcdf.org/gifsicle/gifsicle-' + version + '.tar.gz')
		.cmd('autoreconf -ivf')
		.cmd(cfg)
		.cmd('make install');

	builder.run(function (err) {
		t.assert(!err, err);

		fs.exists(path.join(tmp, 'gifsicle'), function (exists) {
			t.assert(exists);
		});
	});
});

test('return path to binary and verify that it is working', function (t) {
	t.plan(2);

	binCheck(require('../').path, ['--version'], function (err, works) {
		t.assert(!err, err);
		t.assert(works);
	});
});

test('minify a GIF', function (t) {
	t.plan(3);

	var src = path.join(__dirname, 'fixtures/test.gif');
	var dest = path.join(tmp, 'test.gif');
	var args = [
		'-o', dest,
		src
	];

	execFile(require('../').path, args, function (err) {
		t.assert(!err, err);

		compareSize(src, dest, function (err, res) {
			t.assert(!err, err);
			t.assert(res[dest] < res[src]);
		});
	});
});
