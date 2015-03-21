Gulp 入门指南
===========

Gulp 是基于 node 实现 Web 前端自动化开发的工具，利用它能够极大的提高开发效率。

在 Web前端开发工作中有很多“无脑工作”，比如压缩CSS/JS文件。而这些工作都是有规律的。找到这些规律，并编写 Gulp 配置代码。

[本书所有示例代码](demo/)

**目录：**

1. [安装 Node 和 Gulp](chapter1.md)
2. [使用 Gulp 压缩 JS](chapter2.md)
3. [使用 Gulp 编译 Sass](chapter3.md)

压缩JS文件的规律和 Gulp 代码
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

### 编写 Gulp 代码

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

Gulp 还可以做很多事，例如：

1. 编译SASS/LESS
2. 编译CoffeeScript
3. 压缩CSS
4. 压缩图片
5. 复制文件至指定目录

[阅读下一章节：安装 Node 和 Gulp](chapter1.md)