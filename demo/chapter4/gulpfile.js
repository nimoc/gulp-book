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
    gulp.watch('images/*.*', ['images'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 images 任务和 auto 任务
gulp.task('default', ['images', 'auto'])
