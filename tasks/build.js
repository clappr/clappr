var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var exorcist = require('exorcist');
var browserify = require('./common').browserify;

gulp.task('build', ['pre-build'], function(b) {
  return browserify({debug: true})
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename('clappr.js'))
    .pipe(transform(function() { return exorcist('./dist/clappr.map') }))
    .pipe(gulp.dest('./dist'));
});
