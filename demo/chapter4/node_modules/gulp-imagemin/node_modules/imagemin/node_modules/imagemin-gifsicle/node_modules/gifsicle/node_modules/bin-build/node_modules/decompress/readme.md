# decompress [![Build Status](http://img.shields.io/travis/kevva/decompress.svg?style=flat)](https://travis-ci.org/kevva/decompress)

> Extracting archives made easy

## Install

```sh
$ npm install --save decompress
```

## Usage

```js
var Decompress = require('decompress');

var decompress = new Decompress({mode: '755'})
	.src('foo.zip')
	.dest('destFolder')
	.use(Decompress.zip({strip: 1}));

decompress.run(function (err) {
	if (err) {
		throw err;
	}

	console.log('Archive extracted successfully!');
});
```

## API

### new Decompress(opts)

Creates a new `Decompress` instance.

#### opts.mode

Type: `String`

Set mode on the extracted files, i.e `{ mode: '755' }`.

#### opts.strip

Type: `Number`

Equivalent to `--strip-components` for tar.

### .src(files)

#### files

Type: `Array|Buffer|String`

Set the files to be extracted.

### .dest(path)

#### path

Type: `String`

Set the destination to where your file will be extracted to.

### .use(plugin)

#### plugin

Type: `Function`

Add a `plugin` to the middleware stack.

### .run(cb)

Extract your file with the given settings.

#### cb(err, files)

Type: `Function`

The callback will return an array of vinyl files in `files`.

## Plugins

The following [plugins](https://www.npmjs.org/browse/keyword/decompressplugin) are bundled with decompress:

* [tar](#tar) — Extract TAR files.
* [tar.bz2](#tarbz2) — Extract TAR.BZ files.
* [tar.gz](#targz) — Extract TAR.GZ files.
* [zip](#zip) — Extract ZIP files.

### .tar()

Extract TAR files.

```js
var Decompress = require('decompress');

var decompress = new Decompress()
	.use(Decompress.tar({strip: 1}));
```

### .tarbz2()

Extract TAR.BZ files.

```js
var Decompress = require('decompress');

var decompress = new Decompress()
	.use(Decompress.tarbz2({strip: 1}));
```

### .targz()

Extract TAR.GZ files.

```js
var Decompress = require('decompress');

var decompress = new Decompress()
	.use(Decompress.targz({strip: 1}));
```

### .zip()

Extract ZIP files.

```js
var Decompress = require('decompress');

var decompress = new Decompress()
	.use(Decompress.zip({strip: 1}));
```

## CLI

```sh
$ npm install --global decompress
```

```sh
$ decompress --help

Usage
  $ decompress <file> [directory]
  $ cat <file> | decompress [directory]

Example
  $ decompress --strip 1 file.zip out
  $ cat file.zip | decompress out

Options
  -m, --mode     Set mode on the extracted files
  -s, --strip    Equivalent to --strip-components for tar
```

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
