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