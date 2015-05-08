'use strict';

var figures = require('figures');
var Squeak = require('squeak');

/**
 * Initialize `log`
 */

var log = new Squeak({separator: ' '});

/**
 * Add types
 */

log.type('info', {
	color: 'cyan',
	prefix: figures.info
});

log.type('warn', {
	color: 'yellow',
	prefix: figures.warning
});

log.type('success', {
	color: 'green',
	prefix: figures.tick
}, function () {
	log.end();
});

log.type('error', {
	color: 'red',
	prefix: figures.cross
}, function () {
	log.end();
});

/**
 * Module exports
 */

module.exports = log;
