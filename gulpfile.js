const gulp = require('gulp');
const browserSync  = require('browser-sync');

const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const base64 = require('gulp-base64');
const rainRevAll = require('rain-rev-all');

const rename = require('gulp-rename');
const rimrafFolder = require('rimraf');
const rimraf = require('gulp-rimraf');
const csso = require('gulp-csso');
const gulpSequence = require('gulp-sequence');

const pump = require('pump');

gulp.task('task_copy_f_electrontest_a',() => {
return gulp.src('G://Electron/electronAppZoom/project/prototype/**/*')
    .pipe(gulp.dest('F://electronTest/a'));
});

	gulp.task('task_uglifyBoot_f_electrontest_a_js_boot', (cb) => {
    pump([
            gulp.src('F://electronTest/a/js/boot/boot.js'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('F://electronTest/a/js/boot/')
        ],
        cb
    );
});

gulp.task('task_autoserve_f_electrontest_a', function() {
    browserSync.init({
        files: ['F://electronTest/a/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/a/pages/default/index.html',
        port: 9000
    });
});

