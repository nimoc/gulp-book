var gulp = require('gulp')
var watchPath = require('../index')
// var watchPath = require('gulp-watch-path')
var uglify = require('gulp-uglify')
var combiner = require('stream-combiner2')

gulp.task('default', function () {
    gulp.watch('src/**/*.js', function (event) {
        var paths = watchPath(event,'src/', 'dist/');
        /*
        paths {srcPath: 'src/file.js',
              srcDir: 'src/',
              distPath: 'dist/file.node',
              distDir: 'dist/',
              srcFilename: 'file.js',
              distFilename: 'file.js' }
        */
        var combined = combiner.obj([
            gulp.src(paths.srcPath), // src/file.js
            uglify(),
            gulp.dest(paths.distDir) // dist/
        ]);
        combined.on('error', function (err) {
            console.log('--------------')
            console.log('Error')
            console.log('fileName: ' + err.fileName)
            console.log('lineNumber: ' + err.lineNumber)
            console.log('message: ' + err.message)
            console.log('plugin: ' + err.plugin)
        })

        console.log('\n')
        console.log(event.type + ': ' + paths.srcPath)
        console.log('dist: ' + paths.distPath)
        /*
        changed: src/file.js
        dist: dist/file.js
        */
    })
})