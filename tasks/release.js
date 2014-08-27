var gulp = require('gulp');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify')
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var browserify = require('./common').browserify;

gulp.task('release', ['pre-build'], function() {
  return browserify()
    .bundle()
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(rename('clappr.min.js'))
    .pipe(gulp.dest('./dist'));
});
