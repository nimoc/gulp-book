使用 Gulp 压缩 JS
================

压缩 js 文件可降低 js 文件大小，提高页面打开速度。在不利用 gulp 时我们需要通过各种工具手动完成压缩工作。

所有的 gulp 代码编写都可以看做是将规律转化为代码的过程。

代码实例与实例解释
------------

**建议**：你可以只阅读下面的代码与注释或同时阅读代码解释

gulp 的所有配置代码都写在 `gulpfile.js` 文件。

**一、新建一个 `gulpfile.js` 文件**

---------

**二、在 `gulpfile.js` 中编写代码**

```js
// 获取 gulp
var gulp = require('gulp');
```

> `require()` 是 node （CommonJS）中获取模块的语法，此处不做过多解释。
> 
> 在 gulp 中你只需要理解 `require()` 可以获取模块。

---------

**三、获取 `gulp-uglify` 组件**

```js
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
```

---------

**四、创建压缩任务**

```js
// 压缩文件
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('js/*.js')
    // 2. 压缩文件
        .pipe(uglify())
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'));
});
```

- `gulp.task(name, fn)` - 定义任务，第一个参数是任务名，第二个参数是任务内容。
- `gulp.src(path)` - 选择文件，传入参数是文件路径。
- `gulp.dest(path)` - 输出文件
- `gulp.pipe()` - 管道，你可以暂时将 pipe 理解为将操作加入执行队列

---------

**五、跳转至 `gulpfile.js` 所在目录**

打开命令行使用 `cd` 命令跳转至 `gulpfile.js` 文件所在目录。

例如我的 `gulpfile.js` 文件保存在 `C:\gulp-book\demo\chapter2\gulpfile.js`。

那么就需要在命令行输入
```
cd C:\gulp-book\demo\chapter2
```

> Mac 用户可使用 `cd Documents/gulp-book/demo/chapter2/` 跳转

---------

**六、使用命令行运行 script 任务**

在控制台输入 `gulp 任务名` 可运行任务，此处我们输入 `gulp script` 回车。

注意：输入 `gulp script` 后命令行将会提示错误信息
```
// 在命令行输入
gulp script

Error: Cannot find module 'gulp-uglify'
    at Function.Module._resolveFilename (module.js:338:15)
    at Function.Module._load (module.js:280:25)
```

`Cannot find module 'gulp-uglify'` 没有找到 `gulp-uglify` 模块。

----------

**七、安装 `gulp-uglify` 模块**

因为我们并没有安装 `gulp-uglify` 模块到本地，所以找不到此模块。

使用 npm 安装 `gulp-uglify` 到本地

```
npm install gulp-uglify
```

安装成功后你会看到如下信息：
```
gulp-uglify@1.1.0 node_modules/gulp-uglify
├── deepmerge@0.2.7
├── uglify-js@2.4.16 (uglify-to-browserify@1.0.2, async@0.2.10, source-map@0.1.34, optimist@0.3.7)
├── vinyl-sourcemaps-apply@0.1.4 (source-map@0.1.43)
├── through2@0.6.3 (xtend@4.0.0, readable-stream@1.0.33)
└── gulp-util@3.0.4 (array-differ@1.0.0, beeper@1.0.0, array-uniq@1.0.2, object-assign@2.0.0, lodash._reinterpolate@3.0.0, lodash._reescape@3.0.0, lodash._reevaluate@3.0.0, replace-ext@0.0.1, minimist@1.1.1, chalk@1.0.0, lodash.template@3.3.2, vinyl@0.4.6, multipipe@0.1.2, dateformat@1.0.11)
chapter2 $
```

在你的文件夹中会 新增一个 `node_modules` 文件夹，这里面存放着 npm 安装的模块。

接着输入 `gulp script` 执行任务

```
gulp script
[13:34:57] Using gulpfile ~/Documents/code/gulp-book/demo/chapter2/gulpfile.js
[13:34:57] Starting 'script'...
[13:34:57] Finished 'script' after 6.13 ms
```

------------

**八、编写 js 文件**

我们发现 gulp 没有进行任何压缩操作。因为没有js目录，自然也没有 js 目录下的 `.js` 后缀文件。

创建 `a.js` 文件，并编写如下内容

```
// a.js
function demo (msg) {
    alert('--------\r\n' + msg + '\r\n--------');
}

demo('Hi');
```

接着在命令行输入 `gulp script` 执行任务

gulp 会在命令行当前目录下创建 `dist/js/` 文件夹，并创建压缩后的 `a.js` 文件。

---------

**九、检测代码修改自动执行任务**

`js/a.js`一旦有修改 就必须重新在命令行输入 `gulp script` ，这很麻烦。

可以使用 `gulp.watch(src, fn)` 检测指定目录下文件的修改后执行任务。

在 `gulpfile.js` 中编写如下代码：
```
// 监听文件修改，当文件被修改则执行 script 任务
gulp.watch('js/*.js', ['script']);
```

但是没有命令可以运行 `gulp.watch()`，需要将 `gulp.watch()` 包含在一个任务中。

修改代码如下：
```
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('js/*.js', ['script']);
})
```

接在在命令行输入 `gulp auto`，自动监听 `js/*.js` 文件的修改后压缩js。

至此，我们完成了 gulp 压缩 js 文件的自动化代码编写。

**注意：**使用 `gulp.watch` 后你的命令行会进入“运行”状态，此时你不可以在命令行进行其他操作。可通过 `Ctrl + C` 停止 gulp。

> Mac 下使用 `control + C` 停止 gulp

**十、使用 gulp.task('default', fn) 定义默认任务**

增加如下代码

```js
gulp.task('default', function(){
    gulp.run('script', 'auto');
});
```

此时你可以在命令行直接输入 `gulp` +回车，运行 `script` 和 `auto` 任务。

[阅读下一章节：使用 Gulp 编译 Sass](chapter3.md)