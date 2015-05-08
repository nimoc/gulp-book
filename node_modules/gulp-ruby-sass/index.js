'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var dargs = require('dargs');
var slash = require('slash');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var spawn = require('win-spawn');
var gutil = require('gulp-util');
var assign = require('object-assign');
var convert = require('convert-source-map');
var eachAsync = require('each-async');
var osTempDir = require('os').tmpdir();

var File = require('vinyl');
var Readable = require('stream').Readable;

// remove temp directory and line breaks for more Sass-like logging
function formatMsg (msg, tempDir) {
	msg = msg.replace(new RegExp((tempDir) + '/?', 'g'), '');
	msg = msg.trim();
	return msg;
}

// convenience function to create a gulp error
function newErr (err, opts) {
	return new gutil.PluginError('gulp-ruby-sass', err, opts);
}

// for now, source is only a single directory or a single file
module.exports = function (source, options) {
	var stream = new Readable({objectMode: true});
	var cwd = process.cwd();
	var defaults = {
		container: 'gulp-ruby-sass',
		verbose: false,
		sourcemap: false
	};
	var command;
	var args;
	var base;
	var destDir;
	var destFile;
	var compileMappings;

	// redundant but necessary
	stream._read = function () {};

	options = assign(defaults, options);

	// sourcemap can only be true or false; warn those trying to pass a Sass string option
	if (typeof options.sourcemap !== 'boolean') {
		throw newErr('The sourcemap option must be true or false. See the readme for instructions on using Sass sourcemaps with gulp.');
	}

	// reassign options.sourcemap boolean to one of our two acceptable Sass arguments
	options.sourcemap = options.sourcemap === true ? 'file' : 'none';

	// sass options need unix style slashes
	destDir = slash(path.join(osTempDir, options.container));

	// directory source
	if (path.extname(source) === '') {
		base = path.join(cwd, source);
		compileMappings = source + ':' + destDir;
		options.update = true;
	}
	// single file source
	else {
		base = path.join(cwd, path.dirname(source));
		destFile = slash(path.join(destDir, path.basename(source, path.extname(source)) + '.css')); // sass options need unix style slashes
		compileMappings = [ source, destFile ];
		mkdirp(destDir);
	}
	// TODO: implement glob file source

	args = dargs(options, [
		'bundleExec',
		'watch',
		'poll',
		'container',
		'verbose'
	]).concat(compileMappings);

	if (options.bundleExec) {
		command = 'bundle';
		args.unshift('exec', 'sass');
	} else {
		command = 'sass';
	}

	// error handling
	var matchNoSass = /execvp\(\): No such file or directory|spawn ENOENT/;
	var msgNoSass = 'Missing the Sass executable. Please install and make available on your PATH.';
	var matchSassErr = /error\s/;
	var matchNoBundler = /ERROR: Gem bundler is not installed/;
	var matchNoGemfile = /Could not locate Gemfile/;
	var matchNoBundledSass = /bundler: command not found: sass|Could not find gem/;

	// plugin logging
	if (options.verbose) {
		gutil.log('gulp-ruby-sass', 'Running command:', command, args.join(' '));
	}

	var sass = spawn(command, args);

	sass.stdout.setEncoding('utf8');
	sass.stderr.setEncoding('utf8');

	// sass stdout: successful compile messages
	// bundler stdout: bundler not installed, no gemfile, correct version of sass not installed
	sass.stdout.on('data', function (data) {
		var msg = formatMsg(data, destDir);
		var isError = [
			matchSassErr,
			matchNoBundler,
			matchNoGemfile,
			matchNoBundledSass
		].some(function (match) {
			return match.test(msg);
		});

		if (isError) {
			stream.emit('error', newErr(msg));
		} else {
			gutil.log('gulp-ruby-sass stdout:', msg);
		}
	});

	// sass stderr: warnings, debug statements
	// bundler stderr: no version of sass installed
	// spawn stderr: no sass executable
	sass.stderr.on('data', function (data) {
		var msg = formatMsg(data, destDir);

		if (matchNoBundledSass.test(msg)) {
			stream.emit('error', newErr(msg));
		}
		else if (!matchNoSass.test(msg)) {
			gutil.log('gulp-ruby-sass stderr:', msg);
		}
	});

	// spawn error: no sass executable
	sass.on('error', function (err) {
		if (matchNoSass.test(err)) {
			err.message = msgNoSass;
		}
		stream.emit('error', newErr(err));
	});

	sass.on('close', function (code) {
		glob(path.join(destDir, '**', '*'), function (err, files) {
			if (err) {
				stream.emit('error', new gutil.PluginError('gulp-ruby-sass', err));
			}

			eachAsync(files, function (file, i, next) {
				if (fs.statSync(file).isDirectory() || path.extname(file) === '.map') {
					next();
					return;
				}

				fs.readFile(file, function (err, data) {
					if (err) {
						stream.emit('error', new gutil.PluginError('gulp-ruby-sass', err));
						next();
						return;
					}

					// rewrite file paths so gulp thinks the files came from cwd, not the
					// OS temp directory
					var vinylFile = new File({
						cwd: cwd,
						base: base,
						path: file.replace(destDir, base)
					});
					var sourcemap;

					// if we are managing sourcemaps and the sourcemap exists
					if (options.sourcemap === 'file' && fs.existsSync(file + '.map')) {
						// remove Sass sourcemap comment; gulp-sourcemaps will add it back in
						data = new Buffer( convert.removeMapFileComments(data.toString()) );
						sourcemap = JSON.parse(fs.readFileSync(file + '.map', 'utf8'));

						// create relative paths for sources
						sourcemap.sources = sourcemap.sources.map(function (sourcemapSource) {
							var absoluteSourcePath = decodeURI(path.resolve('/', sourcemapSource.replace('file:///', '')))
							return path.relative(base, absoluteSourcePath);
						});

						vinylFile.sourceMap = sourcemap;
					}

					vinylFile.contents = data;
					stream.push(vinylFile);
					next();
					return;
				});
			}, function () {
				// cleanup previously generated files for next run
				// TODO: This kills caching. Keeping will push files through that are not in
				// the current gulp.src. We need to decide whether to use a Sass style caching
				// strategy, or a gulp style strategy, and what each would look like.
				rimraf(destDir, function () {
					stream.push(null);
				});
			});
		});
	});

	return stream;
};
