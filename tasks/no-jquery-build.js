
var browserify = require('browserify');
var es6ify = require('es6ify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify')
var args = require('yargs').argv;
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');


gulp.task('no-jquery-build', ['pre-build'], function() {
  var isProd = ['prod', 'production'].indexOf(args.env) !== -1 ? true : false;
  var bundle = browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .add(es6ify.runtime)
    .require('./src/main.js', { entry: true })
    .require('./src/base/ui_plugin', { expose: 'ui_plugin' })
    .require('./src/base/base_object', { expose: 'base_object' })
    .require('./src/base/ui_object', { expose: 'ui_object' })
    .external('jquery')
    .bundle();

  var stream = bundle.pipe(source('main.js'))
    .pipe(rename(isProd ? 'player.min.js' : 'player.js'));

    if(isProd) {
      stream.pipe(streamify(uglify()));
    }
    stream.pipe(gulp.dest('./dist'))
});
