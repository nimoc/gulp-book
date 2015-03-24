使用 Gulp 开发一个项目
==================

请务必理解如下章节后阅读此章节：

1. [安装 Node 和 Gulp](chapter1.md)
2. [使用 Gulp 压缩 JS](chapter2.md)
3. [使用 Gulp 压缩 CSS](chapter3.md)
4. [使用 Gulp 压缩图片](chapter4.md)
5. [使用 Gulp 编译 LESS](chapter5.md)
6. [使用 Gulp 编译 SASS](chapter6.md)

----------

本章将介绍 `gulp-watch` 和 `gulp-sourcemaps` 。并将之前所有章节的内容组合起来编写一个前端项目所需的 Gulp 代码。

你可以在 [nimojs/gulp-demo](https://github.com/nimojs/gulp-demo) 找到本章所有代码。

package.json
------------

首先利用 `package.json` 保存所有 `npm install gulp-xxx` 模块依赖和模块版本。

在命令行输入（此后 `$` 前缀用于表示是在命令行中的操作）

```
$ npm init
```

会依次要求补全项目信息，不清楚的可以直接回车跳过
```
name: (chapter7) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
...
...
Is this ok? (yes) 
```

最终会在当前目录中创建 `package.json` 文件并生成类似如下代码：
```
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

安装 gulp 到项目（防止全局 gulp 升级后与此项目 `gulpfile.js` 代码不见人）
```
$ npm install gulp --save-dev
```

此时打开 `package.json` 会发现多了如下代码

```
"devDependencies": {
	"gulp": "^3.8.11"
}
```

声明此项目的开发依赖 Gulp

接着安装其他依赖
```
$ npm install gulp-uglify gulp-minify-css gulp-imagemin gulp-less gulp-sass --save-dev
```


设计目录结构
----------
我们将文件分为2类，一类是源码，一类是编译压缩后的版本。文件夹分别为 `src` 和 `dist`。

```
└── src/
│
└── dist/
```

`dist/` 目录下的文件都是根据 `src/` 下所有源码文件构建而成。

再 `src/` 下创建前端资源对应的的文件夹

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

压缩 JS 
--------
压缩 `js/` 中所有 js 文件并输出到 `dist/css/` 中

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

### gulp-watch

此代码有个性能问题，当 `gulp.watch` 到 `src/js/` 目录下的js文件有修改时他会讲所有文件全部编译。实际上我们只需要重新编译被修改的文件。 [在线文件示例：src/js/](https://github.com/nimojs/gulp-demo/blob/master/src/js/)

我们使用 `gulp-watch` 改写代码。（注意：它不是 `gulp.watch`）

安装模块
```
$ npm install gulp-watch --save-dev
```

```js
// 改写代码
var gulp = require('gulp');

var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
gulp.task('js', function () {
    gulp.src('src/js/**/*.js')
        .pipe(watch('src/js/**/*.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

gulp.task('default', ['js']);
```

### gulp-sourcemaps

JS 压缩前和压缩后比较
```js
// 压缩前
var say = function (number) {
    if (number > 0) {
        number--
        console.log(number)
        say(number)
    }
}

say(10)
console.log('------------')
say(5)

// 压缩后
var say=function(o){o>0&&(o--,console.log(o),say(o))};say(10),console.log("------------"),say(5);
```

压缩后的代码非常难调试，好在我们可以使用 [sourcemap](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html) 帮助调试

安装模块
```
$ npm install gulp-sourcemaps --save-dev
```


```
// 改写代码
var gulp = require('gulp');

var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps =require('gulp-sourcemaps');

gulp.task('js', function () {
    gulp.src('src/js/**/*.js')
        .pipe(watch('src/js/**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'))
})

gulp.task('default', ['js']);
```

此时 `dist/js/` 中也会生成对应的 `.map` 文件，以便使用 Chrome 控制台调试代码 [在线文件示例：src/js/](https://github.com/nimojs/gulp-demo/blob/master/src/js/)

压缩 CSS
-------
有时我们不想使用 LESS 或 SASS而是直接编写 CSS，但我们需要压缩 CSS 以提高页面加载速度。

编写压缩代码，并加上 `gulp-watch` 和 `gulp-sourcemaps`

```
var minifycss = require('gulp-minify-css');

gulp.task('css', function () {
    gulp.src('src/css/**/*.css')
        .pipe(watch('src/css/**/*.css'))
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('default', ['js','css']);
```

<div style="display:none;" >

压缩图片
------
我们只需要将 [使用 Gulp 压缩图片](chapter4.md) 中的代码添加 `gulp-watch` 即可

```
var imagemin = require('gulp-imagemin');

gulp.task('images', function () {
    gulp.src('src/images/*.+(jpge|jpg|png|gif)')
        .pipe(watch('src/images/*.+(jpge|jpg|png|gif))')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('default', ['js', 'css', 'images']);
```

</div>

本章未完成..

[阅读下一章节：使用 Gulp 编译 markdown](chapter8.md)