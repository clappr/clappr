var es6ify = require('es6ify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify')
var args = require('yargs').argv;
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var browserify = require('./common').browserify;


gulp.task('build', ['pre-build'], function(b) {
  var isProd = ['prod', 'production'].indexOf(args.env) !== -1 ? true : false;

  var stream = browserify()
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename(isProd ? 'clappr.min.js' : 'clappr.js'));

  if(isProd) {
    stream.pipe(streamify(uglify()));
  }
  stream.pipe(gulp.dest('./dist'))
});
