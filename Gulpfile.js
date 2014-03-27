var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var utils = require('gulp-util');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var changed = require('gulp-changed');
var express = require('express');
var fs = require('fs');

var noop = function() {};
var server = express();

server.use(express.static('./dist'));
server.use(express.static('./test'));
server.use(express.static('./node_modules/mocha'));

var paths = {
  files: ['src/**/*.js', 'src/**/*.css', 'src/**/*.html'],
  main: ['src/main.js'],
  tests: ['test/**/*.js'],
  dest: 'dist'
};

var port = 3000;

var distFile = 'api.min.js';
var distTestFile = 'tests_bundle.js';

var namespace = 'WP3';

gulp.task('default', ['lint', 'build']);

gulp.task('pre-build-hook', function() {
  exec('node bin/hook.js', noop);
});

gulp.task('build-tests', ['build'], function() {
  //FIXME looks like gulp-browserify can't handle /**/* globs
  exec('node_modules/.bin/browserify test/**/*.js -o dist/tests_bundle.js');
});

gulp.task('build', ['pre-build-hook'], function() {
  gulp.src(paths.main)
    .pipe(changed(paths.dest))
    .pipe(browserify())
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

gulp.task('dist', ['pre-build-hook'], function() {
  gulp.src(paths.main)
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('headless-test', ['build-tests'], function() {
  setTimeout(function() {
    spawn('node_modules/.bin/mocha-phantomjs', ['-p', 'node_modules/.bin/phantomjs', 'test/headless.html'])
      .stdout.pipe(process.stdout);
  }, 1500);
});

gulp.task('test', ['watch-tests'], function() {
  server.get('/tests', function(req, res) {
    res.sendfile('./test/runner.html');
  });
  server.listen(port);
  utils.log(utils.colors.green('*****  Testing running on localhost:' + port + '/tests  *****'))
  setTimeout(function() {
    exec('open http://localhost:3000/tests');
  }, 2000);

});

gulp.task('coverage', function() {
  gulp.src(paths.files[0])
    .pipe(istanbul())
    .on('end', function() {
      gulp.src(paths.tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports());
    });
});

gulp.task('lint', function() {
  gulp.src(paths.files[0])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.files, function() {
    gulp.run('build');
  });
});

gulp.task('watch-tests', ['build-tests'], function() {
  gulp.watch(paths.files.concat(paths.tests), function() {
    gulp.run('build-tests');
  });
});
