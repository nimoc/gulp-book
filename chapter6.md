使用 Gulp 编译 SASS
==================

请务必理解如下章节后阅读此章节：

1. [安装 Node 和 Gulp](chapter1.md)
2. [使用 Gulp 压缩 JS](chapter2.md)

----------

> SASS 是一种 CSS 的开发工具，提供了许多便利的写法，大大节省了设计者的时间，使得 CSS 的开发，变得简单和可维护。


安装
---

```
npm install gulp-sass
```

基本用法
-------

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) - [或在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6)

```js
// 获取 gulp
var gulp = require('gulp');
// 获取 gulp-sass 模块
var sass = require('gulp-sass');

// 编译sass
// 在命令行输入 gulp images 启动此任务
gulp.task('sass', function () {
    // 1. 找到 scss 文件
    gulp.src('sass/**.scss')
    // 2. 编译为css
        .pipe(sass())
    // 3. 另存文件
        .pipe(gulp.dest('dist/css'));
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch('sass/**.scss', ['sass']);
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 sass 任务和 auto 任务
gulp.task('default', ['sass', 'auto']);
```


SASS 代码和编译后的 CSS 代码
----------

[sass/a.scss](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/sass/a.scss)

```css
.sass{
	a{
        color:pink;
    }
}
```

[sass/import.scss](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/sass/import.scss)


```css
@import "a.scss";
.import{
	a{
		color:red;
    }
}
```

[sass/a.css](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/dist/css/a.css)

```css
.sass a {
  color: pink;
}
```

[sass/import.css](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/dist/css/import.css)

```css
.sass a {
  color: pink;
}
.import a{
  color: red;
}
```

[阅读下一章节：使用 Gulp 开发一个项目](chapter7.md)