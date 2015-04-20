# gulp-declare [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> declare plugin for gulp 3

## Usage

First, install `gulp-declare` as a development dependency:

```shell
npm install --save-dev gulp-declare
```

Then, add it to your `gulpfile.js`:

```javascript
var declare = require('gulp-declare');
var concat = require('gulp-concat');

gulp.task('models', function() {
  // Define each model as a property of a namespace according to its filename
  gulp.src(['client/models/*.js'])
    .pipe(declare({
      namespace: 'MyApp.models',
      noRedeclare: true // Avoid duplicate declarations
    }))
    .pipe(concat('models.js')) // Combine into a single file
    .pipe(gulp.dest('build/js/'));
});
```

## API

### declare(options)

#### options.namespace
Type: `String`  
Default: `"this"`

The namespace in which the file contents will be assigned. Use dot notation (e.g. `MyApp.templates`) for nested namespaces.

For example, if the namespace is `MyApp.templates` and a file is named `App.Header.js`, the following declaration will be added:

```javascript
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["App"] = this["MyApp"]["templates"]["App"] || {};
this["MyApp"]["templates"]["App"]["Header"] = /* File contents from App.Header.js */;
```

If the default value of `"this"` is provided, namespace declaration will be determined soley by the filename and output of `options.processName`. That is, a file names `MyApp.templates.App.Header.js` will result in the same declaration as above.


#### options.processName
Type: `Function`  
Default: Strip file extension

This option accepts a function which takes one argument (the path to the file) and returns a string which will be used as the key for object. By default, the filename minus the extension is used.

This function should return a namespace path in dot notation, such as `Prop.sub.item`, which is then combined with `options.namespace`. See [`options.namespace`](#optionsnamespace) above for an example.

See [`declare.processNameByPath`](#declareprocessnamebypathfilepath) to generate namespace paths based on directory structure.

#### options.separator
Type: `String`  
Default: `\n`

The separator to use between declarations.


#### options.noRedeclare
Type: `Boolean`  
Default: `false`

If `true`, parts of the namespace that were declared as a result of previous files in the stream will not be redeclared. For instance, if the stream contains the following files:

* Main.Content.js
* Main.Header.js
* Main.Footer.js

And if `declare` is invoked with `{ namespace: 'MyApp', noRedeclare: true }`, the contents of the streamed files will look like this:

**Main.Content.js**
```javascript
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["Main"] = this["MyApp"]["Main"] || {};
this["MyApp"]["Main"]["Content"] = /* File contents from Main.Content.js */;
```

**Main.Header.js**
```javascript
this["MyApp"]["Main"]["Header"] = /* File contents from Main.Header.js */;
```

**Main.Footer.js**
```javascript 
this["MyApp"]["Main"]["Footer"] = /* File contents from Main.Footer.js */;
```

This option makes the most sense when you're concatenating files later and want to minimize duplicate declarations. Regardless of this option, `gulp-declare` will never clobber existing namespaces or their properties.

#### options.root
Type: `String`  
Default: `this`

The root object to declare the namespace within. Defaults to `this` (which is equal to `window` in the browser).

This option is prepended to the assignment statement, so special characters or operators such as `-` should be avoided as they will result in an invalid left-hand assignment error.

When using Node or Browserify, you can specify `root: 'module.exports'` with no namespace if you would like to assign as properties of an exported module:

```js
gulp.src(['models/*.js'])
  .pipe(declare({
    root: 'module.exports', // Declare as properties of module.exports
    noRedeclare: true // Avoid duplicate declarations
  })
  .pipe(concat('models.js'))
  .pipe(gulp.dest('build/js/'));
```

Which results in the following `templates.js`:

```js
module.exports["App"] = module.exports["App"] || {};
module.exports["App"]["Main"] = /* File contents from App.Main.js */;
module.exports["App"]["Header"] = /* File contents from App.Header.js */;
module.exports["App"]["Footer"] = /* File contents from App.Footer.js */;
```

### declare.processNameByPath(filePath)

Pass this method as `options.processName` so the path within the namespace matches the path in the filesystem combined with dot notation from the filename:

```js
gulp.src(['templates/**/*.html'])
  .pipe(domly()) // Compile HTML to document fragment builder functions
  .pipe(declare({
    namespace: 'NS', // Use NS as the base namespace
    noRedeclare: true, // Avoid duplicate declarations
    processName: declare.processNameByPath // Include the path as part of the sub-namespace
  })
  .pipe(concat('models.js'))
  .pipe(gulp.dest('build/js/'));
```

The above configuration will result in the following mapping:

| File path                         | Namespace path                   |
| --------------------------------- | -------------------------------- |
| templates/App.hbs                 | NS.templates.App                 |
| templates/App/header.hbs          | NS.templates.App.header          |
| templates/App/content.initial.hbs | NS.templates.App.content.initial |
| templates/Other.item.hbs          | NS.templates.Other.item          |

**Note:** In the above example, `NS.templates.App.header` is a function that is stored as a property of the `NS.templates.App` function. As everything in JavaScript is an object, even functions, this is perfectly valid and works in all environments. If this hurts your brain, store `templates/App.hbs` as `templates/App/main.hbs` and access it as `NS.templates.App.main`.

#### Customizing the path used to generate the namespace

If you want to remove or change part of the path, you can define your own `options.processName` and use `declare.processNameByPath()` within it. The following example results in the same namespace paths as above with a different directory structure:

```js
gulp.src(['client/templates/**/*.html'])
  .pipe(domly()) // Compile HTML to document fragment builder functions
  .pipe(declare({
    namespace: 'NS.templates', // Declare within NS.templates
    noRedeclare: true, // Avoid duplicate declarations
    processName: function(filePath) {
      // Drop the client/templates/ folder from the namespace path
      return declare.processNameByPath(filePath.replace('client/templates/', ''));
    }
  })
  .pipe(concat('templates.js'))
  .pipe(gulp.dest('build/js/'));
```


[travis-url]: http://travis-ci.org/lazd/gulp-declare
[travis-image]: https://secure.travis-ci.org/lazd/gulp-declare.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-declare
[npm-image]: https://badge.fury.io/js/gulp-declare.png
