var gulp = require('gulp');

var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps =require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');

gulp.task('js', function () {
    gulp.src('src/js/**/*.js')
        .pipe(watch('src/js/**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'))
})

gulp.task('css', function () {
    gulp.src('src/css/**/*.css')
        .pipe(watch('src/css/**/*.css'))
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
})

// gulp.task('images', function () {
//     gulp.src('src/images/*.+(jpge|jpg|png|gif)')
//         .pipe(watch('src/images/*.+(jpge|jpg|png|gif)'))
//         .pipe(imagemin({
//             progressive: true
//         }))
//         .pipe(gulp.dest('dist/images'))
// })

gulp.task('default', ['js', 'css'/*, 'images'*/]);