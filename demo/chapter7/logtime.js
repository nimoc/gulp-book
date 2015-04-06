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

gulp.task('default', function () {
    log('!!!change some file')
    log(colors.error('!!!error message:') + ' text')
})