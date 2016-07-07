使用 gulp 编译 Sass
==================

> 无论是 `node-sass` 还是 `ruby-sass` 使用 npm 安装都非常的慢，甚至会装不上。及其不利于团队协作。建议使用 less 作为 css 预处理器。
> 如果因为 less 不支持自定义函数选择用 sass 可以使用 [less-plugin-functions](https://github.com/seven-phases-max/less-plugin-functions) 让 less 支持自定义函数。

## gulp-sass

本章使用的是 ruby-sass 如果你不方便安装 ruby 或编译速度慢，建议使用 [gulp-sass](https://github.com/dlmanning/gulp-sass)

请务必理解如下章节后阅读此章节：

1. [安装 Node 和 gulp](chapter1.md)
2. [使用 gulp 压缩 JS](chapter2.md)

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/15)

----------

> Sass 是一种 CSS 的开发工具，提供了许多便利的写法，大大节省了开发者的时间，使得 CSS 的开发，变得简单和可维护。

本章使用 `ruby-sass` 编译 css,若你没有安装 ruby 和 sass 请移步 [使用ruby.taobao安装 Sass](https://github.com/nimojs/blog/issues/14)

安装
---

```
npm install gulp-ruby-sass
```

基本用法
-------

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) 或 [在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6)

```js
// 获取 gulp
var gulp = require('gulp')
// 获取 gulp-ruby-sass 模块
var sass = require('gulp-ruby-sass')

// 编译sass
// 在命令行输入 gulp sass 启动此任务
gulp.task('sass', function() {
    return sass('sass/') 
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(gulp.dest('dist/css'))
});


// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch('sass/**/*.scss', ['sass'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 sass 任务和 auto 任务
gulp.task('default', ['sass', 'auto'])
```


Sass 代码和编译后的 CSS 代码
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
[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/15)

[接着阅读：使用 gulp 开发一个项目](chapter7.md)
