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
const sass = require('gulp-sass');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const csso = require('gulp-csso');
const gulpSequence = require('gulp-sequence');

const pump = require('pump');
gulp.task('task_autoserve_f_electrontest_testsass-dist', function() {
    browserSync.init({
        files: [
      'F://electronTest/testsass-dist/pages/**/*.{html,js,css}',
      {
        match:['F://electronTest/testsass-dist/pages/**/*.scss'],
        fn: function() {
          return gulp.src('F://electronTest/testsass-dist/pages/**/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('F://electronTest/testsass-dist/pages'))
        }
      }
    ],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        notify: {
            styles: [
                "margin: 0",
                "padding: 5px",
                "position: fixed",
                "font-size: 10px",
                "z-index: 9999",
                "bottom: 0px",
                "right: 0px",
                "border-radius: 0",
                "border-top-left-radius: 5px",
                "background-color: rgba(60,197,31,0.5)",
                "color: white",
                "text-align: center"
            ]
        },
        startPath: '//pages/default/index.html',
        reloadDelay: 0,
        port: 9000
    });
});


gulp.task('task_autoserve_f_electrontest_testsass', function() {
    browserSync.init({
        files: [
      'F://electronTest/testsass/pages/**/*.{html,js,css}',
      {
        match:['F://electronTest/testsass/pages/**/*.scss'],
        fn: function() {
          return gulp.src('F://electronTest/testsass/pages/**/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('F://electronTest/testsass/pages'))
        }
      }
    ],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        notify: {
            styles: [
                "margin: 0",
                "padding: 5px",
                "position: fixed",
                "font-size: 10px",
                "z-index: 9999",
                "bottom: 0px",
                "right: 0px",
                "border-radius: 0",
                "border-top-left-radius: 5px",
                "background-color: rgba(60,197,31,0.5)",
                "color: white",
                "text-align: center"
            ]
        },
        startPath: '/testsass/pages/default/index.html',
        reloadDelay: 0,
        port: 9000
    });
});

