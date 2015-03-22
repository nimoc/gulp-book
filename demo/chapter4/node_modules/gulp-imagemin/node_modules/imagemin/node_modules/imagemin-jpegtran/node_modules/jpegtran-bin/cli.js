#!/usr/bin/env node
'use strict';

var bin = require('./').path;
var input = process.argv.slice(2);
var spawn = require('child_process').spawn;

spawn(bin, input, { stdio: 'inherit' })
	.on('exit', process.exit);
