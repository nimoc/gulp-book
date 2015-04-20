# optipng-bin [![Build Status](http://img.shields.io/travis/imagemin/optipng-bin.svg?style=flat)](http://travis-ci.org/imagemin/optipng-bin)

> [OptiPNG](http://optipng.sourceforge.net) is a PNG optimizer that recompresses 
image files to a smaller size, without losing any information.


## Install

```bash
$ npm install --save optipng-bin
```


## Usage

```js
var execFile = require('child_process').execFile;
var optipng = require('optipng-bin').path;

execFile(optipng, ['-out', 'output.png', 'input.png'], function (err) {
	if (err) {
		throw err;
	}

	console.log('Image minified!');
});
```


## CLI

```bash
$ npm install --global optipng-bin
```

```bash
$ optipng --help
```


## License

MIT © [imagemin](https://github.com/imagemin)
