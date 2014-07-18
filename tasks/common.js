var gulp = require('gulp');
var es6ify = require('es6ify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

module.exports.js = 'src/**/*.js';

module.exports.browserify = function() {
  return browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .add(es6ify.runtime)
    .require('./src/main.js', { entry: true })
    .require('./src/base/ui_plugin', { expose: 'ui_plugin' })
    .require('./src/base/base_object', { expose: 'base_object' })
    .require('./src/base/ui_object', { expose: 'ui_object' })
    .require('jquery', { expose: 'jquery' });
};

gulp.task('compile-js', function() {
  return module.exports.browserify()
  .bundle()
  .pipe(source('clappr.js'))
  .pipe(rename('clappr.js'))
  .pipe(gulp.dest('./dist'))
});

