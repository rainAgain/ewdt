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
const gulpSequence = require('gulp-sequence');

const pump = require('pump');

gulp.task('task_release_test_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/test-dist', cb);
    return stream;
});

gulp.task('task_release_test_release_copy', () => {

    const stream = gulp.src('F://electronTest/test/**/*')
        .pipe(gulp.dest('F://electronTest/test-dist'));

    return stream;
});


gulp.task('task_release_test_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});


gulp.task('task_release_test_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/test-dist/pages',
              imgDesDir: 'F://electronTest/test-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});

gulp.task('task_release_test_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});

gulp.task('task_release_test_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(cleanCSS(
            {
                compatibility: 'ie7',
                keepSpecialComments: '*'
            })
        )
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});


gulp.task('task_release_test_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/test-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/test-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_test_del_min', () => {
    return gulp.src([ 'F://electronTest/test-dist/pages/**/*.min.min.js', 'F://electronTest/test-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_test', function(cb) {
    gulpSequence(
        'task_release_test_release_clean', 'task_release_test_release_copy','task_release_test_release_autoprefixer','task_release_test_release_minicss','task_release_test_release_uglifyJs','task_release_test_del_min'
    )(cb)
});
gulp.task('task_release_test_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/test-dist', cb);
    return stream;
});

gulp.task('task_release_test_release_copy', () => {

    const stream = gulp.src('F://electronTest/test/**/*')
        .pipe(gulp.dest('F://electronTest/test-dist'));

    return stream;
});


gulp.task('task_release_test_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});


gulp.task('task_release_test_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/test-dist/pages',
              imgDesDir: 'F://electronTest/test-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});

gulp.task('task_release_test_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});

gulp.task('task_release_test_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(cleanCSS(
            {
                compatibility: 'ie7',
                keepSpecialComments: '*'
            })
        )
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});


gulp.task('task_release_test_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/test-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/test-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_test_del_min', () => {
    return gulp.src([ 'F://electronTest/test-dist/pages/**/*.min.min.js', 'F://electronTest/test-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_test', function(cb) {
    gulpSequence(
        'task_release_test_release_clean', 'task_release_test_release_copy','task_release_test_release_autoprefixer','task_release_test_release_minicss','task_release_test_release_uglifyJs','task_release_test_del_min'
    )(cb)
});
gulp.task('task_release_test_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/test-dist', cb);
    return stream;
});

gulp.task('task_release_test_release_copy', () => {

    const stream = gulp.src('F://electronTest/test/**/*')
        .pipe(gulp.dest('F://electronTest/test-dist'));

    return stream;
});


gulp.task('task_release_test_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});


gulp.task('task_release_test_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/test-dist/pages',
              imgDesDir: 'F://electronTest/test-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});

gulp.task('task_release_test_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});

gulp.task('task_release_test_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/test-dist/pages/**/*.css')
        .pipe(cleanCSS(
            {
                compatibility: 'ie7',
                keepSpecialComments: '*'
            })
        )
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/test-dist/pages'));
    return stream;
});


gulp.task('task_release_test_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/test-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/test-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_test_del_min', () => {
    return gulp.src([ 'F://electronTest/test-dist/pages/**/*.min.min.js', 'F://electronTest/test-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_test', function(cb) {
    gulpSequence(
        'task_release_test_release_clean', 'task_release_test_release_copy','task_release_test_release_autoprefixer','task_release_test_release_minicss','task_release_test_release_uglifyJs','task_release_test_del_min'
    )(cb)
});
