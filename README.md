gulp 入门指南
===========

gulp 是基于 node 实现 Web 前端自动化开发的工具，利用它能够极大的提高开发效率。

在 Web前端开发工作中有很多“无脑工作”，比如压缩CSS/JS文件。而这些工作都是有规律的。找到这些规律，并编写 gulp 配置代码。

[本书所有示例代码](demo/) 

**目录：**

1. [安装 Node 和 gulp](chapter1.md)
2. [使用 gulp 压缩 JS](chapter2.md)
3. [使用 gulp 压缩 CSS](chapter3.md)
4. [使用 gulp 压缩图片](chapter4.md)
5. [使用 gulp 编译 LESS](chapter5.md)
6. [使用 gulp 编译 Sass](chapter6.md)
7. [使用 gulp 开发一个项目](chapter7.md)

[点击此处](https://github.com/nimojs/gulp-book/issues)发帖告诉我，你还需要哪些新章节。([https://github.com/nimojs/gulp-book/issues](https://github.com/nimojs/gulp-book/issues))
压缩JS文件的规律和 gulp 代码
------------------------

现有目录结构如下：

```
└── js/
    ├── index.js
    └── page-a.js
```

### 规律

1. 找到 js/目录下的所有 .js 文件
2. 压缩这些 js 文件
3. 将压缩后的代码另存在 dist/js/ 目录下

### 编写 gulp 代码

```js
// 压缩文件
gulp.task('script', function() {
    // 1. 找到
    gulp.src('js/*.js')
    // 2. 压缩
        .pipe(uglify())
    // 3. 另存
        .pipe(gulp.dest('dist/js'));
});
```

### 代码执行结果

代码执行后文件结构

```
└── js/
│   ├── index.js
│   └── page-a.js
└── dist/
    └── js/
        ├── index.js
        └── page-a.js
```

此时 `dist/js` 目录下的 `.js` 文件都是压缩后的版本。

----------------

gulp 还可以做很多事，例如：

1. 压缩CSS
2. 压缩图片
3. 编译Sass/LESS
4. 编译CoffeeScript
5. markdown 转换为 html

[开始阅读：安装 Node 和 gulp](chapter1.md)