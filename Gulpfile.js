var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var utils = require('gulp-util');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var rename = require('gulp-rename');
var browserify = require('browserify');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var changed = require('gulp-changed');
var path = require('path');
var express = require('express');
var fs = require('fs');
var glob = require('glob').sync;
var karma = require('karma').server;

var streamify = require('gulp-streamify')

var source = require('vinyl-source-stream');

var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');

var es6ify = require('es6ify');

var noop = function() {};
var server = express();

server.use(express.static('./dist'));
server.use(express.static('./test'));
server.use(express.static('./node_modules/mocha'));

var paths = {
  files: ['src/**/*.js', 'src/**/*.css', 'src/**/*.html', 'src/**/*.scss'],
  main: ['src/main.js'],
  tests: ['test/**/*.js'],
  dest: 'dist'
};

var port = 3000;

var distFile = 'player.js';
var distTestFile = 'tests_bundle.js';

var namespace = 'WP3';

gulp.task('default', ['lint', 'build']);

gulp.task('pre-build-hook', ['sass', 'copy-html', 'copy-css'], function() {
  exec('node bin/hook.js', noop);
});

gulp.task('sass', function () {
    return gulp.src(paths.files[3])
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest("build"));
});

gulp.task("copy-css", function() {
  return gulp.src(paths.files[1])
    .pipe(minifyCSS())
    .pipe(gulp.dest('build'));
});

gulp.task("copy-html", function() {
  return gulp.src(paths.files[2])
    // .pipe(minifyHTML())
    .pipe(gulp.dest('build'));
});

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

gulp.task('build', ['pre-build-hook'], function() {
  var bundle = browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .add(es6ify.runtime)
    .require(require.resolve('./src/main.js'), { entry: true })
    .require('./src/base/ui_plugin', { expose: 'ui_plugin' })
    .require('./src/base/base_object', { expose: 'base_object' })
    .require('./src/base/ui_object', { expose: 'ui_object' })
    .bundle();

  return bundle.pipe(source('main.js'))
    .pipe(changed(paths.dest))
    .pipe(rename('player.js'))
    .pipe(gulp.dest(paths.dest))
    .on("error", function(err) {
      throw err;
    });
});

gulp.task('serve', ['watch'], function() {
  utils.log(utils.colors.green('*****  Listening on port ' + port + '  *****'))
  server.listen(port);
});

gulp.task('dist', ['pre-build-hook'], function() {
  var bundle = browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .add(es6ify.runtime)
    .require(require.resolve('./src/main.js'), { entry: true })
    .bundle();

  return bundle.pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dest));
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

