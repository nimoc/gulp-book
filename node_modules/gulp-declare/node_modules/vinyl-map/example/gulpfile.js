var uglify = require('uglify-js')
var map = require('../')
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
