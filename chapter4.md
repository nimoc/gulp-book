使用 gulp 压缩图片
================

请务必理解如下章节后阅读此章节：

1. [安装 Node 和 gulp](chapter1.md)
2. [使用 gulp 压缩 JS](chapter2.md)


[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/13)
----------

压缩 图片文件可降低文件大小，提高图片加载速度。

找到规律转换为 gulp 代码

规律
---
找到 `images/` 目录下的所有文件，压缩它们，将压缩后的文件存放在 `dist/images/` 目录下。

gulp 代码
---------

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) 或 [在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter4)



**一、安装 gulp-imagemin** 模块

提示：你需要使用命令行的 `cd` 切换至对应目录再进行安装操作和 gulp 启动操作。

[学习使用命令行](chapter1.md)

在命令行输入

```
npm install gulp-imagemin
```

安装成功后你会看到如下信息：(安装时间可能会比较长)

```
gulp-imagemin@2.2.1 node_modules/gulp-imagemin
├── object-assign@2.0.0
├── pretty-bytes@1.0.3 (get-stdin@4.0.1)
├── chalk@1.0.0 (escape-string-regexp@1.0.3, ansi-styles@2.0.1, supports-color@1.3.1, has-ansi@1.0.3, strip-ansi@2.0.1)
├── through2-concurrent@0.3.1 (through2@0.6.3)
├── gulp-util@3.0.4 (array-differ@1.0.0, beeper@1.0.0, array-uniq@1.0.2, lodash._reevaluate@3.0.0, lodash._reescape@3.0.0, lodash._reinterpolate@3.0.0, replace-ext@0.0.1, minimist@1.1.1, vinyl@0.4.6, through2@0.6.3, multipipe@0.1.2, lodash.template@3.3.2, dateformat@1.0.11)
└── imagemin@3.1.0 (get-stdin@3.0.2, optional@0.1.3, vinyl@0.4.6, through2@0.6.3, stream-combiner@0.2.1, concat-stream@1.4.7, meow@2.1.0, vinyl-fs@0.3.13, imagemin-svgo@4.1.2, imagemin-optipng@4.2.0, imagemin-jpegtran@4.1.0, imagemin-pngquant@4.0.0, imagemin-gifsicle@4.1.0)
```

**二、创建 `gulpfile.js` 文件编写代码**

在对应目录创建 `gulpfile.js` 文件并写入如下内容：

```js
// 获取 gulp
var gulp = require('gulp');

// 获取 gulp-imagemin 模块
var imagemin = require('gulp-imagemin')

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('images/*.*')
    // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
    // 3. 另存图片
        .pipe(gulp.dest('dist/images'))
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch('images/*.*)', ['images'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 images 任务和 auto 任务
gulp.task('default', ['images', 'auto'])
```

你可以访问 [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin) 以查看更多用法。

------

**三、在 `images/` 目录下存放图片**

在 `gulpfile.js` 对应目录创建 `images` 文件夹，并在 `images/` 目录下存放图片。

你可以访问 [https://github.com/nimojs/gulp-book/tree/master/demo/chapter4/images/](https://github.com/nimojs/gulp-book/tree/master/demo/chapter4/images/) 下载示例图片


--------

**四、运行 gulp 查看效果**

在命令行输入 `gulp` +回车

你将看到命令行出现如下提示

```
gulp
[18:10:42] Using gulpfile ~/Documents/code/gulp-book/demo/chapter4/gulpfile.js
[18:10:42] Starting 'images'...
[18:10:42] Finished 'images' after 5.72 ms
[18:10:42] Starting 'auto'...
[18:10:42] Finished 'auto' after 6.39 ms
[18:10:42] Starting 'default'...
[18:10:42] Finished 'default' after 5.91 μs
[18:10:42] gulp-imagemin: Minified 3 images (saved 25.83 kB - 5.2%)
```

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/13)

[接着阅读：使用 gulp 编译 LESS](chapter5.md)
