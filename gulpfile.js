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

gulp.task('task_release_we_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/we-dist', cb);
    return stream;
});

gulp.task('task_release_we_release_copy', () => {

    const stream = gulp.src('F://electronTest/we/**/*')
        .pipe(gulp.dest('F://electronTest/we-dist'));

    return stream;
});


gulp.task('task_release_we_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/we-dist/pages',
              imgDesDir: 'F://electronTest/we-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/we-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/we-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_we_del_min', () => {
    return gulp.src([ 'F://electronTest/we-dist/pages/**/*.min.min.js', 'F://electronTest/we-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_we', function(cb) {
    gulpSequence(
        'task_release_we_release_clean', 'task_release_we_release_copy','task_release_we_release_minicss','task_release_we_release_uglifyJs','task_release_we_del_min'
    )(cb)
});
gulp.task('task_release_we_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/we-dist', cb);
    return stream;
});

gulp.task('task_release_we_release_copy', () => {

    const stream = gulp.src('F://electronTest/we/**/*')
        .pipe(gulp.dest('F://electronTest/we-dist'));

    return stream;
});


gulp.task('task_release_we_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/we-dist/pages',
              imgDesDir: 'F://electronTest/we-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/we-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/we-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_we_del_min', () => {
    return gulp.src([ 'F://electronTest/we-dist/pages/**/*.min.min.js', 'F://electronTest/we-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_we', function(cb) {
    gulpSequence(
        'task_release_we_release_clean', 'task_release_we_release_copy','task_release_we_release_autoprefixer','task_release_we_release_sprite','task_release_we_release_minicss','task_release_we_release_uglifyJs','task_release_we_del_min'
    )(cb)
});
gulp.task('task_release_we_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/we-dist', cb);
    return stream;
});

gulp.task('task_release_we_release_copy', () => {

    const stream = gulp.src('F://electronTest/we/**/*')
        .pipe(gulp.dest('F://electronTest/we-dist'));

    return stream;
});


gulp.task('task_release_we_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/we-dist/pages',
              imgDesDir: 'F://electronTest/we-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/we-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/we-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_we_del_min', () => {
    return gulp.src([ 'F://electronTest/we-dist/pages/**/*.min.min.js', 'F://electronTest/we-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_we', function(cb) {
    gulpSequence(
        'task_release_we_release_clean', 'task_release_we_release_copy','task_release_we_release_autoprefixer','task_release_we_release_minicss','task_release_we_release_uglifyJs','task_release_we_del_min'
    )(cb)
});
gulp.task('task_release_we_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/we-dist', cb);
    return stream;
});

gulp.task('task_release_we_release_copy', () => {

    const stream = gulp.src('F://electronTest/we/**/*')
        .pipe(gulp.dest('F://electronTest/we-dist'));

    return stream;
});


gulp.task('task_release_we_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/we-dist/pages',
              imgDesDir: 'F://electronTest/we-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});

gulp.task('task_release_we_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/we-dist/pages/**/*.css')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/we-dist/pages'));
    return stream;
});


gulp.task('task_release_we_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/we-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/we-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_we_del_min', () => {
    return gulp.src([ 'F://electronTest/we-dist/pages/**/*.min.min.js', 'F://electronTest/we-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_we', function(cb) {
    gulpSequence(
        'task_release_we_release_clean', 'task_release_we_release_copy','task_release_we_release_autoprefixer','task_release_we_release_minicss','task_release_we_release_uglifyJs','task_release_we_del_min'
    )(cb)
});
gulp.task('task_copy_f_electrontest_aaaa',() => {
return gulp.src('G://Electron/electronAppZoom/project/prototype/**/*')
    .pipe(gulp.dest('F://electronTest/aaaa'));
});

	gulp.task('task_aaaa', function() {
    browserSync.init({
        files: ['F://electronTest/aaaa/pages/**'],
        server: {
            baseDir: 'F://electronTest',
            index: 'index.html'
        },
        startPath: '/aaaa/pages/default/index.html',
        port: 9800
    });
});

gulp.task('task_release_aaaa_release_clean', (cb) => {
    const stream = rimrafFolder('F://electronTest/aaaa-dist', cb);
    return stream;
});

gulp.task('task_release_aaaa_release_copy', () => {

    const stream = gulp.src('F://electronTest/aaaa/**/*')
        .pipe(gulp.dest('F://electronTest/aaaa-dist'));

    return stream;
});


gulp.task('task_release_aaaa_release_autoprefixer', () => {

    const stream =  gulp.src('F://electronTest/aaaa-dist/pages/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('F://electronTest/aaaa-dist/pages'));
    return stream;
});


gulp.task('task_release_aaaa_release_sprite',  () => {

    const stream =  gulp.src('F://electronTest/aaaa-dist/pages/**/*.css')
        .pipe(sprite({
              cssDesDir: 'F://electronTest/aaaa-dist/pages',
              imgDesDir: 'F://electronTest/aaaa-dist/pages/css/images',
              hash: false
          }))
        .pipe(gulp.dest('F://electronTest/aaaa-dist/pages'));
    return stream;
});

gulp.task('task_release_aaaa_release_base64',  () => {

    const stream =  gulp.src('F://electronTest/aaaa-dist/pages/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('F://electronTest/aaaa-dist/pages'));
    return stream;
});

gulp.task('task_release_aaaa_release_minicss',  () => {

    const stream =  gulp.src('F://electronTest/aaaa-dist/pages/**/*.css')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('F://electronTest/aaaa-dist/pages'));
    return stream;
});


gulp.task('task_release_aaaa_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('F://electronTest/aaaa-dist/pages/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('F://electronTest/aaaa-dist/pages')
                        ]
                    );
    return stream;
});

gulp.task('task_release_aaaa_del_min', () => {
    return gulp.src([ 'F://electronTest/aaaa-dist/pages/**/*.min.min.js', 'F://electronTest/aaaa-dist/pages/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('task_release_aaaa', function(cb) {
    gulpSequence(
        'task_release_aaaa_release_clean', 'task_release_aaaa_release_copy','task_release_aaaa_release_autoprefixer','task_release_aaaa_release_sprite','task_release_aaaa_release_base64','task_release_aaaa_release_minicss','task_release_aaaa_release_uglifyJs','task_release_aaaa_del_min'
    )(cb)
});
