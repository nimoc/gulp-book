# vinyl-map [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/vinyl-map&title=vinyl-map&description=hughsk/vinyl-map%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Map [vinyl](https://github.com/wearefractal/vinyl) files' contents as strings,
so you can easily use existing code without needing yet another
[gulp](https://github.com/gulpjs/gulp) plugin!

Essentially, with the hope of reducing the number of gulp plugins out there
which are *just* doing this:

``` javascript
var through = require('through')
var uglify = require('uglify-js')

module.exports = function() {
  return through(function(file) {
    if (file.isNull()) return this.queue(file)
    if (file.isStream()) throw new Error('no support')

    file.contents = file.contents.toString()

    var minified = uglify.minify(file.contents, {
      fromString: true
    })

    file = file.clone()
    file.contents = new Buffer(minified.code)
    this.queue(file)
  })
}
```

Of course, sometimes that's fine too, but this might help save some complexity
for when it's too much hassle. It also takes care of the differences between
handling Buffer, Stream and null values for your `file.contents`.

## Usage ##

[![vinyl-map](https://nodei.co/npm/vinyl-map.png?mini=true)](https://nodei.co/npm/vinyl-map)

Here's a simple example, using gulp:

``` javascript
var uglify = require('uglify-js')
var map = require('vinyl-map')
var gulp = require('gulp')

gulp.task('minify', function() {
  var minify = map(function(code, filename) {
    // file contents are handed
    // over as buffers
    code = code.toString()

    return uglify.minify(code, {
      fromString: true
    }).code
  })

  return gulp.src(['./index.js'])
    .pipe(minify)
    .pipe(gulp.dest('./dist'))
})

```

## API ##

### `map(mapper(contents, filename))` ###

Returns a transform stream that takes vinyl files as input and spits out
their modified copies as output.

`mapper` is a function which will be called once for each file, with two
arguments:

* `contents` is a string or [Buffer](http://nodejs.org/api/buffer.html)
* `filename` is the value of `file.path`, which should generally be the file's
  absolute path. Might be convenient if you want to filter based on file
  extension etc.

The `mapper` function is expected to return a modified string value for the
updated file contents. If nothing is returned, no modifications will be made
to the file contents, but the output file will be cloned.

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/vinyl-map/blob/master/LICENSE.md) for details.
