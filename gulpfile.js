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

gulp.task('task_copy_f_electrontest_22222',() => {
return gulp.src('G://Electron/electronAppZoom/project/prototype/**/*')
    .pipe(gulp.dest('F://electronTest/22222'));
});

	gulp.task('task_uglifyBoot_f_electrontest_22222_js_boot', (cb) => {
    pump([
            gulp.src('F://electronTest/22222/js/boot/boot.js'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('F://electronTest/22222/js/boot/')
        ],
        cb
    );
});

gulp.task('task_22222', function() {
    browserSync.init({
        files: ['F://electronTest/22222/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/22222/pages/default/index.html',
        port: 9000
    });
});

