# pngquant-bin [![Build Status](http://img.shields.io/travis/imagemin/pngquant-bin.svg?style=flat)](https://travis-ci.org/imagemin/pngquant-bin)

> pngquant is a command-line utility for converting 24/32-bit PNG images to paletted (8-bit) PNGs. The conversion reduces file sizes significantly (often as much as 70%) and preserves full alpha transparency.


## Install

```sh
$ npm install --save pngquant-bin
```


## Usage

```js
var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin').path;

execFile(pngquant, ['-o', 'output.png', 'input.png'], function (err) {
	if (err) {
		throw err;
	}

	console.log('Image minified!');
});
```


## CLI

```sh
$ npm install --global pngquant-bin
```

```sh
$ pngquant --help
```


## License

MIT © [imagemin](https://github.com/imagemin)
