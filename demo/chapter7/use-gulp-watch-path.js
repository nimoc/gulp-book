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

var uglify = require('gulp-uglify')
var watchPath = require('gulp-watch-path')

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

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('default', ['watchjs'])