使用 gulp 压缩 CSS
================

请务必理解如下章节后阅读此章节：

1. [安装 Node 和 gulp](chapter1.md)
2. [使用 gulp 压缩 JS](chapter2.md)

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/12)

----------


压缩 css 代码可降低 css 文件大小，提高页面打开速度。

我们接着将规律转换为 gulp 代码

规律
---
找到 `css/` 目录下的所有 css 文件，压缩它们，将压缩后的文件存放在 `dist/css/` 目录下。

gulp 代码
---------

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) 或 [在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter3)

当熟悉 [使用 gulp 压缩 JS](chapter2.md) 的方法后，配置压缩 CSS 的 gulp 代码就变得很轻松。


**一、安装 gulp-minify-css** 模块

提示：你需要使用命令行的 `cd` 切换到对应目录后进行安装操作。

[学习使用命令行](chapter1.md)

在命令行输入

```
npm install gulp-minify-css
```

安装成功后你会看到如下信息：(安装时间可能会比较长)

```
gulp-minify-css@1.0.0 node_modules/gulp-minify-css
├── object-assign@2.0.0
├── vinyl-sourcemaps-apply@0.1.4 (source-map@0.1.43)
├── clean-css@3.1.8 (commander@2.6.0, source-map@0.1.43)
├── through2@0.6.3 (xtend@4.0.0, readable-stream@1.0.33)
├── vinyl-bufferstream@1.0.1 (bufferstreams@1.0.1)
└── gulp-util@3.0.4 (array-differ@1.0.0, beeper@1.0.0, array-uniq@1.0.2, lodash._reescape@3.0.0, lodash._reinterpolate@3.0.0, lodash._reevaluate@3.0.0, replace-ext@0.0.1, minimist@1.1.1, multipipe@0.1.2, vinyl@0.4.6, chalk@1.0.0, lodash.template@3.3.2, dateformat@1.0.11)
```

**二、参照 [使用 gulp 压缩 JS](chapter2.md) 创建 `gulpfile.js` 文件编写代码**

在对应目录创建 `gulpfile.js` 文件并写入如下内容：

```js
// 获取 gulp
var gulp = require('gulp')

// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css')

// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {
    // 1. 找到文件
    gulp.src('css/*.css')
    // 2. 压缩文件
        .pipe(minifyCSS())
    // 3. 另存为压缩文件
        .pipe(gulp.dest('dist/css'))
})

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 css 任务
    gulp.watch('css/*.css', ['css'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 css 任务和 auto 任务
gulp.task('default', ['css', 'auto'])
```

你可以访问 [gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css) 以查看更多用法。

------

**三、创建 css 文件**

在 `gulpfile.js` 对应目录创建 `css` 文件夹，并在 `css/` 目录下创建 `a.css` 文件。

```css
/* a.css */
body a{
    color:pink;
}
```

--------

**四、运行 gulp 查看效果**

在命令行输入 `gulp` +回车

你将看到命令行出现如下提示

```
gulp
[17:01:19] Using gulpfile ~/Documents/code/gulp-book/demo/chapter3/gulpfile.js
[17:01:19] Starting 'css'...
[17:01:19] Finished 'css' after 6.21 ms
[17:01:19] Starting 'auto'...
[17:01:19] Finished 'auto' after 5.42 ms
[17:01:19] Starting 'default'...
[17:01:19] Finished 'default' after 5.71 μs
```

gulp 会创建 `dist/css` 目录，并创建 `a.css` 文件，此文件存放压缩后的 css 代码。
[dist/css/a.css](https://github.com/nimojs/gulp-book/blob/master/demo/chapter3/dist/css/a.css)

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/12)

[接着阅读：使用 gulp 压缩图片](chapter4.md)