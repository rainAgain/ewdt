const gulp = require('gulp');
const browserSync  = require('browser-sync');

const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const base64 = require('gulp-base64');
const rainRevAll = require('rain-rev-all');
const sprite = require('rain-css-img-sprite');

const pump = require('pump');

gulp.task('task_copy_f_electrontest_project',() => {
return gulp.src('G://Electron/electronAppZoom/project/prototype/**/*')
    .pipe(gulp.dest('F://electronTest/project'));
});
	gulp.task('task_electronTest', function() {
    browserSync.init({
        files: ['F://electronTest/project/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/project/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_electronTest', function() {
    browserSync.init({
        files: ['F://electronTest/project/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/project/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_electronTest', function() {
    browserSync.init({
        files: ['F://electronTest/project/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/project/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_electronTest', function() {
    browserSync.init({
        files: ['F://electronTest/project/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/project/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_electronTest', function() {
    browserSync.init({
        files: ['F://electronTest/project/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/project/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_electronTest', function() {
    browserSync.init({
        files: ['F://electronTest/project/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/project/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_electronTest', function() {
    browserSync.init({
        files: ['F://electronTest/project/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/project/pages/default/index.html',
        port: 9800
    });
});

