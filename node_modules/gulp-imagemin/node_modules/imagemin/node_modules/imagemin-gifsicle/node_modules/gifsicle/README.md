# gifsicle-bin [![Build Status](http://img.shields.io/travis/imagemin/gifsicle-bin.svg?style=flat)](http://travis-ci.org/imagemin/gifsicle-bin)

> gifsicle manipulates GIF image files in many different ways. Depending on command line options, it can merge several GIFs into a GIF animation; explode an animation into its component frames; change individual frames in an animation; turn interlacing on and off; add transparency and much more.


## Install

```sh
$ npm install --save gifsicle
```


## Usage

```js
var execFile = require('child_process').execFile;
var gifsicle = require('gifsicle').path;

execFile(gifsicle, ['-o', 'output.gif', 'input.gif'], function (err) {
	if (err) {
		throw err;
	}

	console.log('Image minified!');
});
```


## CLI

```sh
$ npm install --global gifsicle
```

```sh
$ gifsicle --help
```


## License

MIT © [imagemin](https://github.com/imagemin)
