使用 gulp 构建一个项目
==================


请务必理解前面的章节后阅读此章节：

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/16)

----------

本章将介绍
- [gulp-watch-path](https://github.com/nimojs/gulp-watch-path)
- [stream-combiner2](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md)
- [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)
- [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer/blob/master/package.json)

并将之前所有章节的内容组合起来编写一个前端项目所需的 gulp 代码。

你可以在 [nimojs/gulp-demo](https://github.com/nimojs/gulp-demo) 查看完整代码。

若你不了解npm 请务必阅读 [npm模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html)

package.json
------------

如果你熟悉 npm 则可以利用 `package.json` 保存所有 `npm install --save-dev gulp-xxx` 模块依赖和模块版本。

在命令行输入

```
npm init
```

会依次要求补全项目信息，不清楚的可以直接回车跳过
```
name: (gulp-demo) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
...
...
Is this ok? (yes) 
```

最终会在当前目录中创建 `package.json` 文件并生成类似如下代码：
```js
{
  "name": "gulp-demo",
  "version": "0.0.0",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/nimojs/gulp-demo.git"
  },
  "keywords": [
    "gulp",
  ],
  "author": "nimojs <nimo.jser@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/nimojs/gulp-demo/issues"
  },
  "homepage": "https://github.com/nimojs/gulp-demo"
}
```

### 安装依赖

安装 gulp 到项目（防止全局 gulp 升级后与此项目 `gulpfile.js` 代码不兼容）
```
npm install gulp --save-dev
```

此时打开 `package.json` 会发现多了如下代码

```js
"devDependencies": {
	"gulp": "^3.8.11"
}
```

声明此项目的开发依赖 gulp

接着安装其他依赖：

> 安装模块较多，请耐心等待，若一直安装失败可使用[npm.taobao.org](http://npm.taobao.org/)


```
npm install gulp-uglify gulp-watch-path stream-combiner2 gulp-sourcemaps gulp-minify-css gulp-autoprefixer gulp-less gulp-ruby-sass gulp-imagemin gulp-util --save-dev
```
此时，[package.json](https://github.com/nimojs/gulp-demo/blob/master/package.json) 将会更新
```js
"devDependencies": {
    "colors": "^1.0.3",
    "gulp": "^3.8.11",
    "gulp-autoprefixer": "^2.1.0",
    "gulp-imagemin": "^2.2.1",
    "gulp-less": "^3.0.2",
    "gulp-minify-css": "^1.0.0",
    "gulp-ruby-sass": "^1.0.1",
    "gulp-sourcemaps": "^1.5.1",
    "gulp-uglify": "^1.1.0",
    "gulp-watch-path": "^0.0.7",
    "stream-combiner2": "^1.0.2"
}
```

当你将这份 gulpfile.js 配置分享给你的朋友时，就不需要将 `node_modules/` 发送给他，他只需在命令行输入
```
npm install
```
就可以检测 `package.json` 中的 `devDependencies` 并安装所有依赖。

设计目录结构
----------
我们将文件分为2类，一类是源码，一类是编译压缩后的版本。文件夹分别为 `src` 和 `dist`。(注意区分 `dist` 和 ·`dest` 的区别)

```
└── src/
│
└── dist/
```

`dist/` 目录下的文件都是根据 `src/` 下所有源码文件构建而成。

在 `src/` 下创建前端资源对应的的文件夹

```
└── src/
	├── less/    *.less 文件
	├── sass/    *.scss *.sass 文件
	├── css/     *.css  文件
	├── js/      *.js 文件
	├── fonts/   字体文件
    └── images/   图片
└── dist/
```

你可以点击 [nimojs/gulp-demo](https://github.com/nimojs/gulp-demo/archive/master.zip) 下载本章代码。

让命令行输出的文字带颜色
-------------------
gulp 自带的输出都带时间和颜色，这样很容易识别。我们利用 [gulp-util](https://github.com/gulpjs/gulp-util) 实现同样的效果。

```js
var gulp = require('gulp')
var gutil = require('gulp-util')

gulp.task('default', function () {
    gutil.log('message')
    gutil.log(gutil.colors.red('error'))
    gutil.log(gutil.colors.green('message:') + "some")
})
```
使用 `gulp` 启动默认任务以测试
![gulp-util](https://cloud.githubusercontent.com/assets/3949015/7137629/a1def1b8-e2ed-11e4-83e0-5a6adb22de6f.png)

配置 JS 任务
--------
### gulp-uglify
检测`src/js/`目录下的 js 文件修改后，压缩 `js/` 中所有 js 文件并输出到 `dist/js/` 中

```js
var uglify = require('gulp-uglify')

gulp.task('uglifyjs', function () {
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

gulp.task('default', function () {
    gulp.watch('src/js/**/*.js', ['uglifyjs'])
})
```

`src/js/**/*.js` 是 glob 语法。[百度百科：glob模式](http://baike.baidu.com/view/4019153.htm) 、[node-glob](https://github.com/isaacs/node-glob)

在命令行输入 `gulp` 后会出现如下消息，表示已经启动。
```ruby
[20:39:50] Using gulpfile ~/Documents/code/gulp-book/demo/chapter7/gulpfile.js
[20:39:50] Starting 'default'...
[20:39:50] Finished 'default' after 13 ms
```


此时编辑 [src/js/log.js](https://github.com/nimojs/gulp-demo/blob/master/src/js/log.js) 文件并保存，命令行会出现如下消息，表示检测到 `src/js/**/*.js` 文件修改后重新编译所有 js。

```ruby
[20:39:52] Starting 'js'...
[20:39:52] Finished 'js' after 14 ms
```

### gulp-watch-path
此配置有个性能问题，当 `gulp.watch` 检测到  `src/js/` 目录下的js文件有修改时会将所有文件全部编译。实际上我们只需要重新编译被修改的文件。

简单介绍 `gulp.watch` 第二个参数为 `function` 时的用法。

```js
gulp.watch('src/js/**/*.js', function (event) {
    console.log(event);
    /*
	当修改 src/js/log.js 文件时
    event {
		// 发生改变的类型，不管是添加，改变或是删除
        type: 'changed', 
		// 触发事件的文件路径
        path: '/Users/nimojs/Documents/code/gulp-book/demo/chapter7/src/js/log.js'
    }
    */
})
```

我们可以利用 `event` 给到的信息，检测到某个 js 文件被修改时，只编写当前修改的 js 文件。

可以利用 `gulp-watch-path` 配合 `event` 获取编译路径和输出路径。

```js
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
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('default', ['watchjs'])
```

[use-gulp-watch-path 完整代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter7/use-gulp-watch-path.js)

**`watchPath(event, search, replace, distExt)`**

| 参数 | 说明 |
|--------|--------|
|    event    |`gulp.watch` 回调函数的 `event`|
|    search   |需要被替换的起始字符串|
|    replace  |第三个参数是新的的字符串|
|   distExt   |扩展名(非必填)|


此时编辑 [src/js/log.js](https://github.com/nimojs/gulp-demo/blob/master/src/js/log.js) 文件并保存，命令行会出现消息，表示检测到 `src/js/log.js` 文件修改后只重新编译 `log.js`。

```ruby
[21:47:25] changed src/js/log.js
[21:47:25] Dist dist/js/log.js
```

你可以访问 [gulp-watch-path](https://github.com/nimojs/gulp-watch-path) 了解更多。

### stream-combiner2

编辑 `log.js` 文件时，如果文件中有 js 语法错误时，gulp 会终止运行并报错。

当 log.js 缺少 `)`
```js
log('gulp-book'
```

并保存文件时出现如下错误，但是错误信息不全面。而且还会让 gulp 停止运行。

```
events.js:85
      throw er; // Unhandled 'error' event
            ^
Error
    at new JS_Parse_Error (/Users/nimojs/Documents/code/gulp-book/demo/chapter7/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:189:18)
...
...
js_error (/Users/nimojs/Documents/code/gulp-book/demo/chapter7/node_modules/gulp-
-book/demo/chapter7/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:1165:20)
    at maybe_unary (/Users/nimojs/Documents/code/gulp-book/demo/chapter7/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:1328:19)

```

应对这种情况，我们可以使用 [Combining streams to handle errors](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md) 文档中推荐的 [stream-combiner2](https://github.com/substack/stream-combiner2)  捕获错误信息。

```js
var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}
var combiner = require('stream-combiner2')

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
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            uglify(),
            gulp.dest(paths.distDir)
        ])

        combined.on('error', handleError)
    })
})
```

[watchjs-1 完整代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter7/watchjs-1.js)

此时当编译错误的语法时，命令行会出现错误提示。而且不会让 gulp 停止运行。

```
changed:src/js/log.js
dist:dist/js/log.js
--------------
Error!
fileName: /Users/nimojs/Documents/code/gulp-book/demo/chapter7/src/js/log.js
lineNumber: 7
message: /Users/nimojs/Documents/code/gulp-book/demo/chapter7/src/js/log.js: Unexpected token eof «undefined», expected punc «,»
plugin: gulp-uglify
```

### gulp-sourcemaps

JS 压缩前和压缩后比较
```js
// 压缩前
var log = function (msg) {
    console.log('--------');
    console.log(msg)
    console.log('--------');
}
log({a:1})
log('gulp-book')

// 压缩后
var log=function(o){console.log("--------"),console.log(o),console.log("--------")};log({a:1}),log("gulp-book");
```

压缩后的代码不存在换行符和空白符，导致出错后很难调试，好在我们可以使用 [sourcemap](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html) 帮助调试

```js
var sourcemaps = require('gulp-sourcemaps')
// ...
var combined = combiner.obj([
    gulp.src(paths.srcPath),
    sourcemaps.init(),
    uglify(),
    sourcemaps.write('./'),
    gulp.dest(paths.distDir)
])
// ...
```

[watchjs-2 完整代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter7/watchjs-1.js)

此时 `dist/js/` 中也会生成对应的 `.map` 文件，以便使用 Chrome 控制台调试代码 [在线文件示例：src/js/](https://github.com/nimojs/gulp-demo/blob/master/src/js/)

-----

至此，我们完成了检测文件修改后压缩 JS 的 gulp 任务配置。

有时我们也需要一次编译所有 js 文件。可以配置 `uglifyjs` 任务。

```js
gulp.task('uglifyjs', function () {
    var combined = combiner.obj([
        gulp.src('src/js/**/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest('dist/js/')
    ])
    combined.on('error', handleError)
})
```

在命令行输入 `gulp uglifyjs` 以压缩 `src/js/` 下的所有 js 文件。

配置 CSS 任务
-------

有时我们不想使用 LESS 或 SASS而是直接编写 CSS，但我们需要压缩 CSS 以提高页面加载速度。

### gulp-minify-css

按照本章中压缩 JS 的方式，先编写 `watchcss` 任务

```js
var minifycss = require('gulp-minify-css')

gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('default', ['watchjs','watchcss'])
```

### gulp-autoprefixer

autoprefixer 解析 CSS 文件并且添加浏览器前缀到CSS规则里。
通过示例帮助理解 

autoprefixer 处理前：
```css
.demo {
    display:flex;
}
```

autoprefixer 处理后：
```css
.demo {
    display:-webkit-flex;
    display:-ms-flexbox;
    display:flex;
}
```
你只需要关心编写标准语法的 css，autoprefixer 会自动补全。

在 watchcss 任务中加入 autoprefixer:

```js
gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})
```

更多 autoprefixer 参数请查看 [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)

有时我们也需要一次编译所有 css 文件。可以配置 `minifyss` 任务。

```js
gulp.task('minifycss', function () {
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: 'last 2 versions'
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
})
```

在命令行输入 `gulp minifyss` 以压缩 `src/css/` 下的所有 .css 文件并复制到 `dist/css` 目录下

配置 Less 任务
------------
参考配置 JavaScript 任务的方式配置 less 任务

```js
var less = require('gulp-less')

gulp.task('watchless', function () {
    gulp.watch('src/less/**/*.less', function (event) {
        var paths = watchPath(event, 'src/less/', 'dist/css/')

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
              browsers: 'last 2 versions'
            }),
            less(),
            minifycss(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])
        combined.on('error', handleError)
    })
})

gulp.task('lesscss', function () {
    var combined = combiner.obj([
            gulp.src('src/less/**/*.less'),
            sourcemaps.init(),
            autoprefixer({
              browsers: 'last 2 versions'
            }),
            less(),
            minifycss(),
            sourcemaps.write('./'),
            gulp.dest('dist/css/')
        ])
    combined.on('error', handleError)
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless'])
```

配置 Sass 任务
-------------

参考配置 JavaScript 任务的方式配置 Sass 任务

```js
gulp.task('watchsass',function () {
    gulp.watch('src/sass/**/*', function (event) {
        var paths = watchPath(event, 'src/sass/', 'dist/css/')

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        sass(paths.srcPath)
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('sasscss', function () {
        sass('src/sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(autoprefixer({
          browsers: 'last 2 versions'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchsass'])
```

配置 image 任务
----------

```js
var imagemin = require('gulp-imagemin')

gulp.task('watchimage', function () {
    gulp.watch('src/images/**/*', function (event) {
        var paths = watchPath(event,'src/','dist/')

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('image', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
})
```

配置文件复制任务
-----------
复制 `src/fonts/` 文件到 `dist/` 中

```js
gulp.task('watchcopy', function () {
    gulp.watch('src/fonts/**/*', function (event) {
        var paths = watchPath(event)

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('copy', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchimage', 'watchcopy'])
```

结语
--------

[完整代码](https://github.com/nimojs/gulp-demo/tree/master/gulpfile.js)

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/16)

你还想了解什么关于 gulp 的什么知识？ [告诉我们](https://github.com/nimojs/gulp-book/issues/8)

后续还会又新章节更新。你可以[订阅本书](https://github.com/nimojs/gulp-book/issues/7) 当有新章节发布时，我们会通过邮件告诉你
