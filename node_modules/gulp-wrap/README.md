# gulp-wrap

[![NPM version](https://img.shields.io/npm/v/gulp-wrap.svg?style=flat)](https://www.npmjs.com/package/gulp-wrap)
[![Build Status](https://secure.travis-ci.org/adamayres/gulp-wrap.svg?branch=master)](http://travis-ci.org/adamayres/gulp-wrap)
[![Coverage Status](https://img.shields.io/coveralls/adamayres/gulp-wrap.svg?style=flat)](https://coveralls.io/r/adamayres/gulp-wrap)
[![Dependency Status](https://img.shields.io/david/adamayres/gulp-wrap.svg?style=flat&label=deps)](https://david-dm.org/adamayres/gulp-wrap)
[![devDependency Status](https://img.shields.io/david/dev/adamayres/gulp-wrap.svg?style=flat&label=devDeps)](https://david-dm.org/adamayres/gulp-wrap#info=devDependencies)

> A [gulp](https://github.com/gulpjs/gulp) plugin to wrap the stream contents with a [lodash](http://lodash.com/docs#template) template.

## Usage

First, install `gulp-wrap` as a development dependency:

```shell
npm install --save-dev gulp-wrap
```

Then, add it to your `gulpfile.js`:

**Wrap the contents with an inline template:**

```javascript
var wrap = require("gulp-wrap");

gulp.src("./src/*.json")
    .pipe(wrap('angular.module(\'text\', []).value(<%= contents %>);'))
    .pipe(gulp.dest("./dist"));
```

**Wrap the contents with a template from file:**

```javascript
var wrap = require("gulp-wrap");

gulp.src("./src/*.json")
    .pipe(wrap({ src: 'path/to/template.txt'}))
    .pipe(gulp.dest("./dist"));
```

**Use parsed contents within a template (supports JSON and YAML):**

```javascript
var wrap = require("gulp-wrap");

gulp.src("./src/*.json")
    .pipe(wrap('Hello, <%= contents.title %>, have a <%= contents.adjective %> day.'))
    .pipe(gulp.dest("./dist"));
```

**Provide additional data and options for template processing:**

```javascript
var wrap = require("gulp-wrap");

gulp.src("./src/*.json")
    .pipe(wrap('BEFORE <%= data.contents %> <%= data.someVar %> AFTER', { someVar: 'someVal'}, { variable: 'data' }))
    .pipe(gulp.dest("./dist"));
```

This gulp plugin wraps the stream contents in a template. If you want the stream contents to be the templates use the [gulp-template](https://github.com/sindresorhus/gulp-template) plugin.

## Template

The stream contents will be available in the template using the `contents` key. If the file extension is `json`, `yaml`, or `yml` then the contents will be parsed before being passed to the template. Properties from the vinyl file will be available in the template under the `file` object and are local to that stream. User supplied `data` values will always take precedence over namespace clashes with the file properties.

## API

### wrap(template\[,data\]\[,options\])

#### template
Type: `String` or `Object` or `Function`

The template to used. When a `String` then it will be used as the template. When an `Object` then the template will be loaded from file. When a `Function` then the function will be called and should return the template content. This function get the `data` object as first parameter.

#### template.src
Type: `String`

The file location of the template.

#### data
Type: `Object`

The data object that is passed on to the [lodash](http://lodash.com/docs#template) template call.

#### options
Type: `Object`

The options object that is passed on to the [lodash](http://lodash.com/docs#template) template call.

#### options.parse
Type: `Boolean`

Set to explicit `false` value to disable automatic JSON and YAML parsing.

#### options.engine
Type: `String`

Set the [consolidate template engine](https://www.npmjs.com/package/consolidate) to use. (default to `lodash`).
Using another engine that `lodash` may require installation of additional node package.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
