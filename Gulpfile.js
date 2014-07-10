var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var utils = require('gulp-util');
var rename = require('gulp-rename');
var browserify = require('browserify');
var path = require('path');
var express = require('express');
var karma = require('karma').server;
var streamify = require('gulp-streamify')
var source = require('vinyl-source-stream');

var server = express();
server.use(express.static('./dist'));
server.use(express.static('./test'));

var paths = {
  files: ['src/**/*.js', 'src/**/*.css', 'src/**/*.html', 'src/**/*.scss'],
  main: ['src/main.js'],
  tests: ['test/**/*.js'],
  dest: 'dist'
};

var port = 3000;

var distFile = 'player.js';
var distTestFile = 'tests_bundle.js';

require('./tasks/assets');
require('./tasks/pre-build');
require('./tasks/build');

gulp.task('build-light', ['pre-build-hook'], function() {
  var bundle = browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .transform(require('browserify-shim'))
    .add(es6ify.runtime)
    .require(require.resolve('./src/main.js'), { entry: true })
    .require('./src/base/ui_plugin', { expose: 'ui_plugin' })
    .require('./src/base/base_object', { expose: 'base_object' })
    .require('./src/base/ui_object', { expose: 'ui_object' })
    .external('jquery')
    .bundle();

  return bundle.pipe(source('main.js'))
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dest))
    .on("error", function(err) {
      throw err;
    });
});


gulp.task('serve', ['watch'], function() {
  utils.log(utils.colors.green('*****  Listening on port ' + port + '  *****'))
  server.listen(port);
});

gulp.task('dist-light', ['pre-build-hook'], function() {
  var bundle = browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .transform(require('browserify-shim'))
    .add(es6ify.runtime)
    .require(require.resolve('./src/main.js'), { entry: true })
    .require('./src/base/ui_plugin', { expose: 'ui_plugin' })
    .require('./src/base/base_object', { expose: 'base_object' })
    .require('./src/base/ui_object', { expose: 'ui_object' })
    .external('jquery')
    .bundle();

  return bundle.pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dest))
    .on("error", function(err) {
      throw err;
    });
});


gulp.task('test', function(done) {
  karma.start({configFile: path.resolve('karma.conf.js')}, done);
});

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.files, function() {
    gulp.run('build');
  });
});

