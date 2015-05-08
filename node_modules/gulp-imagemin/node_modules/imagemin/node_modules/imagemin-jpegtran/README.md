# imagemin-jpegtran [![Build Status](http://img.shields.io/travis/imagemin/imagemin-jpegtran.svg?style=flat)](https://travis-ci.org/imagemin/imagemin-jpegtran) [![Build status](https://ci.appveyor.com/api/projects/status/rwf4by6qcbne1qet?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/imagemin-jpegtran)

> jpegtran imagemin plugin


## Install

```bash
$ npm install --save imagemin-jpegtran
```


## Usage

```js
var Imagemin = require('imagemin');
var jpegtran = require('imagemin-jpegtran');

var imagemin = new Imagemin()
	.src('images/*.jpg')
	.dest('build/images')
	.use(jpegtran({ progressive: true }));

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
var jpegtran = require('imagemin-jpegtran');

gulp.task('default', function () {
	return gulp.src('images/*.jpg')
		.pipe(jpegtran({ progressive: true })())
		.pipe(gulp.dest('build/images'));
});
```


## Options

### progressive

Type: `Boolean`  
Default: `false`

Lossless conversion to progressive.

### arithmetic

Type: `Boolean`  
Default: `false`

Use [arithmetic coding](http://en.wikipedia.org/wiki/Arithmetic_coding).


## License

MIT © [imagemin](https://github.com/imagemin)
