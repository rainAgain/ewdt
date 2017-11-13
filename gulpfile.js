const gulp = require('gulp');
const browserSync  = require('browser-sync').create();

const reload = browserSync.reload;

const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const base64 = require('gulp-base64');
const rainRevAll = require('rain-rev-all');
const sprite = require('rain-css-img-sprite');
const rename = require('gulp-rename');
const rimrafFolder = require('rimraf');
const rimraf = require('gulp-rimraf');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
const csso = require('gulp-csso');
const gulpSequence = require('gulp-sequence');

const pump = require('pump');

        gulp.task('task_autoserve_f_electrontest_auto', ['sass'], function() {
    browserSync.init({
        files: ['F://electronTest/auto/pages/**/*.{html,js,css}'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/auto/pages/default/index.html',
        port: 9000
    });
    gulp.watch("F://electronTest/auto/pages/**/*.scss", ['sass']);
   // gulp.watch("F://electronTest/auto/pages/**/*.html").on('change', reload);
});

gulp.task('sass', function() {
    return gulp.src("F://electronTest/auto/pages/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("F://electronTest/auto/pages"))
});


