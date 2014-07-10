var browserify = require('browserify');
var es6ify = require('es6ify');
var args = require('yargs').argv;
var gulp = require('gulp');
var rename = require('gulp-rename');


gulp.task('build', ['pre-build'], function() {
  var isProd = ['prod', 'production'].indexOf(args.env) !== -1 ? false : true;
  var bundle = browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .add(es6ify.runtime)
    .require('./src/main.js', { entry: true })
    .require('./src/base/ui_plugin', { expose: 'ui_plugin' })
    .require('./src/base/base_object', { expose: 'base_object' })
    .require('./src/base/ui_object', { expose: 'ui_object' })
    .bundle();

  return bundle.pipe(source('main.js'))
    .pipe(rename(isProd ? 'player.min.js' : 'player.js'))
    .pipe(gulp.dest('./dist'))
    .on("error", function(err) {
      throw err;
    });
});
