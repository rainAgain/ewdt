const gulp = require('gulp');
const browserSync  = require('browser-sync');

const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const base64 = require('gulp-base64');
const rainRevAll = require('rain-rev-all');
const sprite = require('rain-css-img-sprite');

const pump = require('pump');

gulp.task('task_copy_f_electrontest/test',() => {
return gulp.src('G://Electron/electronAppZoom/project/prototype/**/*')
    .pipe(gulp.dest('F://electronTest/test'));
});
	