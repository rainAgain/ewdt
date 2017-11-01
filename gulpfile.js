const gulp = require('gulp');
const browserSync  = require('browser-sync');

const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const base64 = require('gulp-base64');
const rainRevAll = require('rain-rev-all');
const sprite = require('rain-css-img-sprite');
const rename = require('gulp-rename');
const rimrafFolder = require('rimraf');
const rimraf = require('gulp-rimraf');
const csso = require('gulp-csso');
const gulpSequence = require('gulp-sequence');

const pump = require('pump');

gulp.task('task_copy_f_electrontest_qq',() => {
return gulp.src('G://Electron/electronAppZoom/project/prototype/**/*')
    .pipe(gulp.dest('F://electronTest/qq'));
});

	gulp.task('task_uglifyBoot_f_electrontest_qq_js_boot', (cb) => {
    pump([
            gulp.src('F://electronTest/qq/js/boot/boot.js'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('F://electronTest/qq/js/boot/')
        ],
        cb
    );
});

gulp.task('task_autoserve_f_electrontest_qq', function() {
    browserSync.init({
        files: ['F://electronTest/qq/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/qq/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_copy_f_electrontest_ww',() => {
return gulp.src('G://Electron/electronAppZoom/project/prototype/**/*')
    .pipe(gulp.dest('F://electronTest/ww'));
});

	gulp.task('task_uglifyBoot_f_electrontest_ww_js_boot', (cb) => {
    pump([
            gulp.src('F://electronTest/ww/js/boot/boot.js'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('F://electronTest/ww/js/boot/')
        ],
        cb
    );
});

gulp.task('task_autoserve_f_electrontest_ww', function() {
    browserSync.init({
        files: ['F://electronTest/ww/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/ww/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_autoserve_f_electrontest_qq', function() {
    browserSync.init({
        files: ['F://electronTest/qq/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/qq/pages/default/index.html',
        port: 9800
    });
});

