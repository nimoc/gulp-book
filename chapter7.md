使用 gulp 构建一个项目
==================

请务必理解前面的章节后阅读此章节：

----------

本章将介绍
- [colors](https://github.com/Marak/colors.js)
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

在命令行输入（此后 `$` 前缀用于表示是在命令行中的操作）

```
$ npm init
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
$ npm install gulp --save-dev
```

此时打开 `package.json` 会发现多了如下代码

```js
"devDependencies": {
	"gulp": "^3.8.11"
}
```

声明此项目的开发依赖 gulp

接着安装其他依赖：(安装模块较多，请耐心等待，若一直安装失败可使用[npm.taobao.org](http://npm.taobao.org/)）
```
$ npm install colors gulp-uglify gulp-watch-path stream-combiner2 gulp-sourcemaps gulp-minify-css gulp-autoprefixer gulp-less gulp-ruby-sass gulp-imagemin  --save-dev
```


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
	├── sass/    *.scss 文件
	├── css/     *.css  文件
	├── js/      *.js 文件
	├── fonts/   字体文件
	├── media/   *.swf等文件
    └── images/   图片
└── dist/
```

由开发者自己决定使用 LESS 、 SASS 或直接编写 CSS。

配置 JS 任务
--------
### gulp-uglify
检测`src/js/`目录下的 js 文件修改后，压缩 `js/` 中所有 js 文件并输出到 `dist/css/` 中

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('js', function () {
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

gulp.task('default', function () {
    gulp.watch('src/js/**/*.js', ['js']);
})
```

`src/js/**/*.js` 是 glob 语法。[百度百科：glob模式](http://baike.baidu.com/view/4019153.htm) 、[node-glob](https://github.com/isaacs/node-glob)

在命令行输入 `gulp` 后会出现如下消息，表示已经启动。
```ruby
[20:39:50] Using gulpfile ~/Documents/code/gulp-book/demo/chapter7/gulpfile.js
[20:39:50] Starting 'default'...
[20:39:50] Finished 'default' after 13 ms
```
此时编辑 [src/js/log.js](https://github.com/nimojs/gulp-demo/src/js/log.js) 文件并保存，命令行会出现如下消息，表示检测到 `src/js/**/*.js` 文件修改后重新编译所有 js。

```ruby
[20:39:52] Starting 'js'...
[20:39:52] Finished 'js' after 14 ms
```

### gulp-watch-path
此配置有个性能问题，当 `gulp.watch` 到 `src/js/` 目录下的js文件有修改时他会讲所有文件全部编译。实际上我们只需要重新编译被修改的文件。

此处介绍一下 `gulp.watch` 第二个参数为 `function` 时的用法。

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
});
```

我们可以利用 `event` 检测到某个 js 文件被修改时，只编写当前修改的 js 文件。

可以利用 `gulp-watch-path` 配合 `event` 获取编译路径和输出路径。

```js
gulp.task('watchjs', function () {
    // 编译 JS
    gulp.watch('src/js/**/*.js', function (event) {
        var path = watchPath(event, 'src/', 'dist/')
        /*
        path = {  srcPath: 'src/js/log.js',
                  srcDir: 'src/js/',
                  distPath: 'dist/js/log.js',
                  distDir: 'dist/js/',
                  filename: 'log.js' }
        */
        console.log('\r')
        console.log(event.type + ':' + path.srcPath)
        console.log('dist:' + path.distPath)

        gulp.src(path.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(path.distDir))
    });
})

gulp.task('default', ['watchjs'])
```

此时编辑 [src/js/log.js](https://github.com/nimojs/gulp-demo/src/js/log.js) 文件并保存，命令行会出现如下消息，表示检测到 `src/js/log.js` 文件修改后只重新编译 `log.js`。

### stream-combiner2

可是编辑 `log.js` 文件时，如果文件中有 js 语法错误时，gulp会终止运行并报错。

当 log.js 缺少 `)`
```js
log('gulp-book'
```

并保存文件时出现如下错误，但是错误信息不全面

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

应对这种情况，我们可以使用 [Combining streams to handle errors](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md) 文档中的 [stream-combiner2](https://github.com/substack/stream-combiner2)  捕获错误信息。


```js
gulp.task('watchjs', function () {
    // 编译 JS
    gulp.watch('src/js/**/*.js', function (event) {
        var path = watchPath(event, 'src/', 'dist/')
        /*
        path = {  srcPath: 'src/js/log.js',
                  srcDir: 'src/js/',
                  distPath: 'dist/js/log.js',
                  distDir: 'dist/js/',
                  filename: 'log.js' }
        */
        console.log('\r')
        console.log(event.type + ':' + path.srcPath)
        console.log('dist:' + path.distPath)

        var combined = combiner.obj([
            gulp.src(path.srcPath), // src/js/log.js
            uglify(),
            gulp.dest(path.distDir) // dist/js/
        ]);
        combined.on('error', function (err) {
          console.log('--------------')
          console.log(colors.error('Error'))
          console.log('fileName: ' + colors.error(err.fileName))
          console.log('lineNumber: ' + colors.error(err.lineNumber))
          console.log('message: ' + err.message)
          console.log('plugin: ' + colors.info(err.plugin))
        })
    });
})

gulp.task('default', ['watchjs'])
```

此时当编译错误的语法时，命令行会出现如下提示：

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
// 改写代码
gulp.task('watchjs', function () {
    // 编译 JS
    gulp.watch('src/js/**/*.js', function (event) {
        var path = watchPath(event, 'src/', 'dist/')
        /*
        path = {  srcPath: 'src/js/log.js',
                  srcDir: 'src/js/',
                  distPath: 'dist/js/log.js',
                  distDir: 'dist/js/',
                  filename: 'log.js' }
        */
        console.log('\r')
        console.log(event.type + ':' + path.srcPath)
        console.log('dist:' + path.distPath)

        var combined = combiner.obj([
            gulp.src(path.srcPath), // src/js/log.js
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(path.distDir) // dist/js/
        ]);
        combined.on('error', function (err) {
            console.log('--------------')
            console.log(colors.error('Error'))
            console.log('fileName: ' + colors.error(err.fileName))
            console.log('lineNumber: ' + colors.error(err.lineNumber))
            console.log('message: ' + err.message)
            console.log('plugin: ' + colors.info(err.plugin))
        })
    });
})
```

此时 `dist/js/` 中也会生成对应的 `.map` 文件，以便使用 Chrome 控制台调试代码 [在线文件示例：src/js/](https://github.com/nimojs/gulp-demo/blob/master/src/js/)

至此，我们完成了检测文件修改后压缩 JS 的 gulp 任务配置。

但有时我们需要编译所有 js 文件。可以配置 `uglifyjs` 任务。

```js
gulp.task('uglifyjs', function () {
  // 编译 JS
  var combined = combiner.obj([
      gulp.src('src/js/**/*.js'),
      sourcemaps.init(),
      uglify(),
      sourcemaps.write('./'),
      gulp.dest('dist/js/')
  ]);
  combined.on('error', function (err) {
      console.log('--------------')
      console.log(colors.error('Error'))
      console.log('fileName: ' + colors.error(err.fileName))
      console.log('lineNumber: ' + colors.error(err.lineNumber))
      console.log('message: ' + err.message)
      console.log('plugin: ' + colors.info(err.plugin))
  })
})
```

此时，你可以通过在 命令行输入 `gulp uglifyjs` 以压缩 `src/js/` 下的所有 js 文件。

配置 CSS 任务
-------

有时我们不想使用 LESS 或 SASS而是直接编写 CSS，但我们需要压缩 CSS 以提高页面加载速度。

### gulp-minify-css

按照本章中压缩 JS 的方式，先编写 `watchcss` 任务

```js
// 检测文件修改后压缩 css
gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var path = watchPath(event, 'src/', 'dist/')
        /*
        path = {  srcPath: 'src/css/css-1.css',
                  srcDir: 'src/css/',
                  distPath: 'dist/css/css-1.css',
                  distDir: 'dist/css/',
                  filename: 'css-1.css' }
        */
        console.log('\r')
        console.log(event.type + ':' + path.srcPath)
        console.log('dist:' + path.distPath)

                // src/css/css-1.css
        gulp.src(path.srcPath)
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            // dist/js/
            .pipe(gulp.dest(path.distDir))
    })
})

gulp.task('default', ['watchjs','watchcss'])
```

在命令行输入 `gulp` 启动 `watchcss`

然后编写 `minifycss` 任务

```js
// 压缩 css
gulp.task('minifycss', function () {
      gulp.src('src/css/**/*.css')
      .pipe(sourcemaps.init())
      .pipe(minifycss())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css/'))
})
```
在命令行输入 `gulp minifycss` 以编译 `src/css/` 下的所有 css 文件。

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

在 watchcss 和 minifycss 任务中加入 autoprefixer:

```js
// 检测文件修改后压缩 css
gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var path = watchPath(event, 'src/', 'dist/')
        console.log(' ')
        console.log(event.type + ':' + path.srcPath)
        console.log('dist:' + path.distPath)

                // src/css/css-1.css
        gulp.src(path.srcPath)
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            // src/css/
            .pipe(gulp.dest(path.distDir))
    })
})

// 压缩 css
gulp.task('minifycss', function () {
      gulp.src('src/css/**/*.css')
      .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(sourcemaps.init())
      .pipe(minifycss())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css/'))
})
```

更多 autoprefixer 参数请查看 [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)


配置 Less 任务
------------
Less 的任务只需在 css 任务的基础上增加一个 `pipe(less())` ，并改变 watch的路径。

```
// less 任务
gulp.task('watchless', function () {
    gulp.watch('src/less/**/*.less', function (event) {
        var path = watchPath(event, 'src/', 'dist/')
        /*
        path = {  srcPath: 'src/less/less.less',
                  srcDir: 'src/less/',
                  distPath: 'dist/css/less.css',
                  distDir: 'dist/css/',
                  filename: 'less.less' }
        */
        console.log(' ')
        console.log(event.type + ':' + path.srcPath)
        console.log('dist:' + path.distPath)

                // src/css/css-1.css
        gulp.src(path.srcPath)
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(minifycss())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            // src/css/
            .pipe(gulp.dest(path.distDir))
    })
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless'])
```
在命令行输入 gulp 启动 watchless 任务。
```
gulp
```

如果将 .less 文件内容是 `abcde` 这种错误的语法，编译时会导致 gulp 终止运行。

参照 js 任务改写代码，加上 `combiner`。

```js
var combined = combiner.obj([
            gulp.src(path.srcPath), // src/less/less.less
            sourcemaps.init(),
            less(),
            minifycss(),
            autoprefixer({
              browsers: 'last 2 versions'
            }),
            sourcemaps.write('./'),
            gulp.dest(path.distDir) // dist/css/
        ]);
        combined.on('error', function (err) {
            console.log(' ')
            console.log(colors.error('Error'))
            console.log('fileName: ' + colors.error(err.fileName))
            console.log('lineNumber: ' + colors.error(err.lineNumber))
            console.log('message: ' + err.message)
            console.log('plugin: ' + colors.info(err.plugin))
        })
```

此时当将 `src/less/less.less` 内容保存为 `abcde` 时候，会在控制台出现错误提示，而 gulp 不会终止。

接着编写 lesscss 任务

```js
gulp.task('lesscss', function () {
    var combined = combiner.obj([
        gulp.src('src/less/**/*.less'), // src/less/less.less
        sourcemaps.init(),
        less(),
        minifycss(),
        autoprefixer({
          browsers: 'last 2 versions'
        }),
        sourcemaps.write('./'),
        gulp.dest('dist/css/')
    ]);
    combined.on('error', function (err) {
        console.log(' ')
        console.log(colors.error('Error'))
        console.log('fileName: ' + colors.error(err.fileName))
        console.log('lineNumber: ' + colors.error(err.lineNumber))
        console.log('message: ' + err.message)
        console.log('plugin: ' + colors.info(err.plugin))
    })
})
```

在命令输入 `gulp lesscss` 编译 `src/less/` 目录下的所有 `.less`后缀文件。


配置 Sass 任务
-------------

Sass 的配置比较简单。

```js
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

gulp.task('watchsass',function () {
    gulp.watch('src/sass/**/*.scss', ['sasscss']);
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchremind'])
```

命令行输入 `gulp` 启动检测文件编译

输入 `gulp sasscss` 编译 `src/sass/` 下的所有文件

配置 image 任务
----------

```js
gulp.task('watchimage', function () {
    gulp.watch('src/images/**/*', function (event) {
        var path = watchPath(event, 'src/', 'dist/')
        /*
        path = {  srcPath: 'src/images/loading.gif',
                  srcDir: 'src/images/',
                  distPath: 'dist/images/loading.gif',
                  distDir: 'dist/images/',
                  filename: 'loading.gif' }
        */
        var sNow = now();
        console.log('\n')
        console.log(sNow + ' ' + colors.info(event.type) + ':' + path.srcPath)
        console.log(sNow + ' ' + 'dist:' + path.distPath)

        gulp.src(path.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(path.distDir))
    })
})

gulp.task('image', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchimage', 'watchremind'])
```

配置文件复制任务
-----------
复制 `src/fonts/` 文件到 `dist/` 中



[你还想学习什么关于 gulp 的知识？告诉我们！](https://github.com/nimojs/gulp-book/issues/8)