'use strict';

var File = require('vinyl');
var fileType = require('file-type');
var through = require('through2');
var uuid = require('uuid');

module.exports.file = function (buf, name) {
	var ext = fileType(buf) ? fileType(buf).ext : null;

	return new File({
		contents: buf,
		path: (name  || uuid.v4()) + (ext || '')
	});
};

module.exports.stream = function (buf, name) {
	var stream = through.obj();
	stream.end(module.exports.file(buf, name));
	return stream;
};
