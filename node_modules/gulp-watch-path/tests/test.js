var assert = require("assert")
var watchPath = require('../')
var fs = require('fs')
var path = require('path')
var resolve = function (paths) {
    return path.resolve(path.join(paths))
}

var result = function (unix, win) {
    if (path.sep === '/') {
        return unix
    }
    else{
        return win
    }
}


describe('search, replace', function () {
    it('"src/sass/", "dist/css/"', function (){
        assert.deepEqual(watchPath({
            path: resolve('src/sass/index.scss')
        },
        'src/sass/',
        'dist/css/'),
        result(
            {
                srcFilename: 'index.scss',
                distFilename: 'index.css',
                srcPath: 'src/sass/index.scss',
                srcDir: 'src/sass/',
                distPath: 'dist/css/index.css',
                distDir: 'dist/css/'
            },
            {
                srcFilename: 'index.scss',
                distFilename: 'index.css',
                srcPath: 'src\\sass\\index.scss',
                srcDir: 'src\\sass\\',
                distPath: 'dist\\css\\index.css',
                distDir: 'dist\\css\\'
            }
        )
        )
    })
    it('"src/" "dist/" path = "src/js/index.coffee"', function (){
        assert.deepEqual(watchPath({
            path: resolve('src/js/index.coffee')
        },
        'src/',
        'dist/'),
        result(
            {
                srcFilename: 'index.coffee',
                distFilename: 'index.js',
                srcPath: 'src/js/index.coffee',
                srcDir: 'src/js/',
                distPath: 'dist/js/index.js',
                distDir: 'dist/js/'
            },
            {
                srcFilename: 'index.coffee',
                distFilename: 'index.js',
                srcPath: 'src\\js\\index.coffee',
                srcDir: 'src\\js\\',
                distPath: 'dist\\js\\index.js',
                distDir: 'dist\\js\\'
            }
        )
        )
    })
    
})

setTimeout(function(){
    console.log(new Date().getSeconds() + 's')
},10)