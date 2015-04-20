# bin-build [![Build Status](http://img.shields.io/travis/kevva/bin-build.svg?style=flat)](https://travis-ci.org/kevva/bin-build)

> Easily build binaries

## Install

```bash
$ npm install --save bin-build
```

## Usage

```js
var BinBuild = require('bin-build');

var build = new BinBuild()
	.src('http://www.lcdf.org/gifsicle/gifsicle-1.80.tar.gz')
	.cmd('./configure --disable-gifview --disable-gifdiff')
	.cmd('make install');

build.run(function (err) {
	if (err) {
		throw err;
	}

	console.log('gifsicle built successfully');
});
```

## API

### new BinBuild(opts)

Creates a new `BinBuild` instance. Available options are:

* `strip`: Strip a number of leading paths from file names on extraction. Defaults to `1`.

### .src(str)

Type: `String`

Accepts a URL to a archive containing the source code, a path to an archive or a 
path to a directory containing the source code.

### .cmd(str)

Type: `String`

Add a command to run when building.

### .run(cb)

Type: `Function`

Runs the build and returns an error if something has gone wrong

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
