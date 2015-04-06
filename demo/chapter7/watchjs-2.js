var gulp = require('gulp')
var colors = require('colors')

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
})

var log = function (msg) {
    // 14:13:55 GMT+0800 (CST)
    var now = new Date().toTimeString().replace(/\s.*$/, '')
    var now =  '[' + colors.data(now) + ']'
    // [10:52:18]
    console.log(now + ' ' + msg)
}

var handleError = function (err) {
    console.log('\n')
    log(colors.error('Error!'))
    log('fileName: ' + colors.error(err.fileName))
    log('lineNumber: ' + colors.error(err.lineNumber))
    log('message: ' + err.message)
    log('plugin: ' + colors.info(err.plugin))
}

var uglify = require('gulp-uglify')
var watchPath = require('gulp-watch-path')
var combiner = require('stream-combiner2')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        /*
        paths
            { srcPath: 'src/js/log.js',
              srcDir: 'src/js/',
              distPath: 'dist/js/log.js',
              distDir: 'dist/js/',
              srcFilename: 'log.js',
              distFilename: 'log.js' }
        */
        log(colors.info(event.type) + ':' + paths.srcPath)
        log('dist:' + paths.distPath)

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])

        combined.on('error', handleError)
    })
})

gulp.task('default', ['watchjs'])