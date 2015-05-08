/*
    传入 gulp.watch(funciton(event){}) 中的 event（event.path） 、 查找起始字符串(search)、替换字符串(replace) 和 扩展名
    扩展名非必填（大部分情况下会自动识别，例如：event.path = 'index.sass' 若 ext 参数为空，ext = 'css'）
*/
var path = require('path')
var main = function (event, search, replace, ext) {
    var log = function (msg) {
        console.log(msg)
    }
    var srcFilename, distFilename, srcPath, srcDir, distPath, distDir
    var rStringToRegExp, fStringToPrefixRegExp, fStringToSuffixRegExp, rDirname
    search = path.join(search)
    replace = path.join(replace)
    log('\n')
    log('search: ' + search)
    log('replace: ' + replace)

    log('event.path: ' + event.path)
    // /Users/nimojs/Documents/code/demo/src/index.js

    /*
      将字符串转换为正则所需的正则
      . $ ^ { 等均需要被转换为 \. \$ \^ \ {
    */
    rStringToRegExp = /([.$^{[(|)*+?\/\\])/g
    fStringToPrefixRegExp = function (str) {
        return new RegExp(
                '^' + (
                        str.replace(rStringToRegExp, '\\$1')
                      )
               );
    }
    fStringToSuffixRegExp = function (str) {
        return new RegExp(
                      (
                        str.replace(rStringToRegExp, '\\$1')
                      ) + '$'
               );
    }

    if (typeof search === 'string') {
        search = fStringToPrefixRegExp(search) // src/ ==> \src\//
    }
    srcFilename = path.basename(event.path)
    log('srcFilename: ' + srcFilename)
    // index.js

    if (/\.(coffee|node)$/i.test(srcFilename)) {
        ext = 'js'
    }
    else if (/\.(scss|sass|less)$/i.test(srcFilename)) {
        ext = 'css'
    }
    else if (/\.(handlebars|hbs)$/i.test(srcFilename)) {
        ext = 'js'
    }

    if (ext) {
        if (/\./.test(srcFilename)) {
            distFilename = srcFilename.replace(/[^.]+$/, ext);
        }
        else{
            distFilename = srcFilename + '.' + ext
        }
        
    }
    else {
        distFilename = srcFilename;
    }
    log('distFilename: ' + distFilename)

    rDirname = fStringToPrefixRegExp(process.cwd())
    log('rDirname: ' + rDirname)
    // ^\/Documents\/code\/gulp-watch-path\/
    srcPath = event.path.replace(rDirname, '')
                            .replace(/^[\/\\]/, '')
    log('srcPath: ' + srcPath)
    // src/js/log.js

    srcDir = srcPath.replace(fStringToSuffixRegExp(srcFilename), '')
    log('srcDir: ' + srcDir)
    // src/js/

    distPath = srcPath.replace(search, replace)
    log('distPath: ' + distPath)
    // dist/js/log.js
    if (ext) {
        distPath = distPath.replace(/[^.]+$/, ext);
    }
    distDir = distPath.replace(fStringToSuffixRegExp(distFilename), '')
    log('distDir: ' + distDir)
    // dist/js/
    log('\n')
    return {
        srcFilename: srcFilename,
        distFilename: distFilename,
        srcPath: srcPath,
        srcDir: srcDir,
        distPath: distPath,
        distDir: distDir
    }
}
module.exports = main
