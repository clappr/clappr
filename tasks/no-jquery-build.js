var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify')
var args = require('yargs').argv;
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var browserify = require('./common').browserify;


gulp.task('no-jquery-build', ['pre-build'], function() {
  var isProd = ['prod', 'production'].indexOf(args.env) !== -1 ? true : false;
  var stream = browserify()
    .external('jquery')
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename(isProd ? 'player.min.js' : 'player.js'));

  if(isProd) {
    stream.pipe(streamify(uglify()));
  }
  stream.pipe(gulp.dest('./dist'))
});
