# gulp-autoprefixer [![Build Status](https://travis-ci.org/sindresorhus/gulp-autoprefixer.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-autoprefixer)

> Prefix CSS with [Autoprefixer](https://github.com/postcss/autoprefixer-core)

*Issues with the output should be reported on the Autoprefixer [issue tracker](https://github.com/postcss/autoprefixer-core/issues).*


## Install

```sh
$ npm install --save-dev gulp-autoprefixer
```


## Usage

```js
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function () {
	return gulp.src('src/app.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist'));
});
```


## API

### autoprefixer(options)

#### options

##### browsers

Type: `array`  
Default: `['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']`

[Browsers](https://github.com/postcss/autoprefixer#browsers) you want to target.

##### cascade

Type: `boolean`  
Default: `true`

Changes the CSS indentation to create a nice [visual cascade](https://github.com/postcss/autoprefixer#visual-cascade) of prefixes.

##### remove

Type: `boolean`  
Default: `true`

Remove unneeded prefixes.


## Source Maps

Use [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) like this:

```js
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

gulp.task('default', function () {
	return gulp.src('src/**/*.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(concat('all.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
