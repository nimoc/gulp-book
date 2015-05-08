# imagemin-pngquant [![Build Status](http://img.shields.io/travis/imagemin/imagemin-pngquant.svg?style=flat)](https://travis-ci.org/imagemin/imagemin-pngquant) [![Build status](https://ci.appveyor.com/api/projects/status/w60auppnbiwgu9gj)](https://ci.appveyor.com/project/kevva/imagemin-pngquant)

> pngquant imagemin plugin


## Install

```sh
$ npm install --save imagemin-pngquant
```


## Usage

```js
var Imagemin = require('imagemin');
var pngquant = require('imagemin-pngquant');

var imagemin = new Imagemin()
	.src('images/*.png')
	.dest('build/images')
	.use(pngquant({ quality: '65-80', speed: 4 }));

imagemin.run(function (err, files) {
	if (err) {
		throw err;
	}

	console.log('Files optimized successfully!'); 
});
```

You can also use this plugin with [gulp](http://gulpjs.com):

```js
var gulp = require('gulp');
var pngquant = require('imagemin-pngquant');

gulp.task('default', function () {
	return gulp.src('images/*.png')
		.pipe(pngquant({ quality: '65-80', speed: 4 })())
		.pipe(gulp.dest('build/images'));
});
```


## Options

### floyd

Type: `Number`  
Default: `0.5`

Controls level of dithering (0 = none, 1 = full).

### nofs

Type: `Boolean`  
Default: `false`

Disable Floyd-Steinberg dithering.

### posterize

Type: `Number`  
Default: `undefined`

Reduce precision of the palette by number of bits. Use when the image will be 
displayed on low-depth screens (e.g. 16-bit displays or compressed textures).

### quality

Type: `String`  
Default: `undefined`

Instructs pngquant to use the least amount of colors required to meet or exceed 
the max quality. If conversion results in quality below the min quality the 
image won't be saved.

Min and max are numbers in range 0 (worst) to 100 (perfect), similar to JPEG.

### speed

Type: `Number`  
Default: `3`

Speed/quality trade-off from `1` (brute-force) to `10` (fastest). Speed `10` has 
5% lower quality, but is 8 times faster than the default.

### verbose

Type: `Boolean`  
Default: `false`

Print verbose status messages.


## License

MIT © [imagemin](https://github.com/imagemin)
