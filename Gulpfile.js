var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

var noop = function(){};

var paths = {
  files: ['src/**/*.js'],
  main: ['src/main.js'],
  tests: ['test/spec_helper.js', 'test/**/*_spec.js'],
  dist: 'dist'
};

var distFile = 'api.min.js';

var namespace = 'WP3';

gulp.task('default', ['build']);

gulp.task('build', function() {
  gulp.src(paths.main)
    .pipe(browserify())
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist', function() {
  gulp.src(paths.main)
    .pipe(browserify({standalone: namespace}))
    .pipe(uglify())
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', function() {
  gulp.src(paths.tests)
    .pipe(mocha({reporter: 'nyan'}))
    .on('error', noop);
});

gulp.task('coverage', function() {
  gulp.src(paths.files)
    .pipe(istanbul())
    .on('end', function() {
      gulp.src(paths.tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports());
    });
});

gulp.task('lint', function() {
  gulp.src(paths.files)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  gulp.watch(paths.files, function() {
    gulp.run('build');
  });
});
